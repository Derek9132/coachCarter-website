import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { element } from 'three/tsl';

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



// load in models


// loading manager
const loadingManager = new THREE.LoadingManager();

loadingManager.onLoad = function() {
    document.getElementById("loadingScreen").style.display = "none";
    animate();
}

// where all objects will go
const scene = new THREE.Scene();

// camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.aspect = window.innerWidth/window.innerHeight;
camera.position.y = 0.99
camera.position.z = 50

// renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("canvas"),
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);


// Make skybox
const boxLoader = new THREE.CubeTextureLoader();

const textures = boxLoader.load([
    "/Daylight Box_Right.png",
    "/Daylight Box_Left.png",
    "/Daylight Box_Top.png",
    "/Daylight Box_Bottom.png",
    "/Daylight Box_Front.png",
    "/Daylight Box_Back.png",
]);

scene.background = textures


// set up lights
const ambient = new THREE.AmbientLight()

scene.add(ambient)

// Make grass
const bladeGeometry = new THREE.PlaneGeometry(0.1, 1, 1, 4); // more segments = smoother bending
bladeGeometry.translate(0, 0.5, 0); // anchor at bottom

const count = 500000;
const dummy = new THREE.Object3D();

// Custom shader material will go here later
const grassMaterial = new THREE.ShaderMaterial({
  vertexShader, // placeholder
  fragmentShader, // placeholder
  uniforms: {
    time: { value: 0.0 }
  },
  side: THREE.DoubleSide
});

const instancedMesh = new THREE.InstancedMesh(bladeGeometry, grassMaterial, count);
scene.add(instancedMesh);

// Positioning blades
for (let i = 0; i < count; i++) {
  dummy.position.set(
    (Math.random() - 0.5) * 100, // X
    0,
    (Math.random() - 0.5) * 100  // Z
  );
  dummy.rotation.y = Math.random() * Math.PI;
  dummy.scale.setScalar(0.5 + Math.random() * 0.5); // vary height
  dummy.updateMatrix();
  instancedMesh.setMatrixAt(i, dummy.matrix);
}

// import football


// import player



// animate function
function animate() {

    requestAnimationFrame(animate)

    renderer.render(scene, camera)

}

animate()


// event listeners

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix()
  
    renderer.setSize(window.innerWidth, window.innerHeight);
});






