(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopPreview = window.matchMedia('(min-width: 761px) and (hover: hover)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const hero = document.querySelector('.hero');
  const mark = document.querySelector('.hero-mark');
  const links = [...document.querySelectorAll('.project-link')];
  const images = [...document.querySelectorAll('.preview-image')];
  const placeholder = document.querySelector('.preview-placeholder');
  let activeImage = 0;
  let request = 0;

  // Decode before crossfading; ignore stale requests during rapid navigation.
  async function showPreview(link, index) {
    if (!desktopPreview.matches) return;
    const token = ++request;
    const source = link.dataset.preview;
    if (source) {
      const incoming = images[1 - activeImage];
      const preload = new Image();
      preload.src = source;
      try { await preload.decode(); } catch { return; }
      if (token !== request) return;
      incoming.src = source;
      incoming.dataset.crop = link.dataset.crop || '';
      incoming.alt = link.dataset.previewAlt || `${link.querySelector('h3').textContent} 미리보기`;
      incoming.hidden = false;
      images[activeImage].classList.remove('is-visible');
      images[activeImage].alt = '';
      incoming.classList.add('is-visible');
      activeImage = 1 - activeImage;
    }
    placeholder.hidden = Boolean(source);
    links.forEach(item => item.classList.toggle('is-active', item === link));
    document.querySelector('#preview-title').textContent = link.querySelector('h3').textContent;
    document.querySelector('#preview-number').textContent = `${String(index + 1).padStart(2, '0')} / 07`;
  }
  links.forEach((link, index) => {
    link.addEventListener('pointerenter', () => showPreview(link, index));
    link.addEventListener('focus', () => showPreview(link, index));
  });

  let frame = 0;
  function resetMark() {
    cancelAnimationFrame(frame);
    frame = 0;
    mark.style.removeProperty('--pointer-x');
    mark.style.removeProperty('--pointer-y');
  }
  hero.addEventListener('pointermove', event => {
    if (reducedMotion.matches || !finePointer.matches || frame) return;
    frame = requestAnimationFrame(() => {
      const bounds = hero.getBoundingClientRect();
      mark.style.setProperty('--pointer-x', `${((event.clientX - bounds.left) / bounds.width - .5) * 14}px`);
      mark.style.setProperty('--pointer-y', `${((event.clientY - bounds.top) / bounds.height - .5) * 14}px`);
      frame = 0;
    });
  });
  hero.addEventListener('pointerleave', resetMark);

  let observer;
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('is-pending');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.reveal').forEach(element => {
      if (element.getBoundingClientRect().top >= window.innerHeight) {
        element.classList.add('is-pending');
        observer.observe(element);
      }
    });
  }
  reducedMotion.addEventListener('change', () => {
    resetMark();
    if (reducedMotion.matches) {
      observer?.disconnect();
      document.querySelectorAll('.is-pending').forEach(element => element.classList.remove('is-pending'));
    }
  });
})();
