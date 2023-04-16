var vinCompare1 = false;
var vinCompare2 = false;
var vinInfo1;
var vinInfo2;
var vinInput1;
var vinInput2;

$("#add-compare").on("click", function () {
  addVIN();
});

$(".form-compare").on("keyup", function (event) {
  if (event.keyCode === 13) {
    addVIN();
  }
});

$("#compare-clear").on("click", function () {
  $(".compare").empty();
  vinInfo1 = null;
  vinInfo2 = null;
  vinCompare1 = false;
  vinCompare2 = false;
});

$("#compare").on("click", function () {
  if (vinCompare1 === true && vinCompare2 === true) {
    $(".compare").empty();

    for (var i = 6; i < vinInfo1.length; i++) {
      if (vinInfo2[i].Value != vinInfo1[i].Value) {
        var dataName1 = vinInfo1[i].Variable;
        var dataInfo1 = vinInfo1[i].Value;
        var dataContainer1 = $(
          "<li class='text-danger'><b>" +
            dataName1 +
            ":</b> " +
            dataInfo1 +
            "</li>"
        );
        var dataName2 = vinInfo2[i].Variable;
        var dataInfo2 = vinInfo2[i].Value;
        var dataContainer2 = $(
          "<li class='text-danger'><b>" +
            dataName2 +
            ":</b> " +
            dataInfo2 +
            "</li>"
        );

        dataContainer1.addClass("list-group-item");
        $("#vin-compare1").append(dataContainer1);
        dataContainer2.addClass("list-group-item");
        $("#vin-compare2").append(dataContainer2);
      }
    }
    $("#vin-compare1").prepend(
      "<h5><b>App: </b>" +
        vinInfo1[9].Value +
        " " +
        vinInfo1[6].Value +
        " " +
        vinInfo1[8].Value +
        "</h5>"
    );
    $("#vin-compare1").prepend(vinInput1);
    $("#vin-compare2").prepend(
      "<h5><b>App: </b>" +
        vinInfo2[9].Value +
        " " +
        vinInfo2[6].Value +
        " " +
        vinInfo2[8].Value +
        "</h5>"
    );
    $("#vin-compare2").prepend(vinInput2);
  }
});

$("#compare-clear").on("click", function () {
  var vinInput = $(".form-compare");
  $(".compare-container1").html(
    "<ul class='list-group list-group-flush compare' id='vin-compare1'></ul>"
  );
  $("#add-compare").prop("disabled", false);
  vinInput.attr("placeholder", "enter first vin...");
  vinInput.prop("disabled", false);
  vinInput.val("");
  vinCompare1 = false;
  vinCompare2 = false;
  vinInfo1;
  vinInfo2;
  vinInput1;
  vinInput2;
});

$(document).on("click", "#not", function () {
  for (var i = 6; i < vinInfo1.length; i++) {
    if (vinInfo1[i].Value === null || vinInfo1[i].Value === "Not Applicable") {
      $("#item-" + i).css("display", "none");
    } else {
      $("#item-" + i).css("display", "initial");
    }
  }
  for (var i = 6; i < vinInfo2.length; i++) {
    if (vinInfo2[i].Value === null || vinInfo2[i].Value === "Not Applicable") {
      $("#item2-" + i).css("display", "none");
    } else {
      $("#item2-" + i).css("display", "initial");
    }
  }
});

$(document).on("click", "#null", function () {
  for (var i = 6; i < vinInfo1.length; i++) {
    if (vinInfo1[i].Value != null && vinInfo1[i].Value != "Not Applicable") {
      $("#item-" + i).css("display", "none");
    } else {
      $("#item-" + i).css("display", "initial");
    }
  }
  for (var i = 6; i < vinInfo2.length; i++) {
    if (vinInfo2[i].Value != null && vinInfo2[i].Value != "Not Applicable") {
      $("#item2-" + i).css("display", "none");
    } else {
      $("#item2-" + i).css("display", "initial");
    }
  }
});

$(document).on("click", "#all", function () {
  for (var i = 6; i < vinInfo1.length; i++) {
    $("#item-" + i).css("display", "initial");
    $("#item2-" + i).css("display", "initial");
  }
});

$(document).on("click", ".test-vin", function (event) {
  var value = event.target.textContent;
  var vinInput = $(".form-compare");
  var inputDisabled = vinInput.prop("disabled");
  if (!inputDisabled) {
    vinInput.val(value);
    vinInput.focus();
  }
});

function isValidVIN(vin) {
  return vin.length === 17;
}

function addVIN() {
  var vinInput = $(".form-compare");
  var vinValue = vinInput.val().trim();
  if (isValidVIN(vinValue)) {
    var queryURL =
      "https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/" +
      vinValue +
      "?format=json";
    $(".decode-list").empty();

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      var vinStuff = response.Results;

      if (vinCompare1 === false) {
        vinInput.attr("placeholder", "enter second vin...");
        vinInput1 = $("<h4><b>VIN: </b>" + vinValue.toUpperCase() + "</h4>");
        vinInfo1 = vinStuff;

        for (var i = 6; i < vinStuff.length; i++) {
          var dataName = vinStuff[i].Variable;
          var dataInfo = vinStuff[i].Value;
          var dataContainer = $(
            "<li><b>" + dataName + ":</b> " + dataInfo + "</li>"
          );
          var toggle = $(
            "<div class='switch-toggle switch-3 switch-candy'><input id='not' name='state-d' type='radio' checked='' /><label for='not' id='not-null'>Not Null</label><input id='all' name='state-d' type='radio' checked='checked' /><label for='all' class='disabled'>All</label><input id='null' name='state-d' type='radio' /><label for='null' id='null-only'>Null</label></div>"
          );

          dataContainer.addClass("list-group-item");
          dataContainer.attr("id", "item-" + i);
          $("#vin-compare1").append(dataContainer);
        }
        $("#vin-compare1").prepend(vinInput1);
        $(".compare-container1").prepend(toggle);
        vinCompare1 = true;
      } else if (vinCompare2 === false) {
        vinInput.prop("disabled", true);
        $("#add-compare").prop("disabled", true);
        vinInput2 = $("<h4><b>VIN: </b>" + vinValue.toUpperCase() + "</h4>");
        vinInfo2 = vinStuff;
        for (var i = 6; i < vinStuff.length; i++) {
          var dataName = vinStuff[i].Variable;
          var dataInfo = vinStuff[i].Value;
          var dataContainer = $(
            "<li><b>" + dataName + ":</b> " + dataInfo + "</li>"
          );

          dataContainer.addClass("list-group-item");
          dataContainer.attr("id", "item2-" + i);
          $("#vin-compare2").append(dataContainer);
        }
        $("#vin-compare2").prepend(vinInput2);
        vinCompare2 = true;
      }

      vinInput.val("");
    });
  }
}
