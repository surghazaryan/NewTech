

import { translations } from "./translations/index.js";


let currentLang = localStorage.getItem('preferredLanguage') || "hy";

document.addEventListener('DOMContentLoaded', function () {

    // --- 1. MENU & NAVIGATION 
    const links = document.querySelectorAll(".nav-links a");
    const menu = document.getElementById("menu");
    const nav = document.querySelector(".nav-links");
    const header = document.getElementById('header');
    const topBar = document.getElementById('topBar');

    // Burger Menu-ի բացել/փակելը
    if (menu) {
        menu.addEventListener("click", () => {
            nav.classList.toggle("active");
            menu.classList.toggle("open");
        });
    }

    // Հղման վրա սեղմելիս մենյուն փակելը
    links.forEach(link => {
        link.addEventListener("click", function () {
            if (menu) menu.classList.remove("open");
            if (nav) nav.classList.remove("active");
        });
    });

    // --- 2. LANGUAGE LOGIC (Լեզվի փոփոխություն) ---
    function changeLanguage(lang) {
        currentLang = lang;

        // Թարմացնում ենք տեքստերը (data-translate)
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        // Թարմացնում ենք input-ների placeholder-ները
        const inputs = document.querySelectorAll('input[data-translate], textarea[data-translate]');
        inputs.forEach(input => {
            const key = input.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                input.placeholder = translations[lang][key];
            }
        });

        document.documentElement.lang = lang;
        localStorage.setItem('preferredLanguage', lang);
    }

    // Դրոշակների վրա սեղմելու իվենթը
    document.querySelectorAll('.icon_lng img').forEach(function (img) {
        img.addEventListener('click', function () {
            const lang = this.getAttribute('data-lang');
            changeLanguage(lang);
        });
    });


    changeLanguage(currentLang);


    // --- 3. ANIMATIONS & SCROLL (Անիմացիաներ) ---
    const animatedElements = [
        document.querySelector('.home-section p'),
        document.querySelector('.home-section .btn'),
        document.querySelector('.about-text'),
        ...document.querySelectorAll('section h2'),
        ...document.querySelectorAll('.service-card'),
        ...document.querySelectorAll('.portfolio-card'),
        ...document.querySelectorAll('.step'),
        ...document.querySelectorAll('.contact-details p')
    ];

    // Սահմանում ենք ուշացումները (Delay) գեղեցիկ հերթականության համար
    document.querySelectorAll('.service-card').forEach((el, i) => el.style.transitionDelay = `${i * 0.1}s`);
    document.querySelectorAll('.portfolio-card').forEach((el, i) => el.style.transitionDelay = `${i * 0.1}s`);
    document.querySelectorAll('.step').forEach((el, i) => el.style.transitionDelay = `${i * 0.2}s`);

    function isInViewport(element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return (rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 && rect.bottom >= 0);
    }

    function checkVisibility() {
        animatedElements.forEach(el => {
            if (el && isInViewport(el)) {
                el.classList.add('visible');
            }
        });
    }
    checkVisibility();
    window.addEventListener('scroll', checkVisibility);


    // --- 4. MODAL LOGIC (Մոդալ պատուհաններ) ---
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener("click", function (e) {
            let textKey = card.getAttribute("data-modal-text");
            if (!textKey) return;
            let bodyText = translations[currentLang][textKey] || "Text not found";
            let modal = document.createElement('div');
            modal.classList.add("modal");
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <p>${bodyText}</p>
                </div>
            `;
            document.body.appendChild(modal);
            setTimeout(() => {
                modal.style.opacity = "1";
                modal.querySelector(".modal-content").style.transform = "scale(1)";
            }, 10);

            // Փակելու ֆունկցիա
            const closeModal = () => {
                modal.style.opacity = "0";
                modal.querySelector(".modal-content").style.transform = "scale(0.8)";
                setTimeout(() => modal.remove(), 300);
            };

            modal.querySelector('.close').addEventListener('click', closeModal);


            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
        });
    });
});