// shader.js

export const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  uniform float time;
  uniform vec3 color1;
  uniform vec3 color2;
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);

    vec3 glow = mix(color1, color2, vUv.y + sin(time + vUv.x * 10.0) * 0.1);
    glow *= intensity;

    gl_FragColor = vec4(glow, 1.0);
  }
`;
  