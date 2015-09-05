var THREE = require('three');

var fs = require('./shaders/fragment.frag')();
var vs = require('./shaders/vertex.vert')();

var video = document.getElementById('video');
var video2 = document.getElementById('video2');
var video3 = document.getElementById('video3');

var texture = new THREE.VideoTexture(video);
var texture2 = new THREE.VideoTexture(video2);
var texture3 = new THREE.VideoTexture(video3);
texture.minFilter = THREE.LinearFilter;
texture2.minFilter = THREE.LinearFilter;
texture3.minFilter = THREE.LinearFilter;

var geometry = new THREE.PlaneBufferGeometry(1600, 1000, 150, 150);

var uniforms = {
  sufis: {
    type: 't',
    value: texture
  },
  sufis2: {
    type: 't',
    value: texture2
  },
  sufis3: {
    type: 't',
    value: texture3
  },
  scale: {
    type: 'f',
    value: 4.0
  }
};

var material = new THREE.ShaderMaterial({
  vertexShader: vs,
  fragmentShader: fs,
  uniforms: uniforms,
  wireframe: true
});

var mesh = new THREE.Mesh(geometry, material);
mesh.position.x = -200;

module.exports.mesh = mesh;
module.exports.material = material;