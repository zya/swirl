uniform sampler2D sufis;
uniform sampler2D sufis2;
uniform float scale;

varying vec2 vUv;

void main() {
  vec4 f = 1.0 - texture2D(sufis, vUv) * 1.3;
  vec4 f2 = 1.0 - texture2D(sufis2, vUv) * 1.1 * scale; 
  vec4 f3 = texture2D(sufis2, vUv) * 10.0;
  vec4 mixture = (f * f2 * 5.0);

  gl_FragColor = mixture;
}
