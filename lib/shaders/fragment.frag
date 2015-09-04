uniform sampler2D sufis;
uniform sampler2D sufis2;
uniform sampler2D sufis3;

varying vec2 vUv;

void main() {
  vec4 f = 1.0 - texture2D(sufis, vUv) * 1.3;
  vec4 f2 = 1.0 - texture2D(sufis2, vUv) * 1.6;
  vec4 f3 = texture2D(sufis3, vUv) * 10.0;
  vec4 mixture = (f * f2 * 4.0);
  if (mixture.x > 1.0) {
    // mixture = vec4(0.5, 0.5, 1.0, 1.0);
  }

  gl_FragColor = mixture;
}
