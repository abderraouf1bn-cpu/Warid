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
  const stored = sessionStorage.getItem('needyRequest');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      const sumName     = document.getElementById('sumName');
      const sumBlood    = document.getElementById('sumBlood');
      const sumLocation = document.getElementById('sumLocation');
      const sumUrgency  = document.getElementById('sumUrgency');
      if (sumName)     sumName.textContent     = data.fullName  || '—';
      if (sumBlood)    sumBlood.textContent     = data.bloodType || '—';
      if (sumLocation) sumLocation.textContent  = data.position || '—';
      if (sumUrgency && data.urgency) {
        sumUrgency.textContent = data.urgency === 'urgent' ? 'Urgent' : 'Normal';
        sumUrgency.classList.add(data.urgency);
      }
    } catch (e) {

    }
  }
  const filterChips  = document.querySelectorAll('.filter-chip');
  const donorCards   = document.querySelectorAll('.donor-card');
  const noResults    = document.getElementById('noResults');
  const searchInput  = document.getElementById('searchInput');
  const applyFilters = () => {
    const activeChip   = document.querySelector('.filter-chip.active');
    const filter       = activeChip ? activeChip.dataset.filter : 'all';
    const searchQuery  = searchInput ? searchInput.value.trim().toLowerCase() : '';
    let visible = 0;
    donorCards.forEach(card => {
      const typeMatch =
        filter === 'all' ||
        (filter === 'available' && card.dataset.available === 'true') ||
        filter === card.dataset.type;
      const nameText  = card.querySelector('.donor-name')?.textContent.toLowerCase() || '';
      const cityText  = card.querySelector('.donor-city')?.textContent.toLowerCase()  || '';
      const searchMatch = !searchQuery || nameText.includes(searchQuery) || cityText.includes(searchQuery);
      const show = typeMatch && searchMatch;
      card.classList.toggle('hidden', !show);
      if (show) visible++;
    });

    noResults?.classList.toggle('hidden', visible > 0);
  };
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      applyFilters();
    });
  });
  searchInput?.addEventListener('input', applyFilters);
  donorCards.forEach(card => {
    const btn  = card.querySelector('.contact-btn');
    const name = card.querySelector('.donor-name')?.textContent || 'this donor';
    const type = card.dataset.type;
    btn?.addEventListener('click', () => {
      if (btn.disabled) return;
      const label = type === 'hospital' ? 'hospital' : 'donor';
      showToast(`Request sent to ${name}. They'll be in touch shortly.`);
      btn.disabled = true;
      btn.textContent = 'Request sent ✓';
      btn.style.opacity = '0.7';
      btn.style.cursor = 'default';
    });
  });
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect   = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size   = Math.max(rect.width, rect.height) * 2;
      ripple.style.position     = 'absolute';
      ripple.style.width        = ripple.style.height = `${size}px`;
      ripple.style.left         = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top          = `${e.clientY - rect.top  - size / 2}px`;
      ripple.style.background   = 'rgba(255,255,255,0.35)';
      ripple.style.borderRadius = '50%';
      ripple.style.pointerEvents= 'none';
      ripple.style.transform    = 'scale(0)';
      ripple.style.opacity      = '1';
      ripple.style.transition   = 'transform 0.6s ease, opacity 0.6s ease';
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      requestAnimationFrame(() => {
        ripple.style.transform = 'scale(1)';
        ripple.style.opacity   = '0';
      });
      setTimeout(() => ripple.remove(), 650);
    });
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  donorCards.forEach(card => {
    card.style.opacity   = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition= 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
});
