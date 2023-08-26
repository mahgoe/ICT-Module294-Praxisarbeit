const params = new URLSearchParams(window.location.search);
const dropdownValue = params.get("service");

if (dropdownValue) {
  const selectElement = document.querySelector("select");
  selectElement.value = dropdownValue;
}
