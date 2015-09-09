var THREE = require('three');
THREE.OBJLoader = require('./lib/objLoader');
var dynamics = require('dynamics.js');
var bowser = require('bowser');
var webgl = require('detector-webgl');
var loader = new THREE.OBJLoader();

var scale = require('./lib/scale');
var mesh = require('./lib/mesh').mesh;
var material = require('./lib/mesh').material;
var camera = require('./lib/camera');
var loadSound = require('./lib/loadSound');
var getAmp = require('./lib/calculateAmp');
var canvasOnClickEvent = require('./lib/canvasOnClick');

var context;
var analyser;
var renderer;
var scene;

window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext;

function startAudio() {
  context = new AudioContext();
  analyser = context.createAnalyser();
  analyser.connect(context.destination);
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = 0.7;

  loadSound(context, './audio/zya-swirl.mp3', function (audiobuffer) {
    buffer = audiobuffer;

    play.style.visibility = 'visible';
    dynamics.animate(spinner, {
      opacity: 0
    }, {
      duration: 1000
    });

    setTimeout(function () {
      dynamics.animate(play, {
        opacity: 1
      }, {
        duration: 1000
      });

      play.addEventListener('click', function () {
        renderer.domElement.style.visibility = 'visible';
        pause.style.visibility = 'visible';
        pause.style.opacity = 1;
        play.style.visibility = 'hidden';

        if (firstTime) {
          dynamics.animate(renderer.domElement, {
            opacity: 1
          }, {
            duration: 4000
          });
          setTimeout(function () {
            playTime = context.currentTime;
            firstTime = false;
            src = context.createBufferSource();
            src.connect(analyser);
            src.buffer = buffer;
            src.onended = audioEnded;
            src.start(0);
          }, 1500);
        } else {
          var offset = pauseTime - playTime;
          src = context.createBufferSource();
          src.connect(analyser);
          src.buffer = buffer;
          src.start(0, offset);
          src.onended = audioEnded;
          playTime = context.currentTime;
        }
      });

      pause.addEventListener('click', function () {
        pauseTime = context.currentTime;
        pause.style.visibility = 'hidden';
        play.style.visibility = 'visible';
        src.stop(0);
      });

    }, 1100);
  }, function () {
    console.log('Failed to load or decode the audio');
  });

}

function startWebGL() {
  renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.domElement.style.cursor = 'pointer';

  scene = new THREE.Scene();

  var ambient = new THREE.AmbientLight(0xffffff);
  scene.add(ambient);
  scene.add(mesh);

  document.addEventListener('mousemove', function (event) {
    mouseX = (event.clientX - windowHalfX) * 1.05;
    mouseY = (event.clientY - windowHalfY) * 1.08;
  });

  renderer.domElement.addEventListener('click', canvasOnClickEvent);
}

if (window.AudioContext && webgl) {
  startAudio();
  startWebGL();
}

var play = document.getElementById('play');
var pause = document.getElementById('pause');

var audioData = new Uint8Array(256 / 2);
var buffer;
var src;
var playTime = 0;
var pauseTime = 0;
var firstTime = true;

var audioOptions = {
  somoothing: 0.7,
  inputMin: 80,
  inputMax: 120,
};

if (bowser.safari) {
  audioOptions.inputMin = -120;
  audioOptions.inputMax = -80;
  audioOptions.somoothing = 0.4;
  audioData = new Float32Array(analyser.frequencyBinCount);
}

var mouseX = 0;
var mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var spinner = document.getElementById('spin');

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

function audioEnded() {
  pause.style.visibility = 'hidden';
  play.style.visibility = 'visible';
  firstTime = true;
  dynamics.animate(renderer.domElement, {
    opacity: 0
  }, {
    duration: 3000
  });
}


setInterval(function () {
  if (bowser.safari && webgl && window.AudioContext) {
    analyser.getFloatFrequencyData(audioData);
  } else if (webgl && window.AudioContext) {
    analyser.getByteFrequencyData(audioData);
  }
}, 25);

function animate() {
  requestAnimationFrame(animate);
  camera.position.x += (mouseX - camera.position.x) * 0.009;
  camera.position.y += (-mouseY - camera.position.y) * 0.009;

  camera.lookAt(scene.position);
  var audioAmp = getAmp(audioData);
  material.uniforms.scale.value = scale(audioAmp, audioOptions.inputMin, audioOptions.inputMax, 0.8, 1.7);
  renderer.render(scene, camera);
}

if (!bowser.mobile && webgl && window.AudioContext) {
  animate();
} else {
  play.style.display = 'none';
  spinner.style.display = 'none';
}