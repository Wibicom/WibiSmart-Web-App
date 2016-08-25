function get_energy_chart_options(){
    dict = {
     strokeWidth: 2,
     legend: 'always',
     //errorBars: true,
     showRangeSelector: true,
     rangeSelectorHeight: 30,
     //rangeSelectorPlotStrokeColor: '#6b8bff',
     //rangeSelectorPlotFillColor: '#6bffb5',
     fillGraph : true,
     colors :['#2ecc71', '#0e4b9a'],
     ylabel: 'Battery level (%)',
     y2label : 'Light level',
     series : {
        Battery : {
         axis : 'y'
        },
        Light : {
          axis : 'y2'
        }
      },

     highlightSeriesOpts: {
          strokeWidth: 4,
          strokeBorderWidth: 1,
          highlightCircleSize: 8
     }

    }

    return dict;
}

function get_meteo_chart_options(){
    dict = {
    strokeWidth: 2,
     legend: 'always',
     showRangeSelector: true,
     rangeSelectorHeight: 30,
     //rangeSelectorPlotStrokeColor: '#6b8bff',
     //rangeSelectorPlotFillColor: '#6bffb5',
     fillGraph : true,
     colors :['#2ecc71', '#0e4b9a'],
     ylabel: 'Temperature (Celsius)',
     y2label : 'Humidity',
     series : {
        Temperature : {
         axis : 'y'
        },
        Humidity : {
          axis : 'y2'
        }
      },

     highlightSeriesOpts: {
          strokeWidth: 4,
          strokeBorderWidth: 1,
          highlightCircleSize: 8
     }

    }

    return dict;
}


function get_accelerometer_chart_options(){
    dict = {
     strokeWidth: 2,
     legend: 'always',
     //errorBars: true,
     showRangeSelector: true,
     rangeSelectorHeight: 30,
     //rangeSelectorPlotStrokeColor: '#6b8bff',
     //rangeSelectorPlotFillColor: '#6bffb5',
     fillGraph : true,
     colors :['#5bc0de', '#0e4b9a', '#2ecc71'],
     ylabel: 'Acceleration (milliG)',

     highlightSeriesOpts: {
          strokeWidth: 4,
          strokeBorderWidth: 1,
          highlightCircleSize: 8
     }

    }

    return dict;
}

function get_pressure_chart_options(){
    dict = {
     strokeWidth: 2,
     legend: 'always',
     //errorBars: true,
     showRangeSelector: true,
     rangeSelectorHeight: 30,
     //rangeSelectorPlotStrokeColor: '#6b8bff',
     //rangeSelectorPlotFillColor: '#6bffb5',
     fillGraph : true,
     colors :['#5bc0de'],
     ylabel: 'Pressure (mbar)',

     highlightSeriesOpts: {
          strokeWidth: 4,
          strokeBorderWidth: 1,
          highlightCircleSize: 8
     }

    }

    return dict;
}


function energy_chart_controller(){
    $(".energy-button").click(function() {
        var selected_period = {'selected_period': $(this).attr('class').split(' ')[3]}
        console.log(selected_period);

        $.ajax({
        url: "/accounts/loggedin/" + deviceId + "/csvoutput_energy/",
        type : "GET", // http method
        data: selected_period,
        datatype : "text/csv",
        success: function(response){
            g2 = new Dygraph(
            document.getElementById("battery_historical_linechart"), response, get_energy_chart_options())}
        })

    })

}

function initialize_energy_chart(){
    $.ajax({
        url: "/accounts/loggedin/" + deviceId + "/csvoutput_energy/",
        type : "GET", // http method
        data: {'selected_period': 'max'},
        datatype : "text/csv",
        success: function(response){
            g2 = new Dygraph(
            document.getElementById("battery_historical_linechart"), response, get_energy_chart_options())
            }
        })
}


function meteo_chart_controller(){
    $(".meteo-button").click(function() {
        var selected_period = {'selected_period': $(this).attr('class').split(' ')[3]}
        console.log(selected_period);

        $.ajax({
        url: "/accounts/loggedin/" + deviceId + "/csvoutput_meteo/",
        type : "GET", // http method
        data: selected_period,
        datatype : "text/csv",
        success: function(response){
            g2 = new Dygraph(
            document.getElementById("meteo_historical_linechart"), response, get_meteo_chart_options())
            var response= response.split(/[\n,]+/)
            response.splice(0,3) //delete the first 3 items of the array (Pressure and Date), be carefull: this returns the removed items
            /*
            var sum = 0;
            var counter = 0;
            var array_data = [];
            for (i = 1; i < response.length ; i+=2) {
                var data = parseInt(response[i])
                array_data.push(data);
                sum +=data;
                counter++;
            }
            var avg = (sum/counter).toFixed(2);
            var min = (Math.max.apply(Math, array_data)).toFixed(2);
            var max = (Math.min.apply(Math, array_data)).toFixed(2);

            document.getElementById("pressure-high").innerHTML = max + " Mbar"
            document.getElementById("pressure-low").innerHTML = min + " Mbar"
            document.getElementById("pressure-avg").innerHTML = avg + " Mbar"
            */
            }
        })

    })

}


