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


let models

loader = new GLTFLoader()

loader.load('./assets/assets.glb', glb => {
  models = glb.scene

  afterLoad()
},
xhr => console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' ),
err => console.error( 'An error happened', err ))


const afterLoad = () => {
  const terrain = new Terrain( 11, 2, models.children[0] )
}


class Terrain {
  constructor( map_size, side_buildings_size, terrain_mesh ) {
    this.size = map_size
    this.side_size = side_buildings_size
    this.mesh = terrain_mesh

    this.createGroups()

    console.log(scene)
  }

  createGroups(){
    const gameboard_group = new THREE.Group(),
      mainTerrain_group = new THREE.Group(),
      sideTerrain_group = new THREE.Group(),
      houses_group = new THREE.Group(),
      roads_group = new THREE.Group(),
      buildings_group = new THREE.Group()

    gameboard_group.uuid = 'gameboard_group'
    mainTerrain_group.uuid = 'mainTerrain_group'
    sideTerrain_group.uuid = 'sideTerrain_group'
    houses_group.uuid = 'houses_group'
    roads_group.uuid = 'roads_group'
    buildings_group.uuid = 'buildings_group'

    for( let i = 0; i < this.size; i++ ){
      const tile = new THREE.Group()

      tile.uuid = `tile-${ i + 1 }`

      houses_group.add(tile.clone())
      roads_group.add(tile.clone())
      buildings_group.add(tile.clone())
    }

    for( let i = 0; i < this.side_size; i++ ){
      const collumn = new THREE.Group()

      collumn.uuid = `collumn-${ i + 1 }`

      for( let j = 0; j < this.size; j++ ){
        const tile = new THREE.Group()

        tile.uuid = `tile-${ j + 1 }`

        collumn.add(tile)
      }

      sideTerrain_group.add(collumn)
    }

    mainTerrain_group.add(houses_group)
    mainTerrain_group.add(roads_group)
    mainTerrain_group.add(buildings_group)

    gameboard_group.add(mainTerrain_group)
    gameboard_group.add(sideTerrain_group)

    scene.add(gameboard_group)
  }
}
