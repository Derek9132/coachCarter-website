import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { element, texture } from 'three/tsl';

// URLs

const ballURL = new URL('/Models/soccerBall2.glb', import.meta.url);


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

// store pentagons 
const pentaList = [];

let ball;
ballLoader.load(ballURL.href, function(gltf) {
  ball = gltf.scene;
  ball.position.set(-130,0,0);
  ball.scale.set(115,115,115);
  spotlight.target = ball;

  gltf.scene.traverse((child) => {
    if (child.name.startsWith("penta")) {
      pentaList.push(child);
    }
  });

  const imageLoader = new THREE.TextureLoader();

  const texture = imageLoader.load("/Images/carter-grayscale.png");

  const circularMaskedMaterial = new THREE.ShaderMaterial({
    uniforms: {
      map: { value: texture },
    },
    vertexShader: `
      varying vec2 vUv;
  
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      varying vec2 vUv;
  
      void main() {
        vec2 center = vUv - vec2(0.5);
        float dist = length(center);
  
        float circleMask = smoothstep(0.5, 0.15, dist); 
  
        vec4 texColor = texture2D(map, vUv);
  
        vec3 finalColor = mix(vec3(0.0), texColor.rgb, circleMask);
  
        gl_FragColor = vec4(finalColor, 1.0); // Fully opaque
      }
    `,
    transparent: false, // No transparency — image is solid inside circle
    depthWrite: true,
  });

  //pentaList[0].material = grayscaleBlendMaterial;
  
  pentaList.forEach((element, index) => {
    element.material = circularMaskedMaterial;
  });

  scene.add(ball);
  scene.add(spotlight.target);

  animate();
})

// rotate ball
let isDragging = false;

let previousMousePosition = {
  x: 0,
  y: 0
};

const canvas = document.getElementById("canvas");
const raycaster = new THREE.Raycaster();

window.addEventListener("mousedown", (e) => {
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

window.addEventListener('mousemove', (e) => {
  if (!isDragging) {
    return;
  }
  else {

  const deltaMove = {
    x: e.movementX || e.mozMovementX || e.webkitMovementX || 0,
    y: e.movementY || e.mozMovementY || e.webkitMovementY || 0
  };

  // Adjust rotation axis and speed
  const rotationSpeed = 0.005;
  ball.rotation.y += deltaMove.x * rotationSpeed;
  ball.rotation.x += deltaMove.y * rotationSpeed;

}});


window.addEventListener('mouseup', () => {
  isDragging = false;
});

window.addEventListener('mouseleave', () => {
  isDragging = false;
});

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
    

    renderer.render(scene, camera);

}



// event listeners

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
  
    renderer.setSize(window.innerWidth, window.innerHeight);
});






