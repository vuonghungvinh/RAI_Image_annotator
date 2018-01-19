$(document).ready(function(){
    $('.note_annotator').popover({
        trigger: 'focus'
    });
    $(function () {
        $('[data-toggle="popover"]').popover()
    });
    $('.note_annotator').on('shown.bs.popover', function () {
        $('a').attr('target', '_blank')
    });
});