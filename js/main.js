(function () {
  "use strict";

  const DATA = window.CMSH_60_DATA;
  if (!DATA) return;

  const STORAGE_KEY = "cmsh_60th_blessings_v1";

  /* ------------------------------------------------------------------
     1. Sticky Header & Mobile Drawer
     ------------------------------------------------------------------ */
  const header = document.getElementById("site-header");
  const navToggle = document.getElementById("nav-toggle");
  const mobileDrawer = document.getElementById("mobile-drawer");

  function updateHeaderScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 36);
  }

  window.addEventListener("scroll", updateHeaderScroll, { passive: true });
  updateHeaderScroll();

  if (navToggle && mobileDrawer) {
    navToggle.addEventListener("click", function () {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      mobileDrawer.classList.toggle("is-open", !expanded);
    });

    mobileDrawer.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.setAttribute("aria-expanded", "false");
        mobileDrawer.classList.remove("is-open");
      });
    });
  }

  /* ------------------------------------------------------------------
     2. Live 60th Anniversary Countdown (1967–2027)
     ------------------------------------------------------------------ */
  const elDays = document.getElementById("cd-days");
  const elHours = document.getElementById("cd-hours");
  const elMinutes = document.getElementById("cd-minutes");
  const elSeconds = document.getElementById("cd-seconds");
  const elMeta = document.getElementById("cd-meta");

  const targetTime = new Date(DATA.anniversaryTargetISO).getTime();

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function updateCountdown() {
    if (!elDays || !elHours || !elMinutes || !elSeconds) return;
    const now = Date.now();
    const diff = targetTime - now;

    if (diff <= 0) {
      elDays.textContent = "000";
      elHours.textContent = "00";
      elMinutes.textContent = "00";
      elSeconds.textContent = "00";
      if (elMeta) {
        elMeta.textContent = "🎉 基督教協同中學創校六十週年慶典盛大展開！歡迎返校同慶！";
      }
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    elDays.textContent = String(days);
    elHours.textContent = pad(hours);
    elMinutes.textContent = pad(minutes);
    elSeconds.textContent = pad(seconds);

    if (elMeta) {
      elMeta.textContent = "目標日期：" + DATA.anniversaryDisplayDate;
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ------------------------------------------------------------------
     3. Interactive 60-Year History Timeline
     ------------------------------------------------------------------ */
  const timelineContainer = document.getElementById("timeline-list");
  const eraButtons = document.querySelectorAll("[data-era-filter]");

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderTimeline(era) {
    if (!timelineContainer) return;
    const items =
      era === "all"
        ? DATA.timeline
        : DATA.timeline.filter(function (item) {
            return item.era === era;
          });

    timelineContainer.innerHTML = items
      .map(function (item) {
        return (
          '<article class="timeline-item">' +
          '  <span class="timeline-dot" aria-hidden="true"></span>' +
          '  <div class="timeline-meta">' +
          '    <span class="timeline-year">' + escapeHTML(item.year) + "</span>" +
          '    <span class="timeline-roc">' + escapeHTML(item.rocYear) + "</span>" +
          '    <span class="timeline-era">' + escapeHTML(item.eraLabel) + "</span>" +
          "  </div>" +
          '  <h3 class="timeline-title">' + escapeHTML(item.title) + "</h3>" +
          '  <p class="timeline-summary">' + escapeHTML(item.summary) + "</p>" +
          '  <div class="timeline-highlight">✦ ' + escapeHTML(item.highlight) + "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  eraButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      eraButtons.forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");
      renderTimeline(btn.getAttribute("data-era-filter"));
    });
  });

  renderTimeline("all");

  /* ------------------------------------------------------------------
     4. Anniversary Events Grid + .ics Calendar Export
     ------------------------------------------------------------------ */
  const eventsContainer = document.getElementById("events-grid");
  const eventButtons = document.querySelectorAll("[data-event-filter]");

  function downloadICS(ev) {
    const uid = ev.id + "@cmsh-60th.github.io";
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Concordia Middle School//60th Anniversary//ZH",
      "BEGIN:VEVENT",
      "UID:" + uid,
      "DTSTART;TZID=Asia/Taipei:" + ev.startISO,
      "DTEND;TZID=Asia/Taipei:" + ev.endISO,
      "SUMMARY:【協同60週年】" + ev.title,
      "LOCATION:" + ev.location + "（嘉義縣民雄鄉建國路二段31號）",
      "DESCRIPTION:" + ev.description + " 詳情請關注協同中學官網 https://www.cmsh.cyc.edu.tw/",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([lines], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cmsh-60th-" + ev.id + ".ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function renderEvents(category) {
    if (!eventsContainer) return;
    const list =
      category === "all"
        ? DATA.events
        : DATA.events.filter(function (ev) {
            return ev.category === category;
          });

    eventsContainer.innerHTML = list
      .map(function (ev) {
        return (
          '<article class="event-card">' +
          '  <div class="event-top">' +
          '    <span class="event-category">' + escapeHTML(ev.categoryLabel) + "</span>" +
          '    <span class="event-status">' + escapeHTML(ev.status) + "</span>" +
          "  </div>" +
          '  <h3 class="event-title">' + escapeHTML(ev.title) + "</h3>" +
          '  <ul class="event-details">' +
          "    <li><strong>日期：</strong>" + escapeHTML(ev.dateLabel) + "</li>" +
          "    <li><strong>時間：</strong>" + escapeHTML(ev.time) + "</li>" +
          "    <li><strong>地點：</strong>" + escapeHTML(ev.location) + "</li>" +
          "  </ul>" +
          '  <p class="event-desc">' + escapeHTML(ev.description) + "</p>" +
          '  <div class="event-footer">' +
          '    <button type="button" class="btn btn--ghost" data-ics-id="' + escapeHTML(ev.id) + '">加入行事曆 (.ics)</button>' +
          "  </div>" +
          "</article>"
        );
      })
      .join("");

    eventsContainer.querySelectorAll("[data-ics-id]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = btn.getAttribute("data-ics-id");
        const found = DATA.events.find(function (e) {
          return e.id === id;
        });
        if (found) downloadICS(found);
      });
    });
  }

  eventButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      eventButtons.forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");
      renderEvents(btn.getAttribute("data-event-filter"));
    });
  });

  renderEvents("all");

  /* ------------------------------------------------------------------
     5. Alumni Blessing Wall (with localStorage persistence)
     ------------------------------------------------------------------ */
  const blessingsGrid = document.getElementById("blessings-grid");
  const blessingForm = document.getElementById("blessing-form");
  const formFeedback = document.getElementById("form-feedback");

  function loadBlessings() {
    let saved = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) saved = JSON.parse(raw);
    } catch (_) {
      saved = [];
    }
    return saved.concat(DATA.initialBlessings);
  }

  function renderBlessings() {
    if (!blessingsGrid) return;
    const all = loadBlessings();
    blessingsGrid.innerHTML = all
      .map(function (b) {
        return (
          '<article class="blessing-card">' +
          '  <p class="blessing-text">' + escapeHTML(b.message) + "</p>" +
          '  <div class="blessing-meta">' +
          "    <div>" +
          '      <span class="blessing-author">' + escapeHTML(b.author) + "</span>" +
          '      <span class="blessing-role">' + escapeHTML(b.role) + "</span>" +
          "    </div>" +
          '    <time class="blessing-date">' + escapeHTML(b.date) + "</time>" +
          "  </div>" +
          "</article>"
        );
      })
      .join("");
  }

  if (blessingForm) {
    blessingForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const author = document.getElementById("blessing-author").value.trim();
      const identity = document.getElementById("blessing-identity").value.trim();
      const cohort = document.getElementById("blessing-cohort").value.trim();
      const message = document.getElementById("blessing-message").value.trim();

      if (!author || !message) {
        if (formFeedback) {
          formFeedback.textContent = "請填寫您的姓名與祝福內容。";
        }
        return;
      }

      const roleText = cohort ? identity + "・" + cohort : identity;
      const today = new Date().toISOString().slice(0, 10);
      const entry = {
        id: "user-" + Date.now(),
        author: author,
        role: roleText,
        message: message,
        date: today
      };

      let saved = [];
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) saved = JSON.parse(raw);
      } catch (_) {
        saved = [];
      }
      saved.unshift(entry);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved.slice(0, 50)));
      } catch (_) {
        // Ignore storage quota errors
      }

      blessingForm.reset();
      renderBlessings();
      if (formFeedback) {
        formFeedback.textContent = "✦ 感謝您的祝福！您的留言已顯示於右側祝福牆。";
      }
    });
  }

  renderBlessings();

  /* ------------------------------------------------------------------
     6. Scroll Reveal Observer & Active Nav Highlight
     ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-desktop .nav-link");
  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach(function (link) {
              link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
            });
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    sections.forEach(function (sec) {
      navObserver.observe(sec);
    });
  }
})();
