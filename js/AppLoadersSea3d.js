/**
 * Created by Kai Salmen on 2014.09.04
 *
 * Separated Sea3d loader from other loaders
 */
APPL.loaders.sea3d = {
    loader : null
}
APPL.loaders.sea3d.functions = {
    init: function () {
        APPL.loaders.sea3d.loader = new THREE.SEA3D();
    },
    load : function (filename, fileSea3d) {
        APPL.loaders.functions.logStart("Started Sead3d loading: " + filename);
        APPL.loaders.sea3d.loader.onComplete = function( e ) {
            APPL.loaders.sea3d.functions.postLoad();
        }
        APPL.loaders.sea3d.loader.container = APPG.scenes.perspective.scene;

        // compatible mode
        APPL.loaders.sea3d.loader.parser = THREE.SEA3D.DEFAULT;
        APPL.loaders.sea3d.loader.load(fileSea3d);
    },
    postLoad: function () {
        // get camera from 3ds Max if exist
        // reset time for keyframe animation
        SEA3D.AnimationHandler.setTime( 0 );
        APPL.loaders.functions.logEnd("Sea3d loader completed: ");
    }
}
