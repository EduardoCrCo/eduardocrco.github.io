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
