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

var counterLabels = (function () {
    var n = 10;

    return function () {
        n++;

        return n;
    };
}());

var counterLabelsAccelerometer = (function () {
    var n = 10;

    return function () {
        n++;

        return n;
    };
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
          angle: 0.1, // The length of each line
          lineWidth: 0.10, // The line thickness
          pointer: {
            length: 1, // The radius of the inner circle
            strokeWidth: 0.030, // The rotation offset
            color: '#000000' // Fill color
          },
          colorStart: '#6FADCF',   // Colors
          colorStop: '#8FC0DA',    // just experiment with them
          strokeColor: '#E0E0E0',   // to see which ones work best for you
          generateGradient: true
        };
        var target = document.getElementById('pressuregauge'); // your canvas element
        var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
        gauge.maxValue = 1500; // set max gauge value
        gauge.animationSpeed = 1; // set animation speed (32 is default value)
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

var TemperatureGauge = (function () {
    var instance;

    function createInstance() {
        var opts = {
          lines: 12, // The number of lines to draw
          angle: 0.005, // The length of each line
          lineWidth: 0.20, // The line thickness
          pointer: {
            length: 1, // The radius of the inner circle
            strokeWidth: 0.030, // The rotation offset
            color: '#000000' // Fill color
          },
           colorStart: '#ffffff',   // Colors
           colorStop: '#94fd77',
          strokeColor: '#E0E0E0',   // to see which ones work best for you
          generateGradient: true
        };
        var target = document.getElementById('temperaturegauge'); // your canvas element
        var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
        gauge.maxValue = 40; // set max gauge value
        gauge.animationSpeed = 1; // set animation speed (32 is default value)
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
        //console.log("hey");
        //console.log(JSON.parse(temperaturelist));
        for(var i = 0; i < JSON.parse(temperaturelist).length; i++) {
            queue.push(JSON.parse(temperaturelist)[i]);
        }
        //console.log(queue);
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

var AccxQueue = (function () {
    var instance;

    function createInstance() {
        var queue = [];
        //console.log(JSON.parse(accxlist));
        for(var i = 0; i < JSON.parse(accxlist).length; i++) {
            queue.push(JSON.parse(accxlist)[i]);
        }
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

var AccyQueue = (function () {
    var instance;

    function createInstance() {
        var queue = [];
        for(var i = 0; i < JSON.parse(accylist).length; i++) {
            queue.push(JSON.parse(accylist)[i]);
        }
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

var AcczQueue = (function () {
    var instance;

    function createInstance() {
        var queue = [];
        for(var i = 0; i < JSON.parse(acczlist).length; i++) {
            queue.push(JSON.parse(acczlist)[i]);
        }
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

var LabelQueue = (function () {
    var instance;

    function createInstance() {
        var queue = [1,2,3,4,5,6,7,8,9,10];
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

var LabelQueueAccelerometer = (function () {
    var instance;

    function createInstance() {
        var queue = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
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

function render_progressbar_accelerometer(live_acc, axis){
    var firstSegment_progress;
    var secondSegment_progress;
    var thirdSegment_progress;
    if (live_acc>0) {
        firstSegment_progress = "50%";
        secondSegment_progress = ((live_acc/4000) * 100).toString() + "%";
        thirdSegment_progress = (50 - ((live_acc/4000)*100)).toString + "%";


    } else if (live_acc<0) {

        firstSegment_progress = (50 - ((Math.abs(live_acc)/4000)*100)).toString() + "%";
        secondSegment_progress = ((Math.abs(live_acc)/4000)*100).toString() + "%";
        thirdSegment_progress = "50%";

    } else {
        firstSegment_progress = "100%";
        secondSegment_progress = "0%";
        thirdSegment_progress = "0%";
    }

    switch(axis){
        case 'x':
            document.getElementById("firstSegment_progress_x").setAttribute("style", "width: " + firstSegment_progress);
            document.getElementById("secondSegment_progress_x").setAttribute("style", "width: " + secondSegment_progress);
            document.getElementById("thirdSegment_progress_x").setAttribute("style", "width: " + thirdSegment_progress);
            break;
        case 'y':
            document.getElementById("firstSegment_progress_y").setAttribute("style", "width: " + firstSegment_progress);
            document.getElementById("secondSegment_progress_y").setAttribute("style", "width: " + secondSegment_progress);
            document.getElementById("thirdSegment_progress_y").setAttribute("style", "width: " + thirdSegment_progress);
            break;
        case 'z':
            document.getElementById("firstSegment_progress_z").setAttribute("style", "width: " + firstSegment_progress);
            document.getElementById("secondSegment_progress_z").setAttribute("style", "width: " + secondSegment_progress);
            document.getElementById("thirdSegment_progress_z").setAttribute("style", "width: " + thirdSegment_progress);
            break;
    }

}

function render_total_acceleration (accx, accy, accz){
    var total_acceleration = (Math.sqrt(Math.pow(accx,2)+ Math.pow(accy,2)+ Math.pow(accz,2))).toFixed(2);
    $('#totalaccelerationvalue').html(total_acceleration + " mg");

}

function gauge_battery_ajax(){

    $.ajax({

        url: "/accounts/loggedin/" + deviceId + "/renderdata/",
        type : "GET", // http method
        datatype: "json",
        success: function (json) {
            $('#batteryvalue').html(json.live_battery + "%"); //take the div output and put the json message in it
            $('#humidityvalue').html(json.live_humidity + "%");
            $('#pressurevalue').html(json.live_pressure + " mb");
            $('#temperaturevalue').html(json.live_temperature + " °Celsius");
            $('#accxvalue').html("X Axis: " + json.live_accx + " mg");
            $('#accyvalue').html("Y Axis: " + json.live_accy + " mg");
            $('#acczvalue').html("Z Axis : " + json.live_accz + " mg");

            render_progressbar_accelerometer(parseInt(json.live_accy), 'y');
            render_progressbar_accelerometer(parseInt(json.live_accx), 'x');
            render_progressbar_accelerometer(parseInt(json.live_accz), 'z');

            render_total_acceleration(parseInt(json.live_accx), parseInt(json.live_accy), parseInt(json.live_accz));

            BatteryGauge.getInstance().set(json.live_battery);
            HumidityGauge.getInstance().set(json.live_humidity);
            PressureGauge.getInstance().set(json.live_pressure);
            TemperatureGauge.getInstance().set(json.live_temperature);

            TemperatureQueue.getInstance().push(json.live_temperature);
            TemperatureQueue.getInstance().shift();

            //console.log(TemperatureQueue.getInstance);
            AccxQueue.getInstance().push(json.live_accx);
            AccxQueue.getInstance().shift();

            AccyQueue.getInstance().push(json.live_accy);
            AccyQueue.getInstance().shift();

            AcczQueue.getInstance().push(json.live_accz);
            AcczQueue.getInstance().shift();

            LabelQueue.getInstance().push(counterLabels());
            LabelQueue.getInstance().shift();

            LabelQueueAccelerometer.getInstance().push(counterLabelsAccelerometer());
            LabelQueueAccelerometer.getInstance().shift();

            //var maximum = Math.max.apply(Math, TemperatureQueue.getInstance());
            //var minimum = Math.min.apply(Math, TemperatureQueue.getInstance());
            //console.log(TemperatureQueue.getInstance());
            //console.log(maximum);
            //console.log(minimum);

            TemperatureChart.getInstance().data.datasets[0].data = TemperatureQueue.getInstance();
            //TemperatureChart.getInstance().options.scales.yAxes[0].ticks.min = 20;
            //TemperatureChart.getInstance().options.scales.yAxes[0].ticks.max = 40;
            TemperatureChart.getInstance().update();

            AccelerometerChart.getInstance().data.datasets[0].data = AccxQueue.getInstance();
            AccelerometerChart.getInstance().data.datasets[1].data =  AccyQueue.getInstance();
            AccelerometerChart.getInstance().data.datasets[2].data =  AcczQueue.getInstance();
            AccelerometerChart.getInstance().update();

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
    //console.log(LabelQueue.getInstance());

    function createInstance() {
        //separator
        var config = {
                type: 'line',
                data: {
                    labels: LabelQueue.getInstance(),
                    datasets: [{
                        label: "Temperature Evolution",
                        backgroundColor: "rgba(84, 249, 183, 0.2)",
                        borderColor: "rgba(151,187,205,1)",
                        pointBorderColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        data: JSON.parse(temperaturelist),

                    }]
                },
                options: {
                  animation: false,
                  title: {
                    display: true,
                    text: "Temperature data (Celsius)",
                    fontSize: 24,
                    fontFamily: 'Josefin Sans',
                    padding: 20
                  },
                  legend: {
                    display: false,
                  },
                  scales: {
                        yAxes: [{
                          ticks: {
                            min: 20,
                            max: 40
                          }
                        }]
                    }
                }
            };

        var ctx = document.getElementById("temperaturelinechart").getContext("2d");
        var myChart = new Chart(ctx, config);

        return myChart;
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

    //space alloc
        var config = {
            type: 'line',
            data: {
                labels: LabelQueueAccelerometer.getInstance(),
                datasets: [{
                    label: "X axis",
                    backgroundColor: "rgba(220,220,220,0.2)",
                    borderColor: "rgba(220,220,220,1)",
                    pointBorderColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    data: JSON.parse(accxlist)

                },
                {
                    label: "Y axis",
                    backgroundColor: "rgba(151,187,205,0.2)",
                    borderColor: "rgba(151,187,205,1)",
                    pointBorderColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    data: JSON.parse(accylist)

                },
                {
                    label : "Z axis",
                    backgroundColor: "rgba(84, 249, 183, 0.2)",
                    borderColor: "rgba(151,187,205,1)",
                    pointBorderColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    data: JSON.parse(acczlist)

                }

                ]
            },
            options: {
              title: {
                display: true,
                text: "Accelerometer data (mg)",
                fontSize: 24,
                fontFamily: 'Josefin Sans',
                padding: 20
              },
              legend: {
                position: 'top'
              },
              animation: false,
              scales: {
              xAxes: [{
                    gridLines: {
                        display:false
                    }
                }],
                yAxes: [{
                      gridLines: {
                        display: true
                      },
                      ticks: {
                        min: -4000,
                        max: 4000
                      }
                    }]
                }
            }
        };

        var ctx = document.getElementById("acccelerometerlinechart").getContext("2d");
        var myChart = new Chart(ctx, config);
        return myChart;
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

    BatteryGauge.getInstance();
    HumidityGauge.getInstance();
    PressureGauge.getInstance();
    TemperatureGauge.getInstance();
    TemperatureQueue.getInstance();
    LabelQueue.getInstance();

    TemperatureChart.getInstance();
    AccelerometerChart.getInstance();
    setInterval(gauge_battery_ajax, 2000);



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
    //renderToggle();
    $('.side-label').removeClass("active");
    $('#dashboards').addClass( "active" );

    var d = new Date()
    document.getElementById("currentDate").innerHTML = d.toDateString();

    renderLiveDashboard();







});

