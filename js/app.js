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

  if (teamSummary) {
    teamSummary.textContent = `Our team: ${teamNames.join(', ')}.`;
    teamSummary.title = `Team members: ${teamMembers.length}`;

    // ANIMATION: Apply a small movement when the summary is clicked.
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

  // LIVE CLOCK: Update the date and time once every second.
  const dateTime = document.querySelector('#current-datetime');
  if (dateTime) {
    const updateDateTime = () => {
      dateTime.textContent = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'full',
        timeStyle: 'medium'
      }).format(new Date());
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
  const themeButton = document.querySelector('#toggle-theme');
  if (themeButton) {
    themeButton.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-theme');
      themeButton.textContent = isDark ? 'Day mode' : 'Night mode';
      themeButton.setAttribute('aria-pressed', String(isDark));
    });
  }

  // SWITCH STATEMENT: Set the page language and update translated elements.
  const languageSelect = document.querySelector('#language-select');
  if (languageSelect) {
    languageSelect.addEventListener('change', () => {
      let language;

      switch (languageSelect.value) {
        case 'ru':
          language = 'ru';
          break;
        case 'en':
        default:
          language = 'en';
          break;
      }

      document.documentElement.lang = language;
      document.querySelectorAll('[data-en][data-ru]').forEach((element) => {
        element.textContent = element.getAttribute(`data-${language}`);
      });
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
      // Sound is optional; the website still works if audio is unavailable.
      console.warn('Sound is unavailable.', error);
    }
  }

  if (soundButton) {
    soundButton.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundButton.textContent = soundEnabled ? 'Sound: On' : 'Sound: Off';
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
  const menuLinks = [...document.querySelectorAll('#mainNav .nav-menu a')];

  menuLinks.forEach((link, index) => {
    link.addEventListener('keydown', (event) => {
      let nextIndex;

      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        nextIndex = (index + 1) % menuLinks.length;
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        nextIndex = (index - 1 + menuLinks.length) % menuLinks.length;
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

  // MODAL: Open and close the subscription window.
  const modal = document.querySelector('#subscription-modal');
  const openModal = document.querySelector('#open-subscription');
  const closeModal = document.querySelector('#close-subscription');

  const closeDialog = () => {
    if (modal) modal.classList.remove('is-visible');
  };

  if (openModal && modal) {
    openModal.addEventListener('click', () => modal.classList.add('is-visible'));
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

      fields.forEach((field) => {
        if (!field.value.trim()) {
          errors.push(`${field.labels[0].textContent} is required.`);
        } else if (field.type === 'email' && !field.validity.valid) {
          errors.push('Enter a valid email address.');
        }
      });

      if (password.value.length < 8) errors.push('Password must contain at least 8 characters.');
      if (password.value !== confirmation.value) errors.push('Password confirmation must match.');

      if (errors.length) {
        errorBox.className = 'form-status error';
        errorBox.textContent = errors[0];
        validationForm.querySelector(':invalid')?.focus();
      } else {
        errorBox.className = 'form-status success';
        errorBox.textContent = 'Validation passed. Thank you for joining us!';
        validationForm.reset();
      }
    });
  }

  // CALLBACK + FETCH: Send the subscription email to the owner's inbox.
  // FormSubmit handles delivery; the first submission requires email activation.
  const subscriptionForm = document.querySelector('#subscription-form');

  if (subscriptionForm) {
    subscriptionForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const status = subscriptionForm.querySelector('.form-status');
      const submitButton = subscriptionForm.querySelector('button[type="submit"]');
      const emailInput = subscriptionForm.querySelector('[name="email"]');

      if (!subscriptionForm.reportValidity()) return;

      status.className = 'form-status';
      status.textContent = 'Sending...';
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

        // FormSubmit may return HTTP 200 for errors, so check its success value.
        if (response.ok && result.success === 'true') {
          status.className = 'form-status success';
          status.textContent = 'Thank you! Your subscription request was sent.';
          subscriptionForm.reset();
        } else {
          status.className = 'form-status error';
          status.textContent = result.message ||
            'The message could not be sent. Please try again later.';
        }
      } catch (error) {
        status.className = 'form-status error';
        status.textContent = 'Network error. Check your connection and try again.';
        console.error('Subscription form submission failed:', error);
      } finally {
        submitButton.disabled = false;
      }
    });
  }
})();

