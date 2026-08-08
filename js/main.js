// Trikayaa Dance Foundation — shared site behaviour
document.addEventListener('DOMContentLoaded', () => {

  /* Mobile nav toggle */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* Gallery placeholder lightbox */
  const lightbox = document.getElementById('lightbox');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxBody = document.getElementById('lightbox-body');
  document.querySelectorAll('[data-lightbox]').forEach(tile => {
    tile.addEventListener('click', () => {
      if (!lightbox) return;
      const title = tile.getAttribute('data-title') || 'Media placeholder';
      const isVideo = tile.classList.contains('video');
      lightboxTitle.textContent = title;
      lightboxBody.textContent = isVideo
        ? 'This is a placeholder for a performance video. Drop an .mp4 or embed a YouTube/Vimeo link here once footage is ready.'
        : 'This is a placeholder for a photo. Replace it with real production or studio photography once available.';
      lightbox.classList.add('open');
    });
  });
  document.querySelectorAll('[data-lightbox-close]').forEach(btn => {
    btn.addEventListener('click', () => lightbox.classList.remove('open'));
  });
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('open');
    });
  }

  /* Filter buttons (portfolio / studio galleries) */
  document.querySelectorAll('.filter-bar').forEach(bar => {
    const targetSelector = bar.getAttribute('data-filter-target');
    const items = targetSelector ? document.querySelectorAll(targetSelector) : [];
    bar.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        items.forEach(item => {
          const cat = item.getAttribute('data-category');
          item.style.display = (filter === 'all' || cat === filter) ? '' : 'none';
        });
      });
    });
  });

  /* Upcoming Sundays — computed live from today's date */
  const sundayContainers = document.querySelectorAll('[data-sunday-slots]');
  if (sundayContainers.length) {
    const today = new Date();
    const sundays = [];
    const d = new Date(today);
    d.setDate(d.getDate() + ((7 - d.getDay()) % 7 || 7));
    for (let i = 0; i < 4; i++) {
      sundays.push(new Date(d));
      d.setDate(d.getDate() + 7);
    }
    const fmt = (date) => date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

    sundayContainers.forEach(container => {
      const timeLabel = container.getAttribute('data-time') || '';
      container.innerHTML = '';
      sundays.forEach((date, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'slot-btn';
        btn.setAttribute('data-value', `${fmt(date)} — ${timeLabel}`);
        btn.innerHTML = `${fmt(date)}<small>${timeLabel}</small>`;
        if (idx === 0) btn.classList.add('selected');
        container.appendChild(btn);
      });
    });

    // Single-select behaviour within each slot group, tracked into hidden input
    document.querySelectorAll('.slot-picker').forEach(group => {
      const hidden = group.parentElement.querySelector('input[name="preferred_slot"]');
      const setInitial = () => {
        const sel = group.querySelector('.slot-btn.selected');
        if (hidden && sel) hidden.value = sel.getAttribute('data-value');
      };
      setInitial();
      group.addEventListener('click', (e) => {
        const btn = e.target.closest('.slot-btn');
        if (!btn) return;
        group.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        if (hidden) hidden.value = btn.getAttribute('data-value');
      });
    });
  }

  /* Demo form submission (no backend wired up yet) */
  document.querySelectorAll('form[data-demo-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const successBox = form.querySelector('.form-success');
      const nameField = form.querySelector('input[name="name"]');
      if (successBox) {
        successBox.innerHTML = `<b>Thank you${nameField && nameField.value ? ', ' + nameField.value.split(' ')[0] : ''}!</b> Your request has been noted. Connect this form to Formspree, Netlify Forms, or an email service so submissions actually reach the studio.`;
        successBox.classList.add('show');
        successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      form.reset();
      form.querySelectorAll('.slot-btn').forEach((b, i) => b.classList.toggle('selected', i === 0));
    });
  });

  /* Sticky header shadow on scroll */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.background = window.scrollY > 20 ? 'rgba(10,10,10,.98)' : 'rgba(10,10,10,.94)';
    });
  }
});
