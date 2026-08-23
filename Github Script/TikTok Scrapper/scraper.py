#!/usr/bin/env python3
"""TikTok Profile Scraper — extract profile data from tiktok.com.

Supports three scraping methods (tried in order):
  1. Rehydration JSON — full data (requires residential IP or proxy)
  2. Web API — limited data from server IPs
  3. oEmbed — basic data (name + thumbnail, no follower counts)

From datacenter IPs, TikTok serves a WAF challenge page. Use --proxy with
a residential proxy to bypass this, or accept partial data from oEmbed.

Usage:
    python scraper.py <handle> [handle2 ...]
    python scraper.py --file handles.txt
    python scraper.py --file handles.txt --out results.csv
    python scraper.py --json tiktok
    python scraper.py --proxy socks5://user:pass@host:port tiktok
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

WAF_MARKERS = [
    "slardar_us_waf",
    "SlardarWAF",
    "wafchallengeid",
    "Please wait...",
    "waf-aiso",
]

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

CSV_COLUMNS = [
    "input",
    "method",
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

_sessions: dict[str, requests.Session] = {}


def get_session(proxy: Optional[str] = None) -> requests.Session:
    key = proxy or "__default__"
    if key not in _sessions:
        s = requests.Session()
        s.headers.update(HEADERS)
        if proxy:
            s.proxies = {"http": proxy, "https": proxy}
        _sessions[key] = s
    return _sessions[key]


def is_waf_challenge(body: str) -> bool:
    """Detect TikTok WAF challenge page."""
    if len(body) < 5000:
        for marker in WAF_MARKERS:
            if marker in body:
                return True
    return False


def fetch_page(handle: str, timeout: int = 30, proxy: Optional[str] = None) -> dict:
    """Fetch a TikTok profile page. Returns raw response metadata."""
    handle = handle.lstrip("@").strip()
    url = f"https://www.tiktok.com/@{handle}"
    t0 = time.time()
    try:
        session = get_session(proxy)
        r = session.get(url, timeout=timeout, allow_redirects=True)
        elapsed = round(time.time() - t0, 2)
        return {
            "url": url,
            "handle": handle,
            "status": r.status_code,
            "chars": len(r.text),
            "elapsed_s": elapsed,
            "body": r.text,
            "waf": is_waf_challenge(r.text),
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
            "waf": False,
            "transport_error": str(exc),
        }


# ---------------------------------------------------------------------------
# Method 1: Rehydration JSON parser
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

    detail = None
    for path in ["webapp.user-detail", "webapp.user-detail-v2"]:
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

    status_code = detail.get("statusCode")
    if not user or not user.get("id"):
        return {
            "ok": False,
            "reason": f"no user node in response (statusCode={status_code})",
            "rehydration_chars": len(raw),
            "status_code": status_code,
            "profile": None,
        }

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
        "followerCount": _int(stats.get("followerCount")),
        "followingCount": _int(stats.get("followingCount")),
        "heartCount": _int(stats.get("heartCount") or stats.get("heart")),
        "videoCount": _int(stats.get("videoCount")),
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


# ---------------------------------------------------------------------------
# Method 2: TikTok Web API
# ---------------------------------------------------------------------------

def scrape_web_api(handle: str, proxy: Optional[str] = None) -> dict:
    """Try TikTok's internal web API endpoint."""
    url = f"https://www.tiktok.com/api/user/detail/?uniqueId={handle}"
    session = get_session(proxy)
    try:
        r = session.get(
            url,
            headers={
                "Accept": "application/json, text/plain, */*",
                "Referer": f"https://www.tiktok.com/@{handle}",
            },
            timeout=20,
        )
        if r.status_code != 200:
            return {"ok": False, "reason": f"HTTP {r.status_code}"}

        data = r.json()
        user_info = data.get("userInfo", {})
        user = user_info.get("user", {})
        stats = user_info.get("stats", {})

        if not user or not user.get("id"):
            return {"ok": False, "reason": "no user in API response"}

        create_time = user.get("createTime", 0)
        created_at = ""
        if create_time:
            try:
                created_at = datetime.fromtimestamp(int(create_time), tz=timezone.utc).isoformat()
            except (OSError, ValueError):
                pass

        return {
            "ok": True,
            "profile": {
                "uniqueId": user.get("uniqueId", ""),
                "nickname": user.get("nickname", ""),
                "signature": user.get("signature", ""),
                "verified": bool(user.get("verified")),
                "id": str(user.get("id", "")),
                "secUid": user.get("secUid", ""),
                "create_time": int(create_time) if create_time else 0,
                "created_at": created_at,
                "avatar": _pick_best_avatar(user),
                "url": f"https://www.tiktok.com/@{handle}",
                "followerCount": _int(stats.get("followerCount")),
                "followingCount": _int(stats.get("followingCount")),
                "heartCount": _int(stats.get("heartCount")),
                "videoCount": _int(stats.get("videoCount")),
                "followerCount_exact": "",
                "followingCount_exact": "",
                "heartCount_exact": "",
                "videoCount_exact": "",
            },
        }
    except Exception as exc:
        return {"ok": False, "reason": str(exc)}


