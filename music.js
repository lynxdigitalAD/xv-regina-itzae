(() => {
  const audio = document.getElementById("invitation-music");
  const musicButton = document.getElementById("music-toggle");
  const openButton = document.getElementById("open-invitation");
  if (!audio || !musicButton || !openButton) return;

  audio.loop = true;
  audio.volume = 0.5;
  audio.pause();
  audio.currentTime = 0;
  let startedFromOpen = false;

  function updateMusicButton() {
    const playing = !audio.paused && !audio.ended;
    musicButton.classList.toggle("is-playing", playing);
    musicButton.setAttribute("aria-pressed", String(playing));
    musicButton.setAttribute("aria-label", playing ? "Pausar música" : "Reproducir música");
  }

  function attemptPlayback() {
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(updateMusicButton);
    }
  }

  audio.addEventListener("play", updateMusicButton);
  audio.addEventListener("pause", updateMusicButton);
  audio.addEventListener("ended", updateMusicButton);

  openButton.addEventListener("click", () => {
    if (startedFromOpen) return;
    startedFromOpen = true;
    audio.currentTime = 0;
    attemptPlayback();
  });

  musicButton.addEventListener("click", () => {
    if (document.body.classList.contains("is-locked")) return;

    if (audio.paused || audio.ended) {
      attemptPlayback();
    } else {
      audio.pause();
    }
  });

  updateMusicButton();
})();
