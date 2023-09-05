function showErrorMessage(field, errorMessageId, message) {
  document.getElementById(errorMessageId).innerText = message;
  field.classList.remove("border-gray-300", "dark:border-gray-600");
  field.classList.add("border-red-500");
}

function clearErrorMessage(field, errorMessageId) {
  document.getElementById(errorMessageId).innerText = "";
  field.classList.remove("border-red-500");
  field.classList.add("border-gray-300", "dark:border-gray-600");
}

function validateForm(e) {
  e.preventDefault();

  const firstName = document.getElementById("firstname");
  const lastName = document.getElementById("lastname");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");

  // Trim für alle Felder um keine Leerzeichen zu haben
  firstName.value = firstName.value.trim();
  lastName.value = lastName.value.trim();
  email.value = email.value.trim();
  phone.value = phone.value.trim();

  // Validation
  let isValid = true;

  if (!validateRequiredField(firstName) || !validateNameFormat(firstName)) {
    isValid = false;
    showErrorMessage(
      firstName,
      "errorMessageFirstName",
      "Bitte einen gültigen Vornamen eingeben"
    );
  } else {
    clearErrorMessage(firstName, "errorMessageFirstName");
  }

  if (!validateRequiredField(lastName) || !validateNameFormat(lastName)) {
    isValid = false;
    showErrorMessage(
      lastName,
      "errorMessageLastName",
      "Bitte einen gültigen Nachnamen eingeben."
    );
  } else {
    clearErrorMessage(lastName, "errorMessageLastName");
  }

  if (!validateRequiredField(email) || !validateEmailFormat(email)) {
    isValid = false;
    showErrorMessage(
      email,
      "errorMessageEmail",
      "Bitte eine gültige E-Mail eingeben."
    );
  } else {
    clearErrorMessage(email, "errorMessageEmail");
  }

  if (!validateRequiredField(phone) || !validatePhoneNumber(phone)) {
    isValid = false;
    showErrorMessage(
      phone,
      "errorMessagePhone",
      "Bitte eine gültige Telefonnummer eingeben"
    );
  } else {
    clearErrorMessage(phone, "errorMessagePhone");
  }

  // Formular abschicken bei erfolgreicher Validierung
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
  const namePattern = /^[a-zA-ZäöüÄÖÜß]+$/;

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
    service: document.getElementById("serviceDropdown").value,
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
      service: post.service,
      create_date: post.create_date,
      pickup_date: post.pickup_date,
    }),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(JSON.stringify(json));
      window.location.href = "formconfirm.html";
    })
    .catch((error) => {
      console.log("Es gab einen Fehler", error);
      window.location.href = "formerror.html";
    });
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
