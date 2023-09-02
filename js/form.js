function validateForm(e) {
  e.preventDefault(); // Verhindert den Standard-Submit des Formulars

  // Elemente aus dem Formular holen
  const firstName = document.getElementById("firstname");
  const lastName = document.getElementById("lastname");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");

  //Trimmen der Eingabewerte, um Leerzeichen vor hinter dem Wert zu entfernen
  firstName.value = firstName.value.trim();
  lastName.value = lastName.value.trim();
  email.value = email.value.trim();
  phone.value = phone.value.trim();

  // Event-Listener für den Fokus-Zustand hinzufügen
  function removeErrorBorderOnFocus(inputElement, ...defaultClasses) {
    inputElement.addEventListener("focus", function () {
      this.classList.remove("border-red-500"); // Entfernt den roten Rahmen
      this.classList.add(...defaultClasses); // Fügt die ursprüngliche Randfarbe hinzu
    });
  }

  removeErrorBorderOnFocus(
    firstName,
    "border-gray-300",
    "dark:border-gray-600"
  );
  removeErrorBorderOnFocus(lastName, "border-gray-300", "dark:border-gray-600");
  removeErrorBorderOnFocus(email, "border-gray-300", "dark:border-gray-600");
  removeErrorBorderOnFocus(phone, "border-gray-300", "dark:border-gray-600");

  // Validierung
  let isValid = true;

  if (!validateRequiredField(firstName) || !validateNameFormat(firstName)) {
    isValid = false;
    document.getElementById("errorMessageFirstName").innerText =
      "Bitte verwenden Sie nur Buchstaben, Leerzeichen oder Bindestriche im Vornamen. (Max-Muster/Max Muster)";
    firstName.classList.remove("border-gray-300", "dark:border-gray-600"); // Entfernt die ursprüngliche Randfarbe
    firstName.classList.add("border-red-500");
  } else {
    document.getElementById("errorMessageFirstName").innerText = "";
  }

  if (!validateRequiredField(lastName) || !validateNameFormat(lastName)) {
    isValid = false;
    document.getElementById("errorMessageLastName").innerText =
      "Bitte verwenden Sie nur Buchstaben, Leerzeichen oder Bindestriche im Nachname. (Max-Muster/Max Muster)";
    lastName.classList.remove("border-gray-300", "dark:border-gray-600"); // Entfernt die ursprüngliche Randfarbe
    lastName.classList.add("border-red-500");
  } else {
    document.getElementById("errorMessageLastName").innerText = "";
  }

  if (!validateRequiredField(email) || !validateEmailFormat(email)) {
    isValid = false;
    document.getElementById("errorMessageEmail").innerText =
      "Bitte geben Sie eine korrekte E-mail Adresse ein";
    email.classList.remove("border-gray-300", "dark:border-gray-600"); // Entfernt die ursprüngliche Randfarbe
    email.classList.add("border-red-500");
  } else {
    document.getElementById("errorMessageEmail").innerText = "";
  }

  if (!validateRequiredField(phone) || !validatePhoneNumber(phone)) {
    isValid = false;
    document.getElementById("errorMessagePhone").innerText =
      "Bitte geben Sie eine korrekte Telefonnummer ein";
    phone.classList.remove("border-gray-300", "dark:border-gray-600"); // Entfernt die ursprüngliche Randfarbe
    phone.classList.add("border-red-500");
  } else {
    document.getElementById("errorMessagePhone").innerText = "";
  }

  // Wenn alle Validierungen erfolgreich sind, dann Formular verarbeiten
  if (isValid) {
    postData(firstName.value, lastName.value, email.value);
    console.log(
      "firstName: " + firstName.value,
      "lastName: " + lastName.value,
      "email: " + email.value
    );
  }
}

// Funktionen für Validierungen und Formularverarbeitung
function validateRequiredField(field) {
  if (field.value === "") {
    field.classList.add("error");
    return false;
  } else {
    field.classList.remove("error");
    return true;
  }
}

// Funktion die nur Buchstaben und Bindestriche erlaubt
function validateNameFormat(field) {
  const namePattern = /^[a-zA-Z-][a-zA-Z-\s]*[a-zA-Z-]$/;

  if (!namePattern.test(field.value)) {
    return false;
  }
  return true;
}

function validateEmailFormat(field) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(field.value)) {
    return false;
  }
  return true;
}

function validatePhoneNumber(field) {
  const phonePattern =
    /(\b(0041|0)|\B\+41)(\s?\(0\))?(\s)?[1-9]{2}(\s)?[0-9]{3}(\s)?[0-9]{2}(\s)?[0-9]{2}\b/;
  if (!phonePattern.test(field.value)) {
    return false;
  }
  return true;
  console.log("Telefon richtig");
}

function postData(firstName, lastName, email) {
  const post = {
    name: firstName + " " + lastName,
    email: email,
    phone: document.getElementById("phone").value,
    priority: document.querySelector('input[name="list-radio"]:checked').value,
    create_date: document.getElementById("startDate").value,
    pickup_date: document.getElementById("endDate").value,
  };

  fetch("http://localhost:5000/api/registration", {
    method: "POST",
    body: JSON.stringify({
      name: post.name,
      email: post.email,
      phone: post.phone,
      priority: post.priority,
      create_date: post.create_date,
      pickup_date: post.pickup_date,
    }),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((response) => response.json())
    .then((json) => console.log(JSON.stringify(json)));
}

const params = new URLSearchParams(window.location.search);
const dropdownValue = params.get("service");

if (dropdownValue) {
  const selectElement = document.querySelector("select");
  selectElement.value = dropdownValue;
}

function setEstimatedPickupDate(priority, startDate) {
  let start = new Date(startDate);
  let daysToAdd = 0;

  if (priority === "Tief") {
    daysToAdd = 12;
  } else if (priority === "Standard") {
    daysToAdd = 7;
  } else if (priority === "Express") {
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
  if (priority === "Standard") {
    priorityCost = 5;
  } else if (priority === "Express") {
    priorityCost = 10;
  }

  const total = serviceCost + priorityCost;
  document.getElementById("total").value = `CHF ${total}.-`;
}

window.onload = function () {
  document
    .getElementById("submitForm")
    .addEventListener("submit", validateForm);

  const startDateInput = document.getElementById("startDate");
  const today = new Date();
  const formattedToday = `${String(today.getDate()).padStart(2, "0")}/${String(
    today.getMonth() + 1
  ).padStart(2, "0")}/${today.getFullYear()}`;

  startDateInput.value = formattedToday;
  setEstimatedPickupDate("Tief", today);

  document.querySelectorAll('input[name="list-radio"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      console.log("radio changed to " + this.value);
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
