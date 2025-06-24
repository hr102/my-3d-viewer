
import * as THREE from 'https://cdn.skypack.dev/three';
import { OrbitControls } from 'https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, controls, mixer;
let autoRotate = true;
let model;

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1, 3);

  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.autoRotate = true;

  const light = new THREE.HemisphereLight(0xffffff, 0x444444);
  scene.add(light);

  const loader = new GLTFLoader();
  loader.load('models/model.glb', (gltf) => {
    model = gltf.scene;
    scene.add(model);
    if (gltf.animations.length) {
      mixer = new THREE.AnimationMixer(model);
      const action = mixer.clipAction(gltf.animations[0]);
      action.play();
    }
  });

  window.addEventListener('resize', onWindowResize);

  document.getElementById('rotateBtn').onclick = () => {
    autoRotate = !autoRotate;
    controls.autoRotate = autoRotate;
    document.getElementById('rotateBtn').innerText = `Auto Rotate: ${autoRotate ? 'ON' : 'OFF'}`;
  };

  document.getElementById('colorBtn').onclick = () => {
    if (model) {
      model.traverse(child => {
        if (child.isMesh) {
          child.material.color.setHex(Math.random() * 0xffffff);
        }
      });
    }
  };

  document.getElementById('animBtn').onclick = () => {
    if (mixer) mixer.timeScale = mixer.timeScale === 0 ? 1 : 0;
  };

  document.getElementById('bgPicker').oninput = (e) => {
    scene.background = new THREE.Color(e.target.value);
  };

  document.getElementById('arBtn').onclick = () => {
    alert('AR Mode: Use <model-viewer> or WebXR for AR!');
  };
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  if (mixer) mixer.update(0.01);
  controls.update();
  renderer.render(scene, camera);
}
