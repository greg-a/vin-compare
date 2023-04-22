let vinInfo1, vinInfo2;

const compareBtn = document.getElementById("compare-btn");
const compareBtnLabel = document.getElementById("compare-btn-label");
const decodeLists = document.querySelectorAll(".decode-list");

const compareContainer1 = document.getElementById("compare-container-1");
const compareContainer2 = document.getElementById("compare-container-2");
const vinCompare1 = document.getElementById("vin-compare1");
const vinCompare2 = document.getElementById("vin-compare2");
const vinInput = document.querySelector(".vin-input");
const searchBtn = document.getElementById("search-btn");
const clearBtn = document.getElementById("clear-btn");
const testVinBtns = document.querySelectorAll(".test-vin");
const attributeToggle = document.getElementById("attribute-toggle");

const generateAffiliateLink = (vin) =>
  `http://gsadev.vincheckup.hop.clickbank.net/?item=3&exitValue=ON&landing=loading&vin=${vin}&redir_page=index`;

searchBtn.addEventListener("click", async function () {
  await addVIN();
});

vinInput.addEventListener("keyup", async function (event) {
  if (event.keyCode === 13) {
    addVIN();
  }
});

clearBtn.addEventListener("click", function () {
  decodeLists.forEach((list) => (list.innerHTML = ""));
  vinInfo1 = null;
  vinInfo2 = null;

  searchBtn.disabled = false;
  vinInput.disabled = false;
  vinInput.setAttribute("placeholder", "enter first vin...");
  attributeToggle.style.visibility = "hidden";
  compareBtnLabel.style.visibility = "hidden";
  document.getElementById("all").checked = true;

  vinInput.value = "";
});

async function addVIN() {
  const vinValue = vinInput.value.trim();
  if (isValidVIN(vinValue)) {
    toggleLoadingSpinner(true);
    try {
      const vinStuff = await getVinInfo(vinValue);

      if (!vinInfo1) {
        attributeToggle.style.visibility = "initial";
        vinInput.setAttribute("placeholder", "enter second vin...");
        vinCompare1.appendChild(createVINLabel(vinValue));
        vinInfo1 = vinStuff;
        const app1 = document.createElement("h5");
        const ymm1 = getYearMakeModel(vinInfo1);

        if (Object.values(ymm1).every((val) => val)) {
          app1.appendChild(
            document.createTextNode(`${ymm1.year} ${ymm1.make} ${ymm1.model}`)
          );
          vinCompare1.appendChild(app1);
        }

        showVinInfo(vinStuff, vinCompare1);
      } else if (!vinInfo2) {
        compareBtnLabel.style.visibility = "initial";
        vinInput.setAttribute("placeholder", "compare vins");
        vinInput.setAttribute("disabled", true);
        searchBtn.setAttribute("disabled", true);
        vinCompare2.appendChild(createVINLabel(vinValue));
        vinInfo2 = vinStuff;

        const app2 = document.createElement("h5");
        const ymm2 = getYearMakeModel(vinInfo2);
        if (Object.values(ymm2).every((val) => val)) {
          app2.appendChild(
            document.createTextNode(`${ymm2.year} ${ymm2.make} ${ymm2.model}`)
          );
          vinCompare2.appendChild(app2);
        }

        showVinInfo(vinStuff, vinCompare2);
      }

      toggleLoadingSpinner(false);
      vinInput.value = "";
    } catch {
      toggleLoadingSpinner(false);
    }
  }
}

testVinBtns.forEach((btn) =>
  btn.addEventListener("click", function (event) {
    const value = event.target.textContent;
    const inputDisabled = vinInput.getAttribute("disabled");
    if (!inputDisabled) {
      vinInput.value = value;
      vinInput.focus();
    }
  })
);

attributeToggle.addEventListener("click", function (event) {
  if (event.target.tagName === "INPUT") {
    switch (event.target.getAttribute("id")) {
      case "all": {
        showVinInfo(vinInfo1, vinCompare1);
        showVinInfo(vinInfo2, vinCompare2);
        break;
      }
      case "null-only": {
        showVinInfo(
          vinInfo1,
          vinCompare1,
          (value) => !value || value === "Not Applicable"
        );
        showVinInfo(
          vinInfo2,
          vinCompare2,
          (value) => !value || value === "Not Applicable"
        );
        break;
      }
      case "not-null": {
        showVinInfo(
          vinInfo1,
          vinCompare1,
          (value) => value && value !== "Not Applicable"
        );
        showVinInfo(
          vinInfo2,
          vinCompare2,
          (value) => value && value !== "Not Applicable"
        );
        break;
      }
      case "compare-btn": {
        if (vinInfo1 && vinInfo2) {
          clearVinInfo(...decodeLists);

          for (let i = 6; i < vinInfo1.length; i++) {
            if (vinInfo2[i].Value !== vinInfo1[i].Value) {
              const key1 = vinInfo1[i].Variable;
              const value1 = vinInfo1[i].Value;
              const vinInfoLI1 = createDecodeLI(key1, value1);

              const key2 = vinInfo2[i].Variable;
              const value2 = vinInfo2[i].Value;
              const vinInfoLI2 = createDecodeLI(key2, value2);

              vinInfoLI1.className = "list-group-item text-danger vin-data";
              vinInfoLI2.className = "list-group-item text-danger vin-data";

              vinCompare1.appendChild(vinInfoLI1);
              vinCompare2.appendChild(vinInfoLI2);
            }
          }
        }
        break;
      }
      default:
        break;
    }
  }
});
