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
camera.position.z = 1600;

var geometry = new THREE.PlaneBufferGeometry(1600, 900, 100, 100);

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

loader.load('./objects/nas-1.obj', function (object) {
  object.traverse(function (traversed) {
    console.log(traversed);
    thing = traversed.children[0];
    morpher(thing.geometry);
    geometry.normalizeNormals();
    thing.material = new THREE.MeshLambertMaterial({
      envMap: maps.reflection,
      morphTargets: true,
      specular: 0x009900,
      shininess: 30,
      wireframe: false
    });
    thing.position.x = -1400;
    thing.position.y = -600;
    thing.position.z = 190;
    thing.scale.x = 2.8;
    thing.scale.y = 2.8;
    scene.add(thing);
  });
});

document.addEventListener('mousemove', function (event) {
  mouseX = (event.clientX - windowHalfX) * 1.05;
  mouseY = (event.clientY - windowHalfY) * 1.5;
});
var mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

function animate() {
  requestAnimationFrame(animate);
  camera.position.x += (mouseX - camera.position.x) * 0.005;
  camera.position.y += (-mouseY - camera.position.y) * 0.005;
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}

animate();