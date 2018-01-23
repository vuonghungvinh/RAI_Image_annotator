var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var cookieParse = require("cookie-parser");
var session = require('express-session');
var engines = require('consolidate');
const pug = require('pug');
var Handlebars = require('handlebars');
var datas = require('./util.js');
//firebase
var firebase = require("firebase");
require("firebase/auth");
require("firebase/database");
var config = {
    apiKey: "AIzaSyBmy4QH_TyCQ_NwuPBFczJNEa2WoJwrbtM",
    authDomain: "annotatorimagefree.firebaseapp.com",
    databaseURL: "https://annotatorimagefree.firebaseio.com",
    projectId: "annotatorimagefree",
    storageBucket: "annotatorimagefree.appspot.com",
    messagingSenderId: "902642725349"
};
firebase.initializeApp(config);
var email = "vuonghungvinhit@gmail.com";
var password = "annotator_image";

firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
   console.log(error.code);
   console.log(error.message);
});
////////////////
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

app.get('/', function (req, res, next) {    
    res.render("index", {"data": null});
});

app.get("/listannotator", function(req, res, next){
    var ref = firebase.database().ref();
    ref.once("value", function(snapshot) {
        if (snapshot.val() === null) {
            res.render("listannotators", {"lists": []});
        } else {
            res.render("listannotators", {"lists": snapshot.val()['annotators']});
        }
    }, function (error) {
        res.render("listannotators", {"lists": []});
    });
});

app.post('/create', function(req, res, next) {
    var id = makeid();
    while (datas[id] != undefined) {
        id = makeid();
    }
    datas[id] = req.body['html'];
    res.json({id: id});
});

app.post("/saveAnnotator", function(req, res, next){
    var ref = firebase.database().ref();
    var postsRef = ref.child("annotators");
    postsRef.push(req.body);
    res.json({status:"ok"});
});

app.post("/updateAnnotator", function(req, res, next){
    var ref = firebase.database().ref();
    var postsRef = ref.child("annotators/"+req.body.key);
    postsRef.set(req.body.data);
    res.json({status:"ok"});
});

app.post("/deleteAnnotator", function(req, res, next){
    var ref = firebase.database().ref();
    var postsRef = ref.child("annotators/"+req.body.key);
    postsRef.remove();
    res.json({status:"ok"});
});

app.post("/listAnnotator", function(req, res, next){
    var ref = firebase.database().ref();
    ref.once("value", function(snapshot) {
        if (snapshot.val() === null) {
            res.json(null);
        } else {
            res.json(snapshot.val()['annotators']);
        }
    }, function (error) {
        res.json({"error": error.code});
    });
});

app.get("/review/:id", function(req, res, next){
    if (datas[req.params.id] === undefined) {
        res.render("error");
    } else {
        res.render("review", {html: datas[req.params.id], id: req.params.id, isReview: true});
    }
});

app.get("/annotator/:id", function(req, res, next) {
    if (datas[req.params.id] === undefined) {
        res.render("error");
    } else {
        res.render("annotator", {html: datas[req.params.id]});
    }
});

app.get("/download/:id", function(req, res, next){
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
                            <div>\
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
                                $(\'.note_annotator\').on(\'shown.bs.popover\', function () {\
                                    $(\'a\').attr(\'target\', \'_blank\');\
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

app.get('/:key', function (req, res, next) {
    var ref = firebase.database().ref();
    var postsRef = ref.child("annotators/"+req.params.key);
    postsRef.once("value", function(snapshot) {
        if (snapshot.val() === null) {
            res.render("index", { "data": null });
        } else {
            res.render("index", { "data": snapshot.val(), "key": req.params.key });
        }
    }, function (error) {
        res.render("index", {"data": null});
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