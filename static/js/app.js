console.log("=== app.js is running ===");

// ---------- Константы ----------
const HEADLINE = "neuromarket n1";
const SLOGAN = "инновационные решения для маркетинга, творчества и дома.";

// Кнопки основного меню (обратите внимание на замену "чатботы" на "чатботыы")
const BUTTON_LABELS = [
  "ии аватар",       // Было "цифровой двойник"
  "маркетинг",
  "нейрофотосессии",
  "музыка",          // Было "создание музыки"
  "автоматизация",
  "видео",
  "чатботыы"
];

// Кнопки нижнего меню (замена "о нас" на "о насс")
const BOTTOM_BUTTON_LABELS = ["контакты", "о насс"];

// Учет коэффициентов от предыдущей версии.
// Предыдущая версия (примерно):
//   HEADLINE_FONT_SIZE = 900 * 0.9 = 810
//   SLOGAN_FONT_SIZE   = 220 * 0.75 = 165
//   BUTTON_FONT_SIZE   = 170 * 0.8 = 136

// Теперь уменьшаем ещё:
//   HEADLINE: сначала на 15% => 810 * 0.85 ≈ 688.5, затем ещё на 15% => 688.5 * 0.85 ≈ 585.2
//   SLOGAN: на 20% => 165 * 0.8 = 132
//   BUTTONS: на 15% => 136 * 0.85 ≈ 115.6
const HEADLINE_FONT_SIZE = 900 * 0.9 * 0.85 * 0.85;  // ≈585.2
const SLOGAN_FONT_SIZE   = 220 * 0.75 * 0.8;           // 132
const BUTTON_FONT_SIZE   = 170 * 0.8 * 0.85;             // ≈115.6

// Глобальное смещение по оси Y для подъёма всей конструкции
const globalYOffset = 1;

// ---------- Глобальные переменные ----------
let scene, camera, renderer;
const container = document.getElementById("random-container");
const sprites = [];

// Ждём загрузки шрифта
document.fonts.ready.then(() => {
  console.log("✅ Шрифт загружен");
  init();
  animate();
});

function init() {
  console.log("=== init() function started ===");

  scene = new THREE.Scene();

  const w = container.clientWidth;
  const h = container.clientHeight;

  camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(w, h);
  container.appendChild(renderer.domElement);

  console.log("✅ Three.js scene initialized");

  // Генерируем облако случайных символов
  const total = 2500;
  const symbols = "0123456789abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < total; i++) {
    let sp = createLetterSprite(symbols);
    sp.position.set(
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 12
    );
    sp.userData.vx = (Math.random() - 0.5) * 0.02;
    sp.userData.vy = (Math.random() - 0.5) * 0.02;
    sp.userData.vz = (Math.random() - 0.5) * 0.02;
    sp.userData.isFinal = false;
    sprites.push(sp);
    scene.add(sp);
  }

  // Запускаем анимацию и трансформацию элементов
  transformAll();
}

/**
 * Создание случайного символа в виде Sprite
 */
function createLetterSprite(symbols) {
  const canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext("2d");

  const char = symbols[Math.floor(Math.random() * symbols.length)];
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "14px Jura";
  const color = Math.random() < 0.5 ? "#000" : "#ff7f00";
  ctx.fillStyle = color;
  ctx.fillText(char, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.1, 0.1, 0.1);
  return sprite;
}

/**
 * Запуск рендера/анимации
 */
function animate() {
  requestAnimationFrame(animate);
  sprites.forEach(sprite => {
    if (!sprite.userData.isFinal) {
      sprite.position.x += sprite.userData.vx;
      sprite.position.y += sprite.userData.vy;
      sprite.position.z += sprite.userData.vz;
      if (sprite.position.x < -6 || sprite.position.x > 6) sprite.userData.vx *= -1;
      if (sprite.position.y < -6 || sprite.position.y > 6) sprite.userData.vy *= -1;
      if (sprite.position.z < -6 || sprite.position.z > 6) sprite.userData.vz *= -1;
    }
  });
  renderer.render(scene, camera);
}

/**
 * Последовательно раскладываем заголовок, слоган, кнопки основного меню и нижние кнопки
 */
