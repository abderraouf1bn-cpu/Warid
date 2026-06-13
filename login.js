document.addEventListener('DOMContentLoaded', () => {
  const toast = document.getElementById('toast');
  let toastTimer;
  const showToast = (message, duration = 2800) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
  };
  const form = document.getElementById('loginForm');
  const identifier = document.getElementById('identifier');
  const password = document.getElementById('password');
  const formError = document.getElementById('formError');
  const isEmail = (value) => /^\S+@\S+\.\S+$/.test(value);
  const isPhone = (value) => /^[0-9+\s-]{8,}$/.test(value);
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      formError.textContent = '';
      const value = identifier.value.trim();
      if (!value) {
        formError.textContent = 'Please enter your email or phone number.';
        identifier.focus();
        return;
      }
      if (!isEmail(value) && !isPhone(value)) {
        formError.textContent = 'Please enter a valid email or phone number.';
        identifier.focus();
        return;
      }
      if (!password.value.trim()) {
        formError.textContent = 'Please enter your password.';
        password.focus();
        return;
      }
      showToast('Login successful! Redirecting...');
      setTimeout(() => {
        window.location.href ='donor-dashboard.html';
      }, 1500);
    });
  }
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height) * 2;
      ripple.style.position = 'absolute';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      ripple.style.background = 'rgba(255,255,255,0.35)';
      ripple.style.borderRadius = '50%';
      ripple.style.pointerEvents = 'none';
      ripple.style.transform = 'scale(0)';
      ripple.style.opacity = '1';
      ripple.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      requestAnimationFrame(() => {
        ripple.style.transform = 'scale(1)';
        ripple.style.opacity = '0';
      });
      setTimeout(() => ripple.remove(), 650);
    });
  });
});
