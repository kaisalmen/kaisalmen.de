/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

if (KSX.apps.tools.text === undefined) {
    KSX.apps.tools.text = {};
}

KSX.apps.tools.text.Unit = (function () {

    function Unit(geometry, material) {
        this.geometry = geometry;
        this.material = material;
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    return Unit;
})();


KSX.apps.tools.text.Text = (function () {

    function Text() {
        this.texts = [];
        this.fonts = [];
    }

    Text.prototype.loadListOfFonts = function (basedir, fontList, callback) {
        if (fontList === undefined || fontList === null) {
            console.error('Provided fontList is empty. Aborting...');
            return;
        }

        var scope = this;
        var fontLoader = new KSX.apps.tools.text.FontLoader();
        var promises = [];

        var path;
        var fontName;
        for ( fontName in fontList ) {
            if (fontList.hasOwnProperty(fontName)) {
                path = fontList[fontName];
                promises.push(fontLoader.loadFont(fontName, basedir + path));
            }
        }

        Promise.all( promises ).then(
            function ( results ) {
                for ( var result of results ) {
                    scope.fonts[result.name] = result.text;
                }

                callback();
            }
        ).catch(
            function (error) {
                console.error('The following error occurred: ', error);
            }
        );
    };

    Text.prototype.addText = function (designation, fontName, value, material, size, curveSegments, extrudeSteps, extrudeAmount) {
        var textGeometry = new THREE.TextGeometry(value, {
            font : this.fonts[fontName],
            size: size,
            curveSegments: curveSegments,
            steps: extrudeSteps === undefined ? 0 : extrudeSteps,
            height: extrudeAmount === undefined ? 0 : extrudeAmount
        });

        var textUnit = new KSX.apps.tools.text.Unit(textGeometry, material);
        this.texts[designation] = textUnit;
        return textUnit;
    };

    Text.prototype.getText = function (name) {
        return this.texts[name];
    };

    return Text;
})();


KSX.apps.tools.text.FontLoader = (function () {

    function FontLoader() {
        this.loader = new THREE.FontLoader();
    }

    FontLoader.prototype.loadFont = function (name, path) {
        var scope = this;

        var promise = function (resolve, reject) {

            var onSuccess = function(text) {
                console.log("Loading of font was completed successfully from: " + path);
                resolve({name, text});
            };

            var onProgress = function (event) {
                if (event.lengthComputable) {
                    var percentComplete = event.loaded / event.total * 100;
                    var output = Math.round(percentComplete, 2) + '% downloaded';
                    console.log(output);
                }
            };

            var onError = function (event) {
                console.log("Error of type '" + event.type + "' occurred when trying to load: " + event.src);
                reject(event);
            };

            scope.loader.load(path, onSuccess, onProgress, onError);
        };

        return new Promise(promise);
    };

    return FontLoader;
})();