function initialize_meteo_chart(){
   $.ajax({
        url: "/accounts/loggedin/" + deviceId + "/csvoutput_meteo/",
        type : "GET", // http method
        data: {'selected_period': 'max'},
        datatype : "text/csv",
        success: function(response){
            g2 = new Dygraph(
            document.getElementById("meteo_historical_linechart"), response, get_meteo_chart_options())
            }
        })
}


function pressure_chart_controller(){
    $(".pressure-button").click(function() {
        var selected_period = {'selected_period': $(this).attr('class').split(' ')[3]} //on prend la quatrieme classe

        //this is the ajax call for getting the csv output
        $.ajax({
        url: "/accounts/loggedin/" + deviceId + "/csvoutput_pressure/",
        type : "GET", // http method
        data: selected_period,
        datatype : "text/csv",
        success: function(response){

            var g2 = new Dygraph(document.getElementById("pressure_historical_linechart"), response, get_pressure_chart_options());
            var response= response.split(/[\n,]+/) //i convert my csv (which is in the form of a string) into an array

            response.splice(0,2) //delete the first two items of the array (Pressure and Date), be carefull: this returns the removed items

            var sum = 0;
            var counter = 0;
            var array_data = [];
            for (i = 1; i < response.length ; i+=2) {
                var data = parseInt(response[i])
                array_data.push(data);
                sum +=data;
                counter++;
            }
            var avg = (sum/counter).toFixed(2);
            var min = (Math.max.apply(Math, array_data)).toFixed(2);
            var max = (Math.min.apply(Math, array_data)).toFixed(2);

            document.getElementById("pressure-high").innerHTML = max + " Mbar"
            document.getElementById("pressure-low").innerHTML = min + " Mbar"
            document.getElementById("pressure-avg").innerHTML = avg + " Mbar"

            }
        })


    })

}

function initialize_pressure_chart(){
   $.ajax({
        url: "/accounts/loggedin/" + deviceId + "/csvoutput_pressure/",
        type : "GET", // http methods
        data: {'selected_period': 'max'},
        datatype : "text/csv",
        success: function(response){
            g2 = new Dygraph(
            document.getElementById("pressure_historical_linechart"), response, get_pressure_chart_options())
            var response= response.split(/[\n,]+/)
            response.splice(0,2) //delete the first two items of the array (Pressure and Date), be carefull: this returns the removed items

            var sum = 0;
            var counter = 0;
            var array_data = [];
            for (i = 1; i < response.length ; i+=2) {
                var data = parseInt(response[i])
                array_data.push(data);
                sum +=data;
                counter++;
            }
            var avg = (sum/counter).toFixed(2);
            var min = (Math.max.apply(Math, array_data)).toFixed(2);
            var max = (Math.min.apply(Math, array_data)).toFixed(2);

            document.getElementById("pressure-high").innerHTML = max + " Mbar"
            document.getElementById("pressure-low").innerHTML = min + " Mbar"
            document.getElementById("pressure-avg").innerHTML = avg + " Mbar"

            }
        })
}


function accelerometer_chart_controller(){
    $(".accelerometer-button").click(function() {
        var selected_period = {'selected_period': $(this).attr('class').split(' ')[3]}

        $.ajax({
        url: "/accounts/loggedin/" + deviceId + "/csvoutput_accelerometer/",
        type : "GET", // http method
        data: selected_period,
        datatype : "text/csv",
        success: function(response){
            g2 = new Dygraph(
            document.getElementById("accelerometer_historical_linechart"), response, get_accelerometer_chart_options())
            }
        })

    })

}


function initialize_accelerometer_chart(){
   $.ajax({
        url: "/accounts/loggedin/" + deviceId + "/csvoutput_accelerometer/",
        type : "GET", // http method
        data: {'selected_period': 'max'},
        datatype : "text/csv",
        success: function(response){
            g2 = new Dygraph(
            document.getElementById("accelerometer_historical_linechart"), response, get_accelerometer_chart_options())
            }
        })
}

$(document).ready(function(){

    $('.side-label').removeClass("active");
    $('#dashboards').addClass( "active" );

    $('#' + deviceId).addClass("active");
    $('#historical-' +deviceId).addClass("active"); //this is a li item
    $('#fafa-historical-' +deviceId).addClass("text-aqua"); //this is a fafa icon turning blue

    initialize_energy_chart();
    initialize_meteo_chart();
    initialize_accelerometer_chart();
    initialize_pressure_chart();

    energy_chart_controller();
    meteo_chart_controller();
    pressure_chart_controller();
    accelerometer_chart_controller();




});

