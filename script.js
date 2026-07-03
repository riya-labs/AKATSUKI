/* =====================================================
   AKATSUKI KUCHO — script.js
===================================================== */

/* ----- Header: scroll effect ----- */
(function () {
    const header = document.getElementById('header');
    if (!header) return;
    let timer = null;

    function onScroll() {
        const isScrolled = window.scrollY > 60;
        header.classList.toggle('scrolled', isScrolled);

        if (isScrolled) {
            header.classList.add('scrolling');
            clearTimeout(timer);
            timer = setTimeout(() => header.classList.remove('scrolling'), 180);
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();


/* ----- Hamburger menu ----- */
(function () {
    const btn = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    if (!btn || !nav) return;

    btn.addEventListener('click', () => {
        const open = btn.classList.toggle('open');
        nav.classList.toggle('open', open);
        btn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    });

    // Close when a link is tapped
    nav.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            btn.classList.remove('open');
            nav.classList.remove('open');
            btn.setAttribute('aria-label', 'メニューを開く');
        });
    });

    // Close on outside click
    document.addEventListener('click', e => {
        if (!btn.contains(e.target) && !nav.contains(e.target)) {
            btn.classList.remove('open');
            nav.classList.remove('open');
        }
    });
})();


/* ----- Smooth scroll for anchor links ----- */
(function () {
    const headerEl = document.getElementById('header');

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const id = anchor.getAttribute('href');
            if (id === '#') return;

            const target = document.querySelector(id);
            if (!target) return;

            e.preventDefault();
            const offset = headerEl ? headerEl.offsetHeight : 0;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
})();


/* ----- Scroll reveal (Intersection Observer) ----- */
(function () {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    // Apply stagger delay based on sibling position within the same parent
    items.forEach(el => {
        const parent = el.parentElement;
        const siblings = Array.from(parent.children).filter(c => c.classList.contains('reveal'));
        const idx = siblings.indexOf(el);
        if (idx > 0) el.style.transitionDelay = `${idx * 0.12}s`;
    });

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -48px 0px'
    });

    items.forEach(el => observer.observe(el));
})();


/* ----- Counter animation ----- */
(function () {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    function runCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        if (isNaN(target)) return;

        const duration = 1800;   // ms
        const fps      = 60;
        const steps    = Math.round(duration / (1000 / fps));
        let   frame    = 0;

        const tick = () => {
            frame++;
            // Ease-out curve: starts fast, slows near the end
            const progress = 1 - Math.pow(1 - frame / steps, 3);
            el.textContent = Math.round(target * progress).toLocaleString('ja-JP');
            if (frame < steps) requestAnimationFrame(tick);
            else el.textContent = target.toLocaleString('ja-JP');
        };

        requestAnimationFrame(tick);
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
})();


/* ----- Active nav link on scroll ----- */
(function () {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav__link');
    const header   = document.getElementById('header');
    if (!sections.length || !links.length) return;

    function update() {
        const offset = (header ? header.offsetHeight : 0) + 30;
        let current = '';

        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - offset) {
                current = sec.id;
            }
        });

        links.forEach(link => {
            link.classList.toggle(
                'nav__link--active',
                link.getAttribute('href') === `#${current}`
            );
        });
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
})();
