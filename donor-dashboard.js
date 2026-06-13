document.addEventListener('DOMContentLoaded', () => {
  const toast = document.getElementById('toast');
  let toastTimer;
  const showToast = (message, duration = 2600) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
  };
  const DONATION_INTERVAL_DAYS = 56; 
  const statusIcon = document.getElementById('statusIcon');
  const statusTitle = document.getElementById('statusTitle');
  const statusDesc = document.getElementById('statusDesc');
  const daysLeft = document.getElementById('daysLeft');
  const ringProgress = document.getElementById('ringProgress');
  const lastDonationDate = document.getElementById('lastDonationDate');
  const nextEligibleDate = document.getElementById('nextEligibleDate');
  const lastDonationInput = document.getElementById('lastDonationInput');
  const RING_CIRCUMFERENCE = 2 * Math.PI * 44;
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  const updateEligibility = (lastDonation) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextEligible = new Date(lastDonation);
    nextEligible.setDate(nextEligible.getDate() + DONATION_INTERVAL_DAYS);
    const msPerDay = 1000 * 60 * 60 * 24;
    const remainingDays = Math.ceil((nextEligible - today) / msPerDay);
    lastDonationDate.textContent = formatDate(lastDonation);
    nextEligibleDate.textContent = formatDate(nextEligible);
    if (remainingDays <= 0) {
      daysLeft.textContent = '0';
      ringProgress.style.strokeDashoffset = '0';
      statusIcon.classList.remove('waiting');
      statusIcon.classList.add('ready');
      statusTitle.textContent = "You're ready to donate!";
      statusDesc.textContent = `It's been ${Math.abs(remainingDays) + DONATION_INTERVAL_DAYS} days since your last donation. You're eligible to give blood now.`;
    } else {
      const progressRatio = Math.min(remainingDays / DONATION_INTERVAL_DAYS, 1);
      const offset = RING_CIRCUMFERENCE * progressRatio;
      daysLeft.textContent = remainingDays;
      ringProgress.style.strokeDashoffset = offset.toFixed(2);
      statusIcon.classList.remove('ready');
      statusIcon.classList.add('waiting');
      statusTitle.textContent = `${remainingDays} day${remainingDays === 1 ? '' : 's'} until you're eligible`;
      statusDesc.textContent = `For your safety, donors must wait ${DONATION_INTERVAL_DAYS} days between donations. You'll be ready again on ${formatDate(nextEligible)}.`;
    }
  };
  const defaultLastDonation = new Date();
  defaultLastDonation.setDate(defaultLastDonation.getDate() - 60);
  lastDonationInput.value = defaultLastDonation.toISOString().split('T')[0];
  lastDonationInput.max = new Date().toISOString().split('T')[0];
  updateEligibility(defaultLastDonation);
  lastDonationInput.addEventListener('change', () => {
    if (!lastDonationInput.value) return;
    const selected = new Date(lastDonationInput.value);
    updateEligibility(selected);
    showToast('Donation date updated.');
  });
  document.querySelectorAll('.event-card .btn-outline').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.closest('.event-card').querySelector('.event-title').textContent;
      const isSet = btn.classList.contains('reminder-set');
      if (isSet) {
        btn.classList.remove('reminder-set');
        btn.textContent = 'Set reminder';
        showToast(`Reminder removed for "${title}".`);
      } else {
        btn.classList.add('reminder-set');
        btn.textContent = 'Reminder set ✓';
        showToast(`We'll remind you about "${title}".`);
      }
    });
  });
  const filterChips = document.querySelectorAll('.filter-chip');
  const requestCards = document.querySelectorAll('.request-card');
  const noResults = document.getElementById('noResults');
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.dataset.filter;
      let visibleCount = 0;
      requestCards.forEach(card => {
        const matches = filter === 'all' || card.dataset.urgency === filter;
        card.classList.toggle('hidden', !matches);
        if (matches) visibleCount++;
      });
      noResults.classList.toggle('hidden', visibleCount > 0);
    });
  });
  document.querySelectorAll('.request-card .btn-donor').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.request-card');
      const name = card.querySelector('.request-name').textContent;
      const bloodType = card.querySelector('.blood-badge').textContent;
      showToast(`Thanks! We've notified ${name} that a ${bloodType} donor can help.`);
      btn.disabled = true;
      btn.textContent = 'Request sent';
      btn.style.opacity = '0.7';
      btn.style.cursor = 'default';
    });
  });
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
  const revealEls = document.querySelectorAll('.event-card, .request-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

});
