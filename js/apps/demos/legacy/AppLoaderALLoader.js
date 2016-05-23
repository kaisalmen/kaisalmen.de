/**
 * Created by Kai Salmen on 2014.09.04
 *
 * Separated ALLoader loader from other loaders
 */
APPL.loaders.alloader = {
    loader : null
};
APPL.loaders.alloader.functions = {
    init: function () {
        APPL.loaders.functions.init();
        APPL.loaders.alloader.loader = new THREE.ALLoader();
    },
    load : function (fileJson) {
        APPL.loaders.functions.logStart("Started ALLoader json loading...");
        APPL.loaders.alloader.loader.load(fileJson, APPL.loaders.alloader.functions.postLoad);
    },
    parse : function (filename, data) {
        var json = JSON.parse(data);
        APPL.loaders.functions.logStart("Started ALLoader json parsing: " + filename);
        APPL.loaders.alloader.loader.parse(json, APPL.loaders.alloader.functions.postLoad);
    },
    postLoad: function (myObject3d) {
        myObject3d.meshes.map(
            function (child) {
                APPG.scenes.perspective.scene.add(child)
            }
        );
        APPL.loaders.functions.logEnd("ALLoader json loader completed: ");
    }
};