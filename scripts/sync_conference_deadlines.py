"""Build the Conference Deadlines feed from the watched CCF-Deadlines files."""

import argparse
import json
import re
from datetime import UTC, date, datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import urlsplit
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError


ROOT = Path(__file__).resolve().parents[1]
WATCHLIST = ROOT / "data" / "conference-deadlines.json"
UPSTREAM = "https://raw.githubusercontent.com/ccfddl/ccf-deadlines/main/conference"
PUBLISHED_FEED = "https://ushin20.github.io/labs/conference-deadlines/deadline-data.js"
FEED_PREFIX = "globalThis.conferenceDeadlineFeed = "
KOREA = ZoneInfo("Asia/Seoul")
OTHER_TRACKS = (
    "journal track", "fast track", "applied data science", "special track",
    "workshop", "demo track", "poster track", "industry track",
    "datasets and benchmarks", "datasets & benchmarks", "ai for sciences",
)


def download(url):
    request = Request(url, headers={"User-Agent": "ushin20-conference-deadlines"})
    with urlopen(request, timeout=15) as response:
        return response.read()


def write_feed(path, feed):
    temporary = path.with_suffix(".tmp")
    data = json.dumps(feed, ensure_ascii=False, indent=2)
    temporary.write_text(f"{FEED_PREFIX}{data};\n", encoding="utf-8")
    temporary.replace(path)


def read_feed(source):
    source = source.strip()
    if not source.startswith(FEED_PREFIX) or not source.endswith(";"):
        raise ValueError("Invalid deadline feed")
    return json.loads(source[len(FEED_PREFIX):-1])


def restore_feed(path):
    bundled = read_feed(path.read_text(encoding="utf-8"))
    try:
        published = read_feed(download(PUBLISHED_FEED).decode("utf-8"))
        if (
            date.fromisoformat(published["updated"]) >= date.fromisoformat(bundled["updated"])
            and published["conferences"].keys() == bundled["conferences"].keys()
            and all(entry["editions"] for entry in published["conferences"].values())
        ):
            write_feed(path, published)
    except (OSError, ValueError, KeyError, TypeError, AttributeError):
        pass  # The bundled feed is the initial fallback.


def source_zone(name):
    if name == "AoE":
        return timezone(timedelta(hours=-12))
    if name in ("PT", "ET"):
        return ZoneInfo({"PT": "America/Los_Angeles", "ET": "America/New_York"}[name])
    if name in ("UTC", "GMT"):
        return UTC
    offset = re.fullmatch(r"(?:UTC|GMT)([+-])(\d{1,2})(?::(\d{2}))?", name)
    if offset:
        sign, hours, minutes = offset.groups()
        difference = timedelta(hours=int(hours), minutes=int(minutes or 0))
        return timezone(-difference if sign == "-" else difference)
    try:
        return ZoneInfo(name) if "/" in name else None
    except ZoneInfoNotFoundError:
        return None


def normalize_deadline(value, zone=""):
    if value is None or str(value).strip().upper() in ("", "TBD", "TBA"):
        return None
    value = str(value).strip()
    if len(value) == 10:
        return date.fromisoformat(value).isoformat()

    deadline = datetime.fromisoformat(value)
    if deadline.tzinfo is None:
        tz = source_zone(zone or "")
        if tz is None:
            return deadline.date().isoformat()
        deadline = deadline.replace(tzinfo=tz)
    return deadline.astimezone(UTC).isoformat(timespec="seconds")


def official_url(url):
    parsed_url = urlsplit(url)
    if parsed_url.scheme not in ("http", "https") or not parsed_url.hostname:
        raise ValueError(f"Invalid conference URL: {url}")
    return url


def normalize_edition(year, edition, override, conference):
    url = official_url(override.get("url", edition.get("link") or conference["site"]))
    timeline = [
        entry for entry in edition.get("timeline", [])
        if not any(track in (entry.get("comment") or "").lower() for track in OTHER_TRACKS)
    ]
    corrections = override.get("rounds", {})
    cycle_count = max(len(timeline), conference.get("cycles", 1), max(map(int, corrections), default=0))
    rounds = []
    for index in range(cycle_count):
        entry = timeline[index] if index < len(timeline) else {}
        cycle = index + 1
        correction = corrections.get(str(cycle), {})
        zone = entry.get("timezone", edition.get("timezone", ""))
        deadlines = {}
        for stage, field in (("paper", "deadline"), ("abstract", "abstract_deadline")):
            if stage == "abstract" and field not in entry and stage not in correction:
                continue
            value = correction.get(stage, entry.get(field))
            if value and correction.get("date_only"):
                value = str(value)[:10]
            deadlines[stage] = normalize_deadline(value, correction.get("timezone", zone))
        if "url" in correction:
            deadlines["url"] = official_url(correction["url"])
        if cycle_count > 1:
            deadlines["label"] = f"Cycle {cycle}"
        if "tentative" in (entry.get("comment") or "").lower():
            deadlines["tentative"] = True
        rounds.append(deadlines)

    return {"year": year, "url": url, "rounds": rounds}


def collect_conference(conference, load_yaml, current_year):
    source = load_yaml(download(f"{UPSTREAM}/{conference['source']}.yml"))
    editions = {int(edition["year"]): edition for edition in source[0]["confs"]}
    if not editions:
        raise ValueError(f"No editions in {conference['source']}")
    overrides = {int(year): value for year, value in conference.get("editions", {}).items()}
    years = sorted(editions.keys() | overrides.keys(), reverse=True)
    selected_years = [year for year in years if year >= current_year - 1]
    metadata = {key: conference[key] for key in ("name", "site", "track", "registration_label") if key in conference}
    metadata["editions"] = [
        normalize_edition(year, editions.get(year, {}), overrides.get(year, {}), conference)
        for year in selected_years or years[:1]
    ]
    return metadata


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", type=Path)
    parser.add_argument("--restore", action="store_true")
    args = parser.parse_args()
    if args.restore:
        restore_feed(args.output)
        return

    from yaml import safe_load

    today = datetime.now(KOREA).date()
    watchlist = json.loads(WATCHLIST.read_text(encoding="utf-8"))
    conferences = {
        slug: collect_conference(conference, safe_load, today.year)
        for slug, conference in watchlist.items()
    }
    write_feed(args.output, {"updated": today.isoformat(), "conferences": conferences})


if __name__ == "__main__":
    main()
