const params = new URLSearchParams(window.location.search);
const dropdownValue = params.get("service");

if (dropdownValue) {
  const selectElement = document.querySelector("select");
  selectElement.value = dropdownValue;
}

function setEstimatedPickupDate(priority, startDate) {
  let start = new Date(startDate);
  let daysToAdd = 0;

  if (priority === "low") {
    daysToAdd = 12;
  } else if (priority === "standard") {
    daysToAdd = 7;
  } else if (priority === "express") {
    daysToAdd = 5;
  }

  const newDate = new Date(start);
  newDate.setDate(start.getDate() + daysToAdd);

  const formattedDate = `${String(newDate.getDate()).padStart(2, "0")}/${String(
    newDate.getMonth() + 1
  ).padStart(2, "0")}/${newDate.getFullYear()}`;

  document.getElementById("endDate").value = formattedDate;
}

function calculateTotal() {
  let serviceCost = 0;
  let priorityCost = 0;

  const serviceOption = document.querySelector("select").value;
  if (serviceOption === "kleinerService") {
    serviceCost = 49;
  } else if (serviceOption === "grosserService") {
    serviceCost = 69;
  } else if (serviceOption === "rennskiService") {
    serviceCost = 99;
  } else if (serviceOption === "bindung") {
    serviceCost = 39;
  } else if (serviceOption === "fell") {
    serviceCost = 25;
  } else if (serviceOption === "heisswachsen") {
    serviceCost = 18;
  }
  // ... (weitere Optionen)

  const priority = document.querySelector(
    'input[name="list-radio"]:checked'
  ).value;
  if (priority === "standard") {
    priorityCost = 5;
  } else if (priority === "express") {
    priorityCost = 10;
  }

  const total = serviceCost + priorityCost;
  document.getElementById("total").value = `CHF ${total}.-`;
}

window.onload = function () {
  const startDateInput = document.getElementById("startDate");
  const today = new Date();
  const formattedToday = `${String(today.getDate()).padStart(2, "0")}/${String(
    today.getMonth() + 1
  ).padStart(2, "0")}/${today.getFullYear()}`;

  startDateInput.value = formattedToday;
  setEstimatedPickupDate("low", today);

  document.querySelectorAll('input[name="list-radio"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      const startDateValue = startDateInput.value.split("/");
      const startDate = new Date(
        `${startDateValue[2]}-${startDateValue[1]}-${startDateValue[0]}`
      );
      setEstimatedPickupDate(this.value, startDate);
      calculateTotal();
    });
  });

  startDateInput.addEventListener("change", function () {
    const selectedDateValue = this.value.split("/");
    const selectedDate = new Date(
      `${selectedDateValue[2]}-${selectedDateValue[1]}-${selectedDateValue[0]}`
    );
    const priority = document.querySelector(
      'input[name="list-radio"]:checked'
    ).value;
    setEstimatedPickupDate(priority, selectedDate);
  });

  // Event-Listener für Änderungen an der Service-Dropdown-Auswahl
  document.querySelector("select").addEventListener("change", function () {
    calculateTotal();
  });

  // Startwert für den Gesamtbetrag setzen
  calculateTotal();
};

let lastKnownStartDate = "";

setInterval(() => {
  const startDateInput = document.getElementById("startDate");
  const currentStartDate = startDateInput.value;

  if (currentStartDate !== lastKnownStartDate) {
    lastKnownStartDate = currentStartDate;

    const startDateValue = currentStartDate.split("/");
    const startDate = new Date(
      `${startDateValue[2]}-${startDateValue[1]}-${startDateValue[0]}`
    );
    const priority = document.querySelector(
      'input[name="list-radio"]:checked'
    ).value;

    setEstimatedPickupDate(priority, startDate);
  }
}, 500); // alle 500 Millisekunden
