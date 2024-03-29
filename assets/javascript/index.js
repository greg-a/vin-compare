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

searchBtn.addEventListener("click", async function () {
  await addVIN();
});

vinInput.addEventListener("keyup", async function (event) {
  clearInputFeedback();
  if (event.keyCode === 13) {
    addVIN();
  }
});

clearBtn.addEventListener("click", function () {
  clearInputFeedback();
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
  clearInputFeedback();
  const vinValue = vinInput.value.trim();
  if (isValidVIN(vinValue)) {
    toggleLoadingSpinner(true);
    try {
      const vinInfo = await getVinInfo(vinValue);
      const ymm = createYMMSection(vinInfo);
      const vinLabel = createVINLabel(vinValue);

      if (!vinInfo1) {
        attributeToggle.style.visibility = "initial";
        vinInput.setAttribute("placeholder", "enter second vin...");
        vinCompare1.appendChild(vinLabel);
        vinInfo1 = vinInfo.results;

        vinCompare1.appendChild(ymm);

        showVinInfo(vinInfo.results, vinCompare1);
      } else if (!vinInfo2) {
        compareBtnLabel.style.visibility = "initial";
        vinInput.setAttribute("placeholder", "compare vins");
        vinInput.setAttribute("disabled", true);
        searchBtn.setAttribute("disabled", true);
        vinCompare2.appendChild(vinLabel);
        vinInfo2 = vinInfo.results;

        vinCompare2.appendChild(ymm);

        showVinInfo(vinInfo.results, vinCompare2);
      }

      toggleLoadingSpinner(false);
      vinInput.value = "";
    } catch {
      toggleLoadingSpinner(false);
    }
  } else {
    const inputContainer = document.getElementById("input-container");
    const inputFeedback = document.createElement("small");
    inputFeedback.className = "text-danger";
    inputFeedback.id = "input-feedback";
    inputFeedback.textContent = "Invalid VIN";
    inputContainer.appendChild(inputFeedback);
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
