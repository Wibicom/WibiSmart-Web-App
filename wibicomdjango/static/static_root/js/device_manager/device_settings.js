$(document).ready(function(){

    var $range = $(".js-range-slider"),
        $btn_minus = $(".js-btn-minus"),
        $btn_plus = $(".js-btn-plus"),
        min = 0.1,
        max = 25.5,
        step = 0.1,
        from = 0.1;

    $range.ionRangeSlider({
        type: "single",
        min: min,
        max: max,
        step: step,
        from: from,
        onFinish: function (data) {
            from = data.from;
        }
    });

    $btn_minus.on("click", function () {
        updateRange(-1);
    });

    $btn_plus.on("click", function () {
        updateRange(1);
    });

    var range_instance = $range.data("ionRangeSlider");

    var updateRange = function (direction) {
        from += step * direction;
        if (from < min) {
            from = min;
        } else if (from > max) {
            from = max;
        }

        range_instance.update({
            from: from
        });
    };

});