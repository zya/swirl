uniform sampler2D sufis;
uniform sampler2D sufis2;
uniform sampler2D sufis3;

varying vec2 vUv;

void main() {
  vec4 f = 1.0 - texture2D(sufis, vUv) * 0.9;
  vec4 f2 = 1.0 - texture2D(sufis2, vUv) * 1.1;
  vec4 f3 = texture2D(sufis3, vUv) * 10.0;
  vec4 mixture = (f * f2 * 2.0);
  if (mixture.x > 1.0) {
    // mixture = vec4(0.5, 0.5, 1.0, 1.0);
  }

  gl_FragColor = mixture;
}