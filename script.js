'use strict';

/* ==========================================
   SMM PRO — Scripts (11 модулей)
   Каждый модуль возвращает { init }
   Инициализация: App.start() по DOMContentLoaded
   ========================================== */

/* ---- Модуль 1: Мобильное меню (burger) ---- */
const BurgerMenu = (() => {
  const SELECTORS = {
    burger: 'burger',
    nav: 'mainNav',
    navOpenClass: 'header__nav--open',
    linkClass: '.header__link'
  };

  const openClass = 'burger--active';

  /**
   * Закрывает мобильное меню
   * @param {HTMLElement} nav - элемент навигации
   * @param {HTMLElement} burger - элемент бургера
   */
  const closeMenu = (nav, burger) => {
    nav.classList.remove(SELECTORS.navOpenClass);
    burger.classList.remove(openClass);
    burger.setAttribute('aria-expanded', 'false');
  };

  /**
   * Инициализирует мобильное меню
   */
  const init = () => {
    const burger = document.getElementById(SELECTORS.burger);
    const nav = document.getElementById(SELECTORS.nav);
    if (!burger || !nav) return;

    burger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle(SELECTORS.navOpenClass);
      burger.classList.toggle(openClass, isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
    });

    const links = nav.querySelectorAll(SELECTORS.linkClass);
    links.forEach((link) => {
      link.addEventListener('click', () => closeMenu(nav, burger));
    });
  };

  return { init };
})();

/* ---- Модуль 2: Header shadow через IntersectionObserver ---- */
const HeaderShadow = (() => {
  const SELECTORS = {
    header: 'header',
    sentinel: '.header-sentinel'
  };
  const SHADOW_CLASS = 'header--shadow';

  /**
   * Инициализирует добавление/удаление тени у хедера
   */
  const init = () => {
    const header = document.getElementById(SELECTORS.header);
    const sentinel = document.querySelector(SELECTORS.sentinel);
    if (!header || !sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          header.classList.remove(SHADOW_CLASS);
        } else {
          header.classList.add(SHADOW_CLASS);
        }
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
  };

  return { init };
})();

/* ---- Модуль 3: Плавный скролл на якорях (Safari fix) ---- */
const SmoothScroll = (() => {
  const ATTR_SELECTOR = 'a[href^="#"]';

  /**
   * Инициализирует плавную прокрутку к якорям
   */
  const init = () => {
    const anchors = document.querySelectorAll(ATTR_SELECTOR);
    anchors.forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  };

  return { init };
})();

/* ---- Модуль 4: Аккордеон (Программа) ---- */
const Accordion = (() => {
  const SELECTORS = {
    trigger: '.accordion__trigger',
    panelAttr: 'aria-controls'
  };
  const ATTR_EXPANDED = 'aria-expanded';
  const HIDDEN_ATTR = 'hidden';

  /**
   * Закрывает все панели аккордеона
   * @param {NodeList} triggers - все триггеры аккордеона
   */
  const closeAllPanels = (triggers) => {
    triggers.forEach((trigger) => {
      trigger.setAttribute(ATTR_EXPANDED, 'false');
      const panel = document.getElementById(trigger.getAttribute(SELECTORS.panelAttr));
      if (panel) {
        panel.setAttribute(HIDDEN_ATTR, '');
        panel.style.maxHeight = null;
      }
    });
  };

  /**
   * Открывает указанную панель аккордеона
   * @param {HTMLElement} trigger - триггер открываемой панели
   * @param {HTMLElement} panel - панель для открытия
   */
  const openPanel = (trigger, panel) => {
    trigger.setAttribute(ATTR_EXPANDED, 'true');
    panel.removeAttribute(HIDDEN_ATTR);
    panel.style.maxHeight = panel.scrollHeight + 'px';
  };

  /**
   * Обновляет высоту открытой панели при ресайзе
   */
  const handleResize = () => {
    const openTrigger = document.querySelector(`${SELECTORS.trigger}[${ATTR_EXPANDED}="true"]`);
    if (openTrigger) {
      const panel = document.getElementById(openTrigger.getAttribute(SELECTORS.panelAttr));
      if (panel && !panel.hasAttribute(HIDDEN_ATTR)) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    }
  };

  /**
   * Инициализирует аккордеон
   */
  const init = () => {
    const triggers = document.querySelectorAll(SELECTORS.trigger);
    if (!triggers.length) return;

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const panel = document.getElementById(trigger.getAttribute(SELECTORS.panelAttr));
        const isOpen = trigger.getAttribute(ATTR_EXPANDED) === 'true';

        closeAllPanels(triggers);

        if (!isOpen && panel) {
          openPanel(trigger, panel);
        }
      });
    });

    window.addEventListener('resize', handleResize);
  };

  return { init };
})();

