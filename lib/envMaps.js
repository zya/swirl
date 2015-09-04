var THREE = require('three');
var maps = (function() {

  var path = '/images/cubemap/';
  var format = '.jpg';
  var urls = [
    path + 'px' + format, path + 'nx' + format,
    path + 'py' + format, path + 'ny' + format,
    path + 'pz' + format, path + 'nz' + format
  ];

  var textureCube = THREE.ImageUtils.loadTextureCube(urls, THREE.CubeRefractionMapping);
  var reflectionCube = THREE.ImageUtils.loadTextureCube(urls);
  reflectionCube.format = THREE.RGBFormat;

  var refractionCube = new THREE.Texture(reflectionCube.image, THREE.CubeRefractionMapping);
  reflectionCube.format = THREE.RGBFormat;

  return {
    none: null,
    reflection: reflectionCube,
    refraction: refractionCube
  };

})();

module.exports = maps;
