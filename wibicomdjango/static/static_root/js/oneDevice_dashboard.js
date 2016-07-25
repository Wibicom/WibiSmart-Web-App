function renderPieBattery(live_battery){
    console.log("hello")

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
function renderGaugeBattery(live_battery){
var opts = {
  lines: 12, // The number of lines to draw
  angle: 0.15, // The length of each line
  lineWidth: 0.44, // The line thickness
 
  colorStart: '#6FADCF',   // Colors
  colorStop: '#8FC0DA',    // just experiment with them
  strokeColor: '#E0E0E0'   // to see which ones work best for you
};
var target = document.getElementById('foo'); // your canvas element
var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
gauge.value = 1250; // set actual value
gauge.maxValue = 3000; // set max gauge value

}


function ajaxcall(){
    console.log("hi");
    $.ajax({
        url: "/accounts/loggedin/94/renderdata/",
        type : "GET", // http method
        datatype: "json",
        success: function (json) {
            $('#output').html(json.message); //take the div output and put the json message in it
            var live_battery = json.message;
            renderPieBattery(live_battery);
            renderGaugeBattery(live_battery);
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

$(document).ready(function(){
    setInterval(ajaxcall, 500) //15 min * 60 sec * 1000 (for milliseconds)   for 15 minutes
	//renderPieBattery();



})