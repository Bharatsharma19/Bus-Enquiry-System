$(document).ready(function () {
  var serverURL = "http://localhost:3000/bus";
  $.getJSON(`${serverURL}/fetch_all_bustype`, function (data) {
    data.busmodal.map((item) => {
      $("#bustype").append($("<option>").text(item.busmodal).val(item.typeid));
    });
    $("select").formSelect();
  });

  $("#bustype").change(function () {
    $("#kilometer").on("input", function () {
      var dInput = this.value;
      $.getJSON(
        `${serverURL}/fetch_rent`,
        { typeid: $("#bustype").val() },
        function (data) {
          data.rent.map((item) => {
            $("#rent").val(item.rent * dInput);
          });

          $("select").formSelect();
        }
      );
    });
  });

  $.getJSON(`${serverURL}/fetch_all_states`, function (data) {
    data.state.map((item) => {
      $("#sstate").append($("<option>").text(item.statename).val(item.stateid));
    });
    $("select").formSelect();
  });

  $("#sstate").change(function () {
    $.getJSON(
      `${serverURL}/fetch_all_cities`,
      { stateid: $("#sstate").val() },
      function (data) {
        $("#scity").empty();
        $("#scity").append($("<option>").text("choose city"));

        data.city.map((item) => {
          $("#scity").append(
            $("<option>").text(item.cityname).val(item.cityid)
          );
        });
        $("select").formSelect();
      }
    );
  });

  $.getJSON(`${serverURL}/fetch_all_states`, function (data) {
    data.state.map((item) => {
      $("#dstate").append($("<option>").text(item.statename).val(item.stateid));
    });
    $("select").formSelect();
  });

  $("#dstate").change(function () {
    $.getJSON(
      `${serverURL}/fetch_all_cities`,
      { stateid: $("#dstate").val() },
      function (data) {
        $("#dcity").empty();
        $("#dcity").append($("<option>").text("choose city"));
        data.city.map((item) => {
          $("#dcity").append(
            $("<option>").text(item.cityname).val(item.cityid)
          );
        });
        $("select").formSelect();
      }
    );
  });
});
