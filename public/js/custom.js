var dot=null;
var listAnnotator;
var key;
$(document).ready(function(){

    if ($("#urlImage").length > 0){
        var w = 642;
        var h = 435;
        try{
            h = parseInt($("#height").val());
        }catch(ex){
            
        }
        try{
            w = parseInt($("#width").val());
        }catch(ex){

        }
        $("#annotator_image").initAnnotatorImage(w, h, $("#urlImage")[0].value);
    }
    $("#annotator_image").on("click", "img", function(e){
        var x = (e.offsetX-17)/e.target.clientWidth*100;
        var y = (e.offsetY-17)/e.target.clientHeight*100;
        $("#annotator_image").addAnnotatorImage(x, y);
    });

    $("#urlImage").on("change keyup paste", function(e){
        $("#annotator_image").initAnnotatorImage(642, 435, e.target.value);
    });

    $("#bcolor").on("change keyup paste", function(e){
        $("#bcolor-addon").text(e.target.value);
        updateDot();
    });
    $("#color").on("change keyup paste", function(e){
        $("#color-addon").text(e.target.value);
        updateDot();
    });
    $("#title").on("change keyup paste", function(e){
        updateDot();
    });
    $("#contenttext").on("change keyup paste", function(e){
        updateDot();
    });
    $("#titledot").on("change keyup paste", function(e){
        updateDot();
    });

    $("#annotator_image").on("click", ".contentAnnotator .note_annotator", function(e){
        dot = e.target;
        $('.contentTool #title').val($(dot).attr("data-original-title"));
        $('.contentTool #contenttext').val($(dot).attr("data-content"));
        $('.contentTool #titledot').val($(dot).text().trim());
        $('.contentTool #bcolor').val(hexc($(dot).css('backgroundColor')));
        $('.contentTool #color').val(hexc($(dot).css('color')));
        $(dot).selectDot();
        CheckDot();
    });

    $("#deletedot").click(function(){
        if (dot != null) {
            $(dot).removeDot();
            dot = null;
            CheckDot();
        }    
    });

    $("#width").on("change keyup paste", function(){
        $("#annotator_image").css({ width: $(this).val(), height: $("#height").val() });
    });

    $("#height").on("change keyup paste", function(){
        $("#annotator_image").css({ width: $("#width").val(), height: $(this).val() });
    });

    $(".createcontent .create").click(function(){
        $.ajax({
            url : "/create",
            type : "POST",
            dataType:"json",
            data : {
                 html : $("#annotator_image")[0].outerHTML
            },
            success : function (result){
                window.open("review/"+result['id'], '_blank');
            }
        });
    });

    $(".createcontent .btnsave").click(function(){
        $("#annotatorModal .errname").addClass("hidden");
        $("#annotatorModal #annotatorlabel").val("");
        $("#saveAnnotator").attr("disabled", "disabled");
    });

    $("#annotatorModal #annotatorlabel").on("change keyup paste", function(){
        if ($(this).val().length > 0) {
            $("#annotatorModal .errname").addClass("hidden");
            $("#saveAnnotator").removeAttr("disabled");
        } else {
            $("#annotatorModal .errname").removeClass("hidden");
            $("#saveAnnotator").attr("disabled", "disabled");
        }
    });

    $("#saveAnnotator").click(function(){
        var annotator = getDatas();
        $.ajax({
            url : "/saveAnnotator",
            type : "POST",
            dataType:"json",
            data : annotator,
            success: function (result){
                $('#annotatorModal').modal('toggle');
                toastr.success('Successfully created new Annotator');
            }
        });
    });
    
    $("#updateAnnotatorModal #updateannotatorlabel").on("change keyup paste", function(){
        if ($(this).val().length > 0) {
            $("#updateAnnotatorModal .errname").addClass("hidden");
            $("#updateAnnotatorModal #updateAnnotator").removeAttr("disabled");
        } else {
            $("#updateAnnotatorModal .errname").removeClass("hidden");
            $("#updateAnnotatorModal #updateAnnotator").attr("disabled", "disabled");
        }
    });

    if (data !== null) {
        $("#annotator_image").loadData(data);
    }
    CheckDot();
});

function getDatas() {
    var dots = [];
    $("#annotator_image").children(".contentAnnotator").children(".note_annotator").each(function(){
        var dot = { text: $(this).text().trim(), left: $(this).css("left"), top: $(this).css("top"), background: hexc($(this).css("backgroundColor")), color: hexc($(this).css("color")), "data-content": $(this).attr("data-content"), "data-original-title": $(this).attr("data-original-title") };
        dots.push(dot);
    });
    var src = $("#annotator_image").children("img").attr("src");
    var width = $("#annotator_image")[0].offsetWidth;
    var height = $("#annotator_image")[0].offsetHeight;
    var annotator = {
        src: src,
        width: width,
        height: height,
        dots: dots,
        label: $("#annotatorModal #annotatorlabel").val()
    };
    return annotator;
}

function hexc(colorval) {
    var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    delete(parts[0]);
    for (var i = 1; i <= 3; ++i) {
        parts[i] = parseInt(parts[i]).toString(16);
        if (parts[i].length == 1) parts[i] = '0' + parts[i];
    }
    return '#' + parts.join('');
}

function CheckDot() {
    if (dot == null) {
        $('.contentTool .dottool').find('input').attr('disabled','disabled');
        $("#deletedot").attr("disabled", 'disabled');
    } else {
        $("#deletedot").removeAttr("disabled");
        $('.contentTool .dottool').find('input').removeAttr('disabled');
    } 
}

function updateDot() {
    var title = $(".contentTool #title").val();
    var content = $(".contentTool #contenttext").val();
    var color = $(".contentTool #color").val();
    var bcolor = $(".contentTool #bcolor").val();
    var titledot = $(".contentTool #titledot").val();
    $(dot).updateDot(title, content, color, bcolor, titledot);
}