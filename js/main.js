function main() {
  var themeToggleBtn = document.getElementById("theme-toggle");
  var themeToggleIcon = document.getElementById("theme-toggle-icon");

  function setLogo(path) {
    document.querySelectorAll(".logo").forEach((logo) => {
      logo.src = path;
    });
  }

  // Change the icons inside the button based on previous settings
  function setThemeDark() {
    if (themeToggleIcon.classList.contains("material-fill")) {
      themeToggleIcon.classList.remove("material-fill");
    }
    document.body.classList.add("dark");
    setLogo("./assets/img/logo_white.png");
  }

  function setThemeLight() {
    if (!themeToggleIcon.classList.contains("material-fill")) {
      themeToggleIcon.classList.add("material-fill");
    }
    document.body.classList.remove("dark");
    setLogo("./assets/img/logo.png");
  }

  if (
    localStorage.getItem("color-theme") === "dark" ||
    (!("color-theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    setThemeDark();
  } else {
    setThemeLight();
  }

  themeToggleBtn.addEventListener("click", function () {
    // toggle icons inside button

    // if set via local storage previously
    if (localStorage.getItem("color-theme")) {
      if (localStorage.getItem("color-theme") === "light") {
        setThemeDark();
        localStorage.setItem("color-theme", "dark");
      } else {
        setThemeLight();
        localStorage.setItem("color-theme", "light");
      }

      // if NOT set via local storage previously
    } else {
      if (document.body.classList.contains("dark")) {
        setThemeLight();
        localStorage.setItem("color-theme", "light");
      } else {
        setThemeDark();
        localStorage.setItem("color-theme", "dark");
      }
    }
  });
  handleNavbar();
  navBarFixed();
}

function setActiveNavigation(name) {
  document.querySelectorAll(`a[data-page="*"]`).forEach((elm) => {
    elm.classList.remove("active");
  });
  document.querySelector(`a[data-page="${name}"]`).classList.add("active");
}

function handleNavbar() {
  const relativePath = window.location.pathname;

  switch (relativePath) {
    case "/form.html":
      setActiveNavigation("form");
      break;

    case "/services.html":
      setActiveNavigation("services");
      break;

    case "/contact.html":
      setActiveNavigation("contact");
      break;

    default:
      setActiveNavigation("index");
      break;
  }
}

// function getWrapperHeight() {
//   // Höhe der Navigation ermitteln
//   var navHeight = document.querySelector("nav").offsetHeight;

//   var formHeight = document.getElementById("form-wrapper");
//   var servicesHeight = document.getElementById("services-wrapper");
//   setMargin("form-wrapper", navHeight);
// }

// function setMargin(name, height) {
//   document.querySelector(`[id="${name}-wrapper"]`).classList.add("mt-100");

//   formHeight.style.marginTop = navHeight + "px";
//   servicesHeight.style.marginTop = navHeight + "px";
// }
// Aufruf der Hauptfunktion, wenn das Fenster geladen wird

document.addEventListener("DOMContentLoaded", main);
