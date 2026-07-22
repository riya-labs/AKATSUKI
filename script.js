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
        document.body.classList.toggle('nav-open', open);
        btn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    });

    // Close when a link is tapped
    nav.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            btn.classList.remove('open');
            nav.classList.remove('open');
            document.body.classList.remove('nav-open');
            btn.setAttribute('aria-label', 'メニューを開く');
        });
    });

    // Close on outside click
    document.addEventListener('click', e => {
        if (!btn.contains(e.target) && !nav.contains(e.target)) {
            btn.classList.remove('open');
            nav.classList.remove('open');
            document.body.classList.remove('nav-open');
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


/* ----- Contact form: Web3Forms submission -----
   ※ access_key はテスト用キーです。本番公開前に Web3Forms (https://web3forms.com/) で
   取得した本番用のアクセスキーに差し替えてください。 */
(function () {
    const form = document.querySelector('.contact__form');
    if (!form) return;

    const WEB3FORMS_ACCESS_KEY = 'c208967a-bb1e-4cf8-8251-33d27238f0d2'; // TODO: 本番用キーに差し替え

    const nameInput      = form.querySelector('#cf-name');
    const emailInput     = form.querySelector('#cf-email');
    const typeCheckboxes = form.querySelectorAll('.contact__checkbox-input');
    const typeValueInput = form.querySelector('#cf-type-value');
    const messageInput   = form.querySelector('#cf-message');
    const submitBtn      = form.querySelector('.contact__form-submit .btn');
    const submitBtnDefaultText = submitBtn ? submitBtn.textContent : '';

    // Toggle the chip's checked look and keep the hidden field in sync
    typeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            checkbox.closest('.contact__checkbox').classList.toggle('is-checked', checkbox.checked);
            typeValueInput.value = Array.from(typeCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value)
                .join('、');
        });
    });

    function validate() {
        if (!nameInput.value.trim()) {
            return { field: nameInput, message: 'お名前を入力してください。' };
        }
        if (!emailInput.value.trim()) {
            return { field: emailInput, message: 'メールアドレスを入力してください。' };
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
            return { field: emailInput, message: 'メールアドレスの形式が正しくありません。' };
        }
        if (![...typeCheckboxes].some(cb => cb.checked)) {
            return { field: typeCheckboxes[0], message: 'お問い合わせ種別を1つ以上選択してください。' };
        }
        if (!messageInput.value.trim()) {
            return { field: messageInput, message: 'お問い合わせ内容を入力してください。' };
        }
        return null;
    }

    function setSubmitting(isSubmitting) {
        if (!submitBtn) return;
        submitBtn.disabled = isSubmitting;
        submitBtn.textContent = isSubmitting ? '送信中...' : submitBtnDefaultText;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const error = validate();
        if (error) {
            alert(error.message);
            error.field.focus();
            return;
        }

        setSubmitting(true);

        const formData = new FormData(form);
        formData.append('access_key', WEB3FORMS_ACCESS_KEY);
        formData.append('subject', '【株式会社あかつき空調】お問い合わせフォームより');
        formData.append('from_name', '株式会社あかつき空調 コーポレートサイト');

        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body: formData
            });
            const result = await res.json();

            if (result.success) {
                alert('お問い合わせありがとうございました。');
                form.reset();
                typeCheckboxes.forEach(cb => cb.closest('.contact__checkbox').classList.remove('is-checked'));
                typeValueInput.value = '';
            } else {
                alert('送信に失敗しました。時間をおいて再度お試しください。');
            }
        } catch (err) {
            alert('送信中にエラーが発生しました。通信環境をご確認のうえ、再度お試しください。');
        } finally {
            setSubmitting(false);
        }
    });
})();
