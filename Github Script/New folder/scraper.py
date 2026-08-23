#!/usr/bin/env python3
"""TikTok Profile Scraper — extract profile data from tiktok.com without API keys.

Reads the __UNIVERSAL_DATA_FOR_REHYDRATION__ JSON blob embedded in every TikTok
profile page. No browser, no login, no third-party API needed.

Usage:
    python scraper.py <handle> [handle2 ...]
    python scraper.py --file handles.txt
    python scraper.py --file handles.txt --out results.csv
    python scraper.py --json tiktok
    python scraper.py tiktok netflix --delay 3 --out data.csv

Requirements: requests (pip install requests)
"""

import argparse
import csv
import json
import os
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from typing import Any, Optional

try:
    import requests
except ImportError:
    print("ERROR: 'requests' not installed. Run: pip install requests", file=sys.stderr)
    sys.exit(1)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

REHYDRATION_RE = re.compile(
    r'<script[^>]+id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>(.*?)</script>',
    re.DOTALL,
)

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/126.0.0.0 Safari/537.36"
)

HEADERS = {
    "User-Agent": USER_AGENT,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
}

# CSV column order
CSV_COLUMNS = [
    "input",
    "uniqueId",
    "nickname",
    "signature",
    "verified",
    "id",
    "secUid",
    "create_time",
    "created_at",
    "avatar",
    "url",
    "followerCount",
    "followingCount",
    "heartCount",
    "videoCount",
    "followerCount_exact",
    "followingCount_exact",
    "heartCount_exact",
    "videoCount_exact",
    "status",
    "error",
]

# ---------------------------------------------------------------------------
# HTTP fetch
# ---------------------------------------------------------------------------

_session: Optional[requests.Session] = None


def get_session() -> requests.Session:
    global _session
    if _session is None:
        _session = requests.Session()
        _session.headers.update(HEADERS)
    return _session


def fetch_page(handle: str, timeout: int = 30) -> dict:
    """Fetch a TikTok profile page. Returns raw response metadata."""
    handle = handle.lstrip("@").strip()
    url = f"https://www.tiktok.com/@{handle}"
    t0 = time.time()
    try:
        r = get_session().get(url, timeout=timeout, allow_redirects=True)
        elapsed = round(time.time() - t0, 2)
        return {
            "url": url,
            "handle": handle,
            "status": r.status_code,
            "chars": len(r.text),
            "elapsed_s": elapsed,
            "body": r.text,
        }
    except requests.RequestException as exc:
        elapsed = round(time.time() - t0, 2)
        return {
            "url": url,
            "handle": handle,
            "status": 0,
            "chars": 0,
            "elapsed_s": elapsed,
            "body": "",
            "transport_error": str(exc),
        }


# ---------------------------------------------------------------------------
# Rehydration JSON parser
# ---------------------------------------------------------------------------

