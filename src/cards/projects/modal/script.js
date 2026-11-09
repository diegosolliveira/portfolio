const ProjectModal = (() => {
  let modal;
  let els = {};
  let gallery = [];
  let current = 0;
  let lastFocused = null;

  function init() {
    if (modal) return; // já foi criado

    modal = document.createElement("div");
    modal.className = "project-modal hidden";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Detalhes do projeto");

    modal.innerHTML = `
      <div class="modal-box">
        <button class="close-modal" aria-label="Fechar">✕</button>

        <div class="modal-carousel">
          <button class="img-prev" aria-label="Imagem anterior">❮</button>
          <img class="modal-image" src="" alt="Projeto">
          <button class="img-next" aria-label="Próxima imagem">❯</button>
          <div class="modal-dots"></div>
        </div>

        <div class="modal-content">
          <div>
            <div class="modal-header">
              <h2 class="modal-title"></h2>
              <p class="modal-date"></p>
              <a href="" target="_blank" rel="noopener noreferrer" class="modal-site">
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                Acessar site
              </a>
            </div>

            <div class="modal-tags-infos">
              <div class="modal-infos" data-tooltip="Empresa">
                <p class="modal-client"></p>
              </div>
            </div>
          </div>

          <div>
            <h3 class="modal-context-title">Contexto</h3>
            <p class="modal-description"></p>
          </div>

          <div class="modal-container-solucao">
            <div class="modal-desafio">
              <div class="modal-info-title">
                <div class="modal-icon-triangle">
                  <img src="icons/triangle.svg" class="triangle" alt="">
                </div>
                <p class="modal-desafio-title">Desafio</p>
              </div>
              <p class="modal-desafio-description"></p>
            </div>

            <div class="modal-proposta">
              <div class="modal-info-title">
                <div class="modal-icon-bulb">
                  <img src="icons/bulb.svg" class="bulb" alt="">
                </div>
                <p class="modal-proposta-title">Solução</p>
              </div>
              <p class="modal-proposta-description"></p>
            </div>
          </div>

          <span class="modal-line"></span>

          <div>
            <h3 class="modal-context-title">Processo</h3>
            <p class="modal-process-description"></p>
          </div>

          <div>
            <h3 class="modal-context-title">Solução</h3>
            <p class="modal-solution-description"></p>
          </div>

          <span class="modal-line"></span>

          <div class="modal-footer">
            <div class="modal-tags" data-tooltip="Stack"></div>

            <button class="email modal-button" data-email="diegolvr14@gmail.com">
              Vamos conversar
              <svg class="arrow" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                  stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14"></path>
                <path d="M13 6l6 6-6 6"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    els = {
      box: modal.querySelector(".modal-box"),
      closeBtn: modal.querySelector(".close-modal"),
      image: modal.querySelector(".modal-image"),
      title: modal.querySelector(".modal-title"),
      client: modal.querySelector(".modal-client"),
      date: modal.querySelector(".modal-date"),
      site: modal.querySelector(".modal-site"),
      description: modal.querySelector(".modal-description"),
      dots: modal.querySelector(".modal-dots"),
      tags: modal.querySelector(".modal-tags"),
      desafio: modal.querySelector(".modal-desafio-description"),
      proposta: modal.querySelector(".modal-proposta-description"),
      solution: modal.querySelector(".modal-solution-description"),
      process: modal.querySelector(".modal-process-description"),
    };

    els.closeBtn.addEventListener("click", close);

    // clicar fora da caixa fecha
    modal.addEventListener("click", e => {
      if (e.target === modal) close();
    });

    modal.querySelector(".img-next").addEventListener("click", e => {
      e.stopPropagation();
      step(1);
    });

    modal.querySelector(".img-prev").addEventListener("click", e => {
      e.stopPropagation();
      step(-1);
    });

    modal.querySelector(".modal-button").addEventListener("click", e => {
      const email = e.currentTarget.dataset.email;
      window.open(
        "https://mail.google.com/mail/?view=cm&fs=1&to=" + email,
        "_blank"
      );
    });

    // atalhos de teclado (só valem com o modal aberto)
    document.addEventListener("keydown", e => {
      if (modal.classList.contains("hidden")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    });
  }

  /* ---------- galeria ---------- */

  function step(dir) {
    if (gallery.length < 2) return;
    current = (current + dir + gallery.length) % gallery.length;
    renderImage();
    renderDots();
  }

  function renderImage() {
    els.image.src = gallery[current];
  }

  function createDots() {
    els.dots.innerHTML = "";

    // com uma imagem só, os pontos não fazem sentido
    if (gallery.length < 2) return;

    gallery.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.classList.add("modal-dot");

      dot.addEventListener("click", () => {
        current = i;
        renderImage();
        renderDots();
      });

      els.dots.appendChild(dot);
    });
  }

  function renderDots() {
    [...els.dots.children].forEach((dot, i) => {
      dot.classList.toggle("active", i === current);
    });
  }

  /* ---------- abrir / fechar ---------- */

  function open(project) {
    if (!modal) init();

    lastFocused = document.activeElement;

    gallery = project.gallery && project.gallery.length
      ? project.gallery
      : [project.image];
    current = 0;

    if (project.siteUrl) {
      els.site.href = project.siteUrl;
      els.site.style.display = "inline-flex";
    } else {
      els.site.style.display = "none";
    }

    els.title.textContent = project.title;
    els.client.textContent = project.client;
    els.date.textContent = project.date;
    els.description.textContent = project.fullDescription || project.description;
    els.desafio.textContent = project.desafio;
    els.proposta.textContent = project.proposta;
    els.solution.textContent = project.solution;
    els.process.textContent = project.process;

    els.tags.innerHTML = (project.tags || [])
      .map(tag => `<span class="modal-tag">${tag}</span>`)
      .join("");

    els.image.alt = project.title;

    renderImage();
    createDots();
    renderDots();

    els.box.scrollTop = 0; // sempre abre no topo
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    els.closeBtn.focus();
  }

  function close() {
    if (!modal) return;

    modal.classList.add("hidden");
    document.body.style.overflow = "";

    // devolve o foco ao card que abriu o modal
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  return { init, open, close };
})();