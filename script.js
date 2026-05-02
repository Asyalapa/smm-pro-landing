'use strict';

// ==========================================
// 1. Burger menu
// ==========================================
function initBurger() {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('mainNav');
  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('header__nav--open');
    burger.classList.toggle('burger--active', isOpen);
    burger.setAttribute('aria-expanded', isOpen.toString());
  });

  // Закрываем меню при клике на ссылку (мобильная навигация)
  nav.querySelectorAll('.header__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('header__nav--open');
      burger.classList.remove('burger--active');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

// ==========================================
// 2. Accordion (Программа курса)
// ==========================================
function initAccordion() {
  const triggers = document.querySelectorAll('.accordion__trigger');
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      // Закрыть все открытые
      triggers.forEach(t => {
        t.setAttribute('aria-expanded', 'false');
        document.getElementById(t.getAttribute('aria-controls'))?.setAttribute('hidden', '');
      });
      // Открыть текущий, если был закрыт
      if (!isOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        document.getElementById(trigger.getAttribute('aria-controls'))?.removeAttribute('hidden');
      }
    });
  });
}

// ==========================================
// 3. Countdown timer
// ==========================================
function initTimer() {
  const timerEl = document.querySelector('[data-sale-end]');
  if (!timerEl) return;

  const saleEndIso = timerEl.dataset.saleEnd;
  if (!saleEndIso) return;

  const end = new Date(saleEndIso);

  const daysEl = document.getElementById('timerDays');
  const hoursEl = document.getElementById('timerHours');
  const minutesEl = document.getElementById('timerMinutes');
  const secondsEl = document.getElementById('timerSeconds');
  const pad = n => String(Math.max(0, n)).padStart(2, '0');

  function tick() {
    const diff = end - Date.now();
    if (diff <= 0) {
      [daysEl, hoursEl, minutesEl, secondsEl].forEach(el => { if (el) el.textContent = '00'; });
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    if (daysEl) daysEl.textContent = pad(days);
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minutesEl) minutesEl.textContent = pad(minutes);
    if (secondsEl) secondsEl.textContent = pad(seconds);
  }

  tick();
  setInterval(tick, 1000);
}

// ==========================================
// 4. Tariff → Form
// ==========================================
function initTariffButtons() {
  const tariffBtns = document.querySelectorAll('[data-tariff]');
  const tariffInput = document.getElementById('tariffInput');
  const contactSection = document.getElementById('contact');

  tariffBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tariffName = btn.dataset.tariff;
      if (tariffInput) tariffInput.value = tariffName;
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ==========================================
// 5. Form validation
// ==========================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('contactName');
  const phoneInput = document.getElementById('contactPhone');
  const emailInput = document.getElementById('contactEmail');

  const nameError = document.getElementById('nameError');
  const phoneError = document.getElementById('phoneError');
  const emailError = document.getElementById('emailError');

  const showError = (el, msg) => { if (el) el.textContent = msg; };
  const clearError = el => { if (el) el.textContent = ''; };

  const validators = {
    name: value => {
      if (!value.trim()) return 'Введите имя';
      if (value.trim().length < 2) return 'Имя должно содержать минимум 2 символа';
      return '';
    },
    phone: value => {
      const cleaned = value.replace(/[\s\-\(\)_+]/g, '');
      if (!cleaned) return 'Введите телефон';
      if (!/^((8|\+7)\d{10}|\d{10})$/.test(cleaned)) return 'Неверный формат телефона';
      return '';
    },
    email: value => {
      if (!value.trim()) return 'Введите email';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Некорректный email';
      return '';
    },
  };

  function validateField(field, validatorFn, errorEl) {
    const msg = validatorFn(field.value);
    showError(errorEl, msg);
    return msg === '';
  }

  // Живая валидация при потере фокуса
  if (nameInput) {
    nameInput.addEventListener('blur', () => validateField(nameInput, validators.name, nameError));
    nameInput.addEventListener('input', () => clearError(nameError));
  }
  if (phoneInput) {
    phoneInput.addEventListener('blur', () => validateField(phoneInput, validators.phone, phoneError));
    phoneInput.addEventListener('input', () => clearError(phoneError));
  }
  if (emailInput) {
    emailInput.addEventListener('blur', () => validateField(emailInput, validators.email, emailError));
    emailInput.addEventListener('input', () => clearError(emailError));
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    if (nameInput) valid = validateField(nameInput, validators.name, nameError) && valid;
    if (phoneInput) valid = validateField(phoneInput, validators.phone, phoneError) && valid;
    if (emailInput) valid = validateField(emailInput, validators.email, emailError) && valid;

    if (valid) {
      // В реальном проекте — отправка на сервер, здесь эмуляция
      const tariffValue = document.getElementById('tariffInput')?.value || 'не выбран';
      alert(`Спасибо за заявку!\n\nТариф: ${tariffValue}\nМы свяжемся с вами в ближайшее время.`);
      form.reset();
    }
  });
}

// ==========================================
// 6. Cookie consent
// ==========================================
function initCookieConsent() {
  const cookieKey = 'smm-pro-cookies-accepted';
  if (localStorage.getItem(cookieKey)) return;

  const banner = document.getElementById('cookieConsent');
  if (!banner) return;
  banner.setAttribute('aria-hidden', 'false');

  document.getElementById('cookieAccept')?.addEventListener('click', () => {
    localStorage.setItem(cookieKey, 'true');
    banner.setAttribute('aria-hidden', 'true');
  });

  document.getElementById('cookieDecline')?.addEventListener('click', () => {
    localStorage.setItem(cookieKey, 'false');
    banner.setAttribute('aria-hidden', 'true');
  });
}

// ==========================================
// 7. Policy modal
// ==========================================
function initModal() {
  const modal = document.getElementById('policyModal');
  if (!modal) return;

  const open = () => {
    modal.classList.add('modal--open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    modal.classList.remove('modal--open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.getElementById('policyLink')?.addEventListener('click', e => { e.preventDefault(); open(); });
  document.getElementById('cookiePolicyLink')?.addEventListener('click', e => { e.preventDefault(); open(); });
  document.getElementById('footerPolicyLink')?.addEventListener('click', e => { e.preventDefault(); open(); });
  document.getElementById('modalClose')?.addEventListener('click', close);
  document.getElementById('modalOverlay')?.addEventListener('click', close);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('modal--open')) close();
  });
}

// ==========================================
// 8. Sticky CTA
// ==========================================
function initStickyCTA() {
  const sticky = document.getElementById('stickyCTA');
  if (!sticky) return;

  const hero = document.getElementById('hero');
  if (!hero) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        sticky.classList.remove('sticky-cta--visible');
        sticky.setAttribute('aria-hidden', 'true');
      } else {
        sticky.classList.add('sticky-cta--visible');
        sticky.setAttribute('aria-hidden', 'false');
      }
    },
    { threshold: 0 }
  );
  observer.observe(hero);
}

// ==========================================
// Bootstrap
// ==========================================
function init() {
  initBurger();
  initAccordion();
  initTimer();
  initTariffButtons();
  initContactForm();
  initCookieConsent();
  initModal();
  initStickyCTA();
}

document.addEventListener('DOMContentLoaded', init);