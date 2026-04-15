function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

const header = document.querySelector("header");

header.addEventListener("mousemove", (e) => {
    const rect = header.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    header.style.setProperty("--x", `${x}px`);
    header.style.setProperty("--y", `${y}px`);
});

const container = document.getElementById("cardContainer");
const nextBtn = document.querySelector(".bi-chevron-right");
const prevBtn = document.querySelector(".bi-chevron-left");

let index = 0;

nextBtn.addEventListener("click", () => {
    const totalCards = container.children.length;
    const visibleCards = getVisibleCards();

    if (index < totalCards - visibleCards) {
        index++;
        updateCarousel();
    }
});

prevBtn.addEventListener("click", () => {
    if (index > 0) {
        index--;
        updateCarousel();
    }
});

function getVisibleCards() {
    const containerWidth = container.parentElement.offsetWidth;
    const card = container.children[0];
    const style = window.getComputedStyle(container);
    const gap = parseInt(style.gap);

    const cardFullWidth = card.offsetWidth + gap;

    return Math.floor(containerWidth / cardFullWidth);
}

function updateCarousel() {
    const card = container.children[0];
    const style = window.getComputedStyle(container);
    const gap = parseInt(style.gap);

    const move = card.offsetWidth + gap;

    container.style.transform = `translateX(-${index * move}px)`;
}

const words = [
  "Product Designer. ",
  "UI/UX Designer. ",
  "Designer de Produtos. "
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typingElement = document.getElementById("typing");

function typeEffect() {
  const currentWord = words[wordIndex];

  if (isDeleting) {
    typingElement.textContent = currentWord.substring(0, charIndex--);
  } else {
    typingElement.textContent = currentWord.substring(0, charIndex++);
  }

  let speed = isDeleting ? 70 : 120;

  if (!isDeleting && charIndex === currentWord.length) {
    speed = 2200;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    speed = 100;
  }

  setTimeout(typeEffect, speed);
}

typeEffect();

const links = document.querySelectorAll("nav a");

links.forEach(link => {
  link.addEventListener("click", function() {
    links.forEach(l => l.classList.remove("active"));
    this.classList.add("active");
  });
});

const toggle = document.getElementById("themeToggle");
const iconWrapper = document.getElementById("iconWrapper");

const moonIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
    viewBox="0 0 24 24">
  <path d="M12 2a10 10 0 1 0 10 10c0-.3 0-.6-.05-.9a8 8 0 1 1-8.95-8.95c-.3-.05-.6-.05-1-.05z"/>
</svg>
`;

const sunIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
    stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="4"/>
  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
</svg>
`;

// estado inicial
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  iconWrapper.innerHTML = sunIcon;
} else {
  iconWrapper.innerHTML = moonIcon;
}

toggle.addEventListener("click", () => {
  document.body.classList.toggle("light");

  if (document.body.classList.contains("light")) {
    localStorage.setItem("theme", "light");
    iconWrapper.innerHTML = sunIcon;
  } else {
    localStorage.setItem("theme", "dark");
    iconWrapper.innerHTML = moonIcon;
  }
});