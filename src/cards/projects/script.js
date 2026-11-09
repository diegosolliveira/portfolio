function initProjects() {
  const container = document.getElementById("cardContainer");

  if (!container) {
    console.warn("initProjects: #cardContainer não encontrado");
    return;
  }

  const carousel = container.closest(".carousel");
  const nextBtn = document.querySelector("#projects .carousel-next");
  const prevBtn = document.querySelector("#projects .carousel-prev");

  // cria o container dos pontos se o HTML não tiver
  let dotsContainer = document.getElementById("dots");

  if (!dotsContainer) {
    dotsContainer = document.createElement("div");
    dotsContainer.id = "dots";
    dotsContainer.className = "carousel-dots";
    container.closest(".card-principal").appendChild(dotsContainer);
  }

  const MIN_SLIDES = 6; // mínimo para o loop infinito ficar suave

  let slides = [];     // elementos .card no DOM
  let realCount = 0;   // quantidade real de projetos
  let active = 0;      // índice do card central

  /* ---------- posição de cada card ---------- */

  // distância circular entre o card i e o card central
  function offsetOf(i) {
    const n = slides.length;
    let off = i - active;

    if (off > n / 2) off -= n;
    else if (off < -n / 2) off += n;

    return off;
  }

  function render() {
    slides.forEach((card, i) => {
      const off = offsetOf(i);
      const abs = Math.abs(off);

      card.style.setProperty("--offset", off);
      card.classList.toggle("is-active", off === 0);
      card.classList.toggle("is-side", abs === 1);
      card.classList.toggle("is-hidden", abs > 1);

      card.setAttribute("aria-hidden", abs > 1 ? "true" : "false");
      card.tabIndex = abs > 1 ? -1 : 0;
    });

    updateDots();
  }

  function goBy(step) {
    const n = slides.length;
    if (!n) return;

    active = (active + step + n) % n;
    render();
  }

  function goToSlide(i) {
    active = i;
    render();
  }

  // vai para o projeto "r" pelo caminho mais curto
  function goToReal(r) {
    const n = slides.length;
    let d = ((r - (active % realCount)) % realCount + realCount) % realCount;

    if (d > realCount / 2) d -= realCount;

    active = (active + d + n) % n;
    render();
  }

  /* ---------- indicadores ---------- */

  function createDots() {
    dotsContainer.innerHTML = "";

    for (let i = 0; i < realCount; i++) {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      dot.addEventListener("click", () => goToReal(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    const current = active % realCount;

    [...dotsContainer.children].forEach((dot, i) => {
      dot.classList.toggle("active", i === current);
    });
  }

  /* ---------- cards ---------- */

  function createCard(project) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("role", "button");

    const status = project.inDevelopment
      ? `<span class="project-status">Em desenvolvimento</span>`
      : `<svg class="project-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
           <line x1="7" y1="17" x2="17" y2="7"></line>
           <polyline points="8 7 17 7 17 16"></polyline>
         </svg>`;

    card.innerHTML = `
      <article class="project-card">
        <div class="project-media">
          <img class="project-bg" src="${project.image}" alt="${project.title}" draggable="false">
        </div>

        <div class="project-info">
          <div class="project-meta">
            <span class="project-category">${project.client} · ${project.date}</span>
            ${status}
          </div>

          <h3>${project.title}</h3>

          <p>${project.description}</p>

          <div class="project-tags">
            ${(project.tags || []).map(tag => `<span>${tag}</span>`).join("")}
          </div>
        </div>
      </article>
    `;

    // card lateral: leva ao centro. Card central: abre o modal.
    card.addEventListener("click", () => {
      if (dragged) return;

      const i = slides.indexOf(card);

      if (i !== active) {
        goToSlide(i);
        return;
      }

      if (!project.inDevelopment) ProjectModal.open(project);
    });

    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });

    return card;
  }

  /* ---------- navegação ---------- */

  if (nextBtn) nextBtn.addEventListener("click", () => goBy(1));
  if (prevBtn) prevBtn.addEventListener("click", () => goBy(-1));

  // teclado
  carousel.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") goBy(1);
    if (e.key === "ArrowLeft") goBy(-1);
  });

  // arrastar / deslizar
  let startX = null;
  let dragged = false;

  carousel.addEventListener("pointerdown", e => {
    startX = e.clientX;
    dragged = false;
  });

  carousel.addEventListener("pointerup", e => {
    if (startX === null) return;

    const dx = e.clientX - startX;
    startX = null;

    if (Math.abs(dx) > 50) {
      dragged = true; // impede o click que vem logo depois
      goBy(dx < 0 ? 1 : -1);
    }
  });

  carousel.addEventListener("pointercancel", () => {
    startX = null;
  });

  /* ---------- dados ---------- */

  ProjectModal.init();

  fetch("src/cards/projects/projects.json")
    .then(res => {
      if (!res.ok) throw new Error("projects.json → " + res.status);
      return res.json();
    })
    .then(data => {
      const projects = data.projects || [];
      realCount = projects.length;
      if (!realCount) return;

      // repete a lista até ter cards suficientes para o loop
      let list = [...projects];
      while (list.length < MIN_SLIDES) list = list.concat(projects);

      container.innerHTML = "";
      slides = list.map(createCard);
      slides.forEach(card => container.appendChild(card));

      active = 0;
      createDots();
      render();
    })
    .catch(err => console.error("Erro ao carregar projetos:", err));
}