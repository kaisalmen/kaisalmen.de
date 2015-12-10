/**
 * Created by Kai Salmen.
 */

"use strict";

/**
 * This class was started with typescript
 */
KSX.apps.core.TextUnit = (function () {

    function TextUnit(geometry, material) {
        this.geometry = geometry;
        this.material = material;
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    return TextUnit;
})();
