(function( $ ){
    $.fn.initAnnotatorImage = function(w, h, src) {
        this.css({ width: w, height: h, position: "relative"});
        $(this).empty();
        $(this).append("\
            <img src='"+src+"' style='width: 100%; height: 100%'/>\
        ");
        $(this).append("\
            <div class='contentAnnotator'></div>\
        ");
    };

    $.fn.addAnnotatorImage = function(x, y) {
        if (this.length < 1){
            return this;
        }
        var w = this[0].clientWidth;
        var h = this[0].clientHeight;
        if (w*(100-x)/100<34){
            x = (w-34)/w*100;
        }
        if (h*(100-y)/100<34){
            y = (h-34)/h*100;
        }
        if (x<0){
            x=0;
        }
        if(y<0){
            y=0;
        }
        this.find(".contentAnnotator").append("\
            <button style='width: 34px; height: 34px; position: absolute; left: "+x+"%; top: "+y+"%; background: red; border-radius: 50%' type='button' class='note_annotator' data-container='body' data-toggle='popover' title='Title' data-placement='top' data-content='Content.'>\
                1\
            </button>\
        ");
        $('.note_annotator').popover({
            trigger: 'focus'
        });
        $(function () {
            $('[data-toggle="popover"]').popover()
        });
        $(".note_annotator").draggable({
            containment: "#annotator_image",
            cancel: false
        });
    };

    $.fn.updateDot = function(title, content, color, bcolor, titledot) {
        $(this).css({background: bcolor, color: color});
        $(this).attr("data-content", content);
        $(this).attr("data-original-title", title);
        $(this).text(titledot);
    };

    $.fn.removeDot = function() {
        $(this).remove();
    };

    $.fn.selectDot = function() {
        $(".contentAnnotator button").removeClass("select");
        $(this).addClass("select");
    }

    $.fn.loadData = function(data) {
        $(this).css({width: data.width, height: data.height});
        $(this).empty();
        $(this).append("\
            <img src='"+data.src+"' style='width: 100%; height: 100%'/>\
        ");
        $(this).append("\
            <div class='contentAnnotator'></div>\
        ");
        for (var i=0; i < data.dots.length; i++) {
            $(this).find(".contentAnnotator").append("\
                <button style='width: 34px; height: 34px; position: absolute; left: "+data.dots[i].left+"; top: "+data.dots[i].top+"; background: "+data.dots[i].background+"; color: "+data.dots[i].color+"; border-radius: 50%' type='button' class='note_annotator' data-container='body' data-toggle='popover' title='"+data.dots[i]['data-original-title']+"' data-placement='top' data-content='"+data.dots[i]['data-content']+"'>\
                    "+data.dots[i].text+"\
                </button>\
            ");
        }
        $('.note_annotator').popover({
            trigger: 'focus'
        });
        $(function () {
            $('[data-toggle="popover"]').popover()
        });
        $(".note_annotator").draggable({
            containment: "#annotator_image",
            cancel: false
        });
    }

 })( jQuery );