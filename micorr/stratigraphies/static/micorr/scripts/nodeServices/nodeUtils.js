/**
 * Created by Thierry Hubmann
 * Module contenant des fonctions générales utiles à Node.js
 */
module.exports = {

    /**
     * Cette méthode permet d'appeller la libraire SVG.js pour node
     * On importe directement aussi le fichier absorb qui permet d'intégrer le contenu de fichiers SVG
     * @param win l'élément window virtuel créé par JSDOM
     */
    getDrawer(win){
        const SVG=require('svg.js')(win);
        return(SVG);
        //var drawer =  SVG(win.document.documentElement);
        //var absorb = require('../dependencies/svg.absorb.js')(win);
    },

    /**
     * Cette méthode récupère le contenu d'un fichier SVG donné en paramètre
     * @param url l'url du fichier
     * @param callback
     * @returns retourne un String contenant tout le SVG contenu dans le fichier
     */
    getSvgFileContent: function (url) {
        console.log('SUCCESS')
        fs = require('fs')

        //On se place dynamiquement à la racine du projet
        process.chdir(__dirname);
        process.chdir("../../../../");
        console.log(url);
        //On supprimer le ../ devant l'url
        var url = url.substring(3);

        //Lecture synchrone du fichier pour retourner immédiatement le résultat
        var result = fs.readFileSync(url, 'utf8');

        return result;

    }
}
