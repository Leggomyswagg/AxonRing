/* AxonRing interactive journeys. Demonstrations only, not a live NFC scanner. */
(() => {
  "use strict";
  const studio = document.getElementById("studio");
  const collection = document.getElementById("line-a")?.nextElementSibling;
  if (!studio || !collection?.querySelector(".products")) return;
  const journeyHTML = [
    "<section class='section axr-xp' id='tap-experience' aria-labelledby='xp-title' data-stage='0'><div class='wrap'>",
    "<div class='axr-xp-head'><div><span class='xp-kicker'>01 / The experience</span><h2 id='xp-title'>Imagine the tap.<br>See what follows.</h2></div><p>Explore how one saved NFC action may open a destination on a compatible phone. An interactive illustration, not a scan of a real ring.</p></div>",
    "<div class='xp-choice-row' role='group' aria-label='Choose a use case'><button class='xp-choice' type='button' data-xp-use='share' aria-pressed='true'>Share a card</button><button class='xp-choice' type='button' data-xp-use='book' aria-pressed='false'>Open a booking page</button><button class='xp-choice' type='button' data-xp-use='automate' aria-pressed='false'>Configured shortcut</button></div>",
    "<div class='xp-stage xp-panel' style='margin-top:18px'><div class='xp-details'><span class='xp-kicker' id='xp-use-label'>Connect / Contact</span><h3 id='xp-use-title'>Your identity. One tap away.</h3><p id='xp-use-description'></p>",
    "<div class='xp-stepper' role='group' aria-label='Demonstration stage'><span class='is-active' data-xp-step='0'>Prepare</span><span data-xp-step='1'>Tap</span><span data-xp-step='2'>Open</span></div>",
    "<p id='xp-step-copy' class='xp-explainer' role='status' aria-live='polite'></p><button id='xp-next' class='btn primary' type='button'>Simulate a tap →</button></div>",
    "<div class='xp-device-scene' aria-label='Illustrated phone and ring simulation'><div class='xp-wave' aria-hidden='true'></div><div class='xp-wave' aria-hidden='true'></div>",
    "<div class='xp-device'><div class='xp-device-screen' role='status' aria-live='polite'><span class='xp-screen-app' id='xp-screen-app'>NFC tap · Ready</span><h4 id='xp-screen-title'>Ready to scan</h4><p id='xp-screen-description'></p><span class='xp-action' id='xp-screen-action'>Concept preview</span></div></div>",
    "<div class='xp-ring' aria-hidden='true'></div><span class='xp-scene-label'>Interaction preview / Not a live scan</span></div></div>",
    "<div class='xp-platform'><div class='xp-choice-row' role='group' aria-label='Phone platform'><button class='xp-choice' type='button' data-xp-platform='iphone' aria-pressed='true'>iPhone</button><button class='xp-choice' type='button' data-xp-platform='android' aria-pressed='false'>Android</button></div><span class='xp-note'>No battery. No subscription. NFC-capable phone required.</span></div>",
    "<p class='xp-tip' id='xp-platform-tip'></p><p class='xp-note'>Illustrative sequence only. This ring does not run apps, process card-terminal payments, unlock third-party doors, or write NFC records. Supported phone setup may be required.</p></div></section>"
  ].join("");

  const explorerHTML = [
    "<section class='section axr-xp explore' id='ring-explorer' aria-labelledby='xp-collection-title'><div class='wrap'>",
    "<div class='axr-xp-head'><div><span class='xp-kicker'>02 / Discover your AxonRing</span><h2 id='xp-collection-title'>Your finish.<br>Your fit.</h2></div><p>Preview the design direction of our two NFC jewelry lines and explore standard U.S. sizing measurements before requesting guidance.</p></div>",
    "<div class='xp-explore-grid'><div class='xp-product-visual xp-panel'><img id='xp-product-image' src='/images/luxury/axonring-on-hand.webp' alt='AxonRing on-hand campaign design study' loading='lazy' decoding='async' width='1024' height='1024'><span class='xp-image-note'>Illustrative design study · Actual product may differ</span></div>",
    "<div class='xp-product-info xp-panel'><span class='xp-kicker'>Select a design direction</span><div class='xp-choice-row' role='group' aria-label='Choose a ring design' style='margin-top:20px'><button class='xp-choice' type='button' data-xp-product='core' aria-pressed='true'>Core</button><button class='xp-choice' type='button' data-xp-product='prestige' aria-pressed='false'>Prestige</button></div>",
    "<h3 id='xp-product-name'>AxonRing Core</h3><span class='xp-product-price' id='xp-product-price'>$129 indicative</span><p class='xp-product-desc' id='xp-product-description'>Minimal black ceramic direction for everyday sharing.</p>",
    "<p class='xp-product-desc'>Both concepts share passive NTAG216 NFC. Final finishes, pricing, sizes, availability and purchase policies must be confirmed before checkout.</p><button id='xp-product-cta' type='button' class='btn primary'>Request sizing guidance →</button><p class='xp-note'>No order or payment is placed here.</p></div></div>",
    "<div class='xp-finder xp-panel'><div><span class='xp-kicker'>03 / Ring size guide</span><h3>Find your starting size.</h3><p>Move the slider to your measured finger circumference. See the closest reference U.S. ring size, then verify a comfortable fit before purchase.</p>",
    "<label for='xp-circumference' class='xp-fit-label'>Finger circumference: <strong id='xp-mm'>57.0 mm</strong></label><input id='xp-circumference' class='xp-fit-range' type='range' min='51.9' max='69.7' step='0.1' value='57' aria-describedby='xp-fit-disclaimer'><div class='xp-fit-range-labels'><span>51.9 mm</span><span>69.7 mm</span></div></div>",
    "<div><div class='xp-fit-result' role='status' aria-live='polite'><span class='xp-kicker'>Nearest standard reference</span><strong id='xp-size'>US size 8</strong><small id='xp-fit-detail'></small></div><p id='xp-fit-disclaimer' class='xp-disclaimer'>Approximate guidance, not a final sizing determination or stock guarantee. Measurements vary with finger shape, temperature, and ring width.</p><button id='xp-fit-cta' class='btn primary' type='button'>Request sizing guidance →</button></div></div></div></section>"
  ].join("");

  studio.insertAdjacentHTML("beforebegin", journeyHTML);
  collection.insertAdjacentHTML("afterend", explorerHTML);

  const journey = document.getElementById("tap-experience");
  const byJourney = (id) => journey.querySelector("#" + id);
  const scenarios = {
    share: {
      label: "Connect / Contact", title: "Your identity. One tap away.",
      description: "A passive NFC record can hold a public profile or portfolio URL.",
      cardTitle: "Jordan Lee", cardDescription: "Creative director · Contact card",
      action: "Public profile opens in browser",
      steps: [
        "Save your public contact page URL to the tag with a compatible NFC writing app.",
        "A compatible phone reads the ring's NFC record near its scanning area.",
        "The recipient can open the stored public profile page."
      ]
    },
    book: {
      label: "Connect / Booking", title: "Less explaining. More connecting.",
      description: "A programmed URL can direct someone to your booking page.",
      cardTitle: "Schedule a meeting", cardDescription: "Your public booking page",
      action: "Your chosen web destination opens",
      steps: [
        "Save an actual public booking link using a compatible NFC writer.",
        "The phone recognizes the URL record near its reader.",
        "The visitor can open your booking destination."
      ]
    },
    automate: {
      label: "Automate / Configured phone", title: "A cue for your workflow.",
      description: "Supported phones may recognize a tag as a trigger for a separately configured automation.",
      cardTitle: "Your configured action", cardDescription: "Personal automation / Tasker",
      action: "Requires setup and permissions",
      steps: [
        "Configure a supported NFC-triggered workflow in your phone's automation app.",
        "The phone recognizes the specific NFC tag configured for that action.",
        "Depending on settings and permissions, the workflow may run or prompt."
      ]
    }
  };
  let scenario = "share", platform = "iphone", stage = 0;
  const emit = (action, value) => {
    try { window.dispatchEvent(new CustomEvent("axonring:experience", {
      detail: { experience: "interactive_home", action, value }
    })); } catch (_) { /* Optional telemetry hook */ }
  };
  const renderJourney = () => {
    const info = scenarios[scenario];
    journey.dataset.stage = String(stage);
    journey.querySelectorAll("[data-xp-use]").forEach((btn) =>
      btn.setAttribute("aria-pressed", String(btn.dataset.xpUse === scenario)));
    journey.querySelectorAll("[data-xp-platform]").forEach((btn) =>
      btn.setAttribute("aria-pressed", String(btn.dataset.xpPlatform === platform)));
    journey.querySelectorAll("[data-xp-step]").forEach((node) =>
      node.classList.toggle("is-active", Number(node.dataset.xpStep) === stage));
    byJourney("xp-use-label").textContent = info.label;
    byJourney("xp-use-title").textContent = info.title;
    byJourney("xp-use-description").textContent = info.description;
    byJourney("xp-step-copy").textContent = info.steps[stage];
    byJourney("xp-screen-app").textContent = ["NFC tap · Ready", "NFC tag recognized", "Destination preview"][stage];
    byJourney("xp-screen-title").textContent = stage === 0 ? "Ready to scan" : stage === 1 ? "NFC tag recognized" : info.cardTitle;
    byJourney("xp-screen-description").textContent = stage === 0 ? "Bring the ring near the phone's NFC reader." : stage === 1 ? "The phone interprets the record." : info.cardDescription;
    byJourney("xp-screen-action").textContent = stage === 2 ? info.action : "Concept preview · No live NFC scan";
    byJourney("xp-next").textContent = ["Simulate a tap →", "View the result →", "Replay experience ↻"][stage];
    byJourney("xp-platform-tip").textContent = platform === "iphone"
      ? "On iPhone, opening a stored link and using NFC to trigger a personal automation are separate workflows. Device and iOS support vary."
      : "On Android, NFC links and Tasker workflows depend on the phone, app configuration, and permissions.";
  };
  journey.querySelectorAll("[data-xp-use]").forEach((btn) => btn.addEventListener("click", () => {
    scenario = btn.dataset.xpUse;
    stage = 0;
    renderJourney();
    emit("use_case_selected", scenario);
  }));
  journey.querySelectorAll("[data-xp-platform]").forEach((btn) => btn.addEventListener("click", () => {
    platform = btn.dataset.xpPlatform;
    renderJourney();
    emit("platform_selected", platform);
  }));
  byJourney("xp-next").addEventListener("click", () => {
    stage = (stage + 1) % 3;
    renderJourney();
    emit("tap_step", String(stage));
  });
  renderJourney();

  const explorer = document.getElementById("ring-explorer");
  const byExplorer = (id) => explorer.querySelector("#" + id);
  const products = {
    core: { name: "AxonRing Core", price: "$129 indicative",
      description: "Minimal black ceramic direction for everyday sharing and configured phone workflows.",
      image: "/images/luxury/axonring-on-hand.webp",
      alt: "AxonRing on-hand design study, illustrating the Core styling direction" },
    prestige: { name: "AxonRing Prestige", price: "$299 indicative",
      description: "A gold-tone accented jewelry direction with the same passive NFC utility.",
      image: "/images/luxury/axonring-detail.webp",
      alt: "Black-and-gold AxonRing detail design study, illustrating the Prestige styling direction" }
  };
  explorer.querySelectorAll("[data-xp-product]").forEach((btn) => btn.addEventListener("click", () => {
    const p = products[btn.dataset.xpProduct];
    explorer.querySelectorAll("[data-xp-product]").forEach((b) =>
      b.setAttribute("aria-pressed", String(b === btn)));
    byExplorer("xp-product-name").textContent = p.name;
    byExplorer("xp-product-price").textContent = p.price;
    byExplorer("xp-product-description").textContent = p.description;
    byExplorer("xp-product-image").src = p.image;
    byExplorer("xp-product-image").alt = p.alt;
    emit("product_selected", btn.dataset.xpProduct);
  }));

  const sizeTable = [
    [6,51.9,16.5],[7,54.4,17.3],[8,57,18.1],[9,59.5,18.9],
    [10,62.1,19.8],[11,64.6,20.6],[12,67.2,21.4],[13,69.7,22.2]
  ];
  const slider = byExplorer("xp-circumference");
  const renderSize = () => {
    const mm = Number(slider.value);
    const nearest = sizeTable.reduce((best, row) =>
      Math.abs(row[1] - mm) < Math.abs(best[1] - mm) ? row : best, sizeTable[0]);
    byExplorer("xp-mm").textContent = mm.toFixed(1) + " mm";
    byExplorer("xp-size").textContent = "US size " + nearest[0];
    byExplorer("xp-fit-detail").textContent = nearest[2].toFixed(1) +
      " mm reference diameter · " + nearest[1].toFixed(1) +
      " mm reference circumference. Verify fit physically.";
  };
  slider.addEventListener("input", renderSize);
  slider.addEventListener("change", () => emit("fit_guide_adjusted", "used"));
  renderSize();
  const openSizing = () => {
    const existing = document.querySelector("#line-a [data-open='sizing']");
    if (existing) existing.click();
    else document.getElementById("foundingMembers")?.scrollIntoView();
  };
  byExplorer("xp-product-cta").addEventListener("click", openSizing);
  byExplorer("xp-fit-cta").addEventListener("click", openSizing);
  const studioLink = document.querySelector("#mainNav a[href='#studio']");
  if (studioLink) {
    const link = document.createElement("a");
    link.href = "#tap-experience";
    link.textContent = "Try a tap";
    studioLink.before(link);
  }
})();
