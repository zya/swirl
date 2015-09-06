var THREE = require('three');

var fs = require('./shaders/fragment.frag')();
var vs = require('./shaders/vertex.vert')();

var video = document.getElementById('video');
var video2 = document.getElementById('video2');

var texture = new THREE.VideoTexture(video);
var texture2 = new THREE.VideoTexture(video2);
texture.minFilter = THREE.LinearFilter;
texture2.minFilter = THREE.LinearFilter;

var geometry = new THREE.PlaneBufferGeometry(1550, 1000, 130, 130);

var uniforms = {
  sufis: {
    type: 't',
    value: texture
  },
  sufis2: {
    type: 't',
    value: texture2
  },
  scale: {
    type: 'f',
    value: 4.0
  },
  multi: {
    type: 'f',
    value: 1.0
  }
};

var material = new THREE.ShaderMaterial({
  vertexShader: vs,
  fragmentShader: fs,
  uniforms: uniforms,
  wireframe: true
});

var mesh = new THREE.Mesh(geometry, material);
mesh.position.x = -50;
mesh.rotation.y = 0.3;

module.exports.mesh = mesh;
module.exports.material = material;