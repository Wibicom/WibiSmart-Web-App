var counter = (function () {
    var n = 10;

    return function () {
        n++;

        return n;
    }
}());

var counteracc = (function () {
    var n = 10;

    return function () {
        n++;

        return n;
    }
}());

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
        gauge.maxValue = 1500; // set max gauge value
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


var TemperatureQueue = (function () {
    var instance;

    function createInstance() {
        var queue = [];
        for(var i = 0; i < JSON.parse(temperaturelist).length; i++) {
            queue.push(JSON.parse(temperaturelist)[i]);
        }
        console.log(queue);
        return queue;
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

function gauge_battery_ajax(){
    //console.log("im in ajax")

    $.ajax({

        url: "/accounts/loggedin/" + deviceId + "/renderdata/",
        type : "GET", // http method
        datatype: "json",
        success: function (json) {
            $('#batteryvalue').html(json.live_battery); //take the div output and put the json message in it
            $('#humidityvalue').html(json.live_humidity);
            $('#pressurevalue').html(json.live_pressure);

            BatteryGauge.getInstance().set(json.live_battery);
            console.log(json.live_battery);
            HumidityGauge.getInstance().set(json.live_humidity);
            PressureGauge.getInstance().set(json.live_pressure);

            //je dois initialement mettre counter a 10 et incrementer a chaque fois sans perdre la valeur
            TemperatureChart.getInstance().addData([json.live_temperature], counter());
            // Remove the first point so we dont just add values forever
            TemperatureChart.getInstance().removeData();


            TemperatureQueue.getInstance().push(json.live_temperature);
            TemperatureQueue.getInstance().shift();
            //console.log(TemperatureQueue.getInstance().length);

            var min = Math.min.apply(Math, TemperatureQueue.getInstance())

            TemperatureChart.getInstance().options.scaleOverride = true;
            TemperatureChart.getInstance().options.animation = true;
            TemperatureChart.getInstance().options.scaleStartValue = Math.round(min-5);
            //TemperatureChart.getInstance().render();
            TemperatureChart.getInstance().update();
            //console.log("ok");
            //console.log(Math.round(min-5));

            AccelerometerChart.getInstance().addData([json.live_accx, json.live_accy, json.live_accz], counteracc());
            // Remove the first point so we dont just add values forever
            AccelerometerChart.getInstance().removeData();



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
var myLiveChart = new Chart(ctx).Line(startingData, {animation:false});


setInterval(function(){
  // Add two random numbers for each dataset
  myLiveChart.addData([Math.random() * 100], ++latestLabel);
  // Remove the first point so we dont just add values forever
  myLiveChart.removeData();
}, 5000);


}

var TemperatureChart = (function () {
    var instance;
    var max = Math.max.apply(Math, TemperatureQueue.getInstance());
    var min = Math.min.apply(Math, TemperatureQueue.getInstance());

    function createInstance() {
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

            options = {
                animation :false,
                scaleOverride: true,
                scaleSteps: 15,
                scaleStepWidth: 5,
                scaleStartValue : Math.round((min-5))

            },
            latestLabel = startingData.labels[9];

        // Reduce the animation steps for demo clarity.
        var myLiveChart = new Chart(ctx).Line(startingData, options);
        return myLiveChart;
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

function startValueAccelerometerChart(){
    var minx = Math.min.apply(Math,JSON.parse(accxlist));
    var miny = Math.min.apply(Math,JSON.parse(accylist));
    var minz = Math.min.apply(Math,JSON.parse(acczlist));
    var min = Math.min(minx,miny,minz);
    return min;

}

function endValueAccelerometerChart(){
    var maxx = Math.max.apply(Math,JSON.parse(accxlist));
    var maxy = Math.max.apply(Math,JSON.parse(accylist));
    var maxz = Math.max.apply(Math,JSON.parse(acczlist));
    var max = Math.max(maxx,maxy,maxz);
    return max;

}

var AccelerometerChart = (function () {
    var instance;

    function createInstance() {
        var canvas = document.getElementById('acccelerometerlinechart'),

            ctx = canvas.getContext('2d'),
            startingData = {
              labels: [1, 2, 3, 4, 5, 6, 7,8,9,10],
              datasets: [
                  {
                      fillColor: "rgba(220,220,220,0.2)",
                      strokeColor: "rgba(220,220,220,1)",
                      pointColor: "rgba(220,220,220,1)",
                      pointStrokeColor: "#fff",
                      data: JSON.parse(accxlist)
                  },
                  {
                      fillColor: "rgba(151,187,205,0.2)",
                      strokeColor: "rgba(151,187,205,1)",
                      pointColor: "rgba(151,187,205,1)",
                      pointStrokeColor: "#fff",
                      data: JSON.parse(accylist)
                  },
                  {
                      fillColor: "rgba(84, 249, 183, 0.2)",
                      strokeColor: "rgba(151,187,205,1)",
                      pointColor: "rgba(151,187,205,1)",
                      pointStrokeColor: "#fff",
                      data: JSON.parse(acczlist)
                  }
              ]
            },
            options = {
                animation :false,

            },

            latestLabel = startingData.labels[9];

    // Reduce the animation steps for demo clarity.
        var myLiveChart = new Chart(ctx).Line(startingData, options);
        return myLiveChart;
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


function renderLiveDashboard(){
    //render the charts for the first time



    BatteryGauge.getInstance();
    HumidityGauge.getInstance();
    PressureGauge.getInstance();
    TemperatureQueue.getInstance();

    TemperatureChart.getInstance();
    AccelerometerChart.getInstance();
    setInterval(gauge_battery_ajax, 2000);

    //make an ajax request every x milliseconds to get new data

    //setInterval(gauge_battery_ajax(), 5000)

    //renderLineChartTemperature();


}

function dateGenerator(){
    var date = new Date();
    var milli = (date.getMilliseconds()*60/999).toFixed(0);
    myDate = "Jul " + date.getDate() + ", " + date.getFullYear() + " 9:" + date.getMinutes()+ ":" + milli + " AM";
    //console.log(myDate);
    //console.log(myDate.toString());
    return myDate.toString();
}

/*
function postRequestSensorDataSender(){
    var formData = {
        "token" : "c69fa188bfd67ff4ba491623dd7b4263e9957397",
        "deviceNb" : "B0:B4:48:E4:BC:01",
        "deviceType": "ENVIRO",
        "datetime": dateGenerator()  ,
        "pressure": ((Math.random() * (1500 - 1000) + 1000).toFixed(1)).toString(),
        "humidity": ((Math.random() * (100)).toFixed(0)).toString(),
        "temperature": ((Math.random() * (30 - (-30)) + (-30)).toFixed(1)).toString(),
        "battery": ((Math.random() * (100)).toFixed(0)).toString(),
        "light": "0",
        "accx": ((Math.random() * (4000 - (-4000)) -4000).toFixed(1)).toString(),
        "accy": ((Math.random() * (4000 - (-4000)) -4000).toFixed(1)).toString(),
        "accz": ((Math.random() * (4000 - (-4000)) -4000).toFixed(1)).toString()
        }

    formData= JSON.stringify(formData);
    console.log(formData),

    $.ajax({
        url: "/receiveandroiddata/",
        type : "POST", // http method
        data: formData,

    });

}*/


$(document).ready(function(){
    renderToggle();

    //renderLiveDashboard();




});

