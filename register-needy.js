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
  const form = document.getElementById('needyForm');
  const fullName = document.getElementById('fullName');
  const phone = document.getElementById('phone');
  const position = document.getElementById('position');
  const bloodType = document.getElementById('bloodType');
  const formError = document.getElementById('formError');
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
      if (!position.value.trim()) {
        formError.textContent = 'Please enter your location.';
        position.focus();
        return;
      }
      if (!bloodType.value) {
        formError.textContent = 'Please select the blood type needed.';
        bloodType.focus();
        return;
      }
      const urgency = form.querySelector('input[name="urgency"]:checked');
      if (!urgency) {
        formError.textContent = 'Please select the urgency level.';
        return;
      }
      const urgencyLabel = urgency.value === 'urgent' ? 'urgent' : 'normal';
      showToast(`Request submitted (${urgencyLabel}). Finding donors near you…`);
      sessionStorage.setItem('needyRequest', JSON.stringify({
        fullName:  fullName.value.trim(),
        phone:     phone.value.trim(),
        position:  position.value.trim(),
        bloodType: bloodType.value,
        urgency:   urgency.value
      }));
      form.reset();
      setTimeout(() => {
        window.location.href = 'find-donors.html';
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