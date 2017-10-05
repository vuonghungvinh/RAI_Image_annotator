$(document).ready(function(){
    var note=null;
    var canMove=false; 
    if ($("#urlImage").length > 0){
        $("#annotator_image").initAnnotatorImage(642, 435, $("#urlImage")[0].value);
    }
    $("#annotator_image").on("click", "img", function(e){
        var x = (e.offsetX-15)/e.target.clientWidth*100;
        var y = (e.offsetY-15)/e.target.clientHeight*100;
        $("#annotator_image").addAnnotatorImage(x, y);
    });

    $("#urlImage").on("change keyup paste", function(e){
        $("#annotator_image").initAnnotatorImage(642, 435, e.target.value);
    })
});