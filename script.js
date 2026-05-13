function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

const sections = document.querySelectorAll("section");
const navlinks = document.querySelectorAll("a[data-section]");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 190;
    const sectionHeight = section.clientHeight;

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  navlinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("data-section") === current) {
      link.classList.add("active");
    }
  });
});

//section transition
const sections2 = document.querySelectorAll(".card-principal");

const observerSection = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, {
  threshold: 0.2
});

sections2.forEach(section => {
  observerSection.observe(section);
});

// JS para Efeito de digitação

const words = [
  "UI/UX Designer. ",
  "Product Designer. "
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
  link.addEventListener("click", function () {
    links.forEach(l => l.classList.remove("active"));
    this.classList.add("active");
  });
});

// js para o toggle do tema

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

//new backkground 

const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

let particles = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

for (let i = 0; i < 60; i++) { // pouco mesmo
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    baseY: Math.random() * canvas.height,
    r: Math.random() * 2.5,
    offset: Math.random() * 500,
    speed: Math.random() * 0.002 + 0.001
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 20);
    ctx.fillStyle = "rgba(255, 102, 0, 0.6)";
    ctx.fill();

    p.y -= p.speed;

    if (p.y < 0) {
      p.y = canvas.height;
      p.x = Math.random() * canvas.width;
    }
  }

  requestAnimationFrame(draw);
}

draw();

// botão para pdf do cv

document.getElementById("downloadCV").addEventListener("click", () => {
  const link = document.createElement("a")
  link.href = "/archives/cv.pdf"
  link.download = "Diego_Oliveira_CV.pdf"
  link.click()
})


