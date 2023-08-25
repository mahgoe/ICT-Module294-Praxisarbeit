const dropdownButton = document.getElementById("dropdownDisplayButton");
const dropdownMenu = document.getElementById("dropdownMenu");
const hiddenSelect = document.getElementById("hiddenSelect");
const optionItems = document.querySelectorAll(".optionItem");
const params = new URLSearchParams(window.location.search);
const dropdownValue = params.get("service");

if (dropdownValue) {
  const elm = document.querySelector(`li[data-value="${dropdownValue}"]`);
  if (elm) {
    setActive(elm);
  }
}

dropdownButton.addEventListener("click", () => {
  dropdownMenu.classList.toggle("hidden");
});

optionItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    console.log(e);
    setActive(e.target);
  });
});

function setActive(target) {
  const value = target.getAttribute("data-value");
  const text = target.textContent;
  hiddenSelect.value = value;
  document.getElementById("dropdownDisplay").textContent = text;
  dropdownMenu.classList.add("hidden");
}

document.querySelector("form").addEventListener("submit", function (e) {
  if (!hiddenSelect.value || hiddenSelect.value === "") {
    e.preventDefault();
    alert("Bitte wählen Sie eine Dienstleistung aus");
  }
});
