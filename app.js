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
  const targetTime = Date.parse(event.dateTime || "");
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
  const guestWhatsappNote = document.getElementById("guest-whatsapp-note");
  const WHATSAPP_NUMBER = String(config.whatsapp?.number || "").replace(/\D/g, "");
  const hasGuestWhatsappNumber = WHATSAPP_NUMBER.length >= 10;
  if (guestWhatsappButton) guestWhatsappButton.disabled = !hasGuestWhatsappNumber;
  if (hasGuestWhatsappNumber && guestWhatsappNote) guestWhatsappNote.textContent = "Se abrirá WhatsApp con un mensaje listo para enviar.";
  guestWhatsappButton?.addEventListener("click", () => {
    if (!hasGuestWhatsappNumber) return;
    const name = document.getElementById("guest-name")?.textContent?.trim() || "";
    const passes = document.getElementById("guest-passes")?.textContent?.trim() || "";
    const message = encodeURIComponent(`Hola, confirmo nuestra asistencia a los XV años de Regina Itzae.\nInvitación: ${name}.\nPases autorizados: ${passes}.`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank", "noopener,noreferrer");
  });

  // Imágenes de muestra: sustituir estas rutas por las fotos definitivas cuando estén disponibles.
  const galleryImages = [
    { src: "assets/jardín_de_rosas_bajo_la_vía_láctea.png", alt: "Jardín de rosas bajo la Vía Láctea, imagen de muestra" },
    { src: "assets/sections/pases-confirmacion-fondo.png", alt: "Jardín fantástico de noche, imagen de muestra" },
    { src: "assets/sections/sendero_encantado_hacia_el_castillo_lunar.png", alt: "Sendero encantado hacia el castillo lunar, imagen de muestra" }
  ];
  const galleryPhoto = document.getElementById("gallery-photo");
  const galleryPrevious = document.getElementById("gallery-previous");
  const galleryNext = document.getElementById("gallery-next");
  let currentGalleryIndex = 0;
  let galleryFadeTimer;

  function showGalleryImage(nextIndex) {
    if (!galleryPhoto || !galleryImages.length) return;
    currentGalleryIndex = (nextIndex + galleryImages.length) % galleryImages.length;
    const image = galleryImages[currentGalleryIndex];
    galleryPhoto.classList.add("is-fading");
    window.clearTimeout(galleryFadeTimer);
    galleryFadeTimer = window.setTimeout(() => {
      galleryPhoto.src = image.src;
      galleryPhoto.alt = image.alt;
      window.requestAnimationFrame(() => galleryPhoto.classList.remove("is-fading"));
    }, 205);
  }

  galleryPrevious?.addEventListener("click", () => showGalleryImage(currentGalleryIndex - 1));
  galleryNext?.addEventListener("click", () => showGalleryImage(currentGalleryIndex + 1));
})();
