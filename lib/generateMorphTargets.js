var THREE = require('three');

module.exports = function generateMorphTargets(geometry) {

  var vertices = [],
    scale;

  for (var i = 0; i < 5; i++) {

    vertices.push(new THREE.Vector3());

    scale = 1 + Math.random() * 0.3;

    vertices[vertices.length - 1].x *= scale;
    vertices[vertices.length - 1].y *= scale;
    vertices[vertices.length - 1].z *= scale;

  }

  geometry.morphTargets = [];
  geometry.morphTargets.push({
    name: "target1",
    vertices: vertices
  });

};