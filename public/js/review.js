$(document).ready(function(){
    $('.note_annotator').popover({
        trigger: 'focus'
    });
    $(function () {
        $('[data-toggle="popover"]').popover()
    });
});