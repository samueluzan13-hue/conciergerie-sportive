// Conciergerie Sportive — interactions

// Adresse qui reçoit les demandes du formulaire de contact
const CONTACT_EMAIL = 'contact@conciergerie-sportive.fr';

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('main-nav');

    // Menu mobile
    const closeMenu = () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Ouvrir le menu');
    };

    toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });

    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

    // Ombre sous l'en-tête au défilement
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Apparition des blocs au défilement
    const revealTargets = document.querySelectorAll('.card, .step, .plan, .faq details, .contact-form');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealTargets.forEach((el) => {
            el.classList.add('reveal');
            observer.observe(el);
        });
    }

    // Boutons "Choisir ..." : pré-sélectionne la formule dans le formulaire
    const planSelect = document.getElementById('plan');
    document.querySelectorAll('[data-plan]').forEach((btn) => {
        btn.addEventListener('click', () => { planSelect.value = btn.dataset.plan; });
    });

    // Formulaire de contact : validation puis ouverture du client e-mail
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        status.className = 'form-status';
        status.textContent = '';

        let firstInvalid = null;
        form.querySelectorAll('[required]').forEach((input) => {
            const valid = input.checkValidity() && input.value.trim() !== '';
            input.closest('.field').classList.toggle('invalid', !valid);
            if (!valid && !firstInvalid) firstInvalid = input;
        });

        if (firstInvalid) {
            status.classList.add('error');
            status.textContent = 'Merci de remplir correctement tous les champs.';
            firstInvalid.focus();
            return;
        }

        const data = new FormData(form);
        const subject = `Demande de devis — ${data.get('club')}`;
        const body = [
            `Club : ${data.get('club')}`,
            `Nom : ${data.get('name')}`,
            `E-mail : ${data.get('email')}`,
            `Formule : ${data.get('plan')}`,
            '',
            data.get('message'),
        ].join('\n');

        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        status.classList.add('success');
        status.textContent = 'Merci ! Votre messagerie va s\'ouvrir pour envoyer la demande.';
        form.reset();
    });

    form.querySelectorAll('input, textarea').forEach((input) => {
        input.addEventListener('input', () => input.closest('.field').classList.remove('invalid'));
    });

    document.getElementById('year').textContent = new Date().getFullYear();
});
