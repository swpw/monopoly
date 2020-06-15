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
camera.position.set(-2, 4, 1.5)
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
  const mesh = models.children[0]
  mesh.rotateY(90 * Math.PI / 180)

  const terrain = new Terrain( 11, 2, mesh )
}


class Terrain {
  constructor( map_size, side_buildings_size, terrain_mesh ) {
    this.size = map_size
    this.side_size = side_buildings_size
    this.mesh = terrain_mesh

    this.createGroups()
    this.createTerrainTiles()

    console.log(scene)
  }

  createGroups(){
    // Inject scene with `gameboard` groups
    /*

    gameboard_group:
      -mainTerrain_group:
        -houses_group -> X amount of tiles
        -roads_group -> X amount of tiles
        -buildings_group -> X amount of tiles
      -sideTerrain_group:
        - X amount of collumns -> X amount of tiles

    */

    const gameboard_group = new THREE.Group(),
      mainTerrain_group = new THREE.Group(),
      sideTerrain_group = new THREE.Group(),
      houses_group = new THREE.Group(),
      roads_group = new THREE.Group(),
      buildings_group = new THREE.Group()

    gameboard_group.name = 'gameboard_group'
    mainTerrain_group.name = 'mainTerrain_group'
    sideTerrain_group.name = 'sideTerrain_group'
    houses_group.name = 'houses_group'
    roads_group.name = 'roads_group'
    buildings_group.name = 'buildings_group'

    for( let i = 0; i < this.size; i++ ){
      const tile1 = new THREE.Group()
      const tile2 = new THREE.Group()
      const tile3 = new THREE.Group()

      tile1.name = `tile-${ i + 1 }`
      tile2.name = `tile-${ i + 1 }`
      tile3.name = `tile-${ i + 1 }`

      houses_group.add(tile1)
      roads_group.add(tile2)
      buildings_group.add(tile3)
    }

    for( let i = 0; i < this.side_size; i++ ){
      const collumn = new THREE.Group()

      collumn.name = `collumn-${ i + 1 }`

      for( let j = 0; j < this.size; j++ ){
        const tile = new THREE.Group()

        tile.name = `tile-${ j + 1 }`

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

  createTerrainTiles(){
    // Select specific groups

    const gameboard = scene.children.find(e => e.name === 'gameboard_group')

    const mainTerrain_children = gameboard.children[0].children.filter(e => e)

    const houses_tiles = mainTerrain_children.filter(e => e.name === 'houses_group')[0].children
    const roads_tiles = mainTerrain_children.filter(e => e.name === 'roads_group')[0].children
    const buildings_tiles = mainTerrain_children.filter(e => e.name === 'buildings_group')[0].children

    // Add meshes to specific groups

    houses_tiles.map((e, i)=> {
      const mesh = this.mesh.clone()
      mesh.name = 'tile'
      mesh.position.set(0, 0, i * -1.7)   // hard written position of tiles
      e.add(mesh)
    })

    roads_tiles.map((e, i)=> {
      const j = i + .5

      const mesh = this.mesh.clone()
      mesh.name = 'tile'
      mesh.position.set(1.5, 0, j * -1.7)   // hard written position of tiles
      e.add(mesh)
    })

    buildings_tiles.map((e, i)=> {
      const j = i + 1

      const mesh = this.mesh.clone()
      mesh.name = 'tile'
      mesh.position.set(3, 0, j * -1.7)   // hard written position of tiles
      e.add(mesh)
    })

  }
}
