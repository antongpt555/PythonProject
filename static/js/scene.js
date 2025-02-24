
console.log("=== scene.js module loaded ===");

let scene, camera, renderer;
let sprites = []; // Локальный массив, затем экспортируем в window.sprites
const container = document.getElementById("random-container");
const TOTAL_SPRITES = 2500;
const SYMBOLS = "0123456789abcdefghijklmnopqrstuvwxyz";

function initScene() {
  scene = new THREE.Scene();
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(w, h);
  container.appendChild(renderer.domElement);

  // Создаем случайные спрайты
  for (let i = 0; i < TOTAL_SPRITES; i++) {
    let sp = createRandomSprite(SYMBOLS);
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
}

function createRandomSprite(symbols) {
  const canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext("2d");

  const char = symbols[Math.floor(Math.random() * symbols.length)];
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "14px Jura";
  ctx.fillStyle = Math.random() < 0.5 ? "#000" : "#ff7f00";
  ctx.fillText(char, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.1, 0.1, 0.1);
  return sprite;
}

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