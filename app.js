(() => {
  const config = window.INVITATION_CONFIG || {};
  const event = config.event || {};
  const copy = config.copy || {};
  // Datos temporales de demostración. La función queda expuesta para personalizar el pase desde el enlace del invitado.
  function renderInvitationGuest({ name, passes } = {}) {
    const guestName = document.getElementById("guest-name");
    const guestPasses = document.getElementById("guest-passes");
    if (guestName && name !== undefined) guestName.textContent = String(name);
    if (guestPasses && passes !== undefined) guestPasses.textContent = String(passes);
  }
  window.renderInvitationGuest = renderInvitationGuest;
  renderInvitationGuest({ name: "Familia invitada", passes: 4 });

  document.querySelectorAll("[data-event-list]").forEach((host) => {
    const names = Array.isArray(event[host.dataset.eventList]) ? event[host.dataset.eventList] : [];
    host.replaceChildren(...names.map((name) => {
      const line = document.createElement("p");
      line.textContent = name;
      return line;
    }));
  });

  const countdownLabels = copy.countdown?.labels || ["Días", "Horas", "Minutos", "Segundos"];
  document.querySelectorAll("[data-clock-label]").forEach((node, index) => {
    node.textContent = countdownLabels[index] || node.textContent;
  });

  const clockSlots = Object.fromEntries(
    ["days", "hours", "minutes", "seconds"].map((unit) => [unit, document.querySelector(`[data-clock="${unit}"]`)])
  );
  function zonedDateTimeToTimestamp(dateTime, timeZone) {
    const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/.exec(dateTime || "");
    if (!match) return NaN;

    const [, year, month, day, hour, minute, second] = match.map(Number);
    const targetUtc = Date.UTC(year, month - 1, day, hour, minute, second);
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      calendar: "gregory",
      numberingSystem: "latn",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23"
    });
    let timestamp = targetUtc;

    for (let attempt = 0; attempt < 2; attempt += 1) {
      const parts = Object.fromEntries(formatter.formatToParts(new Date(timestamp)).map(({ type, value }) => [type, value]));
      const displayedAsUtc = Date.UTC(
        Number(parts.year), Number(parts.month) - 1, Number(parts.day),
        Number(parts.hour), Number(parts.minute), Number(parts.second)
      );
      timestamp += targetUtc - displayedAsUtc;
    }

    return timestamp;
  }

  const targetTime = event.timeZone
    ? zonedDateTimeToTimestamp(event.dateTime, event.timeZone)
    : Date.parse(event.dateTime || "");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function setCountdownValue(slot, nextValue) {
    if (!slot || slot.textContent === nextValue) return;
    if (reduceMotion.matches || typeof slot.animate !== "function") {
      slot.textContent = nextValue;
      return;
    }

    const fadeOut = slot.animate(
      [{ opacity: 1, transform: "translateY(0)" }, { opacity: 0, transform: "translateY(-4px)" }],
      { duration: 105, easing: "ease-in", fill: "forwards" }
    );
    fadeOut.onfinish = () => {
      fadeOut.cancel();
      slot.textContent = nextValue;
      slot.animate(
        [{ opacity: 0, transform: "translateY(4px)" }, { opacity: 1, transform: "translateY(0)" }],
        { duration: 115, easing: "ease-out" }
      );
    };
  }

  function updateCountdown() {
    if (!Number.isFinite(targetTime)) {
      Object.values(clockSlots).forEach((slot) => setCountdownValue(slot, "—"));
      return;
    }
    const remaining = Math.max(0, Math.floor((targetTime - Date.now()) / 1000));
    const values = {
      days: Math.floor(remaining / 86400),
      hours: Math.floor((remaining % 86400) / 3600),
      minutes: Math.floor((remaining % 3600) / 60),
      seconds: remaining % 60
    };
    Object.entries(values).forEach(([unit, value]) => {
      const slot = clockSlots[unit];
      setCountdownValue(slot, unit === "days" ? String(value) : String(value).padStart(2, "0"));
    });
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  const locations = { ceremony: config.ceremony || {}, reception: config.reception || {} };
  const tabs = [...document.querySelectorAll("[data-location]")];
  const mapsButton = document.getElementById("open-maps");
  const mapsEmbed = document.querySelector(".maps-embed");
  const mapsLocationDetails = document.getElementById("maps-location-details");
  const mapsPlaceName = document.getElementById("maps-place-name");
  const mapsPlaceTime = document.getElementById("maps-place-time");
  const defaultMapsEmbedUrl = mapsEmbed?.getAttribute("src") || "";
  let currentLocation = "ceremony";

  function setLocation(key) {
    const location = locations[key];
    if (!location || !mapsButton) return;
    currentLocation = key;
    tabs.forEach((tab) => {
      const selected = tab.dataset.location === key;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      tab.classList.toggle("is-active", selected);
    });
    const hasMapsUrl = /^https?:\/\//i.test(location.mapsUrl?.trim() || "");
    mapsButton.disabled = !hasMapsUrl;
    if (mapsEmbed) {
      if (key === "reception" && location.mapCenter) {
        mapsEmbed.src = `https://maps.google.com/maps?ll=${encodeURIComponent(location.mapCenter)}&z=16&output=embed`;
      } else {
        mapsEmbed.src = defaultMapsEmbedUrl;
      }
      mapsEmbed.title = key === "reception" ? "Mapa de Salón Videmar en Tulancingo de Bravo, Hidalgo" : "Mapa de la ceremonia en Ciudad de México";
    }
    if (mapsLocationDetails) {
      mapsLocationDetails.hidden = key !== "reception";
      if (key === "reception") {
        if (mapsPlaceName) mapsPlaceName.textContent = location.name || "";
        if (mapsPlaceTime) mapsPlaceTime.textContent = location.time || "";
      }
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => setLocation(tab.dataset.location));
    tab.addEventListener("keydown", (keyboardEvent) => {
      let next = index;
      if (keyboardEvent.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (keyboardEvent.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
      if (keyboardEvent.key === "Home") next = 0;
      if (keyboardEvent.key === "End") next = tabs.length - 1;
      if (next === index) return;
      keyboardEvent.preventDefault();
      tabs[next].focus();
      setLocation(tabs[next].dataset.location);
    });
  });

  setLocation(currentLocation);

  mapsButton.addEventListener("click", () => {
    const url = locations[currentLocation]?.mapsUrl?.trim();
    if (mapsButton.disabled || !/^https?:\/\//i.test(url || "")) return;
    window.open(url, "_blank", "noopener,noreferrer");
  });

  const guestWhatsappButton = document.getElementById("guest-confirm-whatsapp");
  const WHATSAPP_NUMBER = String(config.whatsapp?.number || "").replace(/\D/g, "");
  const hasGuestWhatsappNumber = WHATSAPP_NUMBER.length >= 10;
  if (guestWhatsappButton) guestWhatsappButton.disabled = !hasGuestWhatsappNumber;
  guestWhatsappButton?.addEventListener("click", () => {
    if (!hasGuestWhatsappNumber) return;
    const name = document.getElementById("guest-name")?.textContent?.trim() || "";
    const passes = document.getElementById("guest-passes")?.textContent?.trim() || "";
    const message = encodeURIComponent(`Hola, confirmo nuestra asistencia a los XV años de Regina Itzae.\nInvitación: ${name}.\nPases autorizados: ${passes}.`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank", "noopener,noreferrer");
  });

})();
