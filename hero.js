const hero = document.getElementById("hero");
const openButton = document.getElementById("open-invitation");
const openStatus = document.getElementById("open-status");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function scrollToNextSection() {
  const nextSection = document.getElementById("family") || hero.nextElementSibling;
  if (nextSection) nextSection.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth" });
}

function unlockInvitation() {
  hero.classList.add("is-opened");
  document.body.classList.remove("is-locked");
  document.body.classList.add("is-opened");
  openStatus.textContent = "La invitación está abierta.";
}

openButton.addEventListener("click", () => {
  hero.classList.add("is-opening");
  unlockInvitation();
  openButton.setAttribute("aria-pressed", "true");
  window.setTimeout(scrollToNextSection, reduceMotion.matches ? 0 : 760);
}, { once: true });
