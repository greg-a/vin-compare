function isValidVIN(vin) {
  return vin.length === 17;
}

function getYearMakeModel(vinData) {
  const year = vinData.find((d) => d.Variable === "Model Year").Value;
  const make = vinData.find((d) => d.Variable === "Make").Value;
  const model = vinData.find((d) => d.Variable === "Model").Value;
  return { year, make, model };
}

function toggleLoadingSpinner(isLoading) {
  const loadingSpinner = searchBtn.querySelector("#loading-spinner");
  const btnText = searchBtn.querySelector("#btn-text");

  loadingSpinner.style.display = isLoading ? "initial" : "none";
  btnText.style.display = isLoading ? "none" : "initial";
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
  const container = document.createElement("div");
  container.className = "d-flex mb-1";

  const label = document.createElement("h4");
  label.className = "mb-0";
  const bold = document.createElement("b");
  bold.textContent = "VIN: ";
  label.appendChild(bold);
  label.appendChild(document.createTextNode(vin.toUpperCase()));
  container.appendChild(label);

  const affiliateButton = document.createElement("a");
  affiliateButton.className = "btn btn-primary btn-sm text-nowrap w-auto";
  affiliateButton.style.marginLeft = "10px";
  affiliateButton.innerHTML = "Get VIN Report";
  affiliateButton.href = generateAffiliateLink(vin);
  affiliateButton.target = "_blank";

  container.appendChild(affiliateButton);
  return container;
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
      throw alert("Server error. Please try again.");
    }
  }
}

function showVinInfo(
  vinInfo,
  container,
  predicate = (value) => value !== null
) {
  if (!vinInfo) return;
  clearVinInfo(container);
  for (let i = 6; i < vinInfo.length; i++) {
    const key = vinInfo[i].Variable;
    const value = vinInfo[i].Value;
    const decodeLI = createDecodeLI(key, value);

    if (predicate(value)) {
      decodeLI.className = "list-group-item vin-data";
      container.appendChild(decodeLI);
    }
  }
}

function clearVinInfo(...containers) {
  containers.forEach((container) => {
    const vinData = container.querySelectorAll(".vin-data");
    vinData.forEach((data) => data.parentNode.removeChild(data));
  });
}