function transformAll() {
  // Верхняя надпись (заголовок)
  // Раньше заголовок размещался на y = globalYOffset (1), теперь опускаем его на половину этого значения → 1 - 0.5 = 0.5
  const headlineY = globalYOffset - globalYOffset / 2; // 0.5
  // Уменьшаем расстояние между буквами на 20%
  const HEADLINE_SPACING = 0.97 * 0.8; // ≈0.776
  transformText(HEADLINE, HEADLINE_FONT_SIZE, "#000", headlineY, 0, HEADLINE_SPACING, "Jura");

  // Слоган: раньше y = -1.5 + globalYOffset (-1.5 + 1 = -0.5), теперь опускаем на половину глобального подъёма → -0.5 - 0.5 = -1.0
  const sloganY = -1.5 + globalYOffset - globalYOffset / 2; // -1.0
  const SLOGAN_SPACING = 0.17;
  const startIndexSlogan = HEADLINE.length;
  transformText(SLOGAN, SLOGAN_FONT_SIZE, "#ff7f00", sloganY, startIndexSlogan, SLOGAN_SPACING, "Jura");

  // Кнопки основного меню: раньше y = 2.5 + globalYOffset (2.5 + 1 = 3.5), теперь опускаем на половину глобального подъёма → 3.5 - 0.5 = 3.0
  const topButtonsY = 2.5 + globalYOffset - globalYOffset / 2; // 3.0
  const startIndexButtons = HEADLINE.length + SLOGAN.length;
  transformButtons(startIndexButtons, topButtonsY);

  // Нижние кнопки ("контакты" и "о насс"):
  // Раньше y = -3.5, теперь поднимаем на половину глобального подъёма → -3.5 + 0.5 = -3.0
  const bottomButtonsY = -3.5 + globalYOffset / 2; // -3.0
  const usedButtonsMain = BUTTON_LABELS.reduce((acc, lbl) => acc + lbl.replace(/\s/g, "").length, 0);
  const startIndexBottomButtons = HEADLINE.length + SLOGAN.length + usedButtonsMain;
  transformBottomButtons(startIndexBottomButtons, bottomButtonsY);

  // Плавное исчезновение оставшихся спрайтов
  setTimeout(fadeOutRemaining, 2000);
}

/**
 * Универсальная функция для раскладки текста (заголовок, слоган)
 */
function transformText(
  text,
  fontSize,
  color,
  y,
  startIndex = 0,
  letterSpacing = 0.7,
  fontFamily = "Jura"
) {
  const spacing = letterSpacing;
  const totalWidth = text.length * spacing;
  const startX = -(totalWidth / 2);

  for (let i = 0; i < text.length; i++) {
    const sp = sprites[startIndex + i];
    if (!sp) {
      console.error(`Sprite not found at index ${startIndex + i} for text "${text}"`);
      continue;
    }

    sp.userData.isFinal = true;
    updateSprite(sp, text[i], true, color, fontSize, fontFamily);

    gsap.to(sp.position, {
      x: startX + i * spacing,
      y: y,
      z: 0,
      duration: 4,
      ease: "power2.out"
    });
  }
}

/**
 * Раскладываем кнопки основного меню
 */
function transformButtons(startIndex, btnY) {
  const letterFontSize = BUTTON_FONT_SIZE;
  const letterSpacing = 0.14; // межбуквенный интервал
  const gapBetweenButtons = 0.26; // промежуток между кнопками

  const buttonDescs = BUTTON_LABELS.map(lbl => lbl.split(""));

  let totalWidth = 0;
  buttonDescs.forEach(desc => {
    totalWidth += desc.length * letterSpacing;
  });
  totalWidth += (BUTTON_LABELS.length - 1) * gapBetweenButtons;

  let startX = -(totalWidth / 2);
  let currentX = startX;
  let spriteIndex = startIndex;

  for (let i = 0; i < buttonDescs.length; i++) {
    const letters = buttonDescs[i];
    const btnWidth = letters.length * letterSpacing;
    let centerX = currentX + (btnWidth / 2);

    // Дополнительный сдвиг для "видео" (если нужно)
    if (letters.join('') === "видео") {
      centerX += 0.1;
    }

    for (let c = 0; c < letters.length; c++) {
      let sp = sprites[spriteIndex++];
      if (!sp) {
        console.error(`Sprite not found at index ${spriteIndex - 1} for button "${BUTTON_LABELS[i]}"`);
        continue;
      }
      sp.userData.isFinal = true;
      updateSprite(sp, letters[c], true, "#000", letterFontSize, "Jura");

      let xPos = centerX - (btnWidth / 2) + c * letterSpacing;

      gsap.to(sp.position, {
        x: xPos,
        y: btnY,
        z: 0,
        duration: 4,
        ease: "power2.out"
      });
    }
    currentX += btnWidth + gapBetweenButtons;
  }
}

