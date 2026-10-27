document.addEventListener("DOMContentLoaded", () => {
  const languageSelect = document.getElementById("language-select");
  const savedLanguage = localStorage.getItem("teamPortfolioLanguage") || "ru";

  function setLanguage(language) {
    document.documentElement.lang = language;
    document.querySelectorAll("[data-en][data-ru]").forEach((element) => {
      element.textContent = element.getAttribute(`data-${language}`);
    });
    document.querySelectorAll("[data-en-placeholder][data-ru-placeholder]").forEach((element) => {
      element.placeholder = element.getAttribute(`data-${language}-placeholder`);
    });
    document.querySelectorAll("[data-en-alt][data-ru-alt]").forEach((element) => {
      element.alt = element.getAttribute(`data-${language}-alt`);
    });
    document.querySelectorAll("[data-en-aria-label][data-ru-aria-label]").forEach((element) => {
      element.setAttribute("aria-label", element.getAttribute(`data-${language}-aria-label`));
    });
    if (languageSelect) languageSelect.value = language;
    localStorage.setItem("teamPortfolioLanguage", language);
    updateThemeButton();
    updateSoundButton();
    updateSummary();
  }

  if (languageSelect) {
    languageSelect.addEventListener("change", () => setLanguage(languageSelect.value));
  }

  const teamMembers = [
    { name: "Mansur", cityEn: "Astana", cityRu: "Астана", interestsEn: "running, billiards, and web development", interestsRu: "бег, бильярд и веб-разработка" },
    { name: "Erasyl", cityEn: "Shymkent", cityRu: "Шымкент", interestsEn: "football and cars", interestsRu: "футбол и автомобили" },
    { name: "Ansar", cityEn: "Kosshy", cityRu: "Косшы", interestsEn: "basketball, Bunker, and computer games", interestsRu: "баскетбол, «Бункер» и компьютерные игры" }
  ];

  function currentLanguage() { 
    return document.documentElement.lang === "en" ? "en" : "ru"; 
  }

  function updateSummary() {
    const summary = document.getElementById("team-summary");
    if (!summary) return;
    summary.textContent = currentLanguage() === "ru"
      ? "Наша команда: " + teamMembers.map(member => member.name).join(", ") + "."
      : "Our team: " + teamMembers.map(member => member.name).join(", ") + ".";
    summary.title = currentLanguage() === "ru"
      ? `Участников команды: ${teamMembers.length}`
      : `Team members: ${teamMembers.length}`;
  }

  const clock = document.getElementById("current-datetime");
  function updateClock() {
    if (!clock) return;
    const locale = currentLanguage() === "ru" ? "ru-RU" : "en-US";
    clock.textContent = new Intl.DateTimeFormat(locale, {
      dateStyle: "medium", 
      timeStyle: "medium"
    }).format(new Date());
  }
  updateClock();
  setInterval(updateClock, 1000);

  const changeBackground = document.getElementById("change-background");
  const backgrounds = ["#f4f8fb", "#f8f1e7", "#edf7ed", "#f4effa"];
  let backgroundIndex = 0;
  if (changeBackground) {
    changeBackground.addEventListener("click", () => {
      document.body.style.backgroundColor = backgrounds[backgroundIndex % backgrounds.length];
      backgroundIndex++;
    });
  }

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
      updateThemeButton();
    });
  }

  let soundOn = true;
  const soundButton = document.getElementById("sound-toggle");
  function updateSoundButton() {
    if (!soundButton) return;
    const ru = currentLanguage() === "ru";
    soundButton.textContent = soundOn ? (ru ? "Звук: включён" : "Sound: On") : (ru ? "Звук: выключен" : "Sound: Off");
    soundButton.setAttribute("aria-pressed", String(soundOn));
  }
  if (soundButton) {
    soundButton.addEventListener("click", () => { 
      soundOn = !soundOn; 
      updateSoundButton(); 
    });
  }

  document.querySelectorAll(".accordion-trigger").forEach(button => {
    button.addEventListener("click", () => {
      const panel = document.getElementById(button.getAttribute("aria-controls"));
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      if (panel) panel.hidden = expanded;
    });
  });

  const validationForm = document.getElementById("validation-form");
  if (validationForm) {
    validationForm.addEventListener("submit", event => {
      event.preventDefault();
      const status = validationForm.querySelector(".form-status");
      const name = validationForm.querySelector('[name="name"]').value.trim();
      const email = validationForm.querySelector('[name="email"]').value.trim();
      const password = validationForm.querySelector('[name="password"]').value;
      const confirmation = validationForm.querySelector('[name="passwordConfirmation"]').value;
      const ru = currentLanguage() === "ru";
      let message = "";
      if (!name || !email || !password || !confirmation) {
        message = ru ? "Пожалуйста, заполните все поля." : "Please complete all fields.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        message = ru ? "Введите корректный адрес электронной почты." : "Please enter a valid email address.";
      } else if (password.length < 8) {
        message = ru ? "Пароль должен содержать не менее 8 символов." : "Password must be at least 8 characters long.";
      } else if (password !== confirmation) {
        message = ru ? "Пароли не совпадают." : "Passwords do not match.";
      } else {
        message = ru ? "Форма заполнена корректно!" : "Form validated successfully!";
      }
      if (status) status.textContent = message;
    });
  }

  const modal = document.getElementById("subscription-modal");
  const openModal = document.getElementById("open-subscription");
  const closeModal = document.getElementById("close-subscription");
  if (modal) modal.hidden = true;
  if (openModal && modal) openModal.addEventListener("click", () => { modal.hidden = false; });
  if (closeModal && modal) closeModal.addEventListener("click", () => { modal.hidden = true; });
  if (modal) modal.addEventListener("click", event => { if (event.target === modal) modal.hidden = true; });

  const subscriptionForm = document.getElementById("subscription-form");
  if (subscriptionForm) {
    subscriptionForm.addEventListener("submit", event => {
      event.preventDefault();
      const status = subscriptionForm.querySelector(".form-status");
      const email = subscriptionForm.querySelector('[name="email"]');
      const ru = currentLanguage() === "ru";
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        if (status) status.textContent = ru ? "Введите корректный адрес электронной почты." : "Please enter a valid email address.";
      } else if (status) {
        status.textContent = ru ? "Спасибо за подписку!" : "Thanks for subscribing!";
        subscriptionForm.reset();
      }
    });
  }

  setLanguage(savedLanguage);
});
  }
})();

