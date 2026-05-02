'use strict';

/* ==========================================
   SMM PRO — Scripts (11 IIFE-модулей)
   Каждый IIFE возвращает { init }
   Инициализация: App.start() по DOMContentLoaded
   ========================================== */

/* ---- Модуль 1: Мобильное меню (burger) ---- */
const BurgerMenu = (function () {
  function init() {
    var burger = document.getElementById('burger');
    var nav = document.getElementById('mainNav');
    if (!burger || !nav) return;

    burger.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('header__nav--open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
    });

    var links = nav.querySelectorAll('.header__link');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('header__nav--open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }
  return { init };
})();


/* ---- Модуль 2: Header shadow через IntersectionObserver ---- */
const HeaderShadow = (function () {
  function init() {
    var header = document.getElementById('header');
    var sentinel = document.querySelector('.header-sentinel');
    if (!header || !sentinel) return;

    var observer = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          header.classList.remove('header--shadow');
        } else {
          header.classList.add('header--shadow');
        }
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
  }
  return { init };
})();


/* ---- Модуль 3: Плавный скролл на якорях (Safari fix) ---- */
const SmoothScroll = (function () {
  function init() {
    var anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
  return { init };
})();


/* ---- Модуль 4: Аккордеон (Программа) ---- */
const Accordion = (function () {
  function init() {
    var triggers = document.querySelectorAll('.accordion__trigger');
    if (!triggers.length) return;

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var panel = document.getElementById(trigger.getAttribute('aria-controls'));
        var isOpen = trigger.getAttribute('aria-expanded') === 'true';

        // Закрываем все
        triggers.forEach(function (t) {
          t.setAttribute('aria-expanded', 'false');
          var p = document.getElementById(t.getAttribute('aria-controls'));
          if (p) {
            p.setAttribute('hidden', '');
            p.style.maxHeight = null;
          }
        });

        // Открываем текущий, если был закрыт
        if (!isOpen && panel) {
          trigger.setAttribute('aria-expanded', 'true');
          panel.removeAttribute('hidden');
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    });

    // Пересчёт высоты при ресайзе
    window.addEventListener('resize', function () {
      var openTrigger = document.querySelector('.accordion__trigger[aria-expanded="true"]');
      if (openTrigger) {
        var panel = document.getElementById(openTrigger.getAttribute('aria-controls'));
        if (panel && !panel.hasAttribute('hidden')) {
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      }
    });
  }
  return { init };
})();


/* ---- Модуль 5: Таймер (до конца акции) ---- */
const Timer = (function () {
  function init() {
    var clock = document.querySelector('[data-sale-end]');
    if (!clock) return;

    var deadline = new Date(clock.dataset.saleEnd).getTime();
    var daysEl = document.getElementById('timerDays');
    var hoursEl = document.getElementById('timerHours');
    var minutesEl = document.getElementById('timerMinutes');
    var secondsEl = document.getElementById('timerSeconds');

    function pad(n) {
      return String(n).padStart(2, '0');
    }

    function update() {
      var now = Date.now();
      var diff = Math.max(0, deadline - now);

      var days = Math.floor(diff / (1000 * 60 * 60 * 24));
      var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      var minutes = Math.floor((diff / (1000 * 60)) % 60);
      var seconds = Math.floor((diff / 1000) % 60);

      if (daysEl) daysEl.textContent = pad(days);
      if (hoursEl) hoursEl.textContent = pad(hours);
      if (minutesEl) minutesEl.textContent = pad(minutes);
      if (secondsEl) secondsEl.textContent = pad(seconds);

      if (diff > 0) {
        requestAnimationFrame(function () {
          setTimeout(update, 1000);
        });
      }
    }

    update();
  }
  return { init };
})();


/* ---- Модуль 6: Маска телефона ---- */
const PhoneMask = (function () {
  function init() {
    var phoneInput = document.getElementById('contactPhone');
    if (!phoneInput) return;

    phoneInput.addEventListener('input', function () {
      var val = phoneInput.value.replace(/[^\d]/g, '').slice(0, 11);
      var formatted = '+7';

      if (val.length > 1) formatted += ' (' + val.slice(1, 4);
      if (val.length >= 4) formatted += ') ' + val.slice(4, 7);
      if (val.length >= 7) formatted += '-' + val.slice(7, 9);
      if (val.length >= 9) formatted += '-' + val.slice(9, 11);

      phoneInput.value = formatted;
    });

    phoneInput.addEventListener('focus', function () {
      if (phoneInput.value === '') phoneInput.value = '+7 (';
    });

    phoneInput.addEventListener('blur', function () {
      if (phoneInput.value === '+7 (' || phoneInput.value === '+7') {
        phoneInput.value = '';
      }
    });
  }
  return { init };
})();


/* ---- Модуль 7: Форма связи (валидация + скрытое поле tariff + сабмит) ---- */
const ContactForm = (function () {
  function init() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var nameInput = document.getElementById('contactName');
    var phoneInput = document.getElementById('contactPhone');
    var emailInput = document.getElementById('contactEmail');
    var tariffInput = document.getElementById('tariffInput');

    var nameError = document.getElementById('nameError');
    var phoneError = document.getElementById('phoneError');
    var emailError = document.getElementById('emailError');

    function showError(el, msg) {
      if (el) el.textContent = msg;
    }

    function clearErrors() {
      showError(nameError, '');
      showError(phoneError, '');
      showError(emailError, '');
    }

    function validate() {
      var valid = true;
      clearErrors();

      if (!nameInput.value.trim()) {
        showError(nameError, 'Введите имя');
        valid = false;
      } else if (nameInput.value.trim().length < 2) {
        showError(nameError, 'Имя слишком короткое');
        valid = false;
      }

      if (!phoneInput.value.trim()) {
        showError(phoneError, 'Введите телефон');
        valid = false;
      } else {
        var digits = phoneInput.value.replace(/[^\d]/g, '');
        if (digits.length < 11) {
          showError(phoneError, 'Введите номер полностью');
          valid = false;
        }
      }

      var emailVal = emailInput.value.trim();
      if (!emailVal) {
        showError(emailError, 'Введите email');
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        showError(emailError, 'Некорректный email');
        valid = false;
      }

      return valid;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validate()) return;

      // Собираем данные
      var data = {
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        email: emailInput.value.trim(),
        tariff: tariffInput ? tariffInput.value : ''
      };

      console.log('Заявка:', data);

      // Эмулируем отправку
      var submitBtn = form.querySelector('.contact__submit');
      if (submitBtn) {
        submitBtn.textContent = 'Отправлено!';
        submitBtn.disabled = true;
      }

      // Реально здесь был бы fetch на сервер
      alert('Заявка принята! Мы скоро свяжемся с вами.');

      form.reset();
      if (submitBtn) {
        submitBtn.textContent = 'Отправить заявку';
        submitBtn.disabled = false;
      }
    });
  }
  return { init };
})();


