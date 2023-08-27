const params = new URLSearchParams(window.location.search);
const dropdownValue = params.get("service");

if (dropdownValue) {
  const selectElement = document.querySelector("select");
  selectElement.value = dropdownValue;
}

// Funktion, um das voraussichtliche Abholdatum basierend auf der gewählten Priorität zu setzen
function setEstimatedPickupDate(priority) {
  const today = new Date();
  let daysToAdd = 0;

  // Die Anzahl der hinzuzufügenden Tage basierend auf der Priorität
  if (priority === "low") {
    daysToAdd = 12;
  } else if (priority === "standard") {
    daysToAdd = 7;
  } else if (priority === "express") {
    daysToAdd = 5;
  }

  // Das neue Datum berechnen
  const newDate = new Date();
  newDate.setDate(today.getDate() + daysToAdd);

  // Das Datum im gewünschten Format formatieren: DD/MM/YYYY
  const formattedDate = `${String(newDate.getDate()).padStart(2, "0")}/${String(
    newDate.getMonth() + 1
  ).padStart(2, "0")}/${newDate.getFullYear()}`;

  // Das voraussichtliche Abholdatum im Textfeld setzen
  document.getElementById("calendar").value = formattedDate;
}

// Funktion, die beim Laden der Seite aufgerufen wird
window.onload = function () {
  // Das voraussichtliche Abholdatum für die Standardpriorität 'Tief' setzen
  setEstimatedPickupDate("low");

  // Event-Listener für Änderungen der Radio-Buttons hinzufügen
  document.querySelectorAll('input[name="list-radio"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      setEstimatedPickupDate(this.value);
    });
  });
};
