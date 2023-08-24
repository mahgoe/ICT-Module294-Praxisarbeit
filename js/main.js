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
