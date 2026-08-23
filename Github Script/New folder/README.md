# TikTok Profile Scraper

Extract TikTok profile data without API keys. Reads the `__UNIVERSAL_DATA_FOR_REHYDRATION__` JSON blob embedded in every TikTok profile page.

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

## Data extracted

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
| `followerCount_exact` | Exact follower count (from statsV2) |
| `heartCount` | Rounded likes count |
| `heartCount_exact` | Exact likes count |
| `videoCount` | Video count |
| `followingCount` | Following count |

## CLI options

```
positional arguments:
  handles               TikTok handles to scrape

optional arguments:
  -f, --file FILE       File with handles (one per line)
  -o, --out FILE        Output CSV file path
  -j, --json            Output as JSON
  -d, --detail          Detailed per-profile output
  --delay SECONDS       Delay between requests (default: 2)
  --workers N           Concurrent workers (default: 1)
  --timeout SECONDS     HTTP timeout (default: 30)
  --version             Show version
```

## How it works

1. Fetches `https://www.tiktok.com/@{handle}`
2. Extracts `<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__">` from HTML
3. Parses the JSON blob → navigates `__DEFAULT_SCOPE__` → `webapp.user-detail` → `userInfo`
4. Returns user info + both rounded (`stats`) and exact (`statsV2`) counts

No browser automation, no API keys, no TikTok login required.