def parse_rehydration(body: str) -> dict:
    """Parse the __UNIVERSAL_DATA_FOR_REHYDRATION__ blob from HTML.

    Returns dict with keys: ok, reason, profile, rehydration_chars.
    """
    m = REHYDRATION_RE.search(body)
    if not m:
        return {
            "ok": False,
            "reason": "no __UNIVERSAL_DATA_FOR_REHYDRATION__ script found",
            "rehydration_chars": 0,
            "profile": None,
        }

    raw = m.group(1).strip()
    try:
        blob = json.loads(raw)
    except json.JSONDecodeError as exc:
        return {
            "ok": False,
            "reason": f"rehydration blob is not valid JSON: {exc}",
            "rehydration_chars": len(raw),
            "profile": None,
        }

    scope = blob.get("__DEFAULT_SCOPE__", {})

    # Try multiple paths (TikTok changes structure occasionally)
    detail = None
    for path in [
        "webapp.user-detail",
        "webapp.user-detail-v2",
    ]:
        detail = scope.get(path)
        if detail:
            break

    if not detail:
        return {
            "ok": False,
            "reason": "no webapp.user-detail scope in rehydration blob",
            "rehydration_chars": len(raw),
            "scopes": sorted(scope.keys()),
            "profile": None,
        }

    user_info = detail.get("userInfo") or detail.get("user") or {}
    user = user_info.get("user") or user_info.get("info") or {}
    stats = user_info.get("stats") or {}
    stats_v2 = user_info.get("statsV2") or {}

    # Check for missing account (statusCode 10221 = user not found)
    status_code = detail.get("statusCode")
    if not user or not user.get("id"):
        return {
            "ok": False,
            "reason": f"no user node in response (statusCode={status_code})",
            "rehydration_chars": len(raw),
            "status_code": status_code,
            "profile": None,
        }

    # Parse created_at timestamp
    create_time = user.get("createTime") or user.get("create_time") or 0
    if isinstance(create_time, str):
        try:
            create_time = int(create_time)
        except (ValueError, TypeError):
            create_time = 0
    created_at = ""
    if create_time:
        try:
            created_at = datetime.fromtimestamp(create_time, tz=timezone.utc).isoformat()
        except (OSError, ValueError):
            pass

    # Build profile object
    profile = {
        "uniqueId": user.get("uniqueId") or user.get("unique_id") or "",
        "nickname": user.get("nickname") or user.get("nickName") or "",
        "signature": user.get("signature") or user.get("bio") or "",
        "verified": bool(user.get("verified") or user.get("isVerified")),
        "id": str(user.get("id") or ""),
        "secUid": user.get("secUid") or user.get("sec_uid") or "",
        "create_time": create_time,
        "created_at": created_at,
        "avatar": _pick_best_avatar(user),
        "url": f"https://www.tiktok.com/@{user.get('uniqueId') or user.get('unique_id') or ''}",
        # Rounded stats (display)
        "followerCount": _int(stats.get("followerCount")),
        "followingCount": _int(stats.get("followingCount")),
        "heartCount": _int(stats.get("heartCount") or stats.get("heart")),
        "videoCount": _int(stats.get("videoCount")),
        # Exact stats (statsV2 — strings)
        "followerCount_exact": _str(stats_v2.get("followerCount")),
        "followingCount_exact": _str(stats_v2.get("followingCount")),
        "heartCount_exact": _str(stats_v2.get("heartCount") or stats_v2.get("heart")),
        "videoCount_exact": _str(stats_v2.get("videoCount")),
    }

    return {
        "ok": True,
        "reason": None,
        "rehydration_chars": len(raw),
        "status_code": status_code,
        "profile": profile,
    }


def _pick_best_avatar(user: dict) -> str:
    """Pick the highest quality avatar URL."""
    for key in ("avatarLarger", "avatar_medium", "avatarMedium", "avatar", "avatar_thumb", "avatarThumb"):
        val = user.get(key)
        if val:
            if val.startswith("//"):
                val = "https:" + val
            return val
    return ""


def _int(val: Any) -> int:
    if val is None:
        return 0
    if isinstance(val, (int, float)):
        return int(val)
    if isinstance(val, str):
        val = val.replace(",", "").strip()
        try:
            return int(val)
        except ValueError:
            return 0
    return 0


def _str(val: Any) -> str:
    if val is None:
        return ""
    return str(val).replace(",", "").strip()


# ---------------------------------------------------------------------------
# High-level scrape function
# ---------------------------------------------------------------------------

def scrape(handle: str, delay: float = 0, timeout: int = 30) -> dict:
    """Scrape a single TikTok handle. Returns enriched result dict."""
    handle = handle.lstrip("@").strip()
    if delay > 0:
        time.sleep(delay)

    got = fetch_page(handle, timeout=timeout)

    # Transport error
    if "transport_error" in got:
        return {
            "input": handle,
            "status": "error",
            "error": got["transport_error"],
            **_empty_profile(handle),
        }

    # HTTP non-200
    if got["status"] != 200:
        return {
            "input": handle,
            "status": "error",
            "error": f"HTTP {got['status']}",
            **_empty_profile(handle),
        }

    parsed = parse_rehydration(got["body"])
    if not parsed["ok"]:
        return {
            "input": handle,
            "status": "not_found",
            "error": parsed["reason"],
            **_empty_profile(handle),
        }

    profile = parsed["profile"]
    return {
        "input": handle,
        "status": "ok",
        "error": "",
        **profile,
    }


