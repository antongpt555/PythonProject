console.log("=== slogan.js module loaded ===");

const SLOGAN_FONT_SIZE = 220 * 0.75 * 0.8; // 132
const SLOGAN_SPACING = 0.17;
const SLOGAN_Y = -1.0;

function animateSlogan() {
  // Начинаем со спрайта, следующего за заголовком
  const startIndex = window.HEADLINE.length;
  transformText(SLOGAN, SLOGAN_FONT_SIZE, "#ff7f00", SLOGAN_Y, startIndex, SLOGAN_SPACING);
}

function transformText(text, fontSize, color, y, startIndex, letterSpacing, fontFamily = "Jura") {
  const totalWidth = text.length * letterSpacing;
  const startX = -totalWidth / 2;
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
