
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // 1. Language & Storage
  const languageSelect = document.getElementById("language-select");
  const savedLanguage = localStorage.getItem("teamPortfolioLanguage") || "ru";

  function currentLanguage() {
    return document.documentElement.lang === "en" ? "en" : "ru";
  }

  function setLanguage(language) {
    switch (language) {
      case "en":
        document.documentElement.lang = "en";
        break;
      case "ru":
        document.documentElement.lang = "ru";
        break;
      default:
        language = "ru";
        document.documentElement.lang = "ru";
    }

    localStorage.setItem("teamPortfolioLanguage", language);

    document.querySelectorAll("[data-en][data-ru]").forEach((el) => {
      const text = el.getAttribute(`data-${language}`);
      if (text) el.textContent = text;
    });

    document.querySelectorAll("[data-en-placeholder][data-ru-placeholder]").forEach((el) => {
      const placeholder = el.getAttribute(`data-${language}-placeholder`);
      if (placeholder) el.placeholder = placeholder;
    });

    document.querySelectorAll("[data-en-alt][data-ru-alt]").forEach((el) => {
      const alt = el.getAttribute(`data-${language}-alt`);
      if (alt) el.alt = alt;
    });

    document.querySelectorAll("[data-en-aria-label][data-ru-aria-label]").forEach((el) => {
      const label = el.getAttribute(`data-${language}-aria-label`);
      if (label) el.setAttribute("aria-label", label);
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

    const names = teamMembers.map((member) => member.name).join(", ");
    const ru = currentLanguage() === "ru";

    summary.textContent = ru
      ? "Наша команда: " + names + "."
      : "Our team: " + names + ".";

    summary.title = ru
      ? `Участников команды: ${teamMembers.length}`
      : `Team members: ${teamMembers.length}`;

    // Restart the animation when the summary changes.
    summary.classList.remove("is-animated");
    void summary.offsetWidth;
    summary.classList.add("is-animated");
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
    } catch (error) {
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
      document.body.style.backgroundColor =
        backgrounds[backgroundIndex % backgrounds.length];
      backgroundIndex++;
    });
  }

  // 5. Night Mode
  let nightMode = false;
  const themeButton = document.getElementById("toggle-theme");

  function updateThemeButton() {
    if (!themeButton) return;

    const ru = currentLanguage() === "ru";
    themeButton.textContent = nightMode
      ? (ru ? "Дневной режим" : "Day mode")
      : (ru ? "Ночной режим" : "Night mode");

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
  let audioContext = null;
  const soundButton = document.getElementById("sound-toggle");

  function updateSoundButton() {
    if (!soundButton) return;

    const ru = currentLanguage() === "ru";
    soundButton.textContent = soundOn
      ? (ru ? "Звук: включён" : "Sound: On")
      : (ru ? "Звук: выключен" : "Sound: Off");

    soundButton.setAttribute("aria-pressed", String(soundOn));
  }

  function playUiSound() {
    if (!soundOn) return;

    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContextClass) return;

      if (!audioContext) audioContext = new AudioContextClass();

      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = 660;

      gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.08,
        audioContext.currentTime + 0.015
      );
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + 0.12
      );

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.13);
    } catch (error) {
      // Sound is optional.
    }
  }

  if (soundButton) {
    soundButton.addEventListener("click", () => {
      soundOn = !soundOn;
      updateSoundButton();

      if (soundOn) playUiSound();
    });
  }

  // Play a sound on button clicks, except the sound toggle itself.
  document.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (button && button.id !== "sound-toggle") {
      playUiSound();
    }
  });

  // 7. Accordion & Keyboard Navigation
  const accordionButtons = Array.from(
    document.querySelectorAll(".accordion-trigger")
  );

  accordionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const panelId = button.getAttribute("aria-controls");
      const panel = panelId
        ? document.getElementById(panelId)
        : null;

      const expanded = button.getAttribute("aria-expanded") === "true";

      button.setAttribute("aria-expanded", String(!expanded));

      if (panel) panel.hidden = expanded;
    });

    button.addEventListener("keydown", (event) => {
      const index = accordionButtons.indexOf(button);
      let nextIndex;

      switch (event.key) {
        case "ArrowDown":
          nextIndex = (index + 1) % accordionButtons.length;
          break;
        case "ArrowUp":
          nextIndex =
            (index - 1 + accordionButtons.length) %
            accordionButtons.length;
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = accordionButtons.length - 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      accordionButtons[nextIndex].focus();
    });
  });

  // 8. Subscription Modal
  const modal = document.getElementById("subscription-modal");
  const openModal = document.getElementById("open-subscription");
  const closeModal = document.getElementById("close-subscription");

  let lastModalOpener = null;

  function showModal() {
    if (!modal) return;

    lastModalOpener = document.activeElement;
    modal.hidden = false;
    modal.classList.add("is-visible");

    if (closeModal) closeModal.focus();
  }

  function hideModal() {
    if (!modal) return;

    modal.hidden = true;
    modal.classList.remove("is-visible");

    if (lastModalOpener && typeof lastModalOpener.focus === "function") {
      lastModalOpener.focus();
    }
  }

  if (modal) modal.hidden = true;

  if (openModal && modal) {
    openModal.addEventListener("click", showModal);
  }

  if (closeModal && modal) {
    closeModal.addEventListener("click", hideModal);
  }

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) hideModal();
    });
  }

  // Escape closes the modal.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal && !modal.hidden) {
      hideModal();
    }
  });

  // 9. Registration Form Validation
  const validationForm = document.getElementById("validation-form");

  if (validationForm) {
    validationForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const nameInput = document.getElementById("validation-name");
      const emailInput = document.getElementById("validation-email");
      const passwordInput = document.getElementById("password");
      const confirmInput = document.getElementById("password-confirmation");
      const status = validationForm.querySelector(".form-status");
      const ru = currentLanguage() === "ru";

      if (status) {
        status.textContent = "";
        status.className = "form-status";
      }

      [
        nameInput,
        emailInput,
        passwordInput,
        confirmInput
      ].forEach((input) => {
        if (input) input.setCustomValidity("");
      });

      let errorMessage = "";

      if (!nameInput || !nameInput.value.trim()) {
        errorMessage = ru
          ? "Введите имя."
          : "Please enter your name.";

        if (nameInput) nameInput.setCustomValidity(errorMessage);
      } else if (!emailInput || !emailInput.validity.valid) {
        errorMessage = ru
          ? "Введите корректный email."
          : "Please enter a valid email.";

        if (emailInput) emailInput.setCustomValidity(errorMessage);
      } else if (!passwordInput || passwordInput.value.length < 8) {
        errorMessage = ru
          ? "Пароль должен содержать минимум 8 символов."
          : "The password must contain at least 8 characters.";

        if (passwordInput) passwordInput.setCustomValidity(errorMessage);
      } else if (
        !confirmInput ||
        confirmInput.value !== passwordInput.value
      ) {
        errorMessage = ru
          ? "Пароли не совпадают."
          : "The passwords do not match.";

        if (confirmInput) confirmInput.setCustomValidity(errorMessage);
      }

      if (errorMessage) {
        if (status) {
          status.textContent = errorMessage;
          status.classList.add("error");
        }

        const invalidInput = [
          nameInput,
          emailInput,
          passwordInput,
          confirmInput
        ].find((input) => input && input.validationMessage);

        if (invalidInput) invalidInput.focus();
        return;
      }

      const submitButton = validationForm.querySelector(
        'button[type="submit"]'
      );

      if (submitButton) submitButton.disabled = true;

      try {
        // Demo async processing: no backend is connected.
        await new Promise((resolve) => setTimeout(resolve, 350));

        if (status) {
          status.textContent = ru
            ? "Проверка успешна! Данные проверены локально; сервер не подключён."
            : "Validation successful! Data was checked locally; no server is connected.";

          status.classList.add("success");
        }

        validationForm.reset();
      } catch (error) {
        if (status) {
          status.textContent = ru
            ? "Не удалось проверить форму."
            : "Could not validate the form.";

          status.classList.add("error");
        }
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }

  // 10. Subscription Form
  const subscriptionForm = document.getElementById("subscription-form");

  if (subscriptionForm) {
    subscriptionForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const emailInput = document.getElementById("subscription-email");
      const status = subscriptionForm.querySelector(".form-status");
      const submitButton = subscriptionForm.querySelector(
        'button[type="submit"]'
      );
      const ru = currentLanguage() === "ru";

      if (status) {
        status.textContent = "";
        status.className = "form-status";
      }

      if (!emailInput || !emailInput.validity.valid) {
        if (status) {
          status.textContent = ru
            ? "Введите корректный email."
            : "Please enter a valid email address.";

          status.classList.add("error");
        }

        if (emailInput) emailInput.focus();
        return;
      }

      if (submitButton) submitButton.disabled = true;

      try {
        // Demo only: this does not actually send an email.
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (status) {
          status.textContent = ru
            ? "Email проверен. Подписка не отправлена: сервер не подключён."
            : "Email validated. Subscription was not sent because no server is connected.";

          status.classList.add("success");
        }
      } catch (error) {
        if (status) {
          status.textContent = ru
            ? "Произошла ошибка."
            : "Something went wrong.";

          status.classList.add("error");
        }
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }

  // Initialize the website.
  setLanguage(savedLanguage);
});