/* ---- Модуль 5: Таймер (до конца акции) ---- */
const Timer = (() => {
  const SELECTORS = {
    clock: '[data-sale-end]',
    days: 'timerDays',
    hours: 'timerHours',
    minutes: 'timerMinutes',
    seconds: 'timerSeconds'
  };
  const DAY_MS = 1000 * 60 * 60 * 24;
  const HOUR_MS = 1000 * 60 * 60;
  const MINUTE_MS = 1000 * 60;
  const SECOND_MS = 1000;

  /**
   * Добавляет ведущий ноль к числу
   * @param {number} n - число для форматирования
   * @returns {string} отформатированное число
   */
  const pad = (n) => String(n).padStart(2, '0');

  /**
   * Обновляет отображение таймера
   * @param {number} deadline - время окончания в миллисекундах
   * @param {Object} elements - DOM элементы для отображения времени
   */
  const updateTimer = (deadline, elements) => {
    const now = Date.now();
    const diff = Math.max(0, deadline - now);

    const days = Math.floor(diff / DAY_MS);
    const hours = Math.floor((diff / HOUR_MS) % 24);
    const minutes = Math.floor((diff / MINUTE_MS) % 60);
    const seconds = Math.floor((diff / SECOND_MS) % 60);

    if (elements.daysEl) elements.daysEl.textContent = pad(days);
    if (elements.hoursEl) elements.hoursEl.textContent = pad(hours);
    if (elements.minutesEl) elements.minutesEl.textContent = pad(minutes);
    if (elements.secondsEl) elements.secondsEl.textContent = pad(seconds);

    if (diff > 0) {
      requestAnimationFrame(() => {
        setTimeout(() => updateTimer(deadline, elements), SECOND_MS);
      });
    }
  };

  /**
   * Инициализирует таймер обратного отсчета
   */
  const init = () => {
    const clock = document.querySelector(SELECTORS.clock);
    if (!clock) return;

    const deadline = new Date(clock.dataset.saleEnd).getTime();
    const elements = {
      daysEl: document.getElementById(SELECTORS.days),
      hoursEl: document.getElementById(SELECTORS.hours),
      minutesEl: document.getElementById(SELECTORS.minutes),
      secondsEl: document.getElementById(SELECTORS.seconds)
    };

    updateTimer(deadline, elements);
  };

  return { init };
})();

/* ---- Модуль 6: Маска телефона ---- */
const PhoneMask = (() => {
  const SELECTORS = {
    phoneInput: 'contactPhone'
  };
  const PHONE_LENGTH = 11;
  const COUNTRY_CODE = '+7';

  /**
   * Очищает строку от всех нецифровых символов
   * @param {string} value - исходная строка
   * @returns {string} строка только с цифрами
   */
  const cleanDigits = (value) => value.replace(/[^\d]/g, '').slice(0, PHONE_LENGTH);

  /**
   * Форматирует номер телефона в маску +7 (XXX) XXX-XX-XX
   * @param {string} value - исходное значение поля
   * @returns {string} отформатированный номер
   */
  const formatPhone = (value) => {
    const digits = cleanDigits(value);
    let formatted = COUNTRY_CODE;

    if (digits.length > 1) formatted += ' (' + digits.slice(1, 4);
    if (digits.length >= 4) formatted += ') ' + digits.slice(4, 7);
    if (digits.length >= 7) formatted += '-' + digits.slice(7, 9);
    if (digits.length >= 9) formatted += '-' + digits.slice(9, 11);

    return formatted;
  };

  /**
   * Инициализирует маску для поля ввода телефона
   */
  const init = () => {
    const phoneInput = document.getElementById(SELECTORS.phoneInput);
    if (!phoneInput) return;

    phoneInput.addEventListener('input', () => {
      phoneInput.value = formatPhone(phoneInput.value);
    });

    phoneInput.addEventListener('focus', () => {
      if (phoneInput.value === '') phoneInput.value = COUNTRY_CODE + ' (';
    });

    phoneInput.addEventListener('blur', () => {
      if (phoneInput.value === COUNTRY_CODE + ' (' || phoneInput.value === COUNTRY_CODE) {
        phoneInput.value = '';
      }
    });
  };

  return { init };
})();

