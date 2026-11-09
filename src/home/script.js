async function loadIncludes() {
    const els = document.querySelectorAll("[data-include]");
    await Promise.all([...els].map(async el => {
        const res = await fetch(el.dataset.include);
        if (!res.ok) throw new Error(el.dataset.include + " → " + res.status);
        el.innerHTML = await res.text();
    }));
}

function initSectionTransitions() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add("show");
        });
    }, { threshold: 0.2 });

    document.querySelectorAll(".card-principal").forEach(s => observer.observe(s));
}

loadIncludes()
    .then(() => {
        if (typeof initNav === "function") initNav();
        if (typeof initHome === "function") initHome();
        if (typeof initProjects === "function") initProjects();

        initSectionTransitions();
    })
    .catch(err => console.error("Erro ao carregar as seções:", err));