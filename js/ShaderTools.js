/**
 * Created by Kai on 2014.03.17
 */

var ShaderTools = {};

ShaderTools.FileUtils = {
    loadShader : function(path, printShader, shaderName) {
        return $.get(path, function(data) {});
    },
    printShader : function(shaderObj, shaderName) {
        console.log(shaderName + ":");
        console.log(shaderObj);
    }
}
ShaderTools.hexToRGB = function(hexInput, floatUVSpace) {
    var divider = 1;
    if (floatUVSpace) {
        divider = 255.0;
    }
    var rgb = [ 0, 0, 0];
    var hexNormalized = hexInput.charAt(0) == "#" ? hexInput.substring(1, 7) : hexInput;
    rgb[0] = parseInt((hexNormalized).substring(0, 2), 16) / divider;
    rgb[1] = parseInt((hexNormalized).substring(2, 4), 16) / divider;
    rgb[2] = parseInt((hexNormalized).substring(4, 6), 16) / divider;
    return rgb;
}