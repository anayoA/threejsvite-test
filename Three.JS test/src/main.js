import * as THREE from 'three';
import './style.css'; // import the CSS file so Vite includes it in the build
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // camera controls, needs to be imported separately because it's not part of core Three.js
import gsap from "gsap"; // animation library

// Scene setup
const scene = new THREE.Scene(); 

// Sphere
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83",
});
const sphere = new THREE.Mesh(geometry, material);

scene.add(sphere);

// Plane
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshStandardMaterial({ color: "#00FFF0", side: THREE.DoubleSide }); // double sided so we can see it from below
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; // -MathPI so the normal (vector) faces up
plane.position.y = -geometry.parameters.radius; // sits just below the sphere
scene.add(plane);


// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

// Light
const light = new THREE.PointLight(0xffffff, 100, 100);
light.position.set(0, 10, 10);
scene.add(light);

const backlight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(backlight);


// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100); // Aspect ratio matches renderer size, near and far planes set (clipping planes)
camera.position.z = 20; // Move camera away from origin to view the sphere, as camera and sphere are both at (0,0,0)
scene.add(camera);


// Renderer
const canvas = document.querySelector('.webgl');  // document is the html page, querySelector finds the first element that matches the given CSS selector
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio * 2); // this helps with blurriness on hiDPI screens
renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // smooth camera movement
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

// Resize
window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);

});

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop); // calls the loop function again on the next frame
};

loop();

//Timeline magic, using GSAP.
const tl = gsap.timeline({defaults: {duration: 1}});
tl.fromTo(sphere.scale, {z: 0, x: 0, y:0}, {z:1, x:1, y:1}); // first bracket is the starting point, second is the end point.
tl.fromTo('nav', {y: '-100%'}, {y: '0%'});