/* Assignment 5 - Advanced JavaScript and DOM Manipulation.
   The script checks whether each element exists so it can be shared by all pages. */
(function () {
  'use strict';

  // OBJECTS AND ARRAYS: Store information about the team members.
  const teamMembers = [
    { name: 'Mansur', city: 'Astana', interests: ['running', 'billiards', 'web development'] },
    { name: 'Erasyl', city: 'Shymkent', interests: ['football', 'cars'] },
    { name: 'Ansar', city: 'Kosshy', interests: ['basketball', 'Bunker', 'computer games'] }
  ];

  // HIGHER-ORDER FUNCTION: map() creates a new array of names.
  const teamNames = teamMembers.map((member) => member.name);
  const teamSummary = document.querySelector('#team-summary');

  function updateSummary() {
    if (!teamSummary) return;
    const isRu = document.documentElement.lang === 'ru';
    teamSummary.textContent = isRu 
      ? `Наша команда: ${teamNames.join(', ')}.` 
      : `Our team: ${teamNames.join(', ')}.`;
    teamSummary.title = isRu 
      ? `Участников команды: ${teamMembers.length}` 
      : `Team members: ${teamMembers.length}`;
  }

  if (teamSummary) {
    updateSummary();
    teamSummary.addEventListener('click', () => {
      teamSummary.classList.toggle('is-animated');
    });
  }

  // Demonstrate forEach() and object properties on the profile cards.
  document.querySelectorAll('.team-grid .card').forEach((card, index) => {
    const member = teamMembers[index];
    if (!member) return;

    card.dataset.member = member.name;
    card.title = `${member.name} from ${member.city}`;

    card.addEventListener('click', (event) => {
      if (event.target.closest('a')) return;
      card.classList.toggle('is-animated');
      card.style.transform = card.classList.contains('is-animated') ? 'scale(1.02)' : '';
    });
  });

  // LIVE CLOCK: Update the date and time once every second safely.
  const dateTime = document.querySelector('#current-datetime');
  if (dateTime) {
    const updateDateTime = () => {
      try {
        const locale = document.documentElement.lang === 'ru' ? 'ru-RU' : 'en-US';
        dateTime.textContent = new Intl.DateTimeFormat(locale, {
          dateStyle: 'full',
          timeStyle: 'medium'
        }).format(new Date());
      } catch (err) {
        console.error('Clock error:', err);
      }
    };
    updateDateTime();
    window.setInterval(updateDateTime, 1000);
  }

  // DOM STYLING: Change the page background using an array of colors.
  const backgroundButton = document.querySelector('#change-background');
  const backgrounds = ['#f4f6f8', '#eef7f2', '#fff7e8', '#f4efff', '#eaf6fb'];
  let backgroundIndex = 0;

  if (backgroundButton) {
    backgroundButton.addEventListener('click', () => {
      backgroundIndex = (backgroundIndex + 1) % backgrounds.length;
      document.body.style.backgroundColor = backgrounds[backgroundIndex];
      backgroundButton.setAttribute('aria-label', `Background changed to ${backgrounds[backgroundIndex]}`);
    });
  }

  // CLASS-BASED STYLING: Switch between day and night themes.
  let nightMode = false;
  const themeButton = document.querySelector('#toggle-theme');
  if (themeButton) {
    themeButton.addEventListener('click', () => {
      nightMode = !nightMode;
      document.body.classList.toggle('dark-theme', nightMode);
      document.body.classList.toggle('night-mode', nightMode);
      const isRu = document.documentElement.lang === 'ru';
      themeButton.textContent = nightMode 
        ? (isRu ? 'Дневной режим' : 'Day mode') 
        : (isRu ? 'Ночной режим' : 'Night mode');
      themeButton.setAttribute('aria-pressed', String(nightMode));
    });
  }

  // SWITCH STATEMENT & LOCALSTORAGE: Set the page language and update translated elements.
  const languageSelect = document.querySelector('#language-select');
  const savedLanguage = localStorage.getItem('teamPortfolioLanguage') || 'ru';

  function setLanguage(langCode) {
    let language;
    switch (langCode) {
      case 'en':
        language = 'en';
        break;
      case 'ru':
      default:
        language = 'ru';
        break;
    }

    document.documentElement.lang = language;
    localStorage.setItem('teamPortfolioLanguage', language);

    // Update text content
    document.querySelectorAll('[data-en][data-ru]').forEach((element) => {
      element.textContent = element.getAttribute(`data-${language}`);
    });

    // Update placeholders
    document.querySelectorAll('[data-en-placeholder][data-ru-placeholder]').forEach((element) => {
      element.placeholder = element.getAttribute(`data-${language}-placeholder`);
    });

    // Update alt attributes
    document.querySelectorAll('[data-en-alt][data-ru-alt]').forEach((element) => {
      element.alt = element.getAttribute(`data-${language}-alt`);
    });

    // Update aria-labels
    document.querySelectorAll('[data-en-aria-label][data-ru-aria-label]').forEach((element) => {
      element.setAttribute('aria-label', element.getAttribute(`data-${language}-aria-label`));
    });

    if (languageSelect) languageSelect.value = language;
    
    updateSummary();
    if (themeButton) {
      const isRu = language === 'ru';
      themeButton.textContent = nightMode 
        ? (isRu ? 'Дневной режим' : 'Day mode') 
        : (isRu ? 'Ночной режим' : 'Night mode');
    }
    if (soundButton) {
      const isRu = language === 'ru';
      soundButton.textContent = soundEnabled 
        ? (isRu ? 'Звук: включён' : 'Sound: On') 
        : (isRu ? 'Звук: выключен' : 'Sound: Off');
    }
  }

  if (languageSelect) {
    languageSelect.addEventListener('change', () => {
      setLanguage(languageSelect.value);
    });
  }

  // SOUND EFFECTS: Generate a short tone with the Web Audio API.
  let soundEnabled = true;
  let audioContext = null;
  const soundButton = document.querySelector('#sound-toggle');

  function playSound() {
    if (!soundEnabled) return;

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      audioContext ||= new AudioContextClass();
      if (audioContext.state === 'suspended') audioContext.resume();

      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = 660;
      gain.gain.value = 0.04;

      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.08);
    } catch (error) {
      console.warn('Sound is unavailable.', error);
    }
  }

  if (soundButton) {
    soundButton.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      const isRu = document.documentElement.lang === 'ru';
      soundButton.textContent = soundEnabled 
        ? (isRu ? 'Звук: включён' : 'Sound: On') 
        : (isRu ? 'Звук: выключен' : 'Sound: Off');
      soundButton.setAttribute('aria-pressed', String(soundEnabled));
      if (soundEnabled) playSound();
    });
  }

  // Play a short sound for other button clicks.
  document.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (button && button.id !== 'sound-toggle') playSound();
  });

  // KEYBOARD EVENTS: Use arrow keys to move focus through navigation links.
  const menuLinks = [...document.querySelectorAll('#mainNav .nav-menu a, #main-header .nav-menu a')];

  menuLinks.forEach((link, index) => {
    link.addEventListener('keydown', (event) => {
      let nextIndex;

      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        nextIndex = (index + 1) % menuLinks.length;
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        nextIndex = (index - 1 + menuLinks.length) % menuLinks.length;
      } else if (event.key === 'Home') {
        nextIndex = 0;
      } else if (event.key === 'End') {
        nextIndex = menuLinks.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      menuLinks[nextIndex].focus();
    });
  });

  // FAQ ACCORDION: Toggle the answer panel.
  document.querySelectorAll('.accordion-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const panel = document.getElementById(trigger.getAttribute('aria-controls'));
      if (!panel) return;

      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.hidden = isOpen;
      panel.classList.toggle('is-open', !isOpen);
    });
  });

  // MODAL: Open and close the subscription window safely.
  const modal = document.querySelector('#subscription-modal');
  const openModal = document.querySelector('#open-subscription');
  const closeModal = document.querySelector('#close-subscription');

  const closeDialog = () => {
    if (modal) {
      modal.classList.remove('is-visible');
      modal.hidden = true;
    }
  };

  if (openModal && modal) {
    openModal.addEventListener('click', () => {
      modal.classList.add('is-visible');
      modal.hidden = false;
    });
  }

  if (closeModal) closeModal.addEventListener('click', closeDialog);

  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeDialog();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeDialog();
  });

  // FORM VALIDATION: Check required fields, email format and password matching.
  const validationForm = document.querySelector('#validation-form');

  if (validationForm) {
    validationForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const password = validationForm.querySelector('#password');
      const confirmation = validationForm.querySelector('#password-confirmation');
      const errorBox = validationForm.querySelector('.form-status');
      const fields = [...validationForm.querySelectorAll('input[required]')];
      const errors = [];
      const isRu = document.documentElement.lang === 'ru';

      fields.forEach((field) => {
        if (!field.value.trim()) {
          errors.push(isRu ? 'Поле обязательно для заполнения.' : 'Field is required.');
        } else if (field.type === 'email' && !field.validity.valid) {
          errors.push(isRu ? 'Введите корректный адрес электронной почты.' : 'Enter a valid email address.');
        }
      });

      if (password.value.length < 8) errors.push(isRu ? 'Пароль должен содержать не менее 8 символов.' : 'Password must contain at least 8 characters.');
      if (password.value !== confirmation.value) errors.push(isRu ? 'Пароли должны совпадать.' : 'Password confirmation must match.');

      if (errors.length) {
        errorBox.className = 'form-status error';
        errorBox.textContent = errors[0];
        validationForm.querySelector(':invalid')?.focus();
      } else {
        errorBox.className = 'form-status success';
        errorBox.textContent = isRu ? 'Проверка успешно пройдена. Спасибо!' : 'Validation passed. Thank you for joining us!';
        validationForm.reset();
      }
    });
  }

  // CALLBACK + FETCH: Send the subscription email.
  const subscriptionForm = document.querySelector('#subscription-form');

  if (subscriptionForm) {
    subscriptionForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const status = subscriptionForm.querySelector('.form-status');
      const submitButton = subscriptionForm.querySelector('button[type="submit"]');
      const emailInput = subscriptionForm.querySelector('[name="email"]');
      const isRu = document.documentElement.lang === 'ru';

      if (!subscriptionForm.reportValidity()) return;

      status.className = 'form-status';
      status.textContent = isRu ? 'Отправка...' : 'Sending...';
      submitButton.disabled = true;

      const submission = {
        email: emailInput.value.trim(),
        _subject: 'New Team Portfolio subscription',
        _template: 'table',
        message: 'A visitor subscribed to updates from the Team Portfolio website.'
      };

      try {
        const response = await fetch('https://formsubmit.co/ajax/amantayansar07@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(submission)
        });

        const result = await response.json();

        if (response.ok && result.success === 'true') {
          status.className = 'form-status success';
          status.textContent = isRu ? 'Спасибо! Ваша подписка оформлена.' : 'Thank you! Your subscription request was sent.';
          subscriptionForm.reset();
        } else {
          status.className = 'form-status error';
          status.textContent = result.message || (isRu ? 'Не удалось отправить сообщение. Попробуйте позже.' : 'The message could not be sent. Please try again later.');
        }
      } catch (error) {
        status.className = 'form-status error';
        status.textContent = isRu ? 'Ошибка сети. Проверьте подключение.' : 'Network error. Check your connection and try again.';
        console.error('Subscription form submission failed:', error);
      } finally {
        submitButton.disabled = false;
      }
    });
  }

  // Initialize saved language on page load
  setLanguage(savedLanguage);
})();
