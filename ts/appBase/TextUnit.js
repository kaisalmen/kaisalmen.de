/**
 * Created by Kai Salmen on 10.09.2015.
 */
/// <reference path="../../libs/ts/threejs/three.d.ts" />
var TextUnit = (function () {
    function TextUnit(geometry, material) {
        this.geometry = geometry;
        this.material = material;
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }
    return TextUnit;
})();
//# sourceMappingURL=TextUnit.js.map