(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const openButton = document.getElementById("open-invitation");
  openButton?.addEventListener("click", () => {
    document.getElementById("hero")?.classList.add("is-opening");
  }, { once: true });

  const titleSparkles = document.querySelector(".hero-title-sparkles");
  if (titleSparkles && !reduceMotion.matches) {
    for (let i = 0; i < 8; i += 1) {
      const sparkle = document.createElement("span");
      sparkle.className = `title-sparkle ${i % 3 === 0 ? "title-sparkle--glint" : "title-sparkle--twinkle"}`;
      sparkle.style.setProperty("--sparkle-x", `${6 + Math.random() * 88}%`);
      sparkle.style.setProperty("--sparkle-y", `${6 + Math.random() * 88}%`);
      sparkle.style.setProperty("--sparkle-duration", `${1.7 + Math.random() * 1.1}s`);
      sparkle.style.setProperty("--sparkle-delay", `${Math.random() * 1.8}s`);
      titleSparkles.append(sparkle);
    }
  }

})();
