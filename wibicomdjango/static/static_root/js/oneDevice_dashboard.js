function renderPieLuminosity(){
	var lumInPercentage= parseInt(JSON.parse( localStorage.getItem( 'luminosities' ) )[localStorage.getItem('clickedDayNb')])/100;
	document.getElementById("luminosityValue").innerHTML = lumInPercentage + "%";
	var pieData = [
	   {
		  value: 20,
		  label: 'Luminosité',
		  color: '#00FF40'
	   },
	   {
		  value: 80,
		  label: '',
		  color: '#E6E6E6'
	   }

	];
	var options = {
		percentageInnerCutout: 80  ,
	};

	var context = document.getElementById('pieLuminosity').getContext('2d');
	var skillsChart = new Chart(context).Doughnut(pieData, options );
}


$(document).ready(function(){
	renderPieLuminosity();
}