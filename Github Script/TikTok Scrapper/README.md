# TikTok Profile Scraper

Extract TikTok profile data with multi-method fallback. Works from residential IPs with full data; falls back to oEmbed from datacenter IPs.

## Install

```bash
pip install -r requirements.txt
```

## Usage

### Single handle

```bash
python scraper.py tiktok
```

### Multiple handles

```bash
python scraper.py tiktok netflix nba duolingo
```

### From file

```bash
python scraper.py --file handles.txt
```

`handles.txt` — one handle per line, `#` comments allowed, full URLs auto-parsed:

```
# Top brands
tiktok
netflix
nba
https://www.tiktok.com/@duolingo
```

### Save to CSV

```bash
python scraper.py --file handles.txt --out results.csv
```

### JSON output

```bash
python scraper.py --json tiktok netflix
```

### Detailed view

```bash
python scraper.py --detail tiktok netflix
```

### Concurrent scraping

```bash
python scraper.py --workers 5 --delay 1 h1 h2 h3 h4 h5
```

### Via proxy (for full data from datacenter)

```bash
python scraper.py --proxy socks5://user:pass@host:port tiktok
```

Or set env var:

```bash
export TIKTOK_PROXY="socks5://user:pass@host:port"
python scraper.py tiktok
```

## How it works

The scraper tries three methods in order:

| # | Method | Data | Notes |
|---|--------|------|-------|
| 1 | **Rehydration JSON** | Full (13 fields) | Parses `__UNIVERSAL_DATA_FOR_REHYDRATION__` script tag. Requires residential IP or proxy. |
| 2 | **Web API** | Partial | `tiktok.com/api/user/detail/`. Limited from datacenter. |
| 3 | **oEmbed** | Basic | Name + URL only. No follower/like/video counts. Always works. |

From **residential IPs**: Method 1 succeeds with full data (followers, likes, videos, bio, verified, avatar, creation date, exact counts from `statsV2`).

From **datacenter IPs**: TikTok serves a WAF challenge page. Methods 1 & 2 fail; Method 3 (oEmbed) returns basic profile info.

## Data extracted

### Full data (Method 1 — Rehydration JSON)

| Field | Description |
|---|---|
| `uniqueId` | Handle (username) |
| `nickname` | Display name |
| `signature` | Bio |
| `verified` | Verified status |
| `id` | Numeric account ID |
| `secUid` | TikTok security UID |
| `create_time` | Account creation timestamp |
| `created_at` | ISO 8601 creation date |
| `avatar` | Profile picture URL |
| `followerCount` | Rounded follower count |
| `followerCount_exact` | Exact follower count (from `statsV2`) |
| `heartCount` | Rounded likes count |
| `heartCount_exact` | Exact likes count |
| `videoCount` | Video count |
| `followingCount` | Following count |

### Partial data (Method 3 — oEmbed)

Only `uniqueId`, `nickname`, `url` are populated. All count fields return 0.

## CLI options

```
positional arguments:
  handles               TikTok handles to scrape

optional arguments:
  -f, --file FILE       File with handles (one per line)
  -o, --out FILE        Output CSV file path
  -j, --json            Output as JSON
  -d, --detail          Detailed per-profile output
  --proxy URL           Proxy URL (e.g. socks5://user:pass@host:port)
  --delay SECONDS       Delay between requests (default: 2)
  --workers N           Concurrent workers (default: 1)
  --timeout SECONDS     HTTP timeout (default: 30)
  --version             Show version
```

## WAF / IP blocking

TikTok blocks requests from datacenter/cloud IPs with a WAF challenge page. Solutions:

1. **Use a residential proxy**: `--proxy socks5://user:pass@host:port`
2. **Run from a residential IP**: Local machine usually works
3. **Accept partial data**: oEmbed gives name + URL without follower counts

The `--method` column in output shows which method succeeded: `rehydration`, `web_api`, or `oembed`.

## Status values

| Status | Meaning |
|---|---|
| `ok` | Full data obtained (rehydration or web_api) |
| `partial` | Limited data (oEmbed only — no follower counts) |
| `not_found` | Account does not exist |
| `error` | Network or parsing error |
