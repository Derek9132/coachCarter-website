import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { element } from 'three/tsl';

// URLs

const ballURL = new URL('/Models/soccerBall2.glb', import.meta.url);

// shaders
const vertexShader = `
  uniform float time;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float swayStrength = 0.1;
    float frequency = 2.0;
    float phase = sin(time * frequency + instanceMatrix[3].x * 0.5);
    pos.x += phase * swayStrength * pos.y;
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;

  void main() {
    vec3 baseColor = mix(vec3(0.1, 0.4, 0.1), vec3(0.2, 0.8, 0.2), vUv.y);
    gl_FragColor = vec4(baseColor, 1.0);
  }
`;

// loading manager
const loadingManager = new THREE.LoadingManager();

/*loadingManager.onLoad = function() {
    document.getElementById("loadingScreen").style.display = "none";
    animate();
}*/

// where all objects will go
const scene = new THREE.Scene();

// camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.aspect = window.innerWidth/window.innerHeight;
camera.position.y = 0.99;
camera.position.z = 50;

// renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("canvas"),
    alpha: true,
    antialias: true
});

renderer.setClearColor(0x000000, 0);

renderer.setSize(window.innerWidth, window.innerHeight);


// set up lights
//const ambient = new THREE.AmbientLight(0xffffff, 3);

const spotlight = new THREE.SpotLight(0xffffff, 30, 0, 0.314, 0, 0.45)
spotlight.position.set(20, 20, 100)
const helper = new THREE.SpotLightHelper(spotlight)


scene.add(spotlight);

// load in models
const ballLoader = new GLTFLoader(loadingManager);

let ball;
ballLoader.load(ballURL.href, function(gltf) {
  ball = gltf.scene;
  ball.position.set(-130,0,0);
  ball.scale.set(115,115,115);
  spotlight.target = ball;

  // get pentagons 
  const pentaList = [];

  gltf.scene.traverse((child) => {
    if (child.name.startsWith("penta")) {
      pentaList.push(child);
    }
  })

  scene.add(ball);
  scene.add(spotlight.target);

  // blur image 
  animate();
})

// rotate ball
let isDragging = false;

let previousMousePosition = {
  x: 0,
  y: 0
};

const canvas = renderer.domElement;
const raycaster = new THREE.Raycaster()

canvas.addEventListener("mousedown", (e) => {
  let coords = new THREE.Vector2(
    (e.clientX / renderer.domElement.clientWidth) * 2 - 1,
    -((e.clientY / renderer.domElement.clientHeight) * 2 - 1)
  );

  raycaster.setFromCamera(coords, camera);

  const intersections = raycaster.intersectObjects(scene.children, true);

  if (intersections.length > 0) {
    isDragging = true;
  }

});

canvas.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  const deltaMove = {
    x: e.movementX || e.mozMovementX || e.webkitMovementX || 0,
    y: e.movementY || e.mozMovementY || e.webkitMovementY || 0
  };

  // Adjust rotation axis and speed
  const rotationSpeed = 0.005;
  ball.rotation.y += deltaMove.x * rotationSpeed;
  ball.rotation.x += deltaMove.y * rotationSpeed;

});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
});

canvas.addEventListener('mouseleave', () => {
  isDragging = false;
});

//const controls = new OrbitControls(camera, renderer.domElement);

// animate function
function animate() {

    requestAnimationFrame(animate);

    // move ball into view
    if (ball.position.x < -33) {
      ball.position.x += 2;
    }

    // rotate ball
    ball.rotation.x += 0.004;
    ball.rotation.y += 0.004;
    ball.rotation.z += 0.004;
    

    renderer.render(scene, camera);

}



// event listeners

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
  
    renderer.setSize(window.innerWidth, window.innerHeight);
});






