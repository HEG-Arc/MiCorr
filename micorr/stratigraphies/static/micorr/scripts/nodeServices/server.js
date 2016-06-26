/**
 * Created by thierry on 17.06.16.
 */
var http = require('http');
var dispatcher = require('httpdispatcher');
var url = require('url');
var querystring = require('querystring');

var stratigraphyServices = require('./stratigraphyServices')

//Définition du port d'écoute
const PORT = 8080;

function handleRequest(request, response) {
    try {
        var util = require('util');

        console.log(request.url);
        console.log('request: ' + request.method);

        response.setHeader('Access-Control-Allow-Origin', 'http://localhost');
        //response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        dispatcher.dispatch(request, response);
    } catch (err) {
        console.log(err);
    }
}

//Création du serveur
var server = http.createServer(handleRequest);

//Démarrage du serveur
server.listen(PORT, function () {
    console.log("Server listening on: http://localhost:%s", PORT);
});

//Ecoute des requêtes
//Récupération du svg d'une stratigraphie
dispatcher.onPost("/getStratigraphySvg", function (req, res) {

    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
    //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.writeHead(200, {'Content-Type': 'text/plain'});


    var params = querystring.parse(url.parse(req.url).query);
    console.log('widthParam: ' + params['width']);
    if ('name' in params) {
        var width = 250;
        if ('width' in params) {
            if (params['width'] != undefined) {
                width = params['width'];
            }
        }
        stratigraphyServices.getStratigraphyByName(params['name'], function (stratig) {
            console.log('ready to draw');
            if (stratig != undefined) {

                stratigraphyServices.drawStratigraphy(stratig, width, function (svgresult) {
                    res.write(svgresult);
                    res.end();
                });
            }
            else {
                res.write('');
                res.end();
            }

        });

    }
});

dispatcher.onGet("/exportStratigraphy", function (req, res) {

    console.log('test');
    var params = querystring.parse(url.parse(req.url).query);
    var width = params['width'];
    var format = params['format'];
    if(format != 'pdf'){
        format = 'png';
    }
    stratigraphyServices.getStratigraphyByName(params['name'], function (stratig) {
        console.log('ready to draw');
        if (stratig != undefined) {
            stratigraphyServices.drawStratigraphy(stratig, width, function (svgresult) {
                stratigraphyServices.exportStratigraphy(svgresult, format, width, function (fileresult)
                {
                    res.writeHead(200, {'Content-Type': 'image/png'});
                    res.end(fileresult);
                });
            });
        }
        else {
            //TODO: Gérer les exceptions
            res.write('');
            res.end();
        }
    });

});

