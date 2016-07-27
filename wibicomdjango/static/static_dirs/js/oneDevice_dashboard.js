function renderPieBattery(live_battery){

    //console.log(live_battery);
    //console.log(typeof(live_battery));
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

function battery_live_ajaxcall(){
    $.ajax({

        url: "/accounts/loggedin/" + deviceId + "/renderdata/",
        type : "GET", // http method
        datatype: "json",
        success: function (json) {
            $('#output').html(json.message); //take the div output and put the json message in it
            var live_battery = json.message;
            renderPieBattery(live_battery);


        }

    });
}

function ajaxcallforlineChart(){
    $.ajax({
        url: "/accounts/loggedin/" + deviceId + "/csvoutput/",
        type : "GET", // http method
        datatype : "text/csv",
        success: function(response){
            //console.log(response);
            g2 = new Dygraph(
            document.getElementById("graphdiv"),
            response)
         }
    });
}

var BatteryGauge = (function () {
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
        var target = document.getElementById('batterygauge'); // your canvas element
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

var HumidityGauge = (function () {
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
        var target = document.getElementById('humiditygauge'); // your canvas element
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

var PressureGauge = (function () {
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
        var target = document.getElementById('pressuregauge'); // your canvas element
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


function renderLineChartAccelerometer(){
   var barData = {
    labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
    datasets: [
			{
				fillColor: "rgba(220,220,220,0)",
				strokeColor: "rgba(63, 191, 70,1)",
				data: [
					11,
					2,
					3,
					4,
					6,
					9,
					3
					]
			}
		]
	};

	var options = {
		scaleBeginAtZero: false

	};

	var context = document.getElementById('acccelerometerlinechart').getContext('2d');
	var pressureLineChart = new Chart(context).Line(barData, options);
}





function renderToggle(){
    $('#toggle-event').change(function() {
      $('#console-event').html('Toggle: ' + $(this).prop('checked'));
      var booltoggle = $(this).prop('checked');   //this when first lands on page, is null, then will be on true, false once toggled
      console.log(booltoggle);
      if (booltoggle ==false){
        console.log("no im here")
        ajaxcallforlineChart();
      }
      else{
        //create gauges
        console.log("im in else")

        //make an ajax request for data
        //update gauges
      }
    })

}


function gauge_battery_ajax(){
    $.ajax({

        url: "/accounts/loggedin/" + deviceId + "/renderdata/",
        type : "GET", // http method
        datatype: "json",
        success: function (json) {
            $('#batteryvalue').html(json.live_battery); //take the div output and put the json message in it
            $('#humidityvalue').html(json.live_humidity);
            $('#pressurevalue').html(json.live_pressure);

            BatteryGauge.getInstance().set(json.live_battery);
            HumidityGauge.getInstance().set(json.live_humidity);
            PressureGauge.getInstance().set(json.live_pressure);


        }

    });
}

function renderLineChartTemperature(){
var canvas = document.getElementById('temperaturelinechart'),

ctx = canvas.getContext('2d'),
    startingData = {
      labels: [1, 2, 3, 4, 5, 6, 7,8,9,10],
      datasets: [

          {
              fillColor: "rgba(151,187,205,0.2)",
              strokeColor: "rgba(151,187,205,1)",
              pointColor: "rgba(151,187,205,1)",
              pointStrokeColor: "#fff",
              data: JSON.parse(temperaturelist)
          }
      ]
    },
    latestLabel = startingData.labels[9];

// Reduce the animation steps for demo clarity.
var myLiveChart = new Chart(ctx).Line(startingData, {animationSteps: 15});


setInterval(function(){
  // Add two random numbers for each dataset
  myLiveChart.addData([Math.random() * 100], ++latestLabel);
  // Remove the first point so we dont just add values forever
  myLiveChart.removeData();
}, 5000);


}

function renderLiveDashboard(){
    //render the charts for the first time
    BatteryGauge.getInstance();
    HumidityGauge.getInstance();
    PressureGauge.getInstance();

    //make an ajax request every x milliseconds to get new data
    setInterval(gauge_battery_ajax(), 500)

    renderLineChartTemperature();


}

$(document).ready(function(){
    renderToggle();
    renderLiveDashboard();

    //setInterval(battery_live_ajaxcall, 500); //15 min * 60 sec * 1000 (for milliseconds)   for 15 minutes

    //renderGaugeBattery();

    //BatteryGauge.getInstance().set(60);
    //BatteryGauge.getInstance().set(100);
    //HumidityGauge.getInstance().set(40);
    //PressureGauge.getInstance().set(90);
    renderLineChartAccelerometer();





});

