function renderPieBattery(){
    console.log("hello")
    //console.log({{live_battery}})
    console.log(live_battery)
	var pieData = [
	   {
		  value: live_battery,
		  label: 'Luminosité',
		  color: '#00FF40'
	   },
	   {
		  value: 100 - live_battery,
		  label: '',
		  color: '#E6E6E6'
	   }

	];
	var options = {
		percentageInnerCutout: 80  ,
	};

	var context = document.getElementById('pieBattery').getContext('2d');
	var skillsChart = new Chart(context).Doughnut(pieData, options );
}


$(document).ready(function(){
	renderPieBattery();

})