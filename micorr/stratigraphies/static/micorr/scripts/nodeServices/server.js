/**
 * Created by Thierry Hubmann
 * Implémentation du serveur Node.js, écoute le port spécifié dans la constante PORT
 * et redirige les requêtes au bon service Node.js
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
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        //Le dispatcher va rediriger la requête sur la bonne méthode
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

//Récupération du svg d'une stratigraphie
dispatcher.onPost("/getStratigraphySvg", function (req, res) {

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


//Export de la stratigraphie en PNG ou en PDF
dispatcher.onGet("/exportStratigraphy", function (req, res) {

    console.log('test');
    var params = querystring.parse(url.parse(req.url).query);
    var width = params['width'];
    var format = params['format'];
    if (format != 'pdf') {
        format = 'png';
    }
    /*On récupère la stratigraphie et on la convertit dans le format donné en paramèter avec
    le module inkscape
     */
    stratigraphyServices.getStratigraphyByName(params['name'], function (stratig) {
        console.log('ready to draw');
        if (stratig != undefined) {
            stratigraphyServices.drawStratigraphy(stratig, width, function (svgresult) {

                var Inkscape = require('inkscape')
                if(format == 'png') {
                    inkscape = new Inkscape(['-e']);
                    res.writeHead(200, {'Content-Type': 'image/png'});
                    inkscape.end(svgresult);
                    inkscape.pipe(res);
                }
                if(format == 'pdf'){
                    inkscape = new Inkscape(['--export-pdf']);
                    res.writeHead(200, {'Content-Type': 'application/pdf'});
                    inkscape.end(svgresult);
                    inkscape.pipe(res);
                }

            });
        }
        else {
            //Si la stratigraphie n'existe pas on retourne une erreur
            res.writeHead( 400, 'Stratigraphie non trouvée', {'content-type' : 'text/plain'});
            res.end();
        }
    });

});

