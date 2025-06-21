import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

let scene, camera, renderer;
let starField, galaxies = [];
let asteroidGroup = new THREE.Group();
const shootingStars = [];
const spiralData = []; // simpan rotasi bintik spiral

function init() {
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x080014, 0.0006);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1.5, 12);

  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('starfield'),
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // === BINTANG LATAR ===
  const starGeometry = new THREE.BufferGeometry();
  const starCount = 5000;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i++) {
    starPositions[i] = (Math.random() - 0.5) * 2000;
  }
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.7,
    transparent: true,
    opacity: 0.8
  });
  starField = new THREE.Points(starGeometry, starMaterial);
  scene.add(starField);

  // === GALAKSI SPIRAL BERPUTAR ===
  const spiralGeometry = new THREE.BufferGeometry();
  const spiralPoints = [];
  const spiralColors = [];
  const armCount = 5;
  const spiralTightness = 0.22;
  const totalStars = 6000;

  for (let i = 0; i < totalStars; i++) {
    const arm = i % armCount;
    const baseAngle = i * spiralTightness + (arm * (2 * Math.PI / armCount));
    const radius = 6 + Math.random() * 10;
    const randomness = (Math.random() - 0.5) * 1.3;
    const y = (Math.random() - 0.5) * 1.4;

    const angle = baseAngle;
    const x = Math.cos(angle) * radius + randomness;
    const z = Math.sin(angle) * radius + randomness;

    spiralPoints.push(x, y, z);
    spiralData.push({ angle, radius, y, randomness });

    const palette = [
      new THREE.Color(0x89CFF0), new THREE.Color(0x0000FF),
      new THREE.Color(0x8A2BE2), new THREE.Color(0x00FF7F),
      new THREE.Color(0xFFA500), new THREE.Color(0xFF69B4),
      new THREE.Color(0xFFFFFF)
    ];
    const color = palette[i % palette.length];
    spiralColors.push(color.r, color.g, color.b);
  }

  spiralGeometry.setAttribute('position', new THREE.Float32BufferAttribute(spiralPoints, 3));
  spiralGeometry.setAttribute('color', new THREE.Float32BufferAttribute(spiralColors, 3));

  const spiralMaterial = new THREE.PointsMaterial({
    size: 0.12,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const spiralGalaxy = new THREE.Points(spiralGeometry, spiralMaterial);
  spiralGalaxy.userData.rotateSpeed = 0.0003;
  spiralGalaxy.geometry.userData.originalPositions = spiralPoints;

  galaxies.push(spiralGalaxy);
  scene.add(spiralGalaxy);

  // === ASTEROID BELT ===
  const loader = new THREE.TextureLoader();
  const rockTexture = loader.load('rock.png');
  for (let i = 0; i < 250; i++) {
    const size = Math.random() * 0.3 + 0.1;
    const geo = new THREE.IcosahedronGeometry(size, 0);
    const mat = new THREE.MeshStandardMaterial({ map: rockTexture, roughness: 0.85, metalness: 0.15 });

    const asteroid = new THREE.Mesh(geo, mat);
    const radius = 7 + Math.random() * 5;
    const angle = Math.random() * Math.PI * 2;
    asteroid.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 2, Math.sin(angle) * radius);
    asteroid.rotation.set(Math.random(), Math.random(), Math.random());
    asteroid.userData = { angle, radius, speed: 0.0004 + Math.random() * 0.0003 };

    asteroidGroup.add(asteroid);
  }
  scene.add(asteroidGroup);

  // === BINTANG JATUH ===
  for (let i = 0; i < 3; i++) {
    const geo = new THREE.SphereGeometry(0.05, 6, 6);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geo, mat);
    resetShootingStar(star);
    shootingStars.push(star);
    scene.add(star);
  }

  const ambient = new THREE.AmbientLight(0x8888ff, 0.4);
  const directional = new THREE.DirectionalLight(0xffffff, 0.5);
  directional.position.set(4, 10, 8);
  scene.add(ambient, directional);

  window.addEventListener('resize', onResize);
}

function resetShootingStar(star) {
  star.position.set(Math.random() * 20 - 10, Math.random() * 5 + 5, -30);
  star.userData.vx = -0.3 - Math.random() * 0.2;
  star.userData.vy = -0.2 - Math.random() * 0.1;
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  // Geser bintang latar
  const pos = starField.geometry.attributes.position.array;
  for (let i = 0; i < pos.length; i += 3) {
    pos[i + 2] += 0.1;
    if (pos[i + 2] > 1000) pos[i + 2] = -1000;
  }
  starField.geometry.attributes.position.needsUpdate = true;

  // Spiral bintik-bintik ikut muter
  const spiral = galaxies[0];
  const positions = spiral.geometry.attributes.position.array;
  for (let i = 0; i < spiralData.length; i++) {
    const d = spiralData[i];
    d.angle += 0.0006;

    const x = Math.cos(d.angle) * d.radius + d.randomness;
    const z = Math.sin(d.angle) * d.radius + d.randomness;

    positions[i * 3] = x;
    positions[i * 3 + 1] = d.y;
    positions[i * 3 + 2] = z;
  }
  spiral.geometry.attributes.position.needsUpdate = true;

  // Asteroid
  asteroidGroup.children.forEach((ast) => {
    ast.userData.angle += ast.userData.speed;
    ast.position.x = Math.cos(ast.userData.angle) * ast.userData.radius;
    ast.position.z = Math.sin(ast.userData.angle) * ast.userData.radius;
    ast.rotation.x += 0.005;
    ast.rotation.y += 0.003;
  });

  // Bintang jatuh
  shootingStars.forEach((star) => {
    star.position.x += star.userData.vx;
    star.position.y += star.userData.vy;
    if (star.position.y < -5) resetShootingStar(star);
  });

  renderer.render(scene, camera);
}

init();
animate();
