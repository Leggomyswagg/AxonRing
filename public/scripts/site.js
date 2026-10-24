/* Shared navigation, attribution and existing AxonRing signup flows. */
(() => {
  const EVENTS_URL =
    "https://dxofkkdmrvyizwcdyrks.supabase.co/functions/v1/axonring-events";
  const store = window.AXONRING_BROWSER_STATE;
  const uuid = () =>
    crypto.randomUUID
      ? crypto.randomUUID()
      : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          return (c === "x" ? r : (r & 3) | 8).toString(16);
        });
  const getId = (kind, key) => {
    let value = store.read(kind, key);
    if (!value) {
      value = uuid();
      store.write(kind, key, value);
    }
    return value;
  };
  const anonymousId = getId("localStorage", "axonring_anonymous_id");
  const sessionId = getId("sessionStorage", "axonring_session_id");
  const params = new URLSearchParams(location.search);
  const currentTouch = {
    source: params.get("utm_source") || "axonring_web",
    page_url: location.href,
    landing_page: location.href,
    referrer: document.referrer || null,
    ...Object.fromEntries(
      [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content",
        "utm_term",
      ].map((key) => [key, params.get(key)]),
    ),
  };
  let firstTouch;
  try {
    firstTouch = JSON.parse(store.read("localStorage", "axonring_first_touch"));
  } catch {
    /* Start a fresh attribution record. */
  }
  if (!firstTouch) {
    firstTouch = currentTouch;
    store.write(
      "localStorage",
      "axonring_first_touch",
      JSON.stringify(firstTouch),
    );
  }
  async function track(
    event_name,
    { form = {}, properties = {}, marketing } = {},
  ) {
    if (window.AXONRING_LOGO_QA) return { qa: true };
    const consent = { analytics: true };
    if (typeof marketing === "boolean") consent.marketing = marketing;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    let response;
    try {
      response = await fetch(EVENTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-AxonRing-Source": "axonring.com",
        },
        signal: controller.signal,
        body: JSON.stringify({
          event_name,
          event_id: uuid(),
          anonymous_id: anonymousId,
          session_id: sessionId,
          occurred_at: new Date().toISOString(),
          attribution: { ...currentTouch, first_touch: firstTouch },
          consent,
          form,
          properties,
          experiment: {
            key: "logo_mark_v1",
            variant: window.AXONRING_LOGO_VARIANT,
          },
        }),
      });
    } finally {
      clearTimeout(timeout);
    }
    if (!response.ok) throw new Error("submission_failed");
  }
  if (!store.read("sessionStorage", "axonring_exp_exposed_logo_mark_v1")) {
    store.write("sessionStorage", "axonring_exp_exposed_logo_mark_v1", "1");
    track("experiment_exposed", {
      properties: {
        surface: "site_header_and_hero",
        allocation: "50_50",
        logo_variant: window.AXONRING_LOGO_VARIANT,
      },
    }).catch(() => {});
  }
  track("page_viewed", {
    properties: { title: document.title, path: location.pathname },
  }).catch(() => {});

  // Anonymous interaction signals for the new educational homepage modules.
  window.addEventListener("axonring:experience", (event) => {
    const detail = event.detail || {};
    const allowed = ["use_case_selected", "platform_selected", "tap_step", "product_selected", "fit_guide_adjusted"];
    if (detail.experience !== "interactive_home" || !allowed.includes(detail.action)) return;
    track("cta_clicked", {
      properties: {
        cta: "interactive_" + detail.action,
        selection: String(detail.value || "").slice(0, 32),
        surface: "home_experience",
        path: location.pathname,
      },
    }).catch(() => {});
  });
  const copy = {
    card: ["Digital business card", "Share a contact card or profile page."],
    calendar: ["Booking page", "Open your Calendly or booking URL."],
    portfolio: ["Portfolio", "Open a selected work or portfolio page."],
    wifi: [
      "Guest Wi-Fi",
      "Share a guest network record; support varies by phone.",
    ],
    gym: ["Check-in", "Open a gym, event, or attendance URL."],
    automation: [
      "Phone automation",
      "Use the tag as an iOS Shortcuts or Android Tasker trigger.",
    ],
  };
  let active = "card";
  document.querySelectorAll(".tab").forEach((tab) =>
    tab.addEventListener("click", () => {
      document
        .querySelectorAll(".tab")
        .forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
      active = tab.dataset.type;
      document.getElementById("typeHelp").textContent = copy[active][1];
    }),
  );
  document.getElementById("previewBtn")?.addEventListener("click", () => {
    const name =
      document.getElementById("displayName").value.trim() || copy[active][0];
    const value = document.getElementById("destination").value.trim();
    const link = document.getElementById("previewLink");
    document.getElementById("previewTitle").textContent = name;
    document.getElementById("previewText").textContent = copy[active][0];
    link.textContent =
      value.replace(/^https?:\/\//, "") || "Your saved destination";
    try {
      const url = new URL(value);
      link.href = ["http:", "https:"].includes(url.protocol) ? url.href : "#";
    } catch {
      link.href = "#";
    }
    track("cta_clicked", {
      properties: { cta: "studio_preview", action_type: active },
    }).catch(() => {});
  });

  let modalOpener;
  const closeAll = () => {
    document
      .querySelectorAll(".modal.open")
      .forEach((modal) => modal.classList.remove("open"));
    document.body.style.overflow = "";
    modalOpener?.focus({ preventScroll: true });
  };
  const menuBtn = document.getElementById("menuBtn");
  const mainNav = document.getElementById("mainNav");
  menuBtn?.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute(
      "aria-label",
      open ? "Close navigation menu" : "Open navigation menu",
    );
  });
  mainNav?.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", "Open navigation menu");
    }),
  );
  document.querySelectorAll("[data-open]").forEach((button) =>
    button.addEventListener("click", () => {
      const modal = document.getElementById(button.dataset.open);
      if (!modal) return;
      closeAll();
      modalOpener = button;
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
      modal.querySelector("input, button")?.focus({ preventScroll: true });
      track("cta_clicked", {
        properties: {
          cta: button.dataset.open,
          label: button.textContent.trim(),
          surface: button.dataset.ctaSurface || "site",
          path: location.pathname,
        },
      }).catch(() => {});
      if (button.dataset.open === "founding")
        track("founding_member_form_started").catch(() => {});
    }),
  );
  document
    .querySelectorAll("[data-close]")
    .forEach((button) => button.addEventListener("click", closeAll));
  document.querySelectorAll(".modal").forEach((modal) =>
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeAll();
    }),
  );
  document.addEventListener("keydown", (event) => {
    const modal = document.querySelector(".modal.open");
    if (!modal) return;
    if (event.key === "Escape") closeAll();
    if (event.key === "Tab") {
      const items = [
        ...modal.querySelectorAll("button, input, select, textarea, a[href]"),
      ].filter((item) => !item.disabled && item.getClientRects().length);
      const first = items[0],
        last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  });
  document.querySelectorAll("[data-form]").forEach((form) => {
    const success = form.querySelector(".success");
    success.setAttribute("role", "status");
    success.setAttribute("aria-live", "polite");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const button = form.querySelector("[type=submit]");
      if (button.disabled) return;
      const label = button.textContent,
        data = Object.fromEntries(new FormData(form));
      button.disabled = true;
      button.textContent = "Saving…";
      success.style.display = "none";
      try {
        if (form.dataset.form === "AxonRing Founding Member survey") {
          const base = {
            email: data.email,
            product_interest: "undecided",
            primary_use_case: data.feature_interest,
            biggest_friction: data.biggest_problem,
            style_preference: "not_asked",
            price_response: data.price_range,
            purchase_timing: data.beta_interest,
            open_feedback: data.biggest_problem,
            would_wear: data.would_wear,
            platform: data.platform,
            beta_interest: data.beta_interest,
          };
          await track("founding_member_signed_up", {
            form: base,
            marketing: true,
            properties: { flow: "founding_members" },
          });
          await track("survey_completed", {
            form: base,
            marketing: true,
            properties: { flow: "founding_members" },
          });
        } else if (form.dataset.form === "Sizing kit request") {
          const interest = (data.ring_interest || "")
            .toLowerCase()
            .includes("prestige")
            ? "prestige"
            : (data.ring_interest || "").toLowerCase().includes("core")
              ? "core"
              : "undecided";
          await track("sizing_kit_requested", {
            form: {
              email: data.email,
              product_interest: interest,
              requested_size: "sizing_kit",
              country: data.location,
            },
            properties: { flow: "fit_first" },
          });
        } else {
          await track("research_waitlist_signed_up", {
            form: { email: data.email, product_interest: "undecided" },
            properties: {
              flow: "sensor_research_waitlist",
              priority: data.priority,
            },
          });
        }
        success.textContent =
          form.dataset.form === "AxonRing Founding Member survey"
            ? "Your Founding Member responses were saved successfully."
            : "Your request was saved successfully.";
        success.style.color = "";
        success.style.display = "block";
        form.reset();
      } catch {
        success.textContent =
          "We could not save your request. Please try again or email support@axonring.com.";
        success.style.color = "#ffb4a8";
        success.style.display = "block";
      } finally {
        button.disabled = false;
        button.textContent = label;
      }
    });
  });
})();