# ---------------------------------------------------------------------------
# Method 3: oEmbed API (limited data)
# ---------------------------------------------------------------------------

def scrape_oembed(handle: str, proxy: Optional[str] = None) -> dict:
    """Use TikTok's oEmbed endpoint. Limited data: name + thumbnail only."""
    tiktok_url = f"https://www.tiktok.com/@{handle}"
    url = f"https://www.tiktok.com/oembed?url={tiktok_url}"
    session = get_session(proxy)
    try:
        r = session.get(url, timeout=20)
        if r.status_code != 200:
            return {"ok": False, "reason": f"HTTP {r.status_code}"}

        data = r.json()
        author_name = data.get("author_name", "")
        thumbnail = data.get("thumbnail_url", "")
        title = data.get("title", "")

        if not author_name and not thumbnail:
            return {"ok": False, "reason": "empty oEmbed response"}

        return {
            "ok": True,
            "profile": {
                "uniqueId": data.get("author_unique_id") or handle,
                "nickname": author_name or handle,
                "signature": "",
                "verified": False,
                "id": "",
                "secUid": "",
                "create_time": 0,
                "created_at": "",
                "avatar": thumbnail,
                "url": data.get("author_url", tiktok_url),
                "followerCount": 0,
                "followingCount": 0,
                "heartCount": 0,
                "videoCount": 0,
                "followerCount_exact": "",
                "followingCount_exact": "",
                "heartCount_exact": "",
                "videoCount_exact": "",
            },
        }
    except Exception as exc:
        return {"ok": False, "reason": str(exc)}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _pick_best_avatar(user: dict) -> str:
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
# High-level scrape with fallback chain
# ---------------------------------------------------------------------------

def scrape(handle: str, delay: float = 0, timeout: int = 30, proxy: Optional[str] = None) -> dict:
    """Scrape a single TikTok handle with method fallback.

    Tries: Rehydration JSON -> Web API -> oEmbed
    """
    handle = handle.lstrip("@").strip()
    if delay > 0:
        time.sleep(delay)

    got = fetch_page(handle, timeout=timeout, proxy=proxy)

    # Transport error
    if "transport_error" in got:
        return _result(handle, "error", got["transport_error"], "")

    # HTTP non-200
    if got["status"] != 200:
        return _result(handle, "error", f"HTTP {got['status']}", "")

    # WAF challenge detected — skip to fallback methods
    if got["waf"]:
        # Try web API
        api = scrape_web_api(handle, proxy=proxy)
        if api["ok"]:
            return _result(handle, "ok", "", "web_api", api["profile"])

        # Try oEmbed
        oembed = scrape_oembed(handle, proxy=proxy)
        if oembed["ok"]:
            return _result(handle, "partial", "WAF blocked, using oEmbed (no follower data)", "oembed", oembed["profile"])

        return _result(handle, "error", "WAF blocked and fallback methods failed", "")

    # Method 1: Rehydration JSON
    parsed = parse_rehydration(got["body"])
    if parsed["ok"]:
        return _result(handle, "ok", "", "rehydration", parsed["profile"])

    # Method 2: Web API fallback
    api = scrape_web_api(handle, proxy=proxy)
    if api["ok"]:
        return _result(handle, "ok", "", "web_api", api["profile"])

    # Method 3: oEmbed fallback
    oembed = scrape_oembed(handle, proxy=proxy)
    if oembed["ok"]:
        return _result(handle, "partial", "Rehydration failed, using oEmbed (no follower data)", "oembed", oembed["profile"])

    return _result(handle, "not_found", parsed.get("reason", "all methods failed"), "")


