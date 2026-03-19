// Función para hacer scroll al header
function scrollToTop() {
  // Remover el hash de la URL de manera más segura para GitHub Pages
  try {
    if (window.location.hash) {
      history.replaceState(
        null,
        null,
        window.location.pathname + window.location.search,
      );
    }
  } catch (e) {
    // Fallback si hay problemas con history API en GitHub Pages
    console.log("History API not available");
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
  const hasOriginalTransform =
    originalTransform && originalTransform !== "none";

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
        if (hasOriginalTransform && originalTransform.includes("translateY")) {
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

// Mostrar/ocultar el botón basado en la posición del scroll (compatible con GitHub Pages)
window.addEventListener("scroll", function () {
  const backToTopButton = document.getElementById("backToTop");
  if (backToTopButton) {
    // Verificar que el elemento existe
    if (window.scrollY > 300) {
      backToTopButton.style.opacity = "1";
      backToTopButton.style.visibility = "visible";
    } else {
      backToTopButton.style.opacity = "0";
      backToTopButton.style.visibility = "hidden";
    }
  }
});

// Función para agregar scroll suave a todos los enlaces de navegación (compatible con GitHub Pages)
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
        // Calcular la posición del elemento
        const targetPosition =
          targetSection.getBoundingClientRect().top + window.pageYOffset;

        // Verificar si el navegador soporta smooth scrolling
        if ("scrollBehavior" in document.documentElement.style) {
          // Usar scrollIntoView si está soportado
          targetSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        } else {
          // Fallback: scroll manual suave para navegadores que no lo soporten
          smoothScrollTo(targetPosition, 800);
        }

        // Actualizar la URL de manera más segura para GitHub Pages
        try {
          if (history.replaceState) {
            history.replaceState(null, null, targetId);
          } else {
            window.location.hash = targetId;
          }
        } catch (e) {
          // Si falla, al menos intentar cambiar el hash
          window.location.hash = targetId;
        }
      }
    });
  });
}

// Función de fallback para smooth scroll manual
function smoothScrollTo(targetPosition, duration) {
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

// Inicializar carrusel infinito real
function initCarousel() {
  let currentSlide = 1; // Empezar en el primer slide real (índice 1)
  const totalSlides = 7; // Número de slides originales
  const indicators = document.querySelectorAll(".indicator");
  const track = document.querySelector(".carousel-track");

  if (!track || indicators.length === 0) return;

  function updateCarousel(withTransition = true) {
    // Posición basada en el índice actual del slide
    const translateX = -(currentSlide * 11.111); // 100% / 9 slides = 11.111%

    if (!withTransition) {
      track.classList.add("no-animation");
    } else {
      track.classList.remove("no-animation");
    }

    track.style.transform = `translateX(${translateX}%)`;

    if (!withTransition) {
      // Forzar repaint del navegador
      track.offsetHeight;
    }

    // Actualizar indicadores (convertir índice real a lógico)
    const logicalSlide =
      currentSlide === 0
        ? totalSlides - 1
        : currentSlide === totalSlides + 1
          ? 0
          : currentSlide - 1;
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === logicalSlide);
    });
  }

  function nextSlide() {
    currentSlide++;
    updateCarousel(true);

    // Verificar si llegamos al slide clonado del final
    if (currentSlide === totalSlides + 1) {
      // Posición 8 (el clone del final)
      // Después de que la animación termine, saltar al slide real idéntico
      setTimeout(() => {
        currentSlide = 1; // Primer slide real
        updateCarousel(false);
      }, 800); // Coincide con la duración de la transición CSS
    }
  }

  function prevSlide() {
    currentSlide--;
    updateCarousel(true);

    // Verificar si llegamos al slide clonado del inicio
    if (currentSlide === 0) {
      setTimeout(() => {
        currentSlide = totalSlides; // Último slide real (posición 7)
        updateCarousel(false);
      }, 800);
    }
  }

  function goToSlide(slideIndex) {
    // Convertir índice lógico (0-6) a índice real (1-7)
    currentSlide = slideIndex + 1;
    updateCarousel(true);
  }

  // Auto-deslizar cada 4 segundos
  let autoSlideInterval = setInterval(nextSlide, 4000);

  // Manejar clics en indicadores
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      goToSlide(index);

      // Reiniciar el auto-deslizar
      clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(nextSlide, 4000);
    });
  });

  // Pausar auto-deslizar cuando el mouse está sobre el carrusel
  const carouselContainer = document.querySelector(".carousel-container");
  if (carouselContainer) {
    carouselContainer.addEventListener("mouseenter", () => {
      clearInterval(autoSlideInterval);
    });

    carouselContainer.addEventListener("mouseleave", () => {
      autoSlideInterval = setInterval(nextSlide, 4000);
    });
  }

  // Agregar soporte para navegación con flechas del teclado
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      nextSlide();
      clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(nextSlide, 4000);
    } else if (e.key === "ArrowLeft") {
      prevSlide();
      clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(nextSlide, 4000);
    }
  });

  // Inicializar en el primer slide real sin transición
  updateCarousel(false);
}

// Inicializar efectos cuando se carga la página (compatible con GitHub Pages)
document.addEventListener("DOMContentLoaded", function () {
  // Pequeño delay para asegurar que todos los elementos estén cargados en GitHub Pages
  setTimeout(function () {
    initParallaxEffect();
    initSmoothScrolling();
    initCarousel();

    // Debug para GitHub Pages - verificar que los elementos existan
    console.log(
      "Navigation links found:",
      document.querySelectorAll(".header__nav-link").length,
    );
    console.log("Sections found:", {
      projects: !!document.querySelector("#projects"),
      techStack: !!document.querySelector("#tech__stack"),
      aboutMe: !!document.querySelector("#about__me"),
      contact: !!document.querySelector("#contact"),
    });
  }, 100);
});
