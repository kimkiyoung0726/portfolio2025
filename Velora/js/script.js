'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initGnbDropdowns();
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

    gnb.querySelectorAll('.gnb__item.has-dropdown.is-open').forEach((item) => {
      item.classList.remove('is-open');
      const caret = item.querySelector('.gnb__caret');
      if (caret) caret.setAttribute('aria-expanded', 'false');
    });
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
/* GNB dropdown: plain hover on desktop (CSS), tap accordion on mobile    */
/* ---------------------------------------------------------------------- */
function initGnbDropdowns() {
  document.querySelectorAll('.gnb__item.has-dropdown').forEach((item) => {
    const caret = item.querySelector('.gnb__caret');
    if (!caret) return;

    caret.addEventListener('click', () => {
      const isOpen = item.classList.toggle('is-open');
      caret.setAttribute('aria-expanded', String(isOpen));
    });
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
  const infoTitle = info ? info.querySelector('h3') : null;
  const infoDesc = info ? info.querySelector('p') : null;
  const dotsWrap = document.getElementById('bestDots');
  const prevBtn = document.getElementById('bestPrev');
  const nextBtn = document.getElementById('bestNext');
  if (!tabs.length || !dotsWrap) return;

  // 실제 상품명/설명이 정해지면 아래 값만 교체하면 된다.
  const infoText = {
    sofa: { title: 'Tiffany 4 people<br />cowhide sofa', desc: '4인 소가죽 소파' },
    bed: { title: 'Tiffany 4 people<br />cowhide bed', desc: '4인 소가죽 침대' },
    table: { title: 'Tiffany 4 people<br />cowhide table', desc: '소가죽 콤비네이션 테이블' },
  };

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

    const text = infoText[current];
    if (text && infoTitle) infoTitle.innerHTML = text.title;
    if (text && infoDesc) infoDesc.textContent = text.desc;

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
/* Gallery: seamless auto-flowing marquee                                 */
/* ---------------------------------------------------------------------- */
function initGalleryDrag() {
  const list = document.getElementById('galleryList');
  if (!list) return;

  // 무한 루프처럼 보이도록 목록을 통째로 복제해 이어붙인다 (translateX(-50%)로 되감기).
  const originalItems = [...list.children];
  originalItems.forEach((li) => {
    const clone = li.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('img').forEach((img) => img.removeAttribute('loading'));
    list.appendChild(clone);
  });
}

/* ---------------------------------------------------------------------- */
/* Store: location carousel                                               */
/* ---------------------------------------------------------------------- */
function initStoreCarousel() {
  const label = document.getElementById('storeLabel');
  const photoWrap = document.getElementById('storePhotoWrap');
  const prevBtn = document.getElementById('storePrev');
  const nextBtn = document.getElementById('storeNext');
  if (!label || !photoWrap || !prevBtn || !nextBtn) return;

  // 매장 배경(store__bg)은 고정, 이 카드 안의 사진만 매장별로 슬라이딩 전환된다.
  const stores = [
    { name: '마포', photo: './img/store/mapo-thumb.jpg', alt: '마포 매장 쇼룸 - 오렌지 암체어와 라탄 콘솔' },
    { name: '강남', photo: null, alt: '강남 매장 - 오픈 예정' },
    { name: '잠실', photo: null, alt: '잠실 매장 - 오픈 예정' },
  ];

  let current = 0;
  let animating = false;

  function buildEl(store) {
    if (store.photo) {
      const img = document.createElement('img');
      img.src = store.photo;
      img.alt = store.alt;
      return img;
    }
    const empty = document.createElement('p');
    empty.className = 'store__card-empty';
    empty.innerHTML = `${store.name} 매장을<br />준비하고 있어요.`;
    return empty;
  }

  function step(delta) {
    if (animating) return;
    animating = true;

    current = (current + delta + stores.length) % stores.length;
    const store = stores[current];
    label.textContent = store.name;

    const outgoing = photoWrap.firstElementChild;
    const incoming = buildEl(store);
    incoming.style.transform = `translateX(${delta > 0 ? 100 : -100}%)`;
    photoWrap.appendChild(incoming);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (outgoing) outgoing.style.transform = `translateX(${delta > 0 ? -100 : 100}%)`;
        incoming.style.transform = 'translateX(0)';
      });
    });

    setTimeout(() => {
      if (outgoing) outgoing.remove();
      animating = false;
    }, 450);
  }

  prevBtn.addEventListener('click', () => step(-1));
  nextBtn.addEventListener('click', () => step(1));

  // 마우스/터치로 카드 사진을 좌우로 드래그해도 다음/이전 매장으로 넘어간다.
  const DRAG_THRESHOLD = 50;
  let dragging = false;
  let dragStartX = 0;
  let dragDelta = 0;

  photoWrap.addEventListener('pointerdown', (e) => {
    if (animating) return;
    dragging = true;
    dragDelta = 0;
    dragStartX = e.clientX;
    photoWrap.setPointerCapture(e.pointerId);
    photoWrap.classList.add('is-dragging');
    const current = photoWrap.firstElementChild;
    if (current) current.style.transition = 'none';
  });

  photoWrap.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    dragDelta = e.clientX - dragStartX;
    const current = photoWrap.firstElementChild;
    if (current) current.style.transform = `translateX(${dragDelta}px)`;
  });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    photoWrap.classList.remove('is-dragging');

    const current = photoWrap.firstElementChild;
    if (current) current.style.transition = '';

    if (Math.abs(dragDelta) > DRAG_THRESHOLD) {
      if (current) current.style.transform = '';
      step(dragDelta < 0 ? 1 : -1);
    } else if (current) {
      current.style.transform = '';
    }
    dragDelta = 0;
  }

  photoWrap.addEventListener('pointerup', endDrag);
  photoWrap.addEventListener('pointerleave', endDrag);
  photoWrap.addEventListener('pointercancel', endDrag);
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
