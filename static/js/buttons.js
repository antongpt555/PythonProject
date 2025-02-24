console.log("=== buttons.js module loaded ===");

// Оставляем названия кнопок такими же, как у вас были
const BUTTON_LABELS = [
  "ии аватар",  // с пробелом после "ии"
  "маркетинг",
  "нейрофотосессии",
  "музыка",
  "автоматизация",
  "видео",
  "чатботы"
];
const BOTTOM_BUTTON_LABELS = [
  "контакты",
  "о нас"       // с пробелом между "о" и "нас"
];

// Параметры кнопок
const BUTTON_FONT_SIZE = 170 * 0.8 * 0.85; // ~115.6
const BUTTON_LETTER_SPACING = 0.14;
const BUTTON_GAP = 0.26;
const TOP_BUTTONS_Y = 3.0;
const BOTTOM_BUTTONS_Y = -3.0;

function animateButtons() {
  const headlineLen = window.HEADLINE.length;
  const sloganLen = window.SLOGAN.length;

  // Верхние кнопки идут сразу после букв заголовка + слогана
  const topButtonsStartIndex = headlineLen + sloganLen;
  transformButtonGroup(
    BUTTON_LABELS,
    topButtonsStartIndex,
    TOP_BUTTONS_Y,
    BUTTON_LETTER_SPACING,
    BUTTON_GAP,
    BUTTON_FONT_SIZE
  );

  // Подсчитываем, сколько букв ушло на верхние кнопки
  const topButtonsLetters = BUTTON_LABELS.reduce((sum, lbl) => sum + lbl.length, 0);
  const bottomButtonsStartIndex = topButtonsStartIndex + topButtonsLetters;

  // Для нижних кнопок был «сдвиг» крайних кнопок, пока оставим как есть
  function offsetCallback(i, total) {
    const bottomEdgeOffset = 1.0;
    if (i === 0) return -bottomEdgeOffset;
    if (i === total - 1) return bottomEdgeOffset;
    return 0;
  }

  transformButtonGroup(
    BOTTOM_BUTTON_LABELS,
    bottomButtonsStartIndex,
    BOTTOM_BUTTONS_Y,
    BUTTON_LETTER_SPACING,
    BUTTON_GAP,
    BUTTON_FONT_SIZE,
    offsetCallback
  );
}

/**
 * Раскладываем каждую группу кнопок (массив строк) по горизонтали, центрируя их в целом.
 * labels — массив строк (каждая строка — подпись кнопки),
 * startIndex — с какого спрайта начинаем брать буквы,
 * y — координата по вертикали, где будет «линия» кнопок,
 * letterSpacing — расстояние между буквами в одной кнопке,
 * gapBetween — расстояние между самими кнопками,
 * fontSize — итоговый размер шрифта,
 * offsetCallback — необязательная функция, которая может чуть сдвигать кнопку влево/вправо.
 */
function transformButtonGroup(labels, startIndex, y, letterSpacing, gapBetween, fontSize, offsetCallback) {
  // Главное исправление: trim(), чтобы убрать лишние пробелы в начале/конце названий
  const lettersArr = labels.map(label => label.trim().split(""));

  // Вычисляем «ширину» каждой кнопки
  const buttonWidths = lettersArr.map(letters => letters.length * letterSpacing);
  // Общая ширина всего ряда кнопок + промежутки между кнопками
  const totalWidth = buttonWidths.reduce((sum, w) => sum + w, 0) + (labels.length - 1) * gapBetween;

  // Начинаем выкладку слева, чтобы весь ряд оказался по центру (т. е. центр = 0)
  let currentX = -totalWidth / 2;
  let spriteIndex = startIndex;

  // Перебираем кнопки по очереди
  for (let i = 0; i < lettersArr.length; i++) {
    const letters = lettersArr[i];
    // Ширина конкретной кнопки (по буквам)
    const btnWidth = letters.length * letterSpacing;
    // Центр текущей кнопки
    let centerX = currentX + btnWidth / 2;

    // Если есть функция offsetCallback, можем подвинуть кнопку
    if (offsetCallback && typeof offsetCallback === "function") {
      centerX += offsetCallback(i, lettersArr.length);
    }

    // Раскладываем каждую букву кнопки
    for (let j = 0; j < letters.length; j++) {
      const sp = window.sprites[spriteIndex++];
      if (!sp) continue;
      sp.userData.isFinal = true;

      // Превращаем спрайт в букву нужного размера
      updateSprite(sp, letters[j], true, "#000", fontSize, "Jura");

      // Вычисляем окончательную X-позицию буквы
      const xPos = centerX - btnWidth / 2 + j * letterSpacing;

      // Анимация «прилёта» буквы на место
      gsap.to(sp.position, {
        x: xPos,
        y: y,
        z: 0,
        duration: 4,
        ease: "power2.out"
      });
    }

    // Смещаем «текущую точку» на ширину кнопки + зазор
    currentX += btnWidth + gapBetween;
  }
}

// Функция для перерисовки спрайта (из utils-логики)
function updateSprite(sp, char, final, color, fontSize, fontFamily) {
  const canvas = sp.material.map.image;
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
    sp.scale.set(scaleFactor, scaleFactor, scaleFactor);
  } else {
    canvas.width = 16;
    canvas.height = 16;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `14px ${fontFamily}`;
    ctx.fillStyle = Math.random() < 0.5 ? "#000" : "#ff7f00";
    ctx.fillText(char, canvas.width / 2, canvas.height / 2);
    sp.scale.set(0.1, 0.1, 0.1);
  }
  sp.material.map.needsUpdate = true;
}
