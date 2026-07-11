document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const langBtns = document.querySelectorAll('.lang-switch button');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const header = document.querySelector('.header');
  const mobileNavLinks = mobileMenu?.querySelectorAll('a');

  // --- Language ---
  const setLang = (lang) => {
    body.className = body.className.replace(/lang-active-\w+/g, '').trim();
    body.classList.add(`lang-active-${lang}`);
    langBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    localStorage.setItem('twoeras-lang', lang);
  };

  const urlLang = new URLSearchParams(window.location.search).get('lang');
  const savedLang = localStorage.getItem('twoeras-lang');
  if (urlLang && ['ru', 'en'].includes(urlLang)) {
    setLang(urlLang);
  } else if (savedLang && ['ru', 'en'].includes(savedLang)) {
    setLang(savedLang);
  } else {
    setLang('ru');
  }

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });

  // --- Mobile menu ---
  mobileToggle?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('open');
    const isOpen = mobileMenu?.classList.contains('open');
    mobileToggle.querySelectorAll('span').forEach((span, i) => {
      if (isOpen) {
        if (i === 0) { span.style.transform = 'rotate(45deg) translate(5px, 5px)'; }
        if (i === 1) { span.style.opacity = '0'; }
        if (i === 2) { span.style.transform = 'rotate(-45deg) translate(5px, -5px)'; }
      } else {
        span.style.transform = '';
        span.style.opacity = '';
      }
    });
  });

  mobileNavLinks?.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu?.classList.remove('open');
      mobileToggle?.querySelectorAll('span').forEach(span => {
        span.style.transform = '';
        span.style.opacity = '';
      });
    });
  });

  // --- Header scroll ---
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 50);
    lastScroll = y;
  }, { passive: true });

  // --- Gallery ---
  const supportsWebP = (() => {
    const c = document.createElement('canvas');
    return c.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  })();

  const IMG_EXT = supportsWebP ? 'webp' : 'jpg';

  const IMAGE_NAMES = [
    '1-IMGP4013','2-IMGP4014','3-IMGP4015','4-IMGP4016',
    '5-IMGP4017','6-IMGP4018','7-IMGP4019','8-IMGP4022',
    '9-IMGP4023','10-IMGP4024','11-IMGP4025','12-IMGP4027',
    '13-IMGP4028','14-IMGP4029','15-IMGP4030','16-IMGP4031',
    '17-IMGP4032','18-IMGP4034','19-IMGP4035','20-IMGP4037',
    '21-IMGP4038','22-IMGP4039','23-IMGP4040','24-IMGP4041',
    '25-IMGP4046','26-IMGP4047','27-IMGP4049','28-IMGP4050',
    '29-IMGP4052','30-IMGP4053','31-IMGP4054','32-IMGP4055',
    '33-IMGP4056','34-IMGP4057','35-IMGP4058','36-IMGP4061'
  ];

  const ALTS = [
    'Гостиная с панорамным окном — вид на Санкт-Петербург',
    'Диван и журнальный столик в интерьере гостиной',
    'Обеденная зона с панорамным видом на город',
    'Панорамный вид на Санкт-Петербург из апартаментов',
    'Кухня-гостиная с современной мебелью',
    'Кухонный гарнитур и барная стойка',
    'Спальня с большой кроватью и видом на город',
    'Спальня — мягкая кровать и текстиль',
    'Ванная комната с душевой кабиной',
    'Ванная комната — раковина и зеркало',
    'Коридор с вешалкой и дизайнерскими светильниками',
    'Прихожая с комодом и зеркалом',
    'Интерьер гостиной — панорамное окно во всю стену',
    'Мягкий диван и подушки в гостиной',
    'Обеденный стол на 4 персоны',
    'Кухня с бытовой техникой и посудой',
    'Вид из окна на Васильевский остров',
    'Спальня — кровать с балдахином',
    'Прикроватная тумба и ночник',
    'Ванная — полочки с принадлежностями',
    'Гостиная — телевизор и медиазона',
    'Рабочее место у окна',
    'Деталь интерьера — декоративные подушки',
    'Цветы и декор на обеденном столе',
    'Вечерний вид на город с подсветкой',
    'Ночной Санкт-Петербург из окна апартаментов',
    'Чайная зона с чайником и чашками',
    'Деталь интерьера — настольная лампа',
    'Зеркало в полный рост в прихожей',
    'Вешалка для одежды и пуф',
    'Гостиная — крупный план дивана',
    'Кухня — крупный план столешницы',
    'Ванная — крупный план смесителя',
    'Спальня — крупный план покрывала',
    'Декоративная ваза в интерьере',
    'Общий вид гостиной и кухни'
  ];

  const galleryGrid = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentIndex = 0;

  const loadLightboxImage = (index) => {
    const name = IMAGE_NAMES[index];
    lightboxImg.onerror = null;
    lightboxImg.src = `images/${name}.${IMG_EXT}`;
    lightboxImg.onerror = function () {
      this.onerror = null;
      this.src = `images/${name}.jpg`;
    };
  };

  const openLightbox = (index) => {
    currentIndex = index;
    loadLightboxImage(index);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  const navigateLightbox = (delta) => {
    const next = currentIndex + delta;
    if (next >= 0 && next < IMAGE_NAMES.length) {
      openLightbox(next);
    }
  };

  IMAGE_NAMES.forEach((name, i) => {
    const item = document.createElement('div');
    item.className = 'gallery__item';

    const img = document.createElement('img');
    img.src = `images/thumbs/${name}.jpg`;
    img.alt = ALTS[i] || name;
    img.loading = 'lazy';

    img.addEventListener('click', () => openLightbox(i));

    item.appendChild(img);
    galleryGrid?.appendChild(item);
  });

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.getElementById('lightboxClose')?.addEventListener('click', closeLightbox);
  lightboxPrev?.addEventListener('click', () => navigateLightbox(-1));
  lightboxNext?.addEventListener('click', () => navigateLightbox(1));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeLightbox(); closeVideo(); }
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  // --- Video ---
  const videoOverlay = document.getElementById('videoOverlay');
  const videoEl = document.getElementById('videoEl');
  const videoPlayBtn = document.getElementById('videoPlayBtn');

  const openVideo = () => {
    videoOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
    videoEl?.play();
  };

  const closeVideo = () => {
    videoOverlay?.classList.remove('open');
    document.body.style.overflow = '';
    videoEl?.pause();
    videoEl.currentTime = 0;
  };

  videoPlayBtn?.addEventListener('click', openVideo);

  videoOverlay?.addEventListener('click', (e) => {
    if (e.target === videoOverlay) closeVideo();
  });

  document.getElementById('videoClose')?.addEventListener('click', closeVideo);

  // --- Form ---
  const WORKER_URL = 'https://twoeras-form.tehnoles2021.workers.dev/';

  document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = e.target.querySelector('button[type="submit"]');
    const status = document.getElementById('form-status');
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Отправка...';
    btn.disabled = true;
    status.textContent = '';
    status.className = 'form__status';

    const data = {
      name: document.getElementById('formName').value.trim(),
      phone: document.getElementById('formPhone').value.trim(),
      email: document.getElementById('formEmail').value.trim(),
      dates: document.getElementById('formDates').value.trim(),
      message: getVisibleMessage(),
    };

    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Worker error');
      }
    } catch {
      btn.innerHTML = originalText;
      btn.disabled = false;
      status.textContent = '❌ Ошибка отправки';
      status.className = 'form__status form__status--error';
      return;
    }

    status.textContent = '✅ Отправлено!';
    status.className = 'form__status form__status--success';
    e.target.reset();
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }, 2500);
  });

  function getVisibleMessage() {
    const ru = document.getElementById('formMessage');
    if (ru.offsetParent !== null) return ru.value.trim();
    const en = document.querySelector('.form__textarea.lang-en');
    return en ? en.value.trim() : '';
  }
});