/**
 * Раскладываем нижние кнопки ("контакты", "о насс")
 * Нижние кнопки располагаются ближе к краям экрана: левая сдвигается левее, правая – правее.
 */
function transformBottomButtons(startIndex, btnY) {
  const letterFontSize = BUTTON_FONT_SIZE;
  const letterSpacing = 0.14;
  const gapBetweenButtons = 0.26;
  // Определяем дополнительное смещение для краёв
  const bottomEdgeOffset = 1.0;

  const buttonDescs = BOTTOM_BUTTON_LABELS.map(lbl => lbl.split(""));

  let totalWidth = 0;
  buttonDescs.forEach(desc => {
    totalWidth += desc.length * letterSpacing;
  });
  totalWidth += (BOTTOM_BUTTON_LABELS.length - 1) * gapBetweenButtons;

  let startX = -(totalWidth / 2);
  let currentX = startX;
  let spriteIndex = startIndex;

  for (let i = 0; i < buttonDescs.length; i++) {
    const letters = buttonDescs[i];
    const btnWidth = letters.length * letterSpacing;
    let centerX = currentX + (btnWidth / 2);

    // Сдвигаем левую кнопку левее, а правую – правее
    if (i === 0) {
      centerX -= bottomEdgeOffset;
    } else if (i === buttonDescs.length - 1) {
      centerX += bottomEdgeOffset;
    }

    for (let c = 0; c < letters.length; c++) {
      let sp = sprites[spriteIndex++];
      if (!sp) {
        console.error(`Sprite not found at index ${spriteIndex - 1} for bottom button "${BOTTOM_BUTTON_LABELS[i]}"`);
        continue;
      }
      sp.userData.isFinal = true;
      updateSprite(sp, letters[c], true, "#000", letterFontSize, "Jura");

      let xPos = centerX - (btnWidth / 2) + c * letterSpacing;

      gsap.to(sp.position, {
        x: xPos,
        y: btnY,
        z: 0,
        duration: 4,
        ease: "power2.out"
      });
    }
    currentX += btnWidth + gapBetweenButtons;
  }
}

/**
 * Плавно убираем спрайты, которые не вошли в состав текста или кнопок
 */
function fadeOutRemaining() {
  const usedHeadline = HEADLINE.length;
  const usedSlogan = SLOGAN.length;
  let usedButtons = 0;
  BUTTON_LABELS.forEach(lbl => {
    let clean = lbl.replace(/\s/g, "");
    usedButtons += clean.length;
  });
  let usedBottomButtons = 0;
  BOTTOM_BUTTON_LABELS.forEach(lbl => {
    let clean = lbl.replace(/\s/g, "");
    usedBottomButtons += clean.length;
  });

  const totalUsed = usedHeadline + usedSlogan + usedButtons + usedBottomButtons;
  for (let i = totalUsed; i < sprites.length; i++) {
    if (!sprites[i]) continue;
    gsap.to(sprites[i].material, {
      opacity: 0,
      duration: 1.5,
      ease: "power2.out"
    });
  }
}

/**
 * Универсальная перерисовка символа на canvas
 */
function updateSprite(sprite, char, final, color, fontSize, fontFamily) {
  const canvas = sprite.material.map.image;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (final) {
    const scaleFactor = fontSize / 150;
    canvas.width = fontSize * 4;
    canvas.height = fontSize * 4;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;
    // Используем единый шрифт "Jura" для всех элементов
    ctx.font = fontSize + "px " + fontFamily;
    ctx.fillText(char, canvas.width / 2, canvas.height / 2);

    sprite.scale.set(scaleFactor, scaleFactor, scaleFactor);
  } else {
    canvas.width = 16;
    canvas.height = 16;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "14px Jura";
    ctx.fillStyle = Math.random() < 0.5 ? "#000" : "#ff7f00";
    ctx.fillText(char, canvas.width / 2, canvas.height / 2);
    sprite.scale.set(0.1, 0.1, 0.1);
  }
  sprite.material.map.needsUpdate = true;
}

console.log("✅ Все упомянутые изменения (смещения, названия кнопок, позиционирование) применены!");
