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

// JS para o carousel

const container = document.getElementById("cardContainer");
const nextBtn = document.querySelector(".bi-chevron-right");
const prevBtn = document.querySelector(".bi-chevron-left");

let index = 0;

nextBtn.addEventListener("click", () => {
  const totalCards = container.children.length;
  index = (index + 1) % totalCards;
  updateCarousel();
  updateDots();
});

prevBtn.addEventListener("click", () => {
  const totalCards = container.children.length;
  index = (index - 1 + totalCards) % totalCards;
  updateCarousel();
  updateDots();
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

// js dots

const dotsContainer = document.getElementById("dots");

function createDots() {
  const totalCards = container.children.length;

  for (let i = 0; i < totalCards; i++) {
    const dot = document.createElement("span");

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

createDots();
updateDots();

// JS para Efeito de digitação

const words = [
  "UI/UX Designer. ",
  "Web Designer. "
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

//JS para o background

// const deg = (a) => Math.PI / 280 * a
// const rand = (v1, v2) => Math.floor(v1 + Math.random() * (v2 - v1))
// const opt = {
//   particles: window.width / 500 ? 12000 : 500,
//   noiseScale: 0.009,
//   angle: Math.PI / 180 * -90,
//   h1: rand(0, 360),
//   h2: rand(0, 360),
//   s1: rand(20, 90),
//   s2: rand(20, 90),
//   l1: rand(30, 80),
//   l2: rand(30, 80),
//   strokeWeight: 92,
//   tail: 12,
// }
// const Particles = []
// let time = 0
// document.body.addEventListener('click', () => {
//   opt.h1 = rand(0, 360)
//   opt.h2 = rand(0, 360)
//   opt.s1 = rand(20, 90)
//   opt.s2 = rand(20, 90)
//   opt.l1 = rand(30, 80)
//   opt.l2 = rand(30, 80)
//   opt.angle += deg(random(10, 10)) * (Math.random() > .5 ? 1 : -1)

//   for (let p of Particles) {
//     p.randomize()
//   }
// })

// class Particle {
//   constructor(x, y) {
//     this.x = x
//     this.y = y
//     this.lx = x
//     this.ly = y
//     this.vx = 0
//     this.vy = 0
//     this.ax = 0
//     this.ay = 0
//     this.hueSemen = Math.random()
//     this.hue = this.hueSemen > .5 ? 60 + opt.h1 : 40 + opt.h2
//     this.sat = this.hueSemen > .5 ? opt.s1 : opt.s2
//     this.light = this.hueSemen > .5 ? opt.l1 : opt.l2
//     this.maxSpeed = this.hueSemen > .5 ? 2 : 2
//   }

//   randomize() {
//     this.hueSemen = Math.random()
//     this.hue = this.hueSemen > .5 ? 60 + opt.h1 : 40 + opt.h2
//     this.sat = this.hueSemen > .5 ? opt.s1 : opt.s2
//     this.light = this.hueSemen > .5 ? opt.l1 : opt.l2
//     this.maxSpeed = this.hueSemen > .5 ? 2 : 2
//   }

//   update() {
//     this.follow()

//     this.vx += this.ax
//     this.vy += this.ay

//     var p = Math.sqrt(this.vx * this.vx + this.vy * this.vy)
//     var a = Math.atan2(this.vy, this.vx)
//     var m = Math.min(this.maxSpeed, p)
//     this.vx = Math.cos(a) * m
//     this.vy = Math.sin(a) * m

//     this.x += this.vx
//     this.y += this.vy
//     this.ax = 0
//     this.ay = 0

//     this.edges()
//   }

//   follow() {
//     let angle = (noise(this.x * opt.noiseScale, this.y * opt.noiseScale, time * opt.noiseScale)) * Math.PI * 0.5 + opt.angle

//     this.ax += Math.cos(angle)
//     this.ay += Math.sin(angle)

//   }

//   updatePrev() {
//     this.lx = this.x
//     this.ly = this.y
//   }

//   edges() {
//     if (this.x < 0) {
//       this.x = width
//       this.updatePrev()
//     }
//     if (this.x > width) {
//       this.x = 0
//       this.updatePrev()
//     }
//     if (this.y < 0) {
//       this.y = height
//       this.updatePrev()
//     }
//     if (this.y > height) {
//       this.y = 0
//       this.updatePrev()
//     }
//   }

//   render() {
//     stroke(`hsla(${this.hue}, ${this.sat}%, ${this.light}%, .5)`)
//     line(this.x, this.y, this.lx, this.ly)
//     this.updatePrev()
//   }
// }

// function setup() {
//   createCanvas(windowWidth, windowHeight)
//   for (let i = 0; i < opt.particles; i++) {
//     Particles.push(new Particle(Math.random() * width, Math.random() * height))
//   }
//   strokeWeight(opt.strokeWeight)
// }


// function draw() {
//   time++

//   if (document.body.classList.contains("light")) {
//     background(255)
//   } else {
//     background(0, 100 - opt.tail)
//   }

//   for (let p of Particles) {
//     p.update()
//     p.render()
//   }
// }


// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight)
// }

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


