/* ============================================================
   Planora — interaksi halaman masuk
   Mode Personal/Business, toggle tampil sandi, switch masuk/daftar
   Teks mengikuti bahasa otomatis.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const I18N = window.PlanoraI18n;
  const t = (key, vars) => (I18N ? I18N.t(key, vars) : key);

  const form = document.getElementById('authForm');
  const nameField = document.getElementById('nameField');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const passToggle = document.getElementById('passToggle');
  const submitBtn = document.getElementById('submitBtn');
  const submitLabel = document.getElementById('submitLabel');
  const status = document.getElementById('formStatus');
  const title = document.getElementById('authTitle');
  const subtitle = document.getElementById('authSub');
  const authSwitch = document.getElementById('authSwitch');
  const forgotLink = document.getElementById('forgotLink');
  const remember = document.getElementById('remember');
  const demoBtn = document.getElementById('demoBtn');

  if (!form) return;

  let isRegister = false;

  /* Pilih mode awal dari ?mode=personal / ?mode=business */
  const modeParam = new URLSearchParams(window.location.search).get('mode');
  if (modeParam === 'business') {
    document.querySelector('input[name="mode"][value="business"]').checked = true;
    document.querySelector('input[name="mode"][value="personal"]').checked = false;
  }

  const getMode = () => {
    const checked = document.querySelector('input[name="mode"]:checked');
    return checked ? checked.value : 'personal';
  };

  const syncPassToggle = () => {
    const hidden = passwordInput.type === 'password';
    passToggle.textContent = hidden ? t('login.show') : t('login.hide');
    passToggle.setAttribute('aria-pressed', String(!hidden));
    passToggle.setAttribute('aria-label', hidden ? t('login.showAria') : t('login.hideAria'));
  };

  const switchHTML = (question, action) => `${t(question)} <a href="#" id="switchLink">${t(action)}</a>`;

  const setMode = (register) => {
    isRegister = register;
    nameField.hidden = !register;
    nameInput.required = register;
    document.querySelector('.form-row').hidden = register;

    if (register) {
      passwordInput.autocomplete = 'new-password';
      title.textContent = t('login.registerTitle');
      subtitle.textContent = t('login.registerSubtitle');
      submitLabel.textContent = t('login.registerSubmit');
      authSwitch.innerHTML = switchHTML('login.switchHaveAccount', 'login.switchSignin');
    } else {
      passwordInput.autocomplete = 'current-password';
      title.textContent = t('login.title');
      subtitle.textContent = t('login.subtitle');
      submitLabel.textContent = t('login.submit');
      authSwitch.innerHTML = switchHTML('login.switchNoAccount', 'login.switchSignup');
    }

    status.className = 'form-status';
    status.textContent = '';
  };

  const onSwitch = (event) => {
    event.preventDefault();
    setMode(!isRegister);
    if (isRegister) nameInput.focus();
    else emailInput.focus();
  };

  authSwitch.addEventListener('click', (event) => {
    if (event.target.closest('#switchLink')) onSwitch(event);
  });

  forgotLink.addEventListener('click', (event) => {
    event.preventDefault();
    status.className = 'form-status show success';
    status.textContent = t('login.forgotDemo');
  });

  demoBtn.addEventListener('click', () => {
    localStorage.removeItem('planora-session');
    sessionStorage.removeItem('planora-session');
    sessionStorage.setItem('planora-mode', getMode());
    window.location.href = './dashboard.html';
  });

  /* Tampilkan / sembunyikan kata sandi */
  passToggle.addEventListener('click', () => {
    const show = passwordInput.type === 'password';
    passwordInput.type = show ? 'text' : 'password';
    syncPassToggle();
  });

  /* Kirim form (demo antarmuka) */
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    submitBtn.disabled = true;
    submitLabel.textContent = t('login.processing');

    const payload = {
      mode: getMode(),
      email: emailInput.value.trim(),
      name: isRegister ? nameInput.value.trim() : ''
    };

    setTimeout(() => {
      const storage = remember.checked ? localStorage : sessionStorage;
      const otherStorage = remember.checked ? sessionStorage : localStorage;
      otherStorage.removeItem('planora-session');
      storage.setItem('planora-session', JSON.stringify(payload));
      sessionStorage.setItem('planora-mode', payload.mode);
      window.location.href = './dashboard.html';
    }, 500);
  });

  if (I18N) {
    I18N.onChange(() => {
      setMode(isRegister);
      syncPassToggle();
    });
  }

  setMode(false);
  syncPassToggle();
});
