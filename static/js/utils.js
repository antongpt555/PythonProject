console.log("=== utils.js module loaded ===");

function fadeOutRemaining() {
  window.sprites.forEach(sprite => {
    if (!sprite.userData.isFinal) {
      gsap.to(sprite.material, {
        opacity: 0,
        duration: 1.5,
        ease: "power2.out"
      });
    }
  });
}
