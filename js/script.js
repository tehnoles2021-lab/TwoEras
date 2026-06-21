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
  const IMAGES = [
    '1-IMGP4013.jpg','2-IMGP4014.jpg','3-IMGP4015.jpg','4-IMGP4016.jpg',
    '5-IMGP4017.jpg','6-IMGP4018.jpg','7-IMGP4019.jpg','8-IMGP4022.jpg',
    '9-IMGP4023.jpg','10-IMGP4024.jpg','11-IMGP4025.jpg','12-IMGP4027.jpg',
    '13-IMGP4028.jpg','14-IMGP4029.jpg','15-IMGP4030.jpg','16-IMGP4031.jpg',
    '17-IMGP4032.jpg','18-IMGP4034.jpg','19-IMGP4035.jpg','20-IMGP4037.jpg',
    '21-IMGP4038.jpg','22-IMGP4039.jpg','23-IMGP4040.jpg','24-IMGP4041.jpg',
    '25-IMGP4046.jpg','26-IMGP4047.jpg','27-IMGP4049.jpg','28-IMGP4050.jpg',
    '29-IMGP4052.jpg','30-IMGP4053.jpg','31-IMGP4054.jpg','32-IMGP4055.jpg',
    '33-IMGP4056.jpg','34-IMGP4057.jpg','35-IMGP4058.jpg','36-IMGP4061.jpg'
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

  IMAGES.forEach((name, i) => {
    const item = document.createElement('div');
    item.className = 'gallery__item';

    const img = document.createElement('img');
    img.src = `images/thumbs/${name}`;
    img.alt = ALTS[i] || name;
    img.loading = 'lazy';

    img.addEventListener('click', () => {
      lightboxImg.src = `images/${name}`;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    item.appendChild(img);
    galleryGrid?.appendChild(item);
  });

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.getElementById('lightboxClose')?.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // --- Form ---
  document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Отправка...';
    btn.disabled = true;

    const visible = (sel) => {
      const el = document.querySelector(sel);
      return el && el.offsetParent !== null ? el.value.trim() : '';
    };

    try {
      const res = await fetch('https://formsubmit.co/ajax/tehnoles2007@yandex.ru', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: document.getElementById('formName').value.trim(),
          phone: document.getElementById('formPhone').value.trim(),
          email: document.getElementById('formEmail').value.trim(),
          dates: document.getElementById('formDates').value.trim(),
          message: visible('#formMessage') || visible('.form__textarea.lang-en')
        })
      });

      if (res.ok) {
        btn.innerHTML = '✅ Отправлено!';
        e.target.reset();
      } else {
        btn.innerHTML = '❌ Ошибка';
      }
    } catch {
      btn.innerHTML = '❌ Ошибка';
    }

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }, 3000);
  });
});