def _empty_profile(handle: str) -> dict:
    return {col: "" for col in CSV_COLUMNS if col not in ("input", "status", "error")}


# ---------------------------------------------------------------------------
# Batch / concurrent scraping
# ---------------------------------------------------------------------------

def scrape_batch(
    handles: list[str],
    workers: int = 1,
    delay: float = 2.0,
    timeout: int = 30,
) -> list[dict]:
    """Scrape multiple handles concurrently."""
    results = []
    total = len(handles)

    if workers <= 1:
        # Sequential
        for i, h in enumerate(handles):
            prefix = f"[{i+1}/{total}]"
            print(f"{prefix} Scraping @{h}...", end=" ", flush=True)
            res = scrape(h, delay=delay if i > 0 else 0, timeout=timeout)
            _print_result(res)
            results.append(res)
    else:
        # Concurrent with shared delay via semaphore-like approach
        with ThreadPoolExecutor(max_workers=workers) as pool:
            future_map = {}
            for i, h in enumerate(handles):
                d = delay if i > 0 else 0
                future = pool.submit(scrape, h, delay=d, timeout=timeout)
                future_map[future] = (i, h)

            for future in as_completed(future_map):
                idx, handle = future_map[future]
                try:
                    res = future.result()
                except Exception as exc:
                    res = {
                        "input": handle,
                        "status": "error",
                        "error": str(exc),
                        **_empty_profile(handle),
                    }
                print(f"[{idx+1}/{total}] @{handle}: ", end="", flush=True)
                _print_result(res)
                results.append(res)

        # Sort by original order
        handle_order = {h.lower(): i for i, h in enumerate(handles)}
        results.sort(key=lambda r: handle_order.get(r["input"].lower(), 999))

    return results


def _print_result(res: dict):
    if res["status"] == "ok":
        followers = res.get("followerCount_exact") or res.get("followerCount", "?")
        verified = "✓" if res.get("verified") else ""
        print(f"OK — {res.get('nickname', '?')} | {followers} followers | {res.get('videoCount', '?')} videos {verified}")
    else:
        print(f"FAIL — {res.get('error', 'unknown')}")


# ---------------------------------------------------------------------------
# Output formatters
# ---------------------------------------------------------------------------

def output_table(results: list[dict]):
    """Pretty-print results as a table to stdout."""
    if not results:
        print("No results.")
        return

    print(f"\n{'='*90}")
    print(f"{'Handle':<16} {'Followers':>12} {'Likes':>12} {'Videos':>8} {'Verified':>8} {'Status':<10}")
    print(f"{'-'*90}")
    for r in results:
        if r["status"] != "ok":
            print(f"@{r['input']:<15} {'—':>12} {'—':>12} {'—':>8} {'—':>8} {r['status']:<10}")
            continue
        followers = r.get("followerCount_exact") or str(r.get("followerCount", 0))
        likes = r.get("heartCount_exact") or str(r.get("heartCount", 0))
        videos = r.get("videoCount_exact") or str(r.get("videoCount", 0))
        verified = "Yes" if r.get("verified") else "No"
        print(f"@{r['input']:<15} {followers:>12} {likes:>12} {videos:>8} {verified:>8} {r['status']:<10}")
    print(f"{'='*90}")
    print(f"Total: {len(results)} | OK: {sum(1 for r in results if r['status']=='ok')} | Failed: {sum(1 for r in results if r['status']!='ok')}")


def output_json(results: list[dict]):
    """Print results as JSON."""
    # Remove empty error fields for cleaner output
    cleaned = []
    for r in results:
        c = {k: v for k, v in r.items() if v != "" and v is not None}
        cleaned.append(c)
    print(json.dumps(cleaned, indent=2, ensure_ascii=False))


def output_csv(results: list[dict], filepath: str):
    """Write results to a CSV file."""
    mode = "a" if os.path.exists(filepath) and os.path.getsize(filepath) > 0 else "w"
    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_COLUMNS, extrasaction="ignore")
        if mode == "w":
            writer.writeheader()
        for r in results:
            writer.writerow(r)
    print(f"\nWrote {len(results)} rows to {filepath}")


