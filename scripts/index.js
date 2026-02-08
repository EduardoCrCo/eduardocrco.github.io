// Función para hacer scroll al header
function scrollToTop() {
  // Remover el hash de la URL
  if (window.location.hash) {
    history.pushState(
      null,
      null,
      window.location.pathname + window.location.search,
    );
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Efecto parallax mejorado para el header
function initParallaxEffect() {
  const header = document.querySelector(".header");
  const headerText = document.querySelector(".header__text");

  if (!header || !headerText) return;

  window.addEventListener("scroll", function () {
    const scrolled = window.pageYOffset;
    const headerHeight = header.offsetHeight;

    // Solo aplicar efectos mientras el header esté visible
    if (scrolled < headerHeight) {
      // Efecto parallax más sutil para el texto (menos movimiento)
      const rate = scrolled * -0.2; // Reducido de -0.5 a -0.2
      const opacity = 1 - (scrolled / headerHeight) * 3; // Fade más gradual

      // Aplicar transformaciones más conservadoras
      headerText.style.transform = `translate3d(0, ${Math.max(rate, -50)}px, 0)`; // Limitar movimiento
      headerText.style.opacity = Math.max(opacity, 0.2); // Mantener algo de opacidad

      // Efecto zoom muy sutil en el fondo
      const zoom = 1.25 + scrolled * 0.001; // Reducido de 0.0005 a 0.0002
      header.style.backgroundSize = `${Math.min(zoom * 100, 500)}%`; // Limitar zoom máximo
    }
  });
}

// Mostrar/ocultar el botón basado en la posición del scroll
window.addEventListener("scroll", function () {
  const backToTopButton = document.getElementById("backToTop");
  if (window.scrollY > 300) {
    backToTopButton.style.opacity = "1";
    backToTopButton.style.visibility = "visible";
  } else {
    backToTopButton.style.opacity = "0";
    backToTopButton.style.visibility = "hidden";
  }
});

// Inicializar efectos cuando se carga la página
document.addEventListener("DOMContentLoaded", function () {
  initParallaxEffect();
});
