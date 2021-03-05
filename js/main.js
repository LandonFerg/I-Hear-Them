var renderer = new THREE.WebGLRenderer({canvas: gameCanvas});
renderer.setPixelRatio( window.devicePixelRatio * 1); // (0.25 is good) change resolution
renderer.physicallyCorrectLights = true;
var scene = new THREE.Scene();
const loader = new THREE.GLTFLoader(); // used to load custom models

scene.background = new THREE.Color('rgb(0, 0, 0)');

const gameHolder = document.getElementById( 'gameHolder' );
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );

camera.position.y = 10;

//camera.position.set(0,0,0);

// White directional light at half intensity shining from the top.
var directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 1 );
directionalLight.castShadow = true;
scene.add( directionalLight );

var spotLight = new THREE.SpotLight( 0xffffff, 0.2 );
spotLight.position.set(0, 100, 0);
spotLight.castShadow = true;
scene.add( spotLight );

var light = new THREE.AmbientLight( 0xcccccc ); // soft white light
scene.add( light );

// const plight = new THREE.PointLight( 'white', 10, 100 );
// plight.position.set( 40, 12, 0 );
// scene.add( light );

// load house
loader.load( '../objects/house01.glb', function ( gltf ) {
  scene.add( gltf.scene );
  gltf.scene.scale.set(30,30,30) // scale here
  directionalLight.target = gltf.scene;
} )

loader.load('../objects/curtains.glb', function( gltf ) {
  scene.add( gltf.scene );
  gltf.scene.scale.set(30,30,30) // scale here
  //  gltf.scene.translateX
  directionalLight.target = gltf.scene;
})

loader.load('../objects/floor.glb', function( gltf ) {
  scene.add( gltf.scene );
  gltf.scene.scale.set(30,1,30) // scale here
  //  gltf.scene.translateX
  gltf.scene.translateY(0.1);
  //directionalLight.target = gltf.scene;
})

// // pp
renderer.autoClear = false; // stops everything idk
var composer = new THREE.EffectComposer(renderer); // define new composer
composer.addPass(new THREE.RenderPass( scene, camera ));

var effect = new THREE.ShaderPass( THREE.DitherShader );
//var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
//seffect.uniforms[ 'scale' ].value = 4;
effect.renderToScreen = true;
composer.addPass( effect );

// //pp

//
// var spotLight = new THREE.SpotLight( 0xffffff );
// spotLight.position.set(0, 100, 0);
// spotLight.castShadow = true;
// scene.add( spotLight );

// controls
var controls = new THREE.PointerLockControls(camera, renderer.domElement ); // control cam

const blocker = document.getElementById( 'menu' ); // menu that blocks on mouse unlocked
const instructions = document.getElementById( 'instructions' );

// event listeners to control mouse lock
instructions.addEventListener( 'click', function () {
  controls.lock();
} );

controls.addEventListener( 'lock', function () {
	instructions.style.display = 'none';
  blocker.style.display = 'none';
} );

controls.addEventListener( 'unlock', function () {

  blocker.style.display = 'block';
  instructions.style.display = '';
  console.log(camera.position);
} );

scene.add( controls.getObject() ); //dk waht this does

let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let movespeed = 5.0;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();



const onKeyDown = function ( event ) {

  switch ( event.code ) {

    case 'ArrowUp':
    case 'KeyW':
      moveForward = true;
      break;

    case 'ArrowLeft':
    case 'KeyA':
      moveLeft = true;
      break;

    case 'ArrowDown':
    case 'KeyS':
      moveBackward = true;
      break;

    case 'ArrowRight':
    case 'KeyD':
      moveRight = true;
      break;

    case 'Space':
      // if ( canJump === true ) velocity.y += 150; // disabled jump for now
      canJump = false;
      break;

  }

};

const onKeyUp = function ( event ) {

  switch ( event.code ) {

    case 'ArrowUp':
    case 'KeyW':
      moveForward = false;
      break;

    case 'ArrowLeft':
    case 'KeyA':
      moveLeft = false;
      break;

    case 'ArrowDown':
    case 'KeyS':
      moveBackward = false;
      break;

    case 'ArrowRight':
    case 'KeyD':
      moveRight = false;
      break;

  }

};

document.addEventListener( 'keydown', onKeyDown );
document.addEventListener( 'keyup', onKeyUp );

raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

// ground plane

let floorGeometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
floorGeometry.rotateX( - Math.PI / 2 );
const material = new THREE.MeshLambertMaterial( {color: 0x1c1c1c, side:
THREE.DoubleSide} );
mesh = new THREE.Mesh(floorGeometry, material);
mesh.overdraw = true;
scene.add(mesh);

//const ditherMat = new THREE.DitherShader();

const geometry = new THREE.SphereGeometry( 2, 32, 32 );
const smaterial = new THREE.MeshLambertMaterial( {color: 0x474747, emissive: 0xffffff, emissiveIntensity: 5.0});
const sphere = new THREE.Mesh( geometry, smaterial );
sphere.translateZ( -50 );
sphere.translateX( 20 );
sphere.translateY( 10 );

scene.add( sphere );
//scene.position.set(0, 100, 100);

// controls.enableDamping = true;
// controls.target = new THREE.Vector3(0, 0, 0)
// //controls.update() must be called after any manual changes to the camera's transform
// camera.position.set( -5.8, 6.9, 32.6);
// controls.maxPolarAngle = Math.PI/1.9;
// controls.minAzimuthAngle = -Math.PI/1.5;
// controls.maxAzimuthAngle = Math.PI/1.5;
// controls.minDistance = 5;
// controls.maxDistance = 140;
//controls.update();

requestAnimationFrame( animate );

function resizeCanvasToDisplaySize() {
  const canvas = renderer.domElement;
  // look up the size the canvas is being displayed
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  // adjust displayBuffer size to match
  if (canvas.width !== width || canvas.height !== height) {
    // you must pass false here or three.js sadly fights the browser
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // update any render target sizes here
  }
}

// add bloom to make glowing objects glow (add bloom pass before dither?)
animate();
function animate() {
	//stats.begin(); // beging stats
	requestAnimationFrame( animate );

  const time = performance.now(); // not sure
  resizeCanvasToDisplaySize(); // make sure canvas fits dom
  if ( controls.isLocked === true ) { // char controller from https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_pointerlock.html

    raycaster.ray.origin.copy( controls.getObject().position );
    raycaster.ray.origin.y -= 10;

    const delta = ( time - prevTime ) / 1000;

    // movespeeds (higher is slower)
    velocity.x -= velocity.x * 45.0 * delta;
    velocity.z -= velocity.z * 45.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    direction.z = Number( moveForward ) - Number( moveBackward );
    direction.x = Number( moveRight ) - Number( moveLeft );
    direction.normalize(); // this ensures consistent movements in all directions

    if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
    if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

    // if ( onObject === true ) {
    //
    //   velocity.y = Math.max( 0, velocity.y );
    //   canJump = true;
    //
    // }

    controls.moveRight( - velocity.x * delta );
    controls.moveForward( - velocity.z * delta );

    controls.getObject().position.y += ( velocity.y * delta ); // new behavior

    if ( controls.getObject().position.y < 10 ) {

      velocity.y = 0;
      controls.getObject().position.y = 10;

      canJump = true;

    }
}

  prevTime = time;

	// required if controls.enableDamping or controls.autoRotate are set to true
	renderer.render( scene, camera );
  composer.render( scene, camera );
	//composer.render(scene,camera)
	//stats.end(); // end stats
}
