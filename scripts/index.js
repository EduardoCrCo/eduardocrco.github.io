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

  // Guardar las transformaciones CSS originales
  const originalTransform = window.getComputedStyle(headerText).transform;
  const hasOriginalTransform = originalTransform && originalTransform !== 'none';

  window.addEventListener("scroll", function () {
    const scrolled = window.pageYOffset;
    const headerHeight = header.offsetHeight;

    // Solo aplicar efectos mientras el header esté visible
    if (scrolled < headerHeight) {
      // Considerar que está en el top si el scroll es muy pequeño (menos de 5 píxeles)
      if (scrolled <= 5) {
        // Restaurar valores originales cuando estamos en el top
        if (hasOriginalTransform) {
          headerText.style.transform = originalTransform; // Mantener transform CSS original
        } else {
          headerText.style.transform = ""; // Sin transform en móvil
        }
        headerText.style.opacity = "";
        header.style.backgroundSize = ""; // Restaurar CSS original
      } else {
        // Efecto parallax más sutil para el texto (menos movimiento)
        const rate = scrolled * -0.2;
        const opacity = 1 - (scrolled / headerHeight) * 3;

        // Combinar transformación original con efecto parallax
        let combinedTransform;
        if (hasOriginalTransform && originalTransform.includes('translateY')) {
          // Si ya tiene translateY, combinar con el movimiento parallax
          combinedTransform = `${originalTransform} translate3d(0, ${Math.max(rate, -50)}px, 0)`;
        } else {
          // Solo aplicar parallax
          combinedTransform = `translate3d(0, ${Math.max(rate, -50)}px, 0)`;
        }

        headerText.style.transform = combinedTransform;
        headerText.style.opacity = Math.max(opacity, 0.2);

        // Efecto zoom muy sutil en el fondo - empieza desde 100%
        const zoom = 1 + scrolled * 0.001;
        header.style.backgroundSize = `${Math.min(zoom * 100, 500)}%`;
      }
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

// Función para agregar scroll suave a todos los enlaces de navegación
function initSmoothScrolling() {
  // Seleccionar todos los enlaces de navegación
  const navLinks = document.querySelectorAll(".header__nav-link");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault(); // Prevenir comportamiento por defecto del enlace

      // Obtener el href (ej: "#projects", "#tech__stack", etc.)
      const targetId = this.getAttribute("href");

      // Buscar el elemento con ese ID
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        // Hacer scroll suave a la sección
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // Opcional: Actualizar la URL sin hacer jump
        history.pushState(null, null, targetId);
      }
    });
  });
}

// Inicializar efectos cuando se carga la página
document.addEventListener("DOMContentLoaded", function () {
  initParallaxEffect();
  initSmoothScrolling(); // Inicializar scroll suave
});
