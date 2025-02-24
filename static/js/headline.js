const HEADLINE_FONT_SIZE = 900 * 0.9 * 0.85 * 0.85; // приблизительно 585.2
const HEADLINE_SPACING = 0.97 * 0.8; // ≈0.776
const HEADLINE_Y = 0.5;

function animateHeadline() {
  // startIndex 0 – первые спрайты для заголовка
  transformText(HEADLINE, HEADLINE_FONT_SIZE, "#000", HEADLINE_Y, 0, HEADLINE_SPACING);
}

function transformText(text, fontSize, color, y, startIndex, letterSpacing, fontFamily = "Jura") {
  // Общая ширина рассчитывается как (количество символов - 1) * letterSpacing
  // Добавляем сдвиг вправо на один letterSpacing
  const totalWidth = (text.length - 1) * letterSpacing;
  const startX = -totalWidth / 2 + letterSpacing;  // сдвиг вправо на один символ
  for (let i = 0; i < text.length; i++) {
    const sp = window.sprites[startIndex + i];
    if (!sp) continue;
    sp.userData.isFinal = true;
    updateSprite(sp, text[i], true, color, fontSize, fontFamily);
    gsap.to(sp.position, {
      x: startX + i * letterSpacing,
      y: y,
      z: 0,
      duration: 4,
      ease: "power2.out"
    });
  }
}

function updateSprite(sprite, char, final, color, fontSize, fontFamily) {
  const canvas = sprite.material.map.image;
  const ctx = canvas.getContext("2d");
  if (final) {
    const scaleFactor = fontSize / 150;
    canvas.width = fontSize * 4;
    canvas.height = fontSize * 4;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillText(char, canvas.width / 2, canvas.height / 2);
    sprite.scale.set(scaleFactor, scaleFactor, scaleFactor);
  } else {
    canvas.width = 16;
    canvas.height = 16;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `14px ${fontFamily}`;
    ctx.fillStyle = Math.random() < 0.5 ? "#000" : "#ff7f00";
    ctx.fillText(char, canvas.width / 2, canvas.height / 2);
    sprite.scale.set(0.1, 0.1, 0.1);
  }
  sprite.material.map.needsUpdate = true;
}
