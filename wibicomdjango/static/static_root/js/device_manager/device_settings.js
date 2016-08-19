

$(document).ready(function(){
    console.log("sanity check");

    $("#accelerometer-range-slider").ionRangeSlider({
    min: 0.1,
    max: 25.5,
    from: 0.1,
    step: 0.1
    });

    $("#weather-range-slider").ionRangeSlider({
    min: 0.1,
    max: 25.5,
    from: 0.1,
    step: 0.1
    });

    $("#light-range-slider").ionRangeSlider({
    min: 0.1,
    max: 25.5,
    from: 0.1,
    step: 0.1
    });




});