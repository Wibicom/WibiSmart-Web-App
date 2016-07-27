function renderPieBattery(live_battery){

    console.log(live_battery);
    console.log(typeof(live_battery));
	var pieData = [
	   {
		  value: parseInt(live_battery),
		  label: 'Battery Level',
		  color: '#00FF40'
	   },
	   {
		  value: 100 - parseInt(live_battery),
		  label: '',
		  color: '#E6E6E6'
	   }

	];
	var options = {
		percentageInnerCutout: 85  ,
		animation: false,
	};

	var context = document.getElementById('pieBattery').getContext('2d');
	var skillsChart = new Chart(context).Doughnut(pieData, options );
}
function renderGaugeBattery(){
var opts = {
  lines: 12, // The number of lines to draw
  angle: 0.3, // The length of each line
  lineWidth: 0.1, // The line thickness

  limitMax: 'false',   // If true, the pointer will not go past the end of the gauge
  colorStart: '#006EAB',   // Colors
  colorStop: '#006EAB',    // just experiment with them
  strokeColor: '#FFFFFF',   // to see which ones work best for you
  generateGradient: true
};
var target = document.getElementById('foo'); // your canvas element
var gauge = new Donut(target).setOptions(opts); // create sexy gauge!
gauge.maxValue = 100; // set max gauge value
gauge.animationSpeed = 15; // set animation speed (32 is default value)
gauge.set(41); // set actual value

}

function ajaxcall(){
    $.ajax({

        url: "/accounts/loggedin/" + deviceId + "/renderdata/",
        type : "GET", // http method
        datatype: "json",
        success: function (json) {
            $('#output').html(json.message); //take the div output and put the json message in it
            var live_battery = json.message;
            renderPieBattery(live_battery);


        }

          // handle a successful response
        /*success : function(json) {
            $('#post-text').val(''); // remove the value from the input
            console.log(json); // log the returned json to the console
            console.log("success"); // another sanity check
        },

        // handle a non-successful response
        error : function(xhr,errmsg,err) {
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }*/
    });
}

function ajaxcallforlineChart(){
    $.ajax({
        url: "/accounts/loggedin/" + deviceId + "/csvoutput/",
        type : "GET", // http method
        datatype : "text/csv",
        success: function(response){
            console.log(response);
            g2 = new Dygraph(
            document.getElementById("graphdiv"),
            response)
         }
    });
}

var Gauge = (function () {
    var instance;

    function createInstance() {
        var opts = {
          lines: 12, // The number of lines to draw
          angle: 0.3, // The length of each line
          lineWidth: 0.1, // The line thickness

          limitMax: 'false',   // If true, the pointer will not go past the end of the gauge
          colorStart: '#006EAB',   // Colors
          colorStop: '#006EAB',    // just experiment with them
          strokeColor: '#FFFFFF',   // to see which ones work best for you
          generateGradient: true
        };
        var target = document.getElementById('foo'); // your canvas element
        var gauge = new Donut(target).setOptions(opts); // create sexy gauge!
        gauge.maxValue = 100; // set max gauge value
        gauge.animationSpeed = 15; // set animation speed (32 is default value)
        gauge.set(0); // set actual value
        return gauge;
        }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

function renderToggle(){
    $('#toggle-event').change(function() {
      $('#console-event').html('Toggle: ' + $(this).prop('checked'))
    })

}

$(document).ready(function(){
    renderToggle();
    setInterval(ajaxcall, 500); //15 min * 60 sec * 1000 (for milliseconds)   for 15 minutes
    ajaxcallforlineChart();
    //renderGaugeBattery();

    Gauge.getInstance().set(60);
    Gauge.getInstance().set(100);




});

