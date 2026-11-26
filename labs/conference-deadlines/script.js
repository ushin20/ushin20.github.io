const venueTemplate = document.getElementById("deadline-venue");
const entryTemplate = document.getElementById("deadline-entry");
const feedStatus = document.getElementById("feed-status");
const dateFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "short",
  day: "numeric",
});
const timeFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Seoul",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});
const hourMs = 3600000;
const dayMs = 24 * hourMs;

function koreanDay(timestamp) {
  return Math.floor((timestamp + 9 * hourMs) / dayMs);
}

function deadlineState(value, now) {
  if (!value) return "pending";
  if (value.length === 10) {
    // A date-only deadline may still be open anywhere on Earth.
    const todayAoE = new Date(now - 12 * hourMs).toISOString().slice(0, 10);
    return value < todayAoE ? "past" : "date-only";
  }
  return Date.parse(value) < now ? "past" : "upcoming";
}

function latestVenue(conference, now) {
  const edition = conference.editions.reduce((latest, candidate) =>
    candidate.year > latest.year ? candidate : latest);
  const entries = edition.rounds.flatMap((round) => {
    const stages = [["Full paper", round.paper]];
    if (Object.hasOwn(round, "abstract")) {
      stages.unshift([conference.registration_label || "Abstract registration", round.abstract]);
    }
    return stages.map(([stage, value]) => ({
      url: round.url,
      description: [stage, round.label].filter(Boolean).join(" · "),
      value,
      timestamp: Date.parse(value),
      state: deadlineState(value, now),
      tentative: round.tentative,
    }));
  });

  return {
    title: `${conference.name} ${edition.year}`,
    track: conference.track,
    url: edition.url,
    entries,
  };
}

function renderVenue(venue, now) {
  const item = venueTemplate.content.firstElementChild.cloneNode(true);
  const link = item.querySelector(".deadline-link");
  link.href = venue.url;
  link.textContent = venue.title;
  item.querySelector(".deadline-track").textContent = venue.track || "";
  item.querySelector(".deadline-list").append(...venue.entries.map((entry) => renderEntry(entry, now)));
  return item;
}

function renderEntry(entry, now) {
  const item = entryTemplate.content.firstElementChild.cloneNode(true);
  const stage = item.querySelector(".deadline-stage");
  const time = item.querySelector("time");
  const status = item.querySelector(".deadline-status");

  item.dataset.status = entry.state;
  if (entry.url) {
    const link = document.createElement("a");
    link.href = entry.url;
    link.textContent = entry.description;
    stage.append(link);
  } else {
    stage.textContent = entry.description;
  }

  if (entry.value) {
    time.dateTime = entry.value;
    time.textContent = dateFormat.format(entry.timestamp);
    if (entry.value.length > 10) {
      time.textContent += ` · ${timeFormat.format(entry.timestamp)}`;
    }
  }

  if (entry.state === "upcoming") {
    const days = koreanDay(entry.timestamp) - koreanDay(now);
    status.textContent = days === 0 ? "D-day" : `D-${days}`;
    if (entry.tentative) {
      const note = item.querySelector(".deadline-note");
      note.textContent = "Tentative";
      note.hidden = false;
    }
  } else if (entry.state === "date-only") {
    status.textContent = "Time unconfirmed";
  } else {
    status.textContent = entry.state === "past" ? "Closed" : "TBD";
  }
  return item;
}

function renderFeed(feed) {
  const now = Date.now();
  const sections = { upcoming: [], pending: [], past: [] };
  for (const conference of Object.values(feed.conferences)) {
    const venue = latestVenue(conference, now);
    const open = venue.entries.filter((entry) => entry.state !== "past");
    const closed = venue.entries.filter((entry) => entry.state === "past");
    const dated = open.filter((entry) => entry.state !== "pending");

    if (dated.length) {
      const sortTime = Math.min(...dated.map((entry) => entry.timestamp));
      sections.upcoming.push({ ...venue, entries: open, sortTime });
    } else if (open.length) {
      sections.pending.push({ ...venue, entries: open });
    }
    if (closed.length) {
      const sortTime = Math.max(...closed.map((entry) => entry.timestamp));
      sections.past.push({ ...venue, entries: closed, sortTime });
    }
  }
  sections.upcoming.sort((first, second) => first.sortTime - second.sortTime);
  sections.past.sort((first, second) => second.sortTime - first.sortTime);

  for (const [section, venues] of Object.entries(sections)) {
    document.getElementById(section).replaceChildren(...venues.map((venue) => renderVenue(venue, now)));
  }
  document.getElementById("pending-group").hidden = !sections.pending.length;
  document.getElementById("past-group").hidden = !sections.past.length;
  feedStatus.textContent = sections.upcoming.length ? "" : "No upcoming deadlines have been published.";
}

function loadFeed() {
  try {
    const feed = globalThis.conferenceDeadlineFeed;
    if (!feed) throw new Error("Deadline data is unavailable.");
    renderFeed(feed);

    const updated = document.getElementById("feed-date");
    updated.dateTime = feed.updated;
    updated.textContent = dateFormat.format(new Date(feed.updated));
    document.getElementById("feed-source").hidden = false;
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) renderFeed(feed);
    });
  } catch (error) {
    console.error(error);
    feedStatus.textContent = "Conference deadlines could not be loaded. Refresh the page to try again.";
  }
}

loadFeed();
