const vinInput = document.querySelector(".vin-input");
const searchBtn = document.getElementById("search-btn");
const clearBtn = document.getElementById("clear-btn");
const testVinBtns = document.querySelectorAll(".test-vin");
const attributeToggle = document.getElementById("attribute-toggle");

function isValidVIN(vin) {
  return vin.length === 17;
}

function createDecodeLI(key, value) {
  const newLI = document.createElement("li");
  const bold = document.createElement("b");
  bold.textContent = `${key}: `;
  newLI.appendChild(bold);
  newLI.appendChild(document.createTextNode(value));
  return newLI;
}

function createVINLabel(vin) {
  const label = document.createElement("h4");
  const bold = document.createElement("b");
  bold.textContent = "VIN: ";
  label.appendChild(bold);
  label.appendChild(document.createTextNode(vin));
  return label;
}

async function getVinInfo(vin) {
  if (isValidVIN(vin)) {
    try {
      const response = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`
      );
      const { Results } = await response.json();
      return Results;
    } catch {
      alert("Server error. Please try again.");
    }
  }
}

testVinBtns.forEach((btn) =>
  btn.addEventListener("click", function (event) {
    var value = event.target.textContent;
    var inputDisabled = vinInput.getAttribute("disabled");
    if (!inputDisabled) {
      vinInput.value = value;
      vinInput.focus();
    }
  })
);

document.getElementById("all").addEventListener("click", function () {
  for (let i = 6; i < vinInfo.length; i++) {
    const item = document.getElementById(`item-${i}`);
    if (item) item.style.display = "initial";
  }
});

document.getElementById("null-only").addEventListener("click", function () {
  for (let i = 6; i < vinInfo.length; i++) {
    const item = document.getElementById(`item-${i}`);
    if (!item) continue;
    if (vinInfo[i].Value != null && vinInfo[i].Value != "Not Applicable") {
      item.style.display = "none";
    } else {
      item.style.display = "initial";
    }
  }
});

document.getElementById("not-null").addEventListener("click", function () {
  for (let i = 6; i < vinInfo.length; i++) {
    const item = document.getElementById(`item-${i}`);
    if (!item) continue;
    if (vinInfo[i].Value === null || vinInfo[i].Value === "Not Applicable") {
      item.style.display = "none";
    } else {
      item.style.display = "initial";
    }
  }
});
