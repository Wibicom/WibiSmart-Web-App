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
           setTimeout(function(){ $('#loading').html(""); }, 2000);
           $.ajax({
                url: "/accounts/loggedin/devicemanager/scan",
                type : "GET", // http method
                datatype: 'json',
                success: function(response){
                    $('#listdevicesfound').html("");
                    var jsonreceived = JSON.parse(response);

                    for (i = 0; i < jsonreceived.length; i++ ){
                        var name = jsonreceived[i].name;
                        var address = jsonreceived[i].address;
                        var url = "http://127.0.0.1:8000/accounts/loggedin/devicemanager/adddevice/"  //will have to change this, not ideal should pass relative path + not secure, need to pass in csrf token
                        var listitem = '<li class="list-group-item">'
                                        + '<span class="pull-right">'
                                            + '<form action = ' + url + ' method = "post">'
                                            + '<button type = "submit" id = "' + address + '" name = "deviceAddress" value = "' + address + '" class="btn btn-success btn-space adddevicebtn">'
                                            + '<i class="fa fa-plus-circle" aria-hidden="true"></i></button>'
                                            + '</form>'
                                        + '</span>'
                                        + '<p><span class = "bold">' + name + '</span>' +  ': ' + address + '</p></li>';
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

});