/* ---- Модуль 7: Форма связи (валидация + скрытое поле tariff + сабмит) ---- */
const ContactForm = (() => {
  const SELECTORS = {
    form: 'contactForm',
    nameInput: 'contactName',
    phoneInput: 'contactPhone',
    emailInput: 'contactEmail',
    tariffInput: 'tariffInput',
    nameError: 'nameError',
    phoneError: 'phoneError',
    emailError: 'emailError',
    submitBtn: '.contact__submit'
  };
  const MIN_NAME_LENGTH = 2;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   * Показывает ошибку в указанном элементе
   * @param {HTMLElement} el - элемент для отображения ошибки
   * @param {string} msg - текст ошибки
   */
  const showError = (el, msg) => {
    if (el) el.textContent = msg;
  };

  /**
   * Очищает все ошибки формы
   * @param {Object} errorElements - объект с элементами для ошибок
   */
  const clearErrors = (errorElements) => {
    showError(errorElements.nameError, '');
    showError(errorElements.phoneError, '');
    showError(errorElements.emailError, '');
  };

  /**
   * Валидирует поле имени
   * @param {HTMLInputElement} nameInput - поле имени
   * @param {HTMLElement} nameError - элемент для ошибки имени
   * @returns {boolean} результат валидации
   */
  const validateName = (nameInput, nameError) => {
    if (!nameInput.value.trim()) {
      showError(nameError, 'Введите имя');
      return false;
    }
    if (nameInput.value.trim().length < MIN_NAME_LENGTH) {
      showError(nameError, 'Имя слишком короткое');
      return false;
    }
    return true;
  };

  /**
   * Валидирует поле телефона
   * @param {HTMLInputElement} phoneInput - поле телефона
   * @param {HTMLElement} phoneError - элемент для ошибки телефона
   * @returns {boolean} результат валидации
   */
  const validatePhone = (phoneInput, phoneError) => {
    if (!phoneInput.value.trim()) {
      showError(phoneError, 'Введите телефон');
      return false;
    }
    const digits = phoneInput.value.replace(/[^\d]/g, '');
    if (digits.length < 11) {
      showError(phoneError, 'Введите номер полностью');
      return false;
    }
    return true;
  };

  /**
   * Валидирует поле email
   * @param {HTMLInputElement} emailInput - поле email
   * @param {HTMLElement} emailError - элемент для ошибки email
   * @returns {boolean} результат валидации
   */
  const validateEmail = (emailInput, emailError) => {
    const emailVal = emailInput.value.trim();

    if (!emailVal) {
      showError(emailError, 'Введите email');
      return false;
    }
    if (!EMAIL_REGEX.test(emailVal)) {
      showError(emailError, 'Некорректный email');
      return false;
    }
    return true;
  };

  /**
   * Выполняет валидацию всей формы
   * @param {Object} elements - DOM элементы формы
   * @returns {boolean} результат валидации
   */
  const validateForm = (elements) => {
    clearErrors(elements);

    const isNameValid = validateName(elements.nameInput, elements.nameError);
    const isPhoneValid = validatePhone(elements.phoneInput, elements.phoneError);
    const isEmailValid = validateEmail(elements.emailInput, elements.emailError);

    return isNameValid && isPhoneValid && isEmailValid;
  };

  /**
   * Инициализирует форму связи
   */
  const init = () => {
    const form = document.getElementById(SELECTORS.form);
    if (!form) return;

    const elements = {
      nameInput: document.getElementById(SELECTORS.nameInput),
      phoneInput: document.getElementById(SELECTORS.phoneInput),
      emailInput: document.getElementById(SELECTORS.emailInput),
      tariffInput: document.getElementById(SELECTORS.tariffInput),
      nameError: document.getElementById(SELECTORS.nameError),
      phoneError: document.getElementById(SELECTORS.phoneError),
      emailError: document.getElementById(SELECTORS.emailError),
      submitBtn: form.querySelector(SELECTORS.submitBtn)
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateForm(elements)) return;

      const data = {
        name: elements.nameInput.value.trim(),
        phone: elements.phoneInput.value.trim(),
        email: elements.emailInput.value.trim(),
        tariff: elements.tariffInput ? elements.tariffInput.value : ''
      };

      console.log('Заявка:', data);

      // Эмуляция отправки
      if (elements.submitBtn) {
        elements.submitBtn.textContent = 'Отправлено!';
        elements.submitBtn.disabled = true;
      }

      alert('Заявка принята! Мы скоро свяжемся с вами.');

      form.reset();
      if (elements.submitBtn) {
        elements.submitBtn.textContent = 'Отправить заявку';
        elements.submitBtn.disabled = false;
      }
    });
  };

  return { init };
})();

/* ---- Модуль 8: Кнопки тарифов → заполнение скрытого поля + скролл ---- */
const TariffButtons = (() => {
  const SELECTORS = {
    tariffBtns: '[data-tariff]',
    tariffInput: 'tariffInput',
    contactSection: 'contact',
    nameField: 'contactName'
  };
  const FOCUS_DELAY_MS = 600;

  /**
   * Инициализирует кнопки выбора тарифа
   */
  const init = () => {
    const tariffBtns = document.querySelectorAll(SELECTORS.tariffBtns);
    const tariffInput = document.getElementById(SELECTORS.tariffInput);
    if (!tariffBtns.length) return;

    tariffBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tariff = btn.getAttribute('data-tariff');
        if (tariffInput) tariffInput.value = tariff;

        const contact = document.getElementById(SELECTORS.contactSection);
        if (contact) {
          contact.scrollIntoView({ behavior: 'smooth' });
        }

        setTimeout(() => {
          const nameField = document.getElementById(SELECTORS.nameField);
          if (nameField) nameField.focus();
        }, FOCUS_DELAY_MS);
      });
    });
  };

  return { init };
})();

