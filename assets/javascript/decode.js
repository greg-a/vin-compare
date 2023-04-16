let vinInfo1 = {};

$("#button-addon2").on("click", function () {
  decodeVIN();
});

$(".form-decode").on("keyup", function (event) {
  if (event.keyCode === 13) {
    decodeVIN();
  }
});

$(document).on("click", "#all", function () {
  for (var i = 6; i < vinInfo1.length; i++) {
    $("#item-" + i).css("display", "initial");
  }
});

$(document).on("click", "#null-only", function () {
  console.log(vinInfo1[6].Value);
  for (var i = 6; i < vinInfo1.length; i++) {
    if (vinInfo1[i].Value != null && vinInfo1[i].Value != "Not Applicable") {
      $("#item-" + i).css("display", "none");
    } else {
      $("#item-" + i).css("display", "initial");
    }
  }
});

$(document).on("click", "#not-null", function () {
  for (var i = 6; i < vinInfo1.length; i++) {
    if (vinInfo1[i].Value === null || vinInfo1[i].Value === "Not Applicable") {
      $("#item-" + i).css("display", "none");
    } else {
      $("#item-" + i).css("display", "initial");
    }
  }
});

$(document).on("click", ".test-vin", function (event) {
  var value = event.target.textContent;
  var vinInput = $(".form-decode");
  var inputDisabled = vinInput.prop("disabled");
  if (!inputDisabled) {
    vinInput.val(value);
    vinInput.focus();
  }
});

$("#clear").on("click", function () {
  $(".decode-list").empty();
  $(".form-decode").val("");
  vinInfo1 = {};
});

function isValidVIN(vin) {
  return vin.length === 17;
}

function decodeVIN() {
  var vinInput = $(".form-decode");
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
      vinInfo1 = response.Results;

      for (var i = 5; i < vinInfo1.length; i++) {
        var dataName = vinInfo1[i].Variable;
        var dataInfo = vinInfo1[i].Value;
        var dataContainer = $(
          "<li><b>" + dataName + ":</b> " + dataInfo + "</li>"
        );
        var toggle = $(
          "<div class='switch-toggle switch-3 switch-candy'><input id='not' name='state-d' type='radio' checked='' /><label for='not' id='not-null'>Not Null</label><input id='all' name='state-d' type='radio' checked='checked' /><label for='all' class='disabled'>All</label><input id='null' name='state-d' type='radio' /><label for='null' id='null-only'>Null</label></div>"
        );

        if (dataInfo != null) {
          dataContainer.addClass("list-group-item");
          $(".decode-list").append(dataContainer);
          dataContainer.attr("id", "item-" + i);
        }
      }
      $(".decode-list").prepend(
        toggle,
        "<h4><b>VIN: </b>" + vinValue + "</h4>"
      );
    });

    vinInput.val("");
  }
}
