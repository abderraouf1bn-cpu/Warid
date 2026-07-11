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
  const form = document.getElementById('donorForm');
  const fullName = document.getElementById('fullName');
  const email = document.getElementById('email');
  const phone = document.getElementById('phone');
  const birthDate = document.getElementById('birthDate');
  const bloodType = document.getElementById('bloodType');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');
  const formError = document.getElementById('formError');
  if (birthDate) {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());
    const minDate = new Date(today.getFullYear() - 65, today.getMonth(), today.getDate());
    birthDate.max = maxDate.toISOString().split('T')[0];
    birthDate.min = minDate.toISOString().split('T')[0];
  }
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      formError.textContent = '';
      if (!fullName.value.trim()) {
        formError.textContent = 'Please enter your full name.';
        fullName.focus();
        return;
      }
      if (!phone.value.trim()) {
        formError.textContent = 'Please enter your phone number.';
        phone.focus();
        return;
      }
      if (!birthDate.value) {
        formError.textContent = 'Please enter your birth date.';
        birthDate.focus();
        return;
      }
      if (!bloodType.value) {
        formError.textContent = 'Please select your blood type.';
        bloodType.focus();
        return;
      }
      if (email.value.trim() && !/^\S+@\S+\.\S+$/.test(email.value.trim())) {
        formError.textContent = 'Please enter a valid email address.';
        email.focus();
        return;
      }
      if (password.value.length < 8) {
        formError.textContent = 'Password must be at least 8 characters.';
        password.focus();
        return;
      }
      if (password.value !== confirmPassword.value) {
        formError.textContent = 'Passwords do not match.';
        confirmPassword.focus();
        return;
      }
      const dob = new Date(birthDate.value);
      const age = (new Date() - dob) / (1000 * 60 * 60 * 24 * 365.25);
      if (age < 17) {
        formError.textContent = 'You must be at least 17 years old to register as a donor.';
        birthDate.focus();
        return;
      }
      showToast('Registration successful! Welcome to Warid.');
      form.reset();

      setTimeout(() => {
        window.location.href = 'donor-dashboard.html';
      }, 1500);
    });
  }
  if (confirmPassword) {
    confirmPassword.addEventListener('input', () => {
      if (confirmPassword.value && confirmPassword.value !== password.value) {
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
      ripple.style.width = ripple.style.height = ${size}px;
      ripple.style.left = ${e.clientX - rect.left - size / 2}px;
      ripple.style.top = ${e.clientY - rect.top - size / 2}px;
      ripple.style.background = 'rgba(255,255,255,0.35)';
      ripple.style.borderRadius = '50%';
      ripple.style.pointerEvents = 'none';
      ripple.style.transform = 'scale(0)';
      ripple.style.opacity = '1';
      ripple.style.transition = 'transform 0.6s ease, opacity 0.6s ease';btn.style.position = 'relative';
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