/* ---- Модуль 8: Кнопки тарифов → заполнение скрытого поля + скролл ---- */
const TariffButtons = (function () {
  function init() {
    var tariffBtns = document.querySelectorAll('[data-tariff]');
    var tariffInput = document.getElementById('tariffInput');
    if (!tariffBtns.length) return;

    tariffBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tariff = this.getAttribute('data-tariff');
        if (tariffInput) tariffInput.value = tariff;

        var contact = document.getElementById('contact');
        if (contact) {
          contact.scrollIntoView({ behavior: 'smooth' });
        }

        // Фокус на первом поле через небольшую задержку
        setTimeout(function () {
          var nameField = document.getElementById('contactName');
          if (nameField) nameField.focus();
        }, 600);
      });
    });
  }
  return { init };
})();


/* ----
   Модуль 9: Sticky CTA
   Плавающая кнопка скрывается при просмотре hero/tariffs/contact/footer
   IntersectionObserver следит за всеми четырьмя секциями.
   Если хотя бы одна видна — кнопка скрыта.
   Если ни одна не видна — кнопка показана.
---- */
const StickyCTA = (function () {
  function init() {
    var sticky = document.getElementById('stickyCTA');
    if (!sticky) return;

    // Собираем все секции, на которых кнопка не нужна
    var sections = [
      document.getElementById('hero'),
      document.getElementById('tariffs'),
      document.getElementById('contact'),
      document.querySelector('footer')
    ].filter(Boolean); // убираем null, если чего-то нет

    if (!sections.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        var anyVisible = entries.some(function (entry) {
          return entry.isIntersecting;
        });

        if (anyVisible) {
          sticky.setAttribute('aria-hidden', 'true');
          sticky.classList.remove('sticky-cta--visible');
        } else {
          sticky.setAttribute('aria-hidden', 'false');
          sticky.classList.add('sticky-cta--visible');
        }
      },
      { threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }
  return { init };
})();


/* ---- Модуль 10: Cookie Consent ---- */
const CookieConsent = (function () {
  function init() {
    var banner = document.getElementById('cookieConsent');
    var acceptBtn = document.getElementById('cookieAccept');
    var declineBtn = document.getElementById('cookieDecline');
    if (!banner) return;

    // Проверка localStorage
    if (localStorage.getItem('cookies-accepted') !== null) {
      banner.setAttribute('aria-hidden', 'true');
      banner.style.display = 'none';
      return;
    }

    // Показать баннер
    banner.setAttribute('aria-hidden', 'false');
    banner.style.display = '';

    function hideBanner() {
      banner.setAttribute('aria-hidden', 'true');
      banner.style.display = 'none';
    }

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        localStorage.setItem('cookies-accepted', 'true');
        hideBanner();
      });
    }

    if (declineBtn) {
      declineBtn.addEventListener('click', function () {
        localStorage.setItem('cookies-accepted', 'false');
        hideBanner();
      });
    }
  }
  return { init };
})();


/* ---- Модуль 11: Policy Modal ---- */
const PolicyModal = (function () {
  function init() {
    var modal = document.getElementById('policyModal');
    var closeBtn = document.getElementById('modalClose');
    var overlay = document.getElementById('modalOverlay');
    var links = document.querySelectorAll('#policyLink, #footerPolicyLink, #cookiePolicyLink');
    if (!modal || !closeBtn || !overlay) return;

    function open() {
      modal.classList.add('modal--open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function close() {
      modal.classList.remove('modal--open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        open();
      });
    });

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', close);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('modal--open')) {
        close();
      }
    });
  }
  return { init };
})();


/* ==========================================
   App — координатор инициализации
   ========================================== */
const App = (function () {
  function start() {
    BurgerMenu.init();
    HeaderShadow.init();
    SmoothScroll.init();
    Accordion.init();
    Timer.init();
    PhoneMask.init();
    ContactForm.init();
    TariffButtons.init();
    StickyCTA.init();
    CookieConsent.init();
    PolicyModal.init();
  }
  return { start };
})();

document.addEventListener('DOMContentLoaded', App.start);