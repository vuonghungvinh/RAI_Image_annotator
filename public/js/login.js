$(document).ready(function(){
    $("#frmlogin input").on("change keyup paste", function(){
        $("#frmlogin p").addClass("hidden");
    });
});