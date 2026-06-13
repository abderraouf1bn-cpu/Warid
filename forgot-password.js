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
  const isEmail = (value) => /^\S+@\S+\.\S+$/.test(value);
  const isPhone = (value) => /^[0-9+\s-]{8,}$/.test(value);
  const form = document.getElementById('resetForm');
  const identifier = document.getElementById('identifier');
  const code = document.getElementById('code');
  const newPassword = document.getElementById('newPassword');
  const confirmPassword = document.getElementById('confirmPassword');
  const formError = document.getElementById('formError');
  const sendCodeBtn = document.getElementById('sendCodeBtn');
  if (sendCodeBtn) {
    sendCodeBtn.addEventListener('click', () => {
      const value = identifier.value.trim();
      if (!value) {
        formError.textContent = 'Please enter your email or phone number first.';
        identifier.focus();
        return;
      }
      if (!isEmail(value) && !isPhone(value)) {
        formError.textContent = 'Please enter a valid email or phone number.';
        identifier.focus();
        return;
      }
      formError.textContent = '';
    
      showToast(`Verification code sent to ${value}`);

      // Cooldown to avoid spamming
      let seconds = 30;
      sendCodeBtn.disabled = true;
      sendCodeBtn.textContent = `Resend (${seconds}s)`;

      const interval = setInterval(() => {
        seconds--;
        if (seconds <= 0) {
          clearInterval(interval);
          sendCodeBtn.disabled = false;
          sendCodeBtn.textContent = 'Send code';
        } else {
          sendCodeBtn.textContent = `Resend (${seconds}s)`;
        }
      }, 1000);
    });
  }
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

      if (!/^\d{6}$/.test(code.value.trim())) {
        formError.textContent = 'Please enter the 6-digit verification code.';
        code.focus();
        return;
      }

      if (newPassword.value.length < 8) {
        formError.textContent = 'Password must be at least 8 characters.';
        newPassword.focus();
        return;
      }

      if (newPassword.value !== confirmPassword.value) {
        formError.textContent = 'Passwords do not match.';
        confirmPassword.focus();
        return;
      }
      showToast('Password reset successful! Redirecting to login...');

      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
    });
  }
  if (confirmPassword) {
    confirmPassword.addEventListener('input', () => {
      if (confirmPassword.value && confirmPassword.value !== newPassword.value) {
        confirmPassword.style.borderColor = 'var(--red-dark)';
      } else {
        confirmPassword.style.borderColor = '';
      }
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