def output_detail(results: list[dict]):
    """Print detailed output for each profile."""
    for r in results:
        print(f"\n{'─'*60}")
        if r["status"] != "ok":
            print(f"  @{r['input']} — FAILED: {r.get('error', 'unknown')}")
            continue
        print(f"  @{r.get('uniqueId', r['input'])} — {r.get('nickname', '')}")
        print(f"  Bio: {r.get('signature', '')[:80] or '(empty)'}")
        print(f"  Verified: {'Yes' if r.get('verified') else 'No'}")
        print(f"  ID: {r.get('id', '')}")
        print(f"  Created: {r.get('created_at', '')}")
        fc = r.get("followerCount_exact") or str(r.get("followerCount", 0))
        hc = r.get("heartCount_exact") or str(r.get("heartCount", 0))
        vc = r.get("videoCount_exact") or str(r.get("videoCount", 0))
        fcl = r.get("followingCount_exact") or str(r.get("followingCount", 0))
        print(f"  Followers: {fc}")
        print(f"  Following: {fcl}")
        print(f"  Likes: {hc}")
        print(f"  Videos: {vc}")
        print(f"  Avatar: {(r.get('avatar', '')[:80] + '...') if len(r.get('avatar', '')) > 80 else r.get('avatar', '')}")
    print(f"\n{'─'*60}")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def load_handles_from_file(filepath: str) -> list[str]:
    """Load handles from a text file (one per line, # comments stripped)."""
    handles = []
    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            # Strip full URLs to just the handle
            if "tiktok.com/@" in line:
                line = line.split("/@")[-1].split("?")[0].split("/")[0]
            handles.append(line.lstrip("@"))
    return handles


def main():
    parser = argparse.ArgumentParser(
        description="TikTok Profile Scraper — extract profile data without API keys",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python scraper.py tiktok                     # single handle
  python scraper.py tiktok netflix nba         # multiple handles
  python scraper.py --file handles.txt         # from file
  python scraper.py --file h.txt --out r.csv   # save to CSV
  python scraper.py --json tiktok              # JSON output
  python scraper.py --detail tiktok netflix    # detailed view
  python scraper.py --workers 5 --delay 1 h1 h2 h3 h4 h5
        """,
    )
    parser.add_argument("handles", nargs="*", help="TikTok handles to scrape")
    parser.add_argument("-f", "--file", help="File with handles (one per line)")
    parser.add_argument("-o", "--out", help="Output CSV file path")
    parser.add_argument("-j", "--json", action="store_true", help="Output as JSON")
    parser.add_argument("-d", "--detail", action="store_true", help="Detailed per-profile output")
    parser.add_argument("--delay", type=float, default=2.0, help="Delay between requests in seconds (default: 2)")
    parser.add_argument("--workers", type=int, default=1, help="Concurrent workers (default: 1 = sequential)")
    parser.add_argument("--timeout", type=int, default=30, help="HTTP timeout in seconds (default: 30)")
    parser.add_argument("--version", action="version", version="1.0.0")

    args = parser.parse_args()

    # Collect handles
    handles = list(args.handles or [])
    if args.file:
        handles.extend(load_handles_from_file(args.file))

    if not handles:
        parser.print_help()
        print("\nERROR: No handles provided. Pass handles as arguments or use --file.", file=sys.stderr)
        sys.exit(1)

    # Deduplicate while preserving order
    seen = set()
    unique = []
    for h in handles:
        key = h.lower()
        if key not in seen:
            seen.add(key)
            unique.append(h)
    handles = unique

    print(f"TikTok Profile Scraper v1.0")
    print(f"Scraping {len(handles)} handle(s) with {args.workers} worker(s), {args.delay}s delay\n")

    start = time.time()
    results = scrape_batch(handles, workers=args.workers, delay=args.delay, timeout=args.timeout)
    elapsed = round(time.time() - start, 2)

    # Output
    if args.out:
        output_csv(results, args.out)

    if args.json:
        output_json(results)
    elif args.detail:
        output_detail(results)
    else:
        output_table(results)

    print(f"\nCompleted in {elapsed}s")


if __name__ == "__main__":
    main()
