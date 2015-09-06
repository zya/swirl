var THREE = require('three');

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.z = 1500;
camera.position.y = 150;

module.exports = camera;