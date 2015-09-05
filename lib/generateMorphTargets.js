module.exports = function generateMorphTargets(geometry) {

  var vertices = [];

  for (var i = 0; i < geometry.vertices.length; i++) {

    vertices.push(geometry.vertices[i].clone());

    vertices[vertices.length - 1].x *= 1 + Math.random() * 4;
    vertices[vertices.length - 1].y *= 1 + Math.random() * 4;
    vertices[vertices.length - 1].z *= 1 + Math.random() * 4;

  }

  geometry.morphTargets.push({
    name: "target1",
    vertices: vertices
  });

  // geometry.update
};