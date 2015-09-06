var dynamics = require('dynamics.js');
var material = require('./mesh').material;
var mesh = require('./mesh').mesh;

var initialXScale = mesh.scale.x;
var initialYScale = mesh.scale.y;
var initialZScale = mesh.scale.z;
var count = 1;

module.exports = function () {
  if (count % 2) {
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

    dynamics.animate(material.uniforms.multi, {
      value: 1.2
    }, {
      type: dynamics.spring,
      duration: 700,
      friction: 346,
      anticipationSize: 124,
      anticipationStrength: 247
    });
  } else {
    dynamics.animate(mesh.scale, {
      x: initialXScale,
      y: initialYScale,
      z: initialZScale
    }, {
      type: dynamics.spring,
      duration: 900
    });

    dynamics.animate(material.uniforms.multi, {
      value: 1
    }, {
      type: dynamics.spring,
      duration: 90,
    });
  }

  count++;
};