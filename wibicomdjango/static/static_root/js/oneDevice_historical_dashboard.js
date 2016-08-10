function get_energy_chart_options(){
    dict = {
     legend: 'always',
     //errorBars: true,
     showRangeSelector: true,
     rangeSelectorHeight: 30,
     rangeSelectorPlotStrokeColor: '#6b8bff',
     rangeSelectorPlotFillColor: '#6bffb5',
     fillGraph : true,
     colors :['#fad400', '#7aff38'],
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
          strokeWidth: 3,
          strokeBorderWidth: 1,
          highlightCircleSize: 8
     }

    }

    return dict;
}

function get_meteo_chart_options(){
    dict = {
     legend: 'always',
     showRangeSelector: true,
     rangeSelectorHeight: 30,
     rangeSelectorPlotStrokeColor: '#6b8bff',
     rangeSelectorPlotFillColor: '#6bffb5',
     fillGraph : true,
     colors :['#fad400', '#7aff38', 'black' ],
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
          strokeWidth: 3,
          strokeBorderWidth: 1,
          highlightCircleSize: 8
     }

    }

    return dict;
}


function get_accelerometer_chart_options(){
    dict = {
     legend: 'always',
     //errorBars: true,
     showRangeSelector: true,
     rangeSelectorHeight: 30,
     rangeSelectorPlotStrokeColor: '#6b8bff',
     rangeSelectorPlotFillColor: '#6bffb5',
     fillGraph : true,
     colors :['#fad400', '#7aff38', 'black'],
     ylabel: 'Acceleration (milliG)',

     highlightSeriesOpts: {
          strokeWidth: 3,
          strokeBorderWidth: 1,
          highlightCircleSize: 8
     }

    }

    return dict;
}

function get_pressure_chart_options(){
    dict = {
     legend: 'always',
     //errorBars: true,
     showRangeSelector: true,
     rangeSelectorHeight: 30,
     rangeSelectorPlotStrokeColor: '#6b8bff',
     rangeSelectorPlotFillColor: '#6bffb5',
     fillGraph : true,
     colors :['#fad400'],
     ylabel: 'Pressure (mbar)',

     highlightSeriesOpts: {
          strokeWidth: 3,
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
            document.getElementById("battery_historical_linechart"), response, get_meteo_chart_options())}
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
            document.getElementById("meteo_historical_linechart"), response, get_meteo_chart_options())}
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
        var selected_period = {'selected_period': $(this).attr('class').split(' ')[3]}

        $.ajax({
        url: "/accounts/loggedin/" + deviceId + "/csvoutput_pressure/",
        type : "GET", // http method
        data: selected_period,
        datatype : "text/csv",
        success: function(response){
            g2 = new Dygraph(
            document.getElementById("pressure_historical_linechart"), response, get_pressure_chart_options())
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
    initialize_energy_chart();
    initialize_meteo_chart();
    initialize_accelerometer_chart();
    initialize_pressure_chart();

    energy_chart_controller();
    meteo_chart_controller();
    pressure_chart_controller();
    accelerometer_chart_controller();


});

