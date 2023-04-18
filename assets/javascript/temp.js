let vinInfo = [];
const decodeList = document.querySelector(".decode-list");

searchBtn.addEventListener("click", function () {
  decodeVIN();
});

vinInput.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    decodeVIN();
  }
});

clearBtn.addEventListener("click", function () {
  decodeList.innerHTML = "";
  vinInput.value = "";
  attributeToggle.style.visibility = "hidden";
  vinInfo = [];
});

async function decodeVIN() {
  const vinValue = vinInput.value.trim();
  if (isValidVIN(vinValue)) {
    toggleLoadingSpinner(true);
    vinInfo = await getVinInfo(vinValue);
    decodeList.innerHTML = "";

    attributeToggle.style.visibility = "visible";
    decodeList.appendChild(createVINLabel(vinValue));
    for (var i = 5; i < vinInfo.length; i++) {
      const key = vinInfo[i].Variable;
      const value = vinInfo[i].Value;
      const decodeLI = createDecodeLI(key, value);

      if (value != null) {
        decodeLI.className = "list-group-item";
        decodeList.append(decodeLI);
        decodeLI.setAttribute("id", `item-${i}`);
      }
    }

    toggleLoadingSpinner(false);
    vinInput.value = "";
  }
}