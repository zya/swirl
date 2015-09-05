var THREE = require('three');
THREE.OBJLoader = require('./lib/objLoader');
var loader = new THREE.OBJLoader();
var scale = require('./lib/scale');
var mesh = require('./lib/mesh').mesh;
var material = require('./lib/mesh').material;
var camera = require('./lib/camera');
var loadSound = require('./lib/loadSound');

var mouseX = 0;
var mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var ambient = new THREE.AmbientLight(0xffffff);
scene.add(ambient);
scene.add(mesh);

document.addEventListener('mousemove', function (event) {
  mouseX = (event.clientX - windowHalfX) * 1.05;
  mouseY = (event.clientY - windowHalfY) * 1.08;
});

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

function animate() {
  requestAnimationFrame(animate);
  camera.position.x += (mouseX - camera.position.x) * 0.005;
  camera.position.y += (-mouseY - camera.position.y) * 0.009;
  camera.lookAt(scene.position);

  var sin = Math.sin(Date.now() * 0.002);
  material.uniforms.scale.value = scale(sin, -1.0, 1.0, 0.8, 1.1);
  renderer.render(scene, camera);
}

animate();