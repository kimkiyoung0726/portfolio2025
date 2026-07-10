'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initBestSection();
  initProductsTabs();
  initGalleryDrag();
  initStoreCarousel();
  initChatFab();
  initToTop();
});

/* ---------------------------------------------------------------------- */
/* Header: shadow on scroll                                               */
/* ---------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 4);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

/* ---------------------------------------------------------------------- */
/* Mobile navigation drawer                                               */
/* ---------------------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.getElementById('menuToggle');
  const gnb = document.getElementById('gnb');
  const dim = document.getElementById('gnbDim');
  if (!toggle || !gnb || !dim) return;

  const close = () => {
    gnb.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    dim.classList.remove('is-visible');
    dim.hidden = true;
  };

  const open = () => {
    gnb.classList.add('is-open');
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    dim.hidden = false;
    requestAnimationFrame(() => dim.classList.add('is-visible'));
  };

  toggle.addEventListener('click', () => {
    gnb.classList.contains('is-open') ? close() : open();
  });

  dim.addEventListener('click', close);
  gnb.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && gnb.classList.contains('is-open')) close();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 767) close();
  });
}

/* ---------------------------------------------------------------------- */
/* Best section: category tabs + prev/next + dots                        */
/* ---------------------------------------------------------------------- */
function initBestSection() {
  const order = ['sofa', 'bed', 'table'];
  const tabs = document.querySelectorAll('.best__tab');
  const panels = document.querySelectorAll('[data-best-panel]');
  const info = document.getElementById('bestInfo');
  const dotsWrap = document.getElementById('bestDots');
  const prevBtn = document.getElementById('bestPrev');
  const nextBtn = document.getElementById('bestNext');
  if (!tabs.length || !dotsWrap) return;

  let current = 'sofa';

  order.forEach((key, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('is-active');
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.querySelectorAll('span');

  function render() {
    tabs.forEach((tab) => {
      const active = tab.dataset.best === current;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });

    panels.forEach((panel) => {
      panel.hidden = panel.dataset.bestPanel !== current;
    });

    if (info) info.hidden = current !== 'sofa';

    dots.forEach((dot, i) => dot.classList.toggle('is-active', order[i] === current));
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      current = tab.dataset.best;
      render();
    });
  });

  function step(delta) {
    const idx = order.indexOf(current);
    current = order[(idx + delta + order.length) % order.length];
    render();
  }

  prevBtn && prevBtn.addEventListener('click', () => step(-1));
  nextBtn && nextBtn.addEventListener('click', () => step(1));

  render();
}

/* ---------------------------------------------------------------------- */
/* Products section: category tabs                                       */
/* ---------------------------------------------------------------------- */
function initProductsTabs() {
  const tabs = document.querySelectorAll('.products__tab');
  const panels = document.querySelectorAll('[data-products-panel]');
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.products;

      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });

      panels.forEach((panel) => {
        panel.hidden = panel.dataset.productsPanel !== key;
      });
    });
  });
}

/* ---------------------------------------------------------------------- */
/* Gallery: mouse drag-to-scroll (touch/trackpad already native)          */
/* ---------------------------------------------------------------------- */
function initGalleryDrag() {
  const list = document.getElementById('galleryList');
  if (!list) return;

  let isDown = false;
  let startX = 0;
  let startScroll = 0;
  let moved = false;

  list.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') return;
    isDown = true;
    moved = false;
    startX = e.clientX;
    startScroll = list.scrollLeft;
    list.setPointerCapture(e.pointerId);
  });

  list.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    const delta = e.clientX - startX;
    if (Math.abs(delta) > 4) moved = true;
    list.scrollLeft = startScroll - delta;
  });

  const stop = () => {
    isDown = false;
  };
  list.addEventListener('pointerup', stop);
  list.addEventListener('pointerleave', stop);

  list.addEventListener(
    'click',
    (e) => {
      if (moved) e.preventDefault();
    },
    true
  );

  list.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') list.scrollBy({ left: 240, behavior: 'smooth' });
    if (e.key === 'ArrowLeft') list.scrollBy({ left: -240, behavior: 'smooth' });
  });
}

/* ---------------------------------------------------------------------- */
/* Store: location carousel                                               */
/* ---------------------------------------------------------------------- */
function initStoreCarousel() {
  const label = document.getElementById('storeLabel');
  const photoWrap = document.getElementById('storePhotoWrap');
  const bg = document.getElementById('storeBg');
  const prevBtn = document.getElementById('storePrev');
  const nextBtn = document.getElementById('storeNext');
  if (!label || !photoWrap || !prevBtn || !nextBtn) return;

  const stores = [
    {
      name: '마포',
      photo: './img/store/mapo-thumb.jpg',
      alt: '마포 매장 쇼룸 - 오렌지 암체어와 라탄 콘솔',
      bg: './img/store/interior.jpg',
    },
    { name: '강남', photo: null, alt: '강남 매장 - 오픈 예정', bg: './img/store/interior.jpg' },
    { name: '잠실', photo: null, alt: '잠실 매장 - 오픈 예정', bg: './img/store/interior.jpg' },
  ];

  let current = 0;

  function render() {
    const store = stores[current];
    label.textContent = store.name;

    if (store.photo) {
      photoWrap.innerHTML = `<img src="${store.photo}" alt="${store.alt}" />`;
    } else {
      photoWrap.innerHTML = `<p class="store__card-empty">${store.name} 매장을<br />준비하고 있어요.</p>`;
    }

    if (bg && store.bg) bg.src = store.bg;
  }

  function step(delta) {
    current = (current + delta + stores.length) % stores.length;
    render();
  }

  prevBtn.addEventListener('click', () => step(-1));
  nextBtn.addEventListener('click', () => step(1));
}

/* ---------------------------------------------------------------------- */
/* Chat FAB tooltip                                                       */
/* ---------------------------------------------------------------------- */
function initChatFab() {
  const fab = document.getElementById('chatFab');
  const tip = document.getElementById('chatFabTip');
  if (!fab || !tip) return;

  let timer = null;

  fab.addEventListener('click', () => {
    tip.hidden = false;
    clearTimeout(timer);
    timer = setTimeout(() => {
      tip.hidden = true;
    }, 2400);
  });
}

/* ---------------------------------------------------------------------- */
/* Back to top                                                            */
/* ---------------------------------------------------------------------- */
function initToTop() {
  const btn = document.getElementById('toTop');
  if (!btn) return;

  const update = () => {
    btn.hidden = window.scrollY < window.innerHeight;
  };
  update();
  window.addEventListener('scroll', update, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
