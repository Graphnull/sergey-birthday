"use strict";

const runButton = document.getElementById("run-greeting");
const output = document.getElementById("greeting-output");
const canvas = document.getElementById("confetti");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let animationFrame = null;

function stopConfetti() {
  if (animationFrame !== null) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
  const context = canvas.getContext("2d");
  if (context) context.clearRect(0, 0, canvas.width, canvas.height);
}

function celebrate() {
  stopConfetti();
  if (reducedMotion.matches) return;
  const context = canvas.getContext("2d");
  if (!context) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  context.setTransform(scale, 0, 0, scale, 0, 0);

  const colors = ["#ff7849", "#f2f3ed", "#b6cf87", "#eaa9d4"];
  const particles = Array.from({ length: width < 600 ? 70 : 110 }, () => ({
    x: width * (0.1 + Math.random() * 0.8),
    y: -30 - Math.random() * height * 0.6,
    vx: (Math.random() - 0.5) * 130,
    vy: 100 + Math.random() * 200,
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 6,
    size: 4 + Math.random() * 5,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));
  const start = performance.now();
  let previous = start;

  function frame(now) {
    const elapsed = now - start;
    if (elapsed > 4200 || reducedMotion.matches || document.hidden) {
      stopConfetti();
      return;
    }
    const delta = Math.min((now - previous) / 1000, 0.05);
    previous = now;
    context.clearRect(0, 0, width, height);
    context.globalAlpha = Math.min(1, (4200 - elapsed) / 700);
    for (const particle of particles) {
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      particle.vy += 25 * delta;
      particle.rotation += particle.spin * delta;
      context.save();
      context.translate(particle.x, particle.y);
      context.rotate(particle.rotation);
      context.fillStyle = particle.color;
      context.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 0.6);
      context.restore();
    }
    animationFrame = requestAnimationFrame(frame);
  }
  animationFrame = requestAnimationFrame(frame);
}

runButton.addEventListener("click", () => {
  const messages = [
    ["Сергей, с днём рождения!", "output-title"],
    ["✓ Смелых идей", ""],
    ["✓ Красивых решений", ""],
    ["✓ Счастья без unwrap()", ""],
    ["Пусть всё получается. Сегодня и всегда ♥", "output-note"]
  ];
  const fragment = document.createDocumentFragment();
  for (const [message, className] of messages) {
    const paragraph = document.createElement("p");
    paragraph.textContent = message;
    if (className) paragraph.className = className;
    fragment.appendChild(paragraph);
  }
  output.replaceChildren(fragment);
  runButton.querySelector("span").textContent = "Ещё раз!";
  celebrate();
});

window.addEventListener("resize", stopConfetti);
reducedMotion.addEventListener("change", stopConfetti);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopConfetti();
});
