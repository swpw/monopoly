import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const createCam = (fov = 75, near = 0.1, far = 1000) =>
  new THREE.PerspectiveCamera(fov, window.innerWidth/window.innerHeight, near, far);


let scene,
  renderer,
  camera,
  controls,
  loader


// SCENE //
scene = new THREE.Scene()


// RENDERER //
renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setClearColor(0x7ec0ee, 1);

renderer.gammaFactor = 1.5;
renderer.gammaInput = true;
renderer.gammaOutput = true;

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild( renderer.domElement );


// CAMERA //
camera = createCam()
camera.position.set(0, 5, 0)
scene.add(camera)

// CONTROLS //
controls = new OrbitControls( camera, renderer.domElement );


// RESIZE
window.addEventListener('resize', () => {
  const { innerHeight, innerWidth } = window;

  renderer.setSize(innerWidth, innerHeight);

  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
});


// RENDER LOOP
const onAnimationFrameHandler = time => {
  renderer.render(scene, camera);

  update(time)

  window.requestAnimationFrame(onAnimationFrameHandler);
}
window.requestAnimationFrame(onAnimationFrameHandler);


const update = (time) => {
  controls.update();
}


/**/


{
  const light = new THREE.HemisphereLight('#fff', "#030522", 1)
  scene.add(light)
}