def _result(handle: str, status: str, error: str, method: str, profile: Optional[dict] = None) -> dict:
    base = {
        "input": handle,
        "status": status,
        "error": error,
        "method": method,
    }
    if profile:
        base.update(profile)
    else:
        base.update({col: "" for col in CSV_COLUMNS if col not in ("input", "status", "error", "method")})
    return base


# ---------------------------------------------------------------------------
# Batch / concurrent scraping
# ---------------------------------------------------------------------------

def scrape_batch(
    handles: list[str],
    workers: int = 1,
    delay: float = 2.0,
    timeout: int = 30,
    proxy: Optional[str] = None,
) -> list[dict]:
    """Scrape multiple handles concurrently."""
    results = []
    total = len(handles)

    if workers <= 1:
        for i, h in enumerate(handles):
            prefix = f"[{i+1}/{total}]"
            print(f"{prefix} Scraping @{h}...", end=" ", flush=True)
            res = scrape(h, delay=delay if i > 0 else 0, timeout=timeout, proxy=proxy)
            _print_result(res)
            results.append(res)
    else:
        with ThreadPoolExecutor(max_workers=workers) as pool:
            future_map = {}
            for i, h in enumerate(handles):
                d = delay if i > 0 else 0
                future = pool.submit(scrape, h, delay=d, timeout=timeout, proxy=proxy)
                future_map[future] = (i, h)

            for future in as_completed(future_map):
                idx, handle = future_map[future]
                try:
                    res = future.result()
                except Exception as exc:
                    res = _result(handle, "error", str(exc), "")
                print(f"[{idx+1}/{total}] @{handle}: ", end="", flush=True)
                _print_result(res)
                results.append(res)

        handle_order = {h.lower(): i for i, h in enumerate(handles)}
        results.sort(key=lambda r: handle_order.get(r["input"].lower(), 999))

    return results


def _print_result(res: dict):
    method = f" [{res['method']}]" if res.get("method") else ""
    if res["status"] == "ok":
        followers = res.get("followerCount_exact") or str(res.get("followerCount", "?"))
        verified = " V" if res.get("verified") else ""
        print(f"OK{method} - {res.get('nickname', '?')} | {followers} followers | {res.get('videoCount', '?')} videos{verified}")
    elif res["status"] == "partial":
        print(f"PARTIAL{method} - {res.get('nickname', '?')} ({res.get('error', '')})")
    else:
        print(f"FAIL{method} - {res.get('error', 'unknown')}")


# ---------------------------------------------------------------------------
# Output formatters
# ---------------------------------------------------------------------------

def output_table(results: list[dict]):
    if not results:
        print("No results.")
        return

    print(f"\n{'='*95}")
    print(f"{'Handle':<16} {'Method':<12} {'Followers':>12} {'Likes':>12} {'Videos':>8} {'Verified':>8} {'Status':<10}")
    print(f"{'-'*95}")
    for r in results:
        method = r.get("method", "-") or "-"
        if r["status"] not in ("ok", "partial"):
            print(f"@{r['input']:<15} {method:<12} {'—':>12} {'—':>12} {'—':>8} {'—':>8} {r['status']:<10}")
            continue
        followers = r.get("followerCount_exact") or str(r.get("followerCount", 0))
        likes = r.get("heartCount_exact") or str(r.get("heartCount", 0))
        videos = r.get("videoCount_exact") or str(r.get("videoCount", 0))
        verified = "Yes" if r.get("verified") else "No"
        print(f"@{r['input']:<15} {method:<12} {followers:>12} {likes:>12} {videos:>8} {verified:>8} {r['status']:<10}")
    print(f"{'='*95}")
    ok = sum(1 for r in results if r["status"] == "ok")
    partial = sum(1 for r in results if r["status"] == "partial")
    fail = sum(1 for r in results if r["status"] not in ("ok", "partial"))
    print(f"Total: {len(results)} | OK: {ok} | Partial: {partial} | Failed: {fail}")


