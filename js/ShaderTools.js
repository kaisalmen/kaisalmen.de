/**
 * Created by Kai on 2014.03.17
 */

var ShaderTools = {};

ShaderTools.FileUtils = {
    loadShader : function(path) {
        return $.get(path, function(data) {});
    }
}

function hexToRGB(hexInput) {
    var rgb = [ 0, 0, 0];
    var hexNormalized = hexInput.charAt(0) == "#" ? hexInput.substring(1, 7) : hexInput;
    rgb[0] = parseInt((hexNormalized).substring(0, 2), 16);
    rgb[1] = parseInt((hexNormalized).substring(2, 4), 16);
    rgb[2] = parseInt((hexNormalized).substring(4, 6), 16);
    return rgb;
}