const generateAffiliateLink = (vin) =>
  `http://gsadev.vincheckup.hop.clickbank.net/?item=3&exitValue=ON&landing=loading&vin=${vin}&redir_page=index`;

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

function createYMMSection(vinInfo) {
  const ymm = getYearMakeModel(vinInfo.results);
  const appContainer = document.createElement("div");
  appContainer.className = "d-flex align-items-center";
  const app = document.createElement("h5");

  if (Object.values(ymm).every((val) => val)) {
    const affiliateButton = createAffiliateLink(vinInfo.vin);
    app.textContent = `${ymm.year} ${ymm.make} ${ymm.model}`;
    app.className = "mb-0";

    appContainer.appendChild(app);
    appContainer.appendChild(affiliateButton);
  } else {
    app.textContent = "Could not find VIN data";
    app.className = "text-danger";
    appContainer.appendChild(app);
  }
  return appContainer;
}

function createAffiliateLink(vin) {
  const button = document.createElement("a");
  button.className = "btn btn-primary btn-sm text-nowrap w-auto";
  button.style.marginLeft = "10px";
  button.innerHTML = "Get VIN Report";
  button.href = generateAffiliateLink(vin);
  button.target = "_blank";
  return button;
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

  // const affiliateButton = createAffiliateLink(vin);
  // container.appendChild(affiliateButton);
  return container;
}

async function getVinInfo(vin) {
  if (isValidVIN(vin)) {
    try {
      const response = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`
      );
      const { Results } = await response.json();
      return { results: Results, vin };
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

function clearInputFeedback() {
  const feedback = document.getElementById("input-feedback");
  feedback?.remove();
}
