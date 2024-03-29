/**
 * Created by Thierry Hubmann
 * Implémentation du serveur Node.js, écoute le port spécifié dans la constante PORT
 * et redirige les requêtes au bon service Node.js
 */
var http = require('http');
var HttpDispatcher = require('httpdispatcher');
var dispatcher     = new HttpDispatcher();
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
    console.log('Current directory: ' + process.cwd());
    // Change working dir to /app/dist/nodeServices to access svg and png files
    // referred to as ../static/micorr/... in /app/dist/static
    process.chdir(__dirname);
    console.log('Change dir to: ' + process.cwd());
});

//Récupération du svg d'une stratigraphie
dispatcher.onGet(/\/getStratigraphySvg\/*/, function (req, res) {
    res.writeHead(200, {'Content-Type': 'image/svg+xml'});
    var params = querystring.parse(url.parse(req.url).query);
    console.log('widthParam: ' + params['width']);
    if ('name' in params) {
        let width = params['width'] ? parseInt(params['width']) : 250;
        let colourFamily = params['colourFamily'] ? params['colourFamily'] : 'colourFamily';
        let binocularObservationMode = params['observationMode'] != 'CS';
        stratigraphyServices.getStratigraphyByName(params['name'], function (stratig) {
            console.log('ready to draw');
            if (stratig != undefined) {
                stratig['colourFamily'] = colourFamily;
                stratig.observationMode['binocular'] = binocularObservationMode;
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
dispatcher.onGet(/\/exportStratigraphy\/*/, function (req, res) {
    var params = querystring.parse(url.parse(req.url).query);
    var width = params['width'];
    var format = params['format'];
    let colourFamily = params['colourFamily'] ? params['colourFamily'] : 'colourFamily';
    let binocularObservationMode = params['observationMode'] != 'CS';

    stratigraphyServices.getStratigraphyByName(params['name'], function (stratig) {
        console.log('ready to draw');
        if (stratig != undefined) {
            stratig.colourFamily = colourFamily;
            stratig.observationMode['binocular'] = binocularObservationMode;
            stratigraphyServices.drawStratigraphy(stratig, width, function (svgresult) {
                // we replace standard href by deprecated xlink:href in the svg output by recent svg.js (2.6.3)
                // as it is not yet supported by latest svg2png/phantomjs (2.1.1) and all embedded images
                // are removed otherwise
                svgresult = svgresult.replace(/href/g, 'xlink:href');
                if(format == 'png') {
                    const svg2png = require("svg2png");
                    svg2png(svgresult, { width: width }).then(function(buffer) {
                        res.writeHead(200, {'Content-Type': 'image/png'});
                        res.write(buffer);
                        res.end()}).catch(function(e) { console.error(e)});
                }
                else if(format == 'pngi') {
                    var Inkscape = require('inkscape')
                    inkscape = new Inkscape(['-e']);
                    res.writeHead(200, {'Content-Type': 'image/png'});
                    inkscape.end(svgresult);
                    inkscape.pipe(res);
                }
                else if(format == 'pdf'){
                    var Inkscape = require('inkscape')
                    inkscape = new Inkscape(['--export-pdf']);
                    res.writeHead(200, {'Content-Type': 'application/pdf'});
                    inkscape.end(svgresult);
                    inkscape.pipe(res);
                }
                else { // defaulting to svg format
                    res.writeHead(200, {'Content-Type': 'image/svg+xml'});
                    res.write(svgresult);
                    res.end();
                }
            });
        }
        else {
            //Si la stratigraphie n'existe pas on retourne une erreur
            res.writeHead( 404, 'Stratigraphy not found', {'content-type' : 'text/plain'});
            res.end();
        }
    });

});

