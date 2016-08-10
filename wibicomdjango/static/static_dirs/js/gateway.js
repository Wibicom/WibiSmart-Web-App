
$(document).ready(function(){
console.log("doing the get");
    $.ajax({
        url: "http://raspberrypi:8000/gap/nodes/",
        type : "GET", // http method
        datatype: 'jsonp',
        crossDomain : true,
        success: function(response){
            console.log("hi");
            console.log(response);
        }
    })

});
