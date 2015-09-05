var THREE = require('three');
THREE.OBJLoader = require('./lib/objLoader')(THREE);
var loader = new THREE.OBJLoader();
var morpher = require('./lib/generateMorphTargets');
var maps = require('./lib/envMaps');
var _ = require('lodash');

var mouseX = 0;
var mouseY = 0;
windowHalfX = window.innerWidth / 2;
windowHalfY = window.innerHeight / 2;
var thing = new THREE.Mesh();
var fs = require('./lib/shaders/fragment.frag')();
var vs = require('./lib/shaders/vertex.vert')();

var renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.domElement.addEventListener('mousemove', function (event) {
  event.preventDefault();
  mouseX = (event.clientX - window.innerWidth / 2);
  mouseY = (event.clientY - window.innerHeight / 2);
}, false);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.z = 1700;
camera.position.y = 150;

var geometry = new THREE.PlaneBufferGeometry(1600, 1000, 150, 150);

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

var ambient = new THREE.AmbientLight(0xffffff);
scene.add(ambient);

loader.load('./objects/moala.obj', function (object) {
  thing = object.children[0];
  morpher(thing.geometry);
  thing.updateMorphTargets();

  thing.material = new THREE.MeshLambertMaterial({
    envMap: maps.reflection,
    morphTargets: true,
    shininess: 10,
    wireframe: false
  });
  thing.position.x = -500;
  thing.position.y = -200;
  thing.position.z = 900;
  thing.scale.x = 0.4;
  thing.scale.y = 0.4;
  thing.scale.z = 0.5;
  scene.add(thing);
});

document.addEventListener('mousemove', function (event) {
  mouseX = (event.clientX - windowHalfX) * 1.05;
  mouseY = (event.clientY - windowHalfY) * 1.5;
});
var mesh = new THREE.Mesh(geometry, material);
mesh.position.x = -200;
scene.add(mesh);

function animate() {
  requestAnimationFrame(animate);
  camera.position.x += (mouseX - camera.position.x) * 0.005;
  camera.position.y += (-mouseY - camera.position.y) * 0.005;
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
  thing.morphTargetInfluences[0] = (Math.sin(Date.now() * 0.001)) * 0.03;
}

animate();