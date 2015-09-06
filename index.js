var THREE = require('three');
THREE.OBJLoader = require('./lib/objLoader');
var loader = new THREE.OBJLoader();
var scale = require('./lib/scale');
var mesh = require('./lib/mesh').mesh;
var material = require('./lib/mesh').material;
var camera = require('./lib/camera');
var loadSound = require('./lib/loadSound');
var getAmp = require('./lib/calculateAmp');

var context = new AudioContext();
var analyser = context.createAnalyser();
analyser.fftSize = 512;
analyser.smoothingTimeConstant = 0.7;

var audioData = new Uint8Array(analyser.frequencyBinCount);
var buffer;

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

loadSound(context, './audio/zya.mp3', function (audiobuffer) {
  buffer = audiobuffer;
  var src = context.createBufferSource();
  src.buffer = buffer;
  src.connect(analyser);
  src.connect(context.destination);
  src.start();
});

function animate() {
  requestAnimationFrame(animate);
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.09;
  analyser.getByteFrequencyData(audioData);
  camera.lookAt(scene.position);
  var audioAmp = getAmp(audioData);
  console.log(audioAmp);
  material.uniforms.scale.value = scale(audioAmp, 80, 120, 0.8, 1.7);
  renderer.render(scene, camera);
}

animate();