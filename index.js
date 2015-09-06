var THREE = require('three');
THREE.OBJLoader = require('./lib/objLoader');
var dynamics = require('dynamics.js');
var loader = new THREE.OBJLoader();
var scale = require('./lib/scale');
var mesh = require('./lib/mesh').mesh;
var material = require('./lib/mesh').material;
var camera = require('./lib/camera');
var loadSound = require('./lib/loadSound');
var getAmp = require('./lib/calculateAmp');

var context = new AudioContext();
var analyser = context.createAnalyser();
analyser.fftSize = 256;
analyser.smoothingTimeConstant = 0.5;

var audioData = new Uint8Array(analyser.frequencyBinCount);
var buffer;

var mouseX = 0;
var mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var initialXScale = mesh.scale.x;
var initialYScale = mesh.scale.y;
var initialZScale = mesh.scale.z;

var renderer = new THREE.WebGLRenderer({
  antialias: false,
  alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.domElement.style.cursor = 'pointer';

var scene = new THREE.Scene();

var ambient = new THREE.AmbientLight(0xffffff);
scene.add(ambient);
scene.add(mesh);

document.addEventListener('mousemove', function (event) {
  mouseX = (event.clientX - windowHalfX) * 1.05;
  mouseY = (event.clientY - windowHalfY) * 1.08;
});

document.addEventListener('click', function () {
  dynamics.animate(material.uniforms.multi, {
    value: 1.2
  }, {
    type: dynamics.spring,
    duration: 700,
    friction: 346,
    anticipationSize: 124,
    anticipationStrength: 247
  });

  dynamics.animate(mesh.scale, {
    x: initialXScale + 0.5,
    y: initialYScale + 0.5,
    z: initialZScale + 0.5
  }, {
    type: dynamics.spring,
    duration: 700,
    friction: 346,
    anticipationSize: 124,
    anticipationStrength: 247
  });

  setTimeout(function () {
    dynamics.animate(material.uniforms.multi, {
      value: 1
    }, {
      type: dynamics.spring,
      duration: 90,
    });

    dynamics.animate(mesh.scale, {
      x: initialXScale,
      y: initialYScale,
      z: initialZScale
    }, {
      type: dynamics.spring,
      duration: 900
    });
  }, 900);
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

setInterval(function () {
  analyser.getByteFrequencyData(audioData);
}, 50);

function animate() {
  requestAnimationFrame(animate);
  camera.position.x += (mouseX - camera.position.x) * 0.005;
  camera.position.y += (-mouseY - camera.position.y) * 0.009;
  camera.lookAt(scene.position);
  var audioAmp = getAmp(audioData);
  material.uniforms.scale.value = scale(audioAmp, 80, 120, 0.6, 1.4);
  renderer.render(scene, camera);
}

animate();