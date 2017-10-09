var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var cookieParse = require("cookie-parser");
var session = require('express-session');
var engines = require('consolidate');
const pug = require('pug');
var Handlebars = require('handlebars');

var datas = require('./util.js');

app.use(express.static('public'));
app.engine('html', engines.mustache);
app.set('view engine', 'pug');
// app.set('views', __dirname + '/views');
app.set('views', './views');
// app.use('/static', express.static("public"));
app.use(cookieParse());
app.use(session({ secret: "Shh, its a secret!" }));
//To parse URL encoded data
app.use(bodyParser.urlencoded({ extended: true }));
//To parse json data
app.use(bodyParser.json());

app.get('/', function (req, res) {                     
    res.render("index.html");
    // res.json({'id': ';ddadafasf'});
});

app.post('/create', function(req, res) {
    var id = makeid();
    while (datas[id] != undefined) {
        id = makeid();
    }
    datas[id] = req.body['html'];
    res.json({id: id});
});

app.get("/review/:id", function(req, res){
    if (datas[req.params.id] === undefined) {
        res.render("error");
    } else {
        res.render("review", {html: datas[req.params.id], id: req.params.id});
    }
});

app.get("/annotator/:id", function(req, res) {
    if (datas[req.params.id] === undefined) {
        res.render("error");
    } else {
        res.render("annotator", {html: datas[req.params.id]});
    }
});

app.get("/download/:id", function(req, res){
    if (datas[req.params.id] === undefined) {
        res.render("error");
        return;
    } 
    var source = '<!DOCTYPE html>\
                    <html>\
                        <head>\
                            <title>Image annotator</title>\
                            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css" integrity="sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M" crossorigin="anonymous">\
                            <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>\
                            <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js" integrity="sha384-b/U6ypiBEHpOf/4+1nzFpr53nxSS+GLCkfwBdFNTxtclqqenISfwAzpKaMNFNmj4" crossorigin="anonymous"></script>\
                            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min.js" integrity="sha384-h0AbiXch4ZDo7tp9hKZ4TsHbi047NrKGLO3SEJAg45jXxnGIfYzk4Si90RDIqNm1" crossorigin="anonymous"></script>\
                            <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js" type="text/javascript"></script>\
                        </head>\
                        <body>\
                            <div class="container">\
                                {{{html}}}\
                            </div>\
                        </body>\
                        <script type="text/javascript">\
                            $(document).ready(function(){\
                                $(".note_annotator").popover({\
                                    trigger: "focus"\
                                });\
                                $(function () {\
                                    $(\'[data-toggle="popover"]\').popover()\
                                });\
                            });\
                        </script>\
                    </html>';
    var template = Handlebars.compile(source);

    var data = { "html":  datas[req.params.id] };
    var result = template(data);
    var fs = require('fs');
    fs.writeFile("annotatorImage.html", result, function(err) {
        res.download("annotatorImage.html");
        if(err) {
            return console.log(err);
        }
    });
});

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 20; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }


var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})