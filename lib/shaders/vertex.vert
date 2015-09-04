uniform sampler2D sufis;
uniform sampler2D sufis2;
uniform sampler2D sufis3;
uniform float vamp;
uniform float scale;

varying vec2 vUv;
void main() {
  vUv = uv;
  vec4 color = texture2D(sufis, uv) * 100.0;
  vec4 color2 = texture2D(sufis2, uv) * 0.7;
  vec4 color3 = 1.0 - texture2D(sufis3, uv) * 5.0;

  float depth = (position * color2.r).x * scale;
  float amp = 1.0 - ((position * color.b).z) * 10.0;
  float modulator = color3.x * 20.0;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x + modulator, position.y + amp * color3.r, depth, 1.0);
}
