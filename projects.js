const projectsContainer = document.getElementById("cardContainer");
const dotsContainer = document.getElementById("dots");

const nextBtn = document.querySelector(".bi-chevron-right");
const prevBtn = document.querySelector(".bi-chevron-left");

let index = 0;

let modal;
let modalImage;
let modalTitle;
let modalClient;
let modalDate;
let modalDescription;
let modalTags;
let modalDots;

let currentGallery = [];
let currentImage = 0;

function createModal() {
  modal = document.createElement("div");
  modal.className = "project-modal hidden";

  modal.innerHTML = `
    <div class="modal-box">
      <button class="close-modal">✕</button>

      <div class="modal-carousel">
        <button class="img-prev">❮</button>
        <img class="modal-image" src="" alt="Projeto">
        <button class="img-next">❯</button>
        <div class="modal-dots"></div>
      </div>

      <div class="modal-content">
      
        <div class="modal-header">
          <h2 class="modal-title"></h2>
          <p class="modal-date"></p>
        </div>
        
        <div class="modal-tags-infos">
          <div class="modal-infos" data-tooltip="Empresa">
            <p class="modal-client"></p>
          </div>
        </div>

        <p class="modal-description"></p>

        <span class="modal-line"></span>

        <div class="modal-container-solucao">
          <div class="modal-desafio">
            <div class="modal-info-title">
              <div class="modal-icon-triangle">
                <img src="/icons/triangle.svg" class="triangle" alt="Desafio">
              </div>
              <p class="modal-desafio-title">Desafio</p>
            </div>
          </div>
          
          <div class="modal-proposta">
            <div class="modal-info-title">
              <div class="modal-icon-bulb">
                <img src="/icons/bulb.svg" class="bulb" alt="Solução">
              </div>
              <p class="modal-proposta-title">Solução</p>
            </div>
          </div>
        </div>

        <div class="modal-tags" data-tooltip="Stack"></div>
      </div>

      
    </div>
  `;

  document.body.appendChild(modal);

  modalImage = modal.querySelector(".modal-image");
  modalTitle = modal.querySelector(".modal-title");
  modalClient = modal.querySelector(".modal-client");
  modalDate = modal.querySelector(".modal-date");
  modalDescription = modal.querySelector(".modal-description");
  modalDots = modal.querySelector(".modal-dots");
  modalTags = modal.querySelector(".modal-tags");

  const closeBtn = modal.querySelector(".close-modal");
  const nextImg = modal.querySelector(".img-next");
  const prevImg = modal.querySelector(".img-prev");

  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  nextImg.addEventListener("click", (e) => {
    e.stopPropagation();

    if (!currentGallery.length) return;

    currentImage = (currentImage + 1) % currentGallery.length;
    updateModalImage();
    updateModalDots();
  });

  prevImg.addEventListener("click", (e) => {
    e.stopPropagation();

    if (!currentGallery.length) return;

    currentImage =
      (currentImage - 1 + currentGallery.length) % currentGallery.length;

    updateModalImage();
    updateModalDots();
  });
}

function openModal(project) {
  currentGallery =
    project.gallery && project.gallery.length
      ? project.gallery
      : [project.image];

  currentImage = 0;

  modalTitle.textContent = project.title;
  modalClient.textContent = project.client;
  modalDate.textContent = project.date;
  modalDescription.textContent =
    project.fullDescription || project.description;

  modalTags.innerHTML = project.tags
    .map(tag => `<span class="modal-tag">${tag}</span>`)
    .join("");

  updateModalImage();
  createModalDots();
  updateModalDots();

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "auto";
}

function updateModalImage() {
  modalImage.src = currentGallery[currentImage];
}

function createModalDots() {
  modalDots.innerHTML = "";

  currentGallery.forEach((_, i) => {
    const dot = document.createElement("span");

    dot.classList.add("modal-dot");

    if (i === currentImage) {
      dot.classList.add("active");
    }

    dot.addEventListener("click", () => {
      currentImage = i;
      updateModalImage();
      updateModalDots();
    });

    modalDots.appendChild(dot);
  });
}

function updateModalDots() {
  const dots = modalDots.children;

  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.toggle("active", i === currentImage);
  }
}

nextBtn.addEventListener("click", () => {
  const total = projectsContainer.children.length;
  index = (index + 1) % total;
  updateCarousel();
  updateDots();
});

prevBtn.addEventListener("click", () => {
  const total = projectsContainer.children.length;
  index = (index - 1 + total) % total;
  updateCarousel();
  updateDots();
});

function updateCarousel() {
  const card = projectsContainer.children[0];
  if (!card) return;

  const style = window.getComputedStyle(projectsContainer);
  const gap = parseInt(style.gap) || 0;

  const move = card.offsetWidth + gap;

  projectsContainer.style.transform = `translateX(-${index * move}px)`;
}

function createDots(total) {
  dotsContainer.innerHTML = "";

  for (let i = 0; i < total; i++) {
    const dot = document.createElement("span");
    dot.classList.add("dot");

    dot.addEventListener("click", () => {
      index = i;
      updateCarousel();
      updateDots();
    });

    dotsContainer.appendChild(dot);
  }
}

function updateDots() {
  const dots = dotsContainer.children;

  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.toggle("active", i === index);
  }
}

createModal();

fetch("projects.json")
  .then(res => res.json())
  .then(data => {
    console.log("projects:", data.projects.length);

    projectsContainer.innerHTML = "";

    data.projects.forEach(project => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <img src="${project.image}" alt="${project.title}">
        <div class="card-conteudo">
          <div class="project-infos">
            <div class="div-title-client">
              <div class="project-header">
                <h3>${project.title}</h3>
                <span class="project-date">${project.date}</span>
              </div>
              <div class="project-details">
                <span class="project-client">${project.client}</span>
              </div>
            </div>
          </div>

          <p>${project.description}</p>

          <div class="div-infos">
            ${project.tags
          .map(tag => `<p class="p-infos">${tag}</p>`)
          .join("")}
          </div>
        </div>
      `;

      card.style.cursor = "pointer";

      card.addEventListener("click", () => {
        openModal(project);
      });

      projectsContainer.appendChild(card);
    });

    createDots(data.projects.length);
    updateDots();
    updateCarousel();
  })
  .catch(err => console.error("Erro no JSON:", err));