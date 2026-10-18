/* Assignment 4 - JavaScript components by team Чушпаны.
   Shared by every HTML page so the project has one predictable behaviour layer. */
(function () {
  'use strict';

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

  document.querySelectorAll('.accordion-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const panel = document.getElementById(trigger.getAttribute('aria-controls'));
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.hidden = isOpen;
      panel.classList.toggle('is-open', !isOpen);
    });
  });

  const modal = document.querySelector('#subscription-modal');
  const openModal = document.querySelector('#open-subscription');
  const closeModal = document.querySelector('#close-subscription');
  const closeDialog = () => {
    if (modal) modal.classList.remove('is-visible');
  };
  if (openModal && modal) openModal.addEventListener('click', () => modal.classList.add('is-visible'));
  if (closeModal) closeModal.addEventListener('click', closeDialog);
  if (modal) modal.addEventListener('click', (event) => {
    if (event.target === modal) closeDialog();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeDialog();
  });

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
        field.setCustomValidity('');
        if (!field.value.trim()) errors.push(`${field.labels[0].textContent} is required.`);
        else if (field.type === 'email' && !field.validity.valid) errors.push('Enter a valid email address.');
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

  const subscriptionForm = document.querySelector('#subscription-form');
  if (subscriptionForm) subscriptionForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = subscriptionForm.querySelector('.form-status');
    status.className = 'form-status success';
    status.textContent = 'Thank you! We will keep you updated.';
  });
})();