/* ---- Модуль 9: Sticky CTA ---- */
const StickyCTA = (() => {
  const SELECTORS = {
    sticky: 'stickyCTA',
    sections: ['hero', 'tariffs', 'contact', 'footer']
  };
  const VISIBLE_CLASS = 'sticky-cta--visible';

  /**
   * Инициализирует плавающую CTA кнопку
   */
  const init = () => {
    const sticky = document.getElementById(SELECTORS.sticky);
    if (!sticky) return;

    const sections = SELECTORS.sections
      .map(id => document.getElementById(id) || document.querySelector(id === 'footer' ? 'footer' : null))
      .filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const anyVisible = entries.some((entry) => entry.isIntersecting);

        if (anyVisible) {
          sticky.setAttribute('aria-hidden', 'true');
          sticky.classList.remove(VISIBLE_CLASS);
        } else {
          sticky.setAttribute('aria-hidden', 'false');
          sticky.classList.add(VISIBLE_CLASS);
        }
      },
      { threshold: 0 }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });
  };

  return { init };
})();

/* ---- Модуль 10: Cookie Consent ---- */
const CookieConsent = (() => {
  const SELECTORS = {
    banner: 'cookieConsent',
    acceptBtn: 'cookieAccept',
    declineBtn: 'cookieDecline'
  };
  const STORAGE_KEY = 'cookies-accepted';

  /**
   * Скрывает баннер cookie
   * @param {HTMLElement} banner - баннер cookie
   */
  const hideBanner = (banner) => {
    banner.setAttribute('aria-hidden', 'true');
    banner.style.display = 'none';
  };

  /**
   * Инициализирует баннер согласия на cookie
   */
  const init = () => {
    const banner = document.getElementById(SELECTORS.banner);
    const acceptBtn = document.getElementById(SELECTORS.acceptBtn);
    const declineBtn = document.getElementById(SELECTORS.declineBtn);
    if (!banner) return;

    if (localStorage.getItem(STORAGE_KEY) !== null) {
      hideBanner(banner);
      return;
    }

    banner.setAttribute('aria-hidden', 'false');
    banner.style.display = '';

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        localStorage.setItem(STORAGE_KEY, 'true');
        hideBanner(banner);
      });
    }

    if (declineBtn) {
      declineBtn.addEventListener('click', () => {
        localStorage.setItem(STORAGE_KEY, 'false');
        hideBanner(banner);
      });
    }
  };

  return { init };
})();

/* ---- Модуль 11: Policy Modal ---- */
const PolicyModal = (() => {
  const SELECTORS = {
    modal: 'policyModal',
    closeBtn: 'modalClose',
    overlay: 'modalOverlay',
    links: '#policyLink, #footerPolicyLink, #cookiePolicyLink'
  };
  const MODAL_OPEN_CLASS = 'modal--open';
  const ESC_KEY = 'Escape';

  /**
   * Открывает модальное окно
   * @param {HTMLElement} modal - модальное окно
   * @param {HTMLElement} closeBtn - кнопка закрытия
   */
  const openModal = (modal, closeBtn) => {
    modal.classList.add(MODAL_OPEN_CLASS);
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  /**
   * Закрывает модальное окно
   * @param {HTMLElement} modal - модальное окно
   */
  const closeModal = (modal) => {
    modal.classList.remove(MODAL_OPEN_CLASS);
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  /**
   * Инициализирует модальное окно с политикой
   */
  const init = () => {
    const modal = document.getElementById(SELECTORS.modal);
    const closeBtn = document.getElementById(SELECTORS.closeBtn);
    const overlay = document.getElementById(SELECTORS.overlay);
    const links = document.querySelectorAll(SELECTORS.links);

    if (!modal || !closeBtn || !overlay) return;

    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(modal, closeBtn);
      });
    });

    closeBtn.addEventListener('click', () => closeModal(modal));
    overlay.addEventListener('click', () => closeModal(modal));

    document.addEventListener('keydown', (e) => {
      if (e.key === ESC_KEY && modal.classList.contains(MODAL_OPEN_CLASS)) {
        closeModal(modal);
      }
    });
  };

  return { init };
})();

/* ==========================================
   App — координатор инициализации
   ========================================== */
const App = (() => {
  /**
   * Запускает инициализацию всех модулей
   */
  const start = () => {
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
  };

  return { start };
})();

document.addEventListener('DOMContentLoaded', App.start);