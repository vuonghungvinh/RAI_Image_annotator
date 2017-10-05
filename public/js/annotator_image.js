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

    $.fn.addAnnotatorImage = function(x, y) {0.
        if (this.length < 1){
            return this;
        }
        var w = this[0].clientWidth;
        var h = this[0].clientHeight;
        if (w*(100-x)/100<30){
            x = (w-30)/w*100;
        }
        if (h*(100-y)/100<30){
            y = (h-30)/h*100;
        }
        if (x<0){
            x=0;
        }
        if(y<0){
            y=0;
        }
        this.find(".contentAnnotator").append("\
            <div class='note_annotator' style='width: 30px; height: 30px; position: absolute; left: "+x+"%; top: "+y+"%; background: red; border-radius: 50%'></div>\
        ");
        $(".note_annotator").draggable({
            containment: "#annotator_image"
        });
    };

 })( jQuery );