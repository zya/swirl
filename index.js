var THREE = require('three');
THREE.OBJLoader = require('./lib/objLoader')(THREE);
var loader = new THREE.OBJLoader();
var _ = require('lodash');

var mouseX = 0;
var mouseY = 0;
var fs = require('./lib/shaders/fragment.frag')();
var vs = require('./lib/shaders/vertex.vert')();

var renderer = new THREE.WebGLRenderer({
  antialias: true
});


renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.domElement.addEventListener('mousemove', function(event) {
  event.preventDefault();
  mouseX = (event.clientX - window.innerWidth / 2);
  mouseY = (event.clientY - window.innerHeight / 2);
}, false);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.z = 1600;

var geometry = new THREE.PlaneBufferGeometry(1600, 900, 100, 150);

var video = document.getElementById('video');
var video2 = document.getElementById('video2');
var video3 = document.getElementById('video3');

var texture = new THREE.VideoTexture(video);
var texture2 = new THREE.VideoTexture(video2);
var texture3 = new THREE.VideoTexture(video3);
texture.minFilter = THREE.LinearFilter;
texture2.minFilter = THREE.LinearFilter;
texture3.minFilter = THREE.LinearFilter;

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
  vamp: {
    type: 'f',
    value: 2.0
  },
  scale: {
    type: 'f',
    value: 2.0
  }
};

var material = new THREE.ShaderMaterial({
  vertexShader: vs,
  fragmentShader: fs,
  uniforms: uniforms,
  wireframe: true
});

loader.load('./objects/male02.obj', function(object) {
  scene.add(object);
});

var mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.y += mouseX * 0.000001;
  mesh.rotation.x += mouseY * 0.000001;
  renderer.render(scene, camera);
}

animate();
