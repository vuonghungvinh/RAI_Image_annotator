var key;
$(document).ready(function(){
    $(".listannotator").on("click", ".rename", function(){
        key = $(this).parent().parent().attr("key");
        $("#updateAnnotatorModal #updateannotatorlabel").val(listannotators[key].label);
        $("#updateAnnotatorModal").modal("toggle");
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
    $("#updateAnnotatorModal #updateAnnotator").click(function(){
        let data = listannotators[key];
        data["label"] = $("#updateAnnotatorModal #updateannotatorlabel").val();
        $.ajax({
            url : "/updateAnnotator",
            type : "POST",
            dataType:"json",
            data : {key: key, data: listannotators[key]},
            success: function (result){
                getList();
                toastr.success('Successfully updated Annotator');
                $("#updateAnnotatorModal").modal('toggle');
            }
        });
    });
    $(".listannotator").on("click", ".delete", function(){
        key = $(this).parent().parent().attr("key");
        $("#deleteAnnotatorModal .title").text("Do you want delete " + listannotators[key].label + "?");
        $("#deleteAnnotatorModal").modal("toggle");
    });
    $("#deleteAnnotatorModal #deleteAnnotator").click(function(){
        $.ajax({
            url : "/deleteAnnotator",
            type : "POST",
            dataType:"json",
            data : {key: key},
            success: function (result){
                $('#deleteAnnotatorModal').modal('toggle');
                toastr.success('Successfully deleted Annotator');
                getList();
            }
        });
    });
});

function getList() {
    $.ajax({
        url : "/listAnnotator",
        type : "POST",
        dataType:"json",
        success : function (result){
            listannotators = result;
            $(".listannotator tbody").empty();
            var i=0;
            $.each(result, function(key, value) {
                i++;
                $(".listannotator tbody").append(`
                    <tr key="`+key+`">
                        <td style="width: 70px;">`+i+`</td>
                        <td>`+ value.label +`</td>
                        <td style="width: 220px;">
                            <a class="btn btn-success btn-sm load" href="/`+key+`" type="button">Load</a>
                            <button class="btn btn-warning btn-sm rename" type="button">Rename</button>
                            <button class="btn btn-danger btn-sm delete" type="button">Delete</button>
                        </td>
                    </tr>
                `);
            });
        }
    });
}