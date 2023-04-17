let vinInfo1, vinInfo2;

const compareBtn = document.getElementById("compare-btn");
const decodeLists = document.querySelectorAll(".decode-list");

const compareContainer1 = document.getElementById("compare-container-1");
const compareContainer2 = document.getElementById("compare-container-2");
const vinCompare1 = document.getElementById("vin-compare1");
const vinCompare2 = document.getElementById("vin-compare2");

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

  vinInput.value = "";
});

compareBtn.addEventListener("click", function () {
  if (vinInfo1 && vinInfo2) {
    decodeLists.forEach((list) => {
      const vinData = list.querySelectorAll("li");
      vinData.forEach((li) => li.parentNode.removeChild(li));
    });

    const app1 = document.createElement("h5");
    app1.appendChild(
      document.createTextNode(
        `${vinInfo1[10].Value} ${vinInfo1[7].Value} ${vinInfo1[9].Value}`
      )
    );
    vinCompare1.appendChild(app1);

    const app2 = document.createElement("h5");
    app2.appendChild(
      document.createTextNode(
        `${vinInfo2[10].Value} ${vinInfo2[7].Value} ${vinInfo2[9].Value}`
      )
    );
    vinCompare2.appendChild(app2);

    for (var i = 6; i < vinInfo1.length; i++) {
      if (vinInfo2[i].Value != vinInfo1[i].Value) {
        var dataName1 = vinInfo1[i].Variable;
        var dataInfo1 = vinInfo1[i].Value;
        var dataContainer1 = createDecodeLI(dataName1, dataInfo1);

        var dataName2 = vinInfo2[i].Variable;
        var dataInfo2 = vinInfo2[i].Value;
        var dataContainer2 = createDecodeLI(dataName2, dataInfo2);

        dataContainer1.className = "list-group-item text-danger";
        dataContainer2.className = "list-group-item text-danger";

        vinCompare1.appendChild(dataContainer1);
        vinCompare2.appendChild(dataContainer2);
      }
    }
  }
});

async function addVIN() {
  const vinValue = vinInput.value.trim();
  if (isValidVIN(vinValue)) {
    const vinStuff = await getVinInfo(vinValue);

    if (!vinInfo1) {
      vinInput.setAttribute("placeholder", "enter second vin...");
      vinCompare1.appendChild(createVINLabel(vinValue));
      vinInfo1 = vinStuff;

      for (var i = 6; i < vinStuff.length; i++) {
        const key = vinStuff[i].Variable;
        const value = vinStuff[i].Value;
        const decodeLI = createDecodeLI(key, value);

        if (value != null) {
          decodeLI.className = "list-group-item";
          decodeLI.setAttribute("id", `item1-${i}`);
          vinCompare1.appendChild(decodeLI);
        }
      }
    } else if (!vinInfo2) {
      vinInput.setAttribute("disabled", true);
      searchBtn.setAttribute("disabled", true);
      vinCompare2.appendChild(createVINLabel(vinValue));
      vinInfo2 = vinStuff;
      for (var i = 6; i < vinStuff.length; i++) {
        const key = vinStuff[i].Variable;
        const value = vinStuff[i].Value;
        const decodeLI = createDecodeLI(key, value);

        if (value != null) {
          decodeLI.className = "list-group-item";
          decodeLI.setAttribute("id", `item2-${i}`);
          vinCompare2.appendChild(decodeLI);
        }
      }
    }

    vinInput.value = "";
  }
}
