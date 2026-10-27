document.addEventListener("DOMContentLoaded", () => {
  'use strict';

  // 1. Language & Storage
  const languageSelect = document.getElementById("language-select");
  const savedLanguage = localStorage.getItem("teamPortfolioLanguage") || "ru";

  function currentLanguage() {
    return document.documentElement.lang === "en" ? "en" : "ru";
  }

  function setLanguage(language) {
    if (language !== "en" && language !== "ru") language = "ru";
    document.documentElement.lang = language;
    localStorage.setItem("teamPortfolioLanguage", language);

    document.querySelectorAll("[data-en][data-ru]").forEach((el) => {
      const text = el.getAttribute(`data-${language}`);
      if (text) el.textContent = text;
    });
    document.querySelectorAll("[data-en-placeholder][data-ru-placeholder]").forEach((el) => {
      const ph = el.getAttribute(`data-${language}-placeholder`);
      if (ph) el.placeholder = ph;
    });
    document.querySelectorAll("[data-en-alt][data-ru-alt]").forEach((el) => {
      const alt = el.getAttribute(`data-${language}-alt`);
      if (alt) el.alt = alt;
    });
    document.querySelectorAll("[data-en-aria-label][data-ru-aria-label]").forEach((el) => {
      const aria = el.getAttribute(`data-${language}-aria-label`);
      if (aria) el.setAttribute("aria-label", aria);
    });

    if (languageSelect) languageSelect.value = language;
    updateThemeButton();
    updateSoundButton();
    updateSummary();
  }

  if (languageSelect) {
    languageSelect.addEventListener("change", () => {
      setLanguage(languageSelect.value);
    });
  }

  // 2. Team Members & Summary
  const teamMembers = [
    { name: "Mansur", city: "Astana" },
    { name: "Erasyl", city: "Shymkent" },
    { name: "Ansar", city: "Kosshy" }
  ];

  function updateSummary() {
    const summary = document.getElementById("team-summary");
    if (!summary) return;
    const names = teamMembers.map(m => m.name).join(", ");
    const ru = currentLanguage() === "ru";
    summary.textContent = ru ? "Наша команда: " + names + "." : "Our team: " + names + ".";
    summary.title = ru ? `Участников команды: ${teamMembers.length}` : `Team members: ${teamMembers.length}`;
  }

  // 3. Live Clock
  const clock = document.getElementById("current-datetime");
  function updateClock() {
    if (!clock) return;
    try {
      const locale = currentLanguage() === "ru" ? "ru-RU" : "en-US";
      clock.textContent = new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "medium"
      }).format(new Date());
    } catch (e) {
      clock.textContent = new Date().toLocaleString();
    }
  }
  updateClock();
  setInterval(updateClock, 1000);

  // 4. Background Changer
  const changeBackground = document.getElementById("change-background");
  const backgrounds = ["#f4f8fb", "#f8f1e7", "#edf7ed", "#f4effa"];
  let backgroundIndex = 0;
  if (changeBackground) {
    changeBackground.addEventListener("click", () => {
      document.body.style.backgroundColor = backgrounds[backgroundIndex % backgrounds.length];
      backgroundIndex++;
    });
  }

  // 5. Night Mode
  let nightMode = false;
  const themeButton = document.getElementById("toggle-theme");
  function updateThemeButton() {
    if (!themeButton) return;
    const ru = currentLanguage() === "ru";
    themeButton.textContent = nightMode ? (ru ? "Дневной режим" : "Day mode") : (ru ? "Ночной режим" : "Night mode");
    themeButton.setAttribute("aria-pressed", String(nightMode));
  }
  if (themeButton) {
    themeButton.addEventListener("click", () => {
      nightMode = !nightMode;
      document.body.classList.toggle("night-mode", nightMode);
      document.body.classList.toggle("dark-theme", nightMode);
      updateThemeButton();
    });
  }

  // 6. Sound & Web Audio API
  let soundOn = true;
  const soundButton = document.getElementById("sound-toggle");
  function updateSoundButton() {
    if (!soundButton) return;
    const ru = currentLanguage() === "ru";
    soundButton.textContent = soundOn ? (ru ? "Звук: включён" : "Sound: On") : (ru ? "Звук: выключен" : "Sound: Off");
    soundButton.setAttribute("aria-pressed", String(soundOn));
  }

  function playUiSound() {
    if (!soundOn) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const audio = new AudioContextClass();
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = 660;
      gain.gain.setValueAtTime(0.0001, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, audio.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.12);
      oscillator.connect(gain);
      gain.connect(audio.destination);
      oscillator.start();
      oscillator.stop(audio.currentTime + 0.13);
      oscillator.addEventListener("ended", () => audio.close(), { once: true });
    } catch (error) {
      // Audio optional, ignore
    }
  }

  if (soundButton) {
    soundButton.addEventListener("click", () => {
      soundOn = !soundOn;
      updateSoundButton();
      if (soundOn) playUiSound();
    });
  }

  document.addEventListener("click", (event) => {
    const btn = event.target.closest("button");
    if (btn && btn.id !== "sound-toggle") {
      playUiSound();
    }
  });

  // 7. Accordion
  document.querySelectorAll(".accordion-trigger").forEach(button => {
    button.addEventListener("click", () => {
      const panelId = button.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      if (panel) panel.hidden = expanded;
      playUiSound();
    });
  });

  // 8. Modal
  const modal = document.getElementById("subscription-modal");
  const openModal = document.getElementById("open-subscription");
  const closeModal = document.getElementById("close-subscription");

  if (modal) modal.hidden = true;

  if (openModal && modal) {
    openModal.addEventListener("click", () => {
      modal.hidden = false;
      modal.classList.add("is-visible");
    });
  }
  if (closeModal && modal) {
    closeModal.addEventListener("click", () => {
      modal.hidden = true;
      modal.classList.remove("is-visible");
    });
  }
  if (modal) {
    modal.addEventListener("click", event => {
      if (event.target === modal) {
        modal.hidden = true;
        modal.classList.remove("is-visible");
      }
    });
  }

  // Initialize saved language
  setLanguage(savedLanguage);
});
