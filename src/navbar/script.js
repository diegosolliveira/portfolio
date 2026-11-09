function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function initNav() {
    // --- scroll para a seção ao clicar (substitui o onclick inline) ---
    const navlinks = document.querySelectorAll("nav a[data-section]");
    navlinks.forEach(link => {
        link.addEventListener("click", () => {
            scrollToSection(link.dataset.section);
        });
    });

    // --- link ativo conforme o scroll ---
    const sections = document.querySelectorAll("section");

    function updateActiveLink() {
        let current = "";

        sections.forEach(section => {
            const top = section.offsetTop - 190;
            if (scrollY >= top && scrollY < top + section.clientHeight) {
                current = section.id;
            }
        });

        navlinks.forEach(link => {
            link.classList.toggle("active", link.dataset.section === current);
        });
    }

    window.addEventListener("scroll", updateActiveLink);
    updateActiveLink();

    // --- menu mobile ---
    const menuToggle = document.getElementById("menuToggle");
    const menu = document.querySelector(".div-nav");

    if (menuToggle && menu) {
        menuToggle.addEventListener("click", () => menu.classList.toggle("active"));

        // fecha o menu ao escolher uma opção
        navlinks.forEach(link =>
            link.addEventListener("click", () => menu.classList.remove("active"))
        );
    }

    // --- tema (só roda se o botão existir no nav) ---
    const toggle = document.getElementById("themeToggle");
    const iconWrapper = document.getElementById("iconWrapper");

    if (toggle && iconWrapper) {
        const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10c0-.3 0-.6-.05-.9a8 8 0 1 1-8.95-8.95c-.3-.05-.6-.05-1-.05z"/></svg>`;
        const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`;

        const isLight = localStorage.getItem("theme") === "light";
        document.body.classList.toggle("light", isLight);
        iconWrapper.innerHTML = isLight ? sunIcon : moonIcon;

        toggle.addEventListener("click", () => {
            const light = document.body.classList.toggle("light");
            localStorage.setItem("theme", light ? "light" : "dark");
            iconWrapper.innerHTML = light ? sunIcon : moonIcon;
        });
    }

    // --- botão de CV (só roda se existir no nav) ---
    const cvBtn = document.getElementById("downloadCV");
    if (cvBtn) {
        cvBtn.addEventListener("click", () => {
            const link = document.createElement("a");
            link.href = "/archives/cv.pdf";
            link.download = "Diego_Oliveira_CV.pdf";
            link.click();
        });
    }
}

// --- carrega o nav e inicializa ---
fetch("/src/navbar/nav.html")
    .then(res => {
        if (!res.ok) throw new Error("Erro ao carregar o nav: " + res.status);
        return res.text();
    })
    .then(html => {
        document.getElementById("nav-placeholder").innerHTML = html;
        initNav();
    })
    .catch(err => console.error(err));