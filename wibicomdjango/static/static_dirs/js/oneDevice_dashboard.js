var counter = (function () {
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
    var n = 30;

    return function () {
        n++;

        return n;
    };
}());


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



var HumidityGauge = (function () {
    var instance;

    function createInstance() {
        var opts = {
          lines: 12, // The number of lines to draw
          angle: 0.3, // The length of each line
          lineWidth: 0.1, // The line thickness

          limitMax: 'false',   // If true, the pointer will not go past the end of the gauge
          colorStart: '#5bc0de',   // Colors
          colorStop: '#5bc0de',    // just experiment with them
          strokeColor: '#FFFFFF',   // to see which ones work best for you
          generateGradient: true
        };
        var target = document.getElementById('humiditygauge'); // your canvas element
        var gauge = new Donut(target).setOptions(opts); // create sexy gauge!
        gauge.maxValue = 100; // set max gauge value
        gauge.maxValue = 100; // set max gauge value
        gauge.animationSpeed = 15; // set animation speed (32 is default value)
        gauge.set(5); // set actual value
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
          colorStart: '#5bc0de',   // Colors
          colorStop: '#5bc0de',    // just experiment with them
          strokeColor: '#E0E0E0',   // to see which ones work best for you
          generateGradient: true
        };
        var target = document.getElementById('pressuregauge'); // your canvas element
        var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
        gauge.maxValue = 1500; // set max gauge value
        gauge.animationSpeed = 1; // set animation speed (32 is default value)
        gauge.set(5); // set actual value
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
          angle: 0.01, // The length of each line
          lineWidth: 0.20, // The line thickness
          pointer: {
            //length: 1, // The radius of the inner circle
            //strokeWidth: 0.030, // The rotation offset
            //color: '#000000' // Fill color
          },
           colorStart: '#f39c12',   // Colors
           colorStop: '#f39c12',
          strokeColor: '#E0E0E0',   //grey part to see which ones work best for you
          generateGradient: true
        };
        var target = document.getElementById('temperaturegauge'); // your canvas element
        var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
        gauge.maxValue = 35; // set max gauge value
        gauge.minValue = -30
        gauge.animationSpeed = 1; // set animation speed (32 is default value)
        gauge.set(1); // set actual value
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
        secondSegment_progress = (((live_acc/4000) * 100)/2).toString() + "%";
        thirdSegment_progress = (50 - (((live_acc/4000)*100))/2).toString + "%";


    } else if (live_acc<0) {

        firstSegment_progress = (50 - (((Math.abs(live_acc)/4000)*100)/2)).toString() + "%";
        secondSegment_progress = (((Math.abs(live_acc)/4000)*100)/2).toString() + "%";
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

function renderIndicatorRssi(){

    if(parseInt((document.getElementById("rssi").innerHTML))> -65){
        document.getElementById("rssi-indicator").innerHTML = "Near";
    } else if(parseInt((document.getElementById("rssi").innerHTML))> -80){
        document.getElementById("rssi-indicator").innerHTML = "Mid Range";
    } else {
        document.getElementById("rssi-indicator").innerHTML = "Far";
    }
}

function renderTemperatureGaugeColor(temperature){
    if(temperature<0){
        TemperatureGauge.getInstance().setOptions({colorStart:'#68e8e4', colorStop: '#68e8e4'})
    }
    else if(temperature<10){
        TemperatureGauge.getInstance().setOptions({colorStart:'#68a0e8', colorStop: '#68a0e8'})
    }
    else if(temperature<25){
        TemperatureGauge.getInstance().setOptions({colorStart:'#fcc754', colorStop: '#fcc754'})
    }else{
        TemperatureGauge.getInstance().setOptions({colorStart:'#fc6d54', colorStop: '#fc6d54'})
    }
}

function renderLightIndicator(live_light){
    var light_indicator = "";
    if (live_light>350){
        light_indicator = "High";
    }else if (live_light>150){
        light_indicator = "Medium";
    }else{
        light_indicator = "Low";
    }
    return light_indicator;
}

//This function is used to color the light circle according to the light level detected
function renderLightCircleColor(){
    var currentClass = $('#light-circle').attr('class');
    var newClass = "fa fa-circle "
    if ($('#light_indicator').html()=="High"){
        newClass += 'fa-circle-high-light-lvl'
    } else if ($('#light_indicator').html()== "Medium"){
         newClass += 'fa-circle-medium-light-lvl'
    }else if ($('#light_indicator').html()== "Low"){
        newClass += 'fa-circle-low-light-lvl'
    } else {
        console.log("There is a problem with the lightbulb");
    }
    if (currentClass!=newClass){
        $('#light-circle').removeClass(currentClass);
        $('#light-circle').addClass(newClass);
    }

}

//this function gets executed every x delay (milliseconds) and collects the data in backend to bring it into dashboard
function ajax_getdata(){

    $.ajax({

        url: "/accounts/loggedin/" + deviceId + "/renderdata/",
        type : "GET", // http method
        datatype: "json",
        success: function (json) {
            $('#batteryvalue').html(json.live_battery + "%"); //take the div output and put the json message in it
            $('#humidityvalue').html(json.live_humidity + "%");
            $('#pressurevalue').html(json.live_pressure + " mbar");
            $('#temperaturevalue').html(json.live_temperature + " °Celsius");
            $('#accxvalue').html("X Axis: " + json.live_accx + " mg");
            $('#accyvalue').html("Y Axis: " + json.live_accy + " mg");
            $('#acczvalue').html("Z Axis : " + json.live_accz + " mg");

            $('#rssi').html(json.live_rssi);
            light_indicator = renderLightIndicator(json.live_light);
            $('#light_indicator').html(light_indicator);
            $('#light_indicator_bottom').html(light_indicator);
            renderLightCircleColor();


            $('#deviceStatus').html(json.live_deviceStatus);

            renderIndicatorRssi();


            render_progressbar_accelerometer(parseInt(json.live_accy), 'y');
            render_progressbar_accelerometer(parseInt(json.live_accx), 'x');
            render_progressbar_accelerometer(parseInt(json.live_accz), 'z');

            render_total_acceleration(parseInt(json.live_accx), parseInt(json.live_accy), parseInt(json.live_accz));


            HumidityGauge.getInstance().set(json.live_humidity);
            PressureGauge.getInstance().set(json.live_pressure);
            renderTemperatureGaugeColor(json.live_temperature);
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

            var maximum = Math.max.apply(Math, TemperatureQueue.getInstance());
            var minimum = Math.min.apply(Math, TemperatureQueue.getInstance());
            //console.log(TemperatureQueue.getInstance());
            //console.log(maximum);
            //console.log(minimum);

            TemperatureChart.getInstance().data.datasets[0].data = TemperatureQueue.getInstance();
            TemperatureChart.getInstance().options.scales.yAxes[0].ticks.min = minimum-5;
            TemperatureChart.getInstance().options.scales.yAxes[0].ticks.max = maximum+5;
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
                        backgroundColor: "rgba(46, 204, 113, 0.2)",
                        borderColor: "rgba(46, 204, 113, 1)",
                        pointBorderColor: "rgba(46, 204, 113, 1)",
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
                    backgroundColor: "rgba(14, 75, 154, 0.2)",
                    borderColor: "rgba(14, 75, 154, 1)",
                    pointBorderColor: "rgba(14, 75, 154, 1)",
                    pointStrokeColor: "#fff",
                    data: JSON.parse(accxlist)

                },
                {
                    label: "Y axis",
                    backgroundColor: "rgba(46, 204, 113, 0.2)",
                    borderColor: "rgba(46, 204, 113, 1)",
                    pointBorderColor: "rgba(46, 204, 113, 1)",
                    pointStrokeColor: "#fff",
                    data: JSON.parse(accylist)

                },
                {
                    label : "Z axis",
                    backgroundColor: "rgba(91, 192, 222, 0.2)",
                    borderColor: "rgba(91, 192, 222, 1)",
                    pointBorderColor: "rgba(91, 192, 222, 1)",
                    pointStrokeColor: "#fff",
                    data: JSON.parse(acczlist)

                }

                ]
            },
            options: {
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


    TemperatureQueue.getInstance();
    LabelQueue.getInstance();
    TemperatureChart.getInstance();
    AccelerometerChart.getInstance();
    HumidityGauge.getInstance();
    PressureGauge.getInstance();
    TemperatureGauge.getInstance();
    ajax_getdata();
    setInterval(ajax_getdata, 2000);



}





//This function is used to render a data transfer level (either High, low, medium) to qualify the daily data transfer
//seen on top of the page under the Data transfer tile
function renderIndicatorDataTransfer(){
    if (avrg_per_min_daily  < 20) {
        document.getElementById("indicator_data_transfer").innerHTML = "Low";
    } else if (avrg_per_min_daily < 40) {
        document.getElementById("indicator_data_transfer").innerHTML = "Medium";
    } else{
        document.getElementById("indicator_data_transfer").innerHTML = "High";
    }
}





$(document).ready(function(){
    //renderToggle();
    $('.side-label').removeClass("active");
    $('#dashboards').addClass( "active" );

    $('#' + deviceId).addClass("active");
    $('#live-' +deviceId).addClass("active"); //this is a li item
    $('#fafa-live-' +deviceId).addClass("text-aqua"); //this is a fafa icon turning blue

    $('.item').matchHeight();

    renderIndicatorDataTransfer();





    renderLiveDashboard();
    renderIndicatorRssi();



});

