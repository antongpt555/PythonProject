console.log("=== app.js is running ===");

document.fonts.ready.then(() => {
  // Инициализация сцены и запуск рендер-цикла (функции определены в scene.js)
  initScene();
  animate();

  // Устанавливаем глобальные константы для использования в модулях
  window.HEADLINE = " neuromarket n1";
  window.SLOGAN = "инновационные решения для маркетинга, творчества и дома.";

  // Экспортируем массив спрайтов для доступа из других модулей
  window.sprites = sprites;

  // Задержка для гарантии, что все спрайты созданы
  setTimeout(() => {
    if (typeof animateHeadline === "function") animateHeadline();
    if (typeof animateSlogan === "function") animateSlogan();
    if (typeof animateButtons === "function") animateButtons();

    // Через 2.5 секунды запускаем fade-out оставшихся случайных букв
    setTimeout(() => {
      if (typeof fadeOutRemaining === "function") fadeOutRemaining();
    }, 2500);
  }, 300);
});
