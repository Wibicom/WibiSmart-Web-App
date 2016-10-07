function adddevice(){
    $(".adddevicebtn").click(function() {
        console.log("1of1");
    })

}


function scan(){
    var clicks = 1;
    $("#scanbox").click(function() {
       if (clicks % 2 == 1) {
           html = '<div class="overlay"> <i class="fa fa-refresh fa-spin"></i> </div>';
           $('#loading').html(html);

           $.ajax({
                url: "/accounts/loggedin/devicemanager/scan",
                type : "GET", // http method
                datatype: 'json',
                success: function(response){
                    $('#loading').html("");
                    $('#listdevicesfound').html(""); //clear the list at the beginning of the scan if something is already in there
                    var jsonreceived = JSON.parse(response);

                    for (i = 0; i < jsonreceived.length; i++ ){
                        var name = jsonreceived[i].name;
                        var address = jsonreceived[i].address;
                        var rssi = jsonreceived[i].rssi;

                        var url = "http://192.168.1.103:8000/accounts/loggedin/devicemanager/adddevice/"  //will have to change this, not ideal should pass relative path + not secure, need to pass in csrf token
                        var listitem = '<li class="list-group-item">'
                                        + '<span class="pull-right">'
                                            + '<form action = ' + url + ' method = "post">'
                                            + '<button type = "submit" id = "' + address + '" name = "device" value = "' + name + ',' + address + '" class="btn btn-success btn-space adddevicebtn">'
                                            + '<i class="fa fa-plus-circle" aria-hidden="true"></i></button>'
                                            + '</form>'
                                        + '</span>'
                                        + '<p><span class = "bold">' + name + '</span>' +  ': ' + address + '<br>RSSI:'+ rssi + '</p></li>';
                        $('#listdevicesfound').append(listitem);
                    }

                    adddevice();

                }
            });

       }
    clicks++;
    console.log(clicks);
    });
}


$(document).ready(function(){
    scan();
    //console.log(document.getElementById("b0:b4:48:e4:95:83"));

    $('.side-label').removeClass("active");
    $('#devicemanager').addClass( "active" );



});
