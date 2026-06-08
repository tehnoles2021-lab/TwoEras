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

  const savedLang = localStorage.getItem('twoeras-lang');
  if (savedLang && ['ru', 'en'].includes(savedLang)) {
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

  const galleryGrid = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');

  IMAGES.forEach((name) => {
    const item = document.createElement('div');
    item.className = 'gallery__item';

    const img = document.createElement('img');
    img.src = `images/thumbs/${name}`;
    img.alt = name;
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
  const BOT_TOKEN = '8545791077:AAF3v6osGQ5b-n0VdFtvAnnxQt0dJW5nzI0';
  const CHAT_ID = '2003616265';

  document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('formName').value.trim();
    const phone = document.getElementById('formPhone').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    const dates = document.getElementById('formDates').value.trim();
    const msg = document.getElementById('formMessage').value.trim();

    const text = `📩 Новая заявка с сайта «Две Эпохи»

👤 Имя: ${name}
📞 Телефон: ${phone}
📧 Email: ${email}
📅 Даты: ${dates || 'не указаны'}
💬 Сообщение: ${msg || '—'}`;

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Отправка...';
    btn.disabled = true;

    try {
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text })
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
