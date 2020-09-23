let vinInfo1 = {};

$("#button-addon2").on("click", function(event) {
    decodeVIN();
    $(".form-decode").val("");
});


$(".form-decode").on("keyup", function(event) {
    if (event.keyCode === 13) {
        decodeVIN();
        $(".form-decode").val("");
    }
});

$(document).on("click", "#all", function(event) {
    for (var i = 6; i < vinInfo1.length; i++) {          
        
        $("#item-" + i).css("display", "initial");
    }
});

$(document).on("click", "#null-only", function(event) {
    console.log(vinInfo1[6].Value)
    for (var i = 6; i < vinInfo1.length; i++) {               
        if (vinInfo1[i].Value != null && vinInfo1[i].Value != "Not Applicable") {
            $("#item-" + i).css("display", "none");
        }
        else {
            $("#item-" + i).css("display", "initial");
        }
    }
});

$(document).on("click", "#not-null", function(event) {
    for (var i = 6; i < vinInfo1.length; i++) {                
        if (vinInfo1[i].Value === null || vinInfo1[i].Value === "Not Applicable") {
            $("#item-" + i).css("display", "none");
        }
        else {
            $("#item-" + i).css("display", "initial");
        }
    }
});

$("#clear").on("click", function (event) {
    $(".decode-list").empty();
    vinInfo1 = {};
});

function decodeVIN(event) {
    var vinInput = $(".form-decode").val().trim();
    var queryURL = "https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/" + vinInput + "?format=json";
    $(".decode-list").empty();

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        vinInfo1 = response.Results;


        for (var i = 5; i < vinInfo1.length; i++) {
            var dataName = vinInfo1[i].Variable;
            var dataInfo = vinInfo1[i].Value;
            var dataContainer = $("<li><b>" + dataName + ":</b> " + dataInfo + "</li>");
            var toggle = $("<div class='switch-toggle switch-3 switch-candy'><input id='not' name='state-d' type='radio' checked='' /><label for='not' id='not-null'>Not Null</label><input id='all' name='state-d' type='radio' checked='checked' /><label for='all' class='disabled'>All</label><input id='null' name='state-d' type='radio' /><label for='null' id='null-only'>Null</label></div>");

            if (dataInfo != null) {
                dataContainer.addClass("list-group-item");
                $(".decode-list").append(dataContainer); 
                dataContainer.attr("id", "item-" + i);
            }
        }
        $(".decode-list").prepend(toggle, "<h4><b>VIN: </b>" + vinInput + "</h4>")
    })
}