def output_json(results: list[dict]):
    cleaned = []
    for r in results:
        c = {k: v for k, v in r.items() if v != "" and v is not None}
        cleaned.append(c)
    print(json.dumps(cleaned, indent=2, ensure_ascii=False))


def output_csv(results: list[dict], filepath: str):
    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_COLUMNS, extrasaction="ignore")
        writer.writeheader()
        for r in results:
            writer.writerow(r)
    print(f"\nWrote {len(results)} rows to {filepath}")


def output_detail(results: list[dict]):
    for r in results:
        print(f"\n{'─'*60}")
        method = f" [{r.get('method', '?')}]" if r.get("method") else ""
        if r["status"] not in ("ok", "partial"):
            print(f"  @{r['input']}{method} - FAILED: {r.get('error', 'unknown')}")
            continue
        print(f"  @{r.get('uniqueId', r['input'])} - {r.get('nickname', '')}{method}")
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
    handles = []
    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "tiktok.com/@" in line:
                line = line.split("/@")[-1].split("?")[0].split("/")[0]
            handles.append(line.lstrip("@"))
    return handles


def main():
    parser = argparse.ArgumentParser(
        description="TikTok Profile Scraper - extract profile data with multi-method fallback",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python scraper.py tiktok                     # single handle
  python scraper.py tiktok netflix nba         # multiple handles
  python scraper.py --file handles.txt         # from file
  python scraper.py --file h.txt --out r.csv   # save to CSV
  python scraper.py --json tiktok              # JSON output
  python scraper.py --detail tiktok netflix    # detailed view
  python scraper.py --proxy socks5://host:port tiktok   # via proxy
  python scraper.py --workers 5 --delay 1 h1 h2 h3 h4 h5

Methods (tried in order):
  1. Rehydration JSON - full data (requires residential IP or proxy)
  2. Web API - partial data
  3. oEmbed - basic data only (name + avatar, no follower counts)

From datacenter IPs, TikTok WAF blocks direct page scraping. Use --proxy
with a residential proxy for full data, or accept partial oEmbed results.
        """,
    )
    parser.add_argument("handles", nargs="*", help="TikTok handles to scrape")
    parser.add_argument("-f", "--file", help="File with handles (one per line)")
    parser.add_argument("-o", "--out", help="Output CSV file path")
    parser.add_argument("-j", "--json", action="store_true", help="Output as JSON")
    parser.add_argument("-d", "--detail", action="store_true", help="Detailed per-profile output")
    parser.add_argument("--proxy", help="Proxy URL (e.g. socks5://user:pass@host:port)")
    parser.add_argument("--delay", type=float, default=2.0, help="Delay between requests in seconds (default: 2)")
    parser.add_argument("--workers", type=int, default=1, help="Concurrent workers (default: 1 = sequential)")
    parser.add_argument("--timeout", type=int, default=30, help="HTTP timeout in seconds (default: 30)")
    parser.add_argument("--version", action="version", version="1.1.0")

    args = parser.parse_args()

    # Env var fallback for proxy
    proxy = args.proxy or os.environ.get("TIKTOK_PROXY")

    handles = list(args.handles or [])
    if args.file:
        handles.extend(load_handles_from_file(args.file))

    if not handles:
        parser.print_help()
        print("\nERROR: No handles provided. Pass handles as arguments or use --file.", file=sys.stderr)
        sys.exit(1)

    seen = set()
    unique = []
    for h in handles:
        key = h.lower()
        if key not in seen:
            seen.add(key)
            unique.append(h)
    handles = unique

    proxy_info = f", proxy={proxy}" if proxy else ""
    print(f"TikTok Profile Scraper v1.1")
    print(f"Scraping {len(handles)} handle(s) | {args.workers} worker(s) | {args.delay}s delay{proxy_info}\n")

    start = time.time()
    results = scrape_batch(handles, workers=args.workers, delay=args.delay, timeout=args.timeout, proxy=proxy)
    elapsed = round(time.time() - start, 2)

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
