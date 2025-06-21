import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

let scene, camera, renderer, raycaster, mouse;
let planets = [];
let pivotObjects = [];

const planetData = [
  { texture: 'earth.jpg', name: 'planet1', image: 'teman1.jpg', quote: 'True friends are never apart, maybe in distance but never in heart.', radius: 5 },
  { texture: 'mars.jpg', name: 'planet2', image: 'teman2.jpg', quote: 'A friend is someone who knows all about you and still loves you.', radius: 7 },
  { texture: 'jupiter.jpg', name: 'planet3', image: 'teman3.jpg', quote: 'Friendship isn’t about who you’ve known the longest, it’s about who walked into your life and never left.', radius: 9 },
  { texture: '/venus.jpg', name: 'planet4', image: 'teman4.webp', quote: 'Good friends are like stars—you don’t always see them, but you know they’re always there.', radius: 11 }
];

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 6, 22);

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement); // ⬅ jangan diubah

  // Cahaya
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  const directional = new THREE.DirectionalLight(0xffffff, 1);
  directional.position.set(5, 5, 5);
  scene.add(ambient, directional);

  // Raycaster
  mouse = new THREE.Vector2();
  raycaster = new THREE.Raycaster();
  window.addEventListener('click', onClick, false);
  window.addEventListener('resize', onResize, false);

  // Planet
  const loader = new THREE.TextureLoader();
  planetData.forEach((data, i) => {
    const texture = loader.load(data.texture);
    const geometry = new THREE.SphereGeometry(1.3, 64, 64); // ⬅ Ukuran planet diperbesar
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const planet = new THREE.Mesh(geometry, material);

    const pivot = new THREE.Object3D();
    planet.position.x = data.radius;
    planet.position.y = 2; // ⬅ dinaikkan ke atas
    pivot.add(planet);
    scene.add(pivot);

    planet.name = data.name;
    planet.userData = {
      image: data.image,
      quote: data.quote,
      active: false,
      angle: Math.random() * Math.PI * 2,
      speed: 0.0015 + i * 0.0005
    };

    planets.push(planet);
    pivotObjects.push(pivot);
  });

  animate();
}

function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(planets);
  if (intersects.length > 0) {
    const planet = intersects[0].object;
    planets.forEach(p => {
      if (p !== planet) {
        p.scale.set(1, 1, 1);
        p.userData.active = false;
      }
    });

    if (!planet.userData.active) {
      planet.scale.set(1.8, 1.8, 1.8);
      planet.userData.active = true;
      const popup = document.getElementById('popup');
      popup.style.display = 'block';
      document.getElementById('popupImage').src = planet.userData.image;
      document.getElementById('popupQuote').innerText = planet.userData.quote;
    } else {
      planet.scale.set(1, 1, 1);
      planet.userData.active = false;
      document.getElementById('popup').style.display = 'none';
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  planets.forEach((planet, i) => {
    const pivot = pivotObjects[i];
    planet.userData.angle += planet.userData.speed;
    planet.rotation.y += 0.003;
    pivot.rotation.y = planet.userData.angle;
  });
  renderer.render(scene, camera);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
// Bisa tutup popup dengan klik gambarnya
document.getElementById('popup').addEventListener('click', () => {
  document.getElementById('popup').style.display = 'none';
   planets.forEach(p => p.userData.active = false);
  planets.forEach(p => p.scale.set(1, 1, 1));
});
