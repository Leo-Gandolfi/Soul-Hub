/* ============================================
   SOUL HUB — SCRIPT.JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- NAV SCROLL ---- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- INTERSECTION OBSERVER — reveal elements ---- */
  const revealEls = document.querySelectorAll(
    '.reveal, .exp-card, .stat-item, .step-item, .audience-card, .testimonial-inner, .cta-card'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
    }
    observer.observe(el);
  });

  /* ---- STEPS stagger ---- */
  const stepEls = document.querySelectorAll('.step-item');
  const stepsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 150);
        stepsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  stepEls.forEach(el => stepsObserver.observe(el));

  /* ---- EXP CARDS stagger ---- */
  const expCards = document.querySelectorAll('.exp-card');
  const cardsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 100);
        cardsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  expCards.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(36px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease, box-shadow 0.35s ease';
    cardsObserver.observe(el);
  });

  /* ---- STAT counter animation ---- */
  const statNumbers = document.querySelectorAll('.stat-number');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => {
    el.dataset.original = el.textContent;
    statsObserver.observe(el.parentElement);
  });

  function animateCounter(statItem) {
    const numEl = statItem.querySelector('.stat-number');
    if (!numEl) return;
    const raw = numEl.dataset.original || numEl.textContent;
    const numMatch = raw.match(/[\d.,]+/);
    if (!numMatch) return;
    const target = parseFloat(numMatch[0].replace(',', '').replace('.', ''));
    const suffix = raw.replace(numMatch[0], '').trim();
    const isBig = target >= 1000;
    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * ease);
      const display = isBig
        ? current.toLocaleString('pt-BR')
        : current.toString();
      numEl.innerHTML = display + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---- SMOOTH SCROLL for internal links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---- CTA BUTTON clicks (modal/scroll) ---- */
  const scrollToContact = () => {
    document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
  };
  document.getElementById('hero-demo-btn')?.addEventListener('click', scrollToContact);
  document.getElementById('nav-cta-btn')?.addEventListener('click', scrollToContact);
  document.getElementById('cta-main-btn')?.addEventListener('click', openModal);
  document.getElementById('moradores-btn')?.addEventListener('click', openModal);
  document.getElementById('sindicos-btn')?.addEventListener('click', openModal);
  document.getElementById('hero-exp-btn')?.addEventListener('click', () => {
    document.getElementById('experiencias')?.scrollIntoView({ behavior: 'smooth' });
  });

  /* ---- MODAL ---- */
  function openModal() {
    const existing = document.getElementById('soul-modal');
    if (existing) { existing.classList.add('open'); return; }

    const overlay = document.createElement('div');
    overlay.id = 'soul-modal';
    overlay.innerHTML = `
      <div class="modal-box" id="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button class="modal-close" id="modal-close-btn" aria-label="Fechar">✕</button>
        <div class="modal-icon">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
            <g stroke="#B8732A" stroke-width="1.8" fill="none">
              <ellipse cx="24" cy="14" rx="5" ry="10" transform="rotate(0 24 24)" />
              <ellipse cx="24" cy="14" rx="5" ry="10" transform="rotate(45 24 24)" />
              <ellipse cx="24" cy="14" rx="5" ry="10" transform="rotate(90 24 24)" />
              <ellipse cx="24" cy="14" rx="5" ry="10" transform="rotate(135 24 24)" />
            </g>
            <circle cx="24" cy="24" r="3" fill="#B8732A" opacity="0.5"/>
          </svg>
        </div>
        <h2 id="modal-title">Vamos conversar!</h2>
        <p>Preencha os dados abaixo e nossa equipe entrará em contato em até 24 horas.</p>
        <form id="modal-form" novalidate>
          <div class="form-group">
            <label for="form-nome">Nome</label>
            <input id="form-nome" type="text" placeholder="Seu nome completo" required />
          </div>
          <div class="form-group">
            <label for="form-email">E-mail</label>
            <input id="form-email" type="email" placeholder="seu@email.com" required />
          </div>
          <div class="form-group">
            <label for="form-cond">Condomínio</label>
            <input id="form-cond" type="text" placeholder="Nome do condomínio" />
          </div>
          <div class="form-group">
            <label for="form-tipo">Você é</label>
            <select id="form-tipo">
              <option value="">Selecione…</option>
              <option value="morador">Morador</option>
              <option value="sindico">Síndico / Administrador</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <button type="submit" class="btn-modal-submit" id="modal-submit-btn">Enviar solicitação</button>
        </form>
      </div>
    `;
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:1000;
      background:rgba(30,22,16,0.65);
      backdrop-filter:blur(8px);
      display:flex;align-items:center;justify-content:center;
      padding:20px;opacity:0;transition:opacity 0.3s ease;
    `;
    document.body.appendChild(overlay);

    const box = overlay.querySelector('.modal-box');
    box.style.cssText = `
      background:#F5F0E8;border-radius:24px;padding:48px 44px;
      max-width:480px;width:100%;position:relative;
      transform:translateY(24px) scale(0.97);
      transition:transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
      box-shadow:0 24px 80px rgba(30,22,16,0.25);
    `;

    const icon = overlay.querySelector('.modal-icon');
    icon.style.cssText = 'text-align:center;margin-bottom:20px;';

    const title = overlay.querySelector('h2');
    title.style.cssText = `font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:500;color:#2C2018;margin-bottom:10px;text-align:center;`;

    overlay.querySelector('p').style.cssText = 'color:#5C4D3A;font-size:0.9rem;line-height:1.6;text-align:center;margin-bottom:28px;';

    overlay.querySelectorAll('.form-group').forEach(g => {
      g.style.cssText = 'margin-bottom:16px;';
      g.querySelector('label').style.cssText = 'display:block;font-size:0.78rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#8C7A65;margin-bottom:6px;';
      const inp = g.querySelector('input, select');
      inp.style.cssText = 'width:100%;padding:13px 16px;border:1.5px solid rgba(184,115,42,0.2);border-radius:10px;background:#fff;font-family:Inter,sans-serif;font-size:0.9rem;color:#2C2018;outline:none;transition:border-color 0.25s ease;';
      inp.addEventListener('focus', () => inp.style.borderColor = '#B8732A');
      inp.addEventListener('blur', () => inp.style.borderColor = 'rgba(184,115,42,0.2)');
    });

    const submitBtn = overlay.querySelector('.btn-modal-submit');
    submitBtn.style.cssText = 'width:100%;background:#B8732A;color:#fff;font-size:0.95rem;font-weight:600;padding:16px;border-radius:100px;border:none;cursor:pointer;margin-top:8px;transition:all 0.3s ease;box-shadow:0 4px 20px rgba(184,115,42,0.3);';
    submitBtn.addEventListener('mouseenter', () => { submitBtn.style.background = '#C9893F'; submitBtn.style.transform = 'translateY(-2px)'; });
    submitBtn.addEventListener('mouseleave', () => { submitBtn.style.background = '#B8732A'; submitBtn.style.transform = 'translateY(0)'; });

    const closeBtn = overlay.querySelector('.modal-close');
    closeBtn.style.cssText = 'position:absolute;top:16px;right:20px;font-size:1.1rem;color:#8C7A65;cursor:pointer;border:none;background:none;line-height:1;padding:4px 8px;transition:color 0.2s;';
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.color = '#2C2018');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.color = '#8C7A65');

    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      box.style.transform = 'translateY(0) scale(1)';
    });

    const closeModal = () => {
      overlay.style.opacity = '0';
      box.style.transform = 'translateY(24px) scale(0.97)';
      setTimeout(() => overlay.remove(), 300);
    };

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', onKey); }
    });

    overlay.querySelector('#modal-form').addEventListener('submit', e => {
      e.preventDefault();
      submitBtn.textContent = '✓ Solicitação enviada!';
      submitBtn.style.background = '#5A8A5A';
      setTimeout(closeModal, 1800);
    });
  }

  /* ---- PARALLAX hero (subtle) ---- */
  const heroImg = document.querySelector('.hero-img');
  if (heroImg && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroImg.style.transform = `translateY(${y * 0.3}px) scale(1.05)`;
    }, { passive: true });
  }

});
