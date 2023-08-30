var animateRain = true;
var audioMuted = false;
var volume = 1;
var levelNumber = 1;
var playerIdleTime = 4; // how long until player is considered idle
var currentTime = 0;

// TOOD: make fullscreen button that simply scales the canvas size (same resolution)

var renderer = new THREE.WebGLRenderer({canvas: gameCanvas});
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setPixelRatio( window.devicePixelRatio * 1); // (0.25 is good) change resolution
renderer.physicallyCorrectLights = true;
// If texture is used for color information, set colorspace.  

var progress = document.createElement('div');
var progressBar = document.createElement('div');

progress.appendChild(progressBar);

document.body.appendChild(progress);

renderer.outputEncoding = THREE.sRGBEncoding;
var scene = new THREE.Scene();
const manager = new THREE.LoadingManager();
const loader = new THREE.GLTFLoader(manager); // used to load custom models

const loadingScreen = document.getElementById("loading");

// bloom properties
const bloomProps = {
  exposure: 1.2,
  bloomStrength: 2.5,
  bloomThreshold: 0.6,
  bloomRadius: 0
};

manager.onStart = function ( url, itemsLoaded, itemsTotal ) {

	console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

};

manager.onLoad = function ( ) {

	console.log( 'Loading complete!');
  loadingScreen.style.display = "none";
};


manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
	//console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
  document.getElementById("loadingBar").value = (itemsLoaded / itemsTotal) * 100;
};

manager.onError = function ( url ) {

	console.log( 'There was an error loading ' + url );

};

scene.background = new THREE.Color('rgb(0, 0, 0)');

const gameHolder = document.getElementById( 'gameHolder' );
var camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 10000 );

camera.position.y = 10;
camera.position.x = 10;

// setup audio
const listener = new THREE.AudioListener();
camera.add(listener);

// TODO: wrap all this stuff in a setup class so everything isnt global

// player debug material
var playerDebug = new THREE.MeshBasicMaterial( { color: 0xff00ff, wireframe: true } );

// setup player object for collision
var playerMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 15, 2));

// create player hitbox
playerMesh.geometry.computeBoundingBox();
var pHitbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
pHitbox.setFromObject(playerMesh);


// add camera to scene (needed because it is a parent of playerMesh)
scene.add(playerMesh);

// // add our player object as a child
// camera.add(playerMesh);

// create player
let player = new Player(pHitbox, camera, false);

scene.add(player.camera);

// create a global audio source
const ambient = new THREE.Audio( listener );

// TODO: make footstep positional

// TODO: put all this loading stuff in another js file, and call function like..
// loadhouse1(); loadhouse2(); so we can have presets

const footstepNoise = new THREE.Audio( listener );

const audioLoader = new THREE.AudioLoader();

audioLoader.load( '../game/audio/rain-storm.ogg', function( buffer ) {
	ambient.setBuffer( buffer );
	ambient.setLoop( true );
	ambient.setVolume( 0.3 );
	//ambient.play(); // play on start
});

audioLoader.load( '../game/audio/foot-step.ogg', function( buffer ) {
	footstepNoise.setBuffer( buffer );
	footstepNoise.setLoop( false );
	footstepNoise.setVolume( 1 );
});


var directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 0.08 );
directionalLight.castShadow = true;
scene.add( directionalLight );

const plight = new THREE.PointLight( 'yellow', 0.5, 55 );
plight.position.set( 32, 12, 0 );
scene.add( plight );

const kitchen_plight = new THREE.PointLight( 'white', 5, 45 );
kitchen_plight.position.set( 112, 7, 0 );
kitchen_plight.shadow.mapSize.width = 1024; // default
kitchen_plight.shadow.mapSize.height = 1024; // default
scene.add( kitchen_plight );

//Object { x: 52.720575307640296, y: 10, z: -20.562483470411625 }

const candleLight = new THREE.PointLight( 'orange', 2.5, 35 );
candleLight.position.set( 52.72, 8, -20.56);
candleLight.shadow.mapSize.width = 1024; // default
candleLight.shadow.mapSize.height = 1024; // default
scene.add( candleLight );

// set initial player rotation
player.camera.lookAt(candleLight.position);


// outlinePass hates empty arrays so lets make an object it can always use
const g = new THREE.BoxGeometry( 1, 1, 1 ); 
const placeholder = new THREE.Mesh(g); 
scene.add(placeholder);
placeholder.position.set( 3000, 3000, 20);


// load house
loader.load( '../objects/house_v2.glb', 
function ( gltf ) {
  scene.add( gltf.scene );
  gltf.scene.scale.set(30,30,30) // scale here
  directionalLight.target = gltf.scene;
})

loader.load( '../objects/kitchen.glb', 
function ( gltf ) {
  scene.add( gltf.scene );
  gltf.scene.scale.set(30,30,30) // scale here
})

loader.load( '../objects/cuppboards.glb', 
function ( gltf ) {
  scene.add( gltf.scene );
  gltf.scene.scale.set(30,30,30) // scale here
})

var microwave = new Microwave(scene);

// Outliner needs an array so we give it an object on init
function initMicrowave()
{
  selectedObjects.push(microwave.microwave);
}

var ramen;
loader.load( '../objects/ramen.glb', 
function ( gltf ) {
  ramen = gltf.scene;
  scene.add( ramen );
  gltf.scene.scale.set(30,30,30) // scale here
})

var doggie;
loader.load( '../objects/doggie.glb', 
function ( gltf ) {
  doggie = gltf.scene;
  mixer = new THREE.AnimationMixer(doggie);
  var action = mixer.clipAction(gltf.animations[0]);
  action.play();
  scene.add( doggie );
  gltf.scene.scale.set(30,30,30) // scale here
  
  doggie.visible = false;
  dogInit();
})

loader.load( '../objects/kitchen_roof.glb', 
function ( gltf ) {
  scene.add( gltf.scene );
  gltf.scene.scale.set(30,30,30) // scale here
})

loader.load( '../objects/candle_fixed.glb', 
function ( gltf ) {
  scene.add( gltf.scene );
  gltf.scene.scale.set(30,30,30) // scale here
  gltf.scene.translateY(2);
})

loader.load('../objects/baseboard-1.glb', function( gltf ) {
  scene.add( gltf.scene );
  gltf.scene.scale.set(30,30,30) // scale here
  gltf.scene.translateY(2);
  //  gltf.scene.translateX
  directionalLight.target = gltf.scene;
})

loader.load( '../objects/table.glb', 
function ( gltf ) {
  scene.add( gltf.scene );
  gltf.scene.scale.set(30,30,30) // scale here
  gltf.scene.translateY(2);
}
)

loader.load('../objects/curtains_new.glb', function( gltf ) {
  scene.add( gltf.scene );
  gltf.scene.scale.set(30,30,30) // scale here
  //  gltf.scene.translateX
  directionalLight.target = gltf.scene;
})

loader.load('../objects/floor_new.glb', function( gltf ) {
  scene.add( gltf.scene );
  gltf.scene.scale.set(30,1,30) // scale here
  //  gltf.scene.translateX
  gltf.scene.translateY(0.1);
  //directionalLight.target = gltf.scene;
})

/* ------------------------------ Post-Processing ------------------------------ */

renderer.autoClear = false; // stops everything idk
var composer = new THREE.EffectComposer(renderer); // define new composer
composer.addPass(new THREE.RenderPass( scene, player.camera ));

var selectedObjects = [];

var outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, player.camera, selectedObjects);
outlinePass.renderToScreen = true;
outlinePass.edgeThickness = 2;
//outlinePass.edgeStrength = 6;
//selectedObjects.push(microwave);
// outlinePass.visibleEdgeColor = 0xffffff;
// outlinePass.hiddenEdgeColor = 0xffffff;
composer.addPass( outlinePass );

var bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
//const bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.renderToScreen = true;
composer.addPass(bloomPass);

bloomPass.threshold = bloomProps.bloomThreshold;
bloomPass.strength = bloomProps.bloomStrength;
bloomPass.radius = bloomProps.bloomRadius;

var ditherShader = new THREE.ShaderPass( THREE.DitherShader );
//var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
//seffect.uniforms[ 'scale' ].value = 4;
ditherShader.renderToScreen = true;
composer.addPass( ditherShader ); // enable dither effect



// controls
var controls = new THREE.PointerLockControls(player.camera, renderer.domElement ); // contr  ol cam

const blocker = document.getElementById( 'menu' ); // menu that blocks on mouse unlocked
const instructions = document.getElementById( 'instructions' );

// event listeners to control mouse lock
instructions.addEventListener( 'click', function () {
  controls.lock();
} );

controls.addEventListener( 'lock', function () {
	instructions.style.display = 'none';
  blocker.style.display = 'none';
  ambient.play();
} );

controls.addEventListener( 'unlock', function () {

  blocker.style.display = 'block';
  ambient.pause();
  instructions.style.display = '';
  console.log(player.camera.position);
} );

scene.add( controls.getObject() ); //dk waht this does

let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let interact = false;
let canJump = false;

let movespeed = 5.0;

let prevTime = performance.now();
const velocity = new THREE.Vector3(); // player velocity
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
    
    case 'KeyE':
      interact = true;
      console.log("interact test");
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

    case 'KeyE':
      interact = false;
      console.log("interact test");
      break;

  }

};

// add keyboard event listeners
document.addEventListener( 'keydown', onKeyDown );
document.addEventListener( 'keyup', onKeyUp );

$("#muteButton").click(function(){
  if(!audioMuted)
  {
    $("#muteButton").attr("src","../images/mute.png");
    volume = listener.getMasterVolume();
    listener.setMasterVolume(0);
    audioMuted = true;
  }
  else
  {
    $("#muteButton").attr("src","../images/audio.png");
    listener.setMasterVolume(volume);
    audioMuted = false;
  }
});

raycaster = new THREE.Raycaster();
raycaster.setFromCamera( new THREE.Vector2(), player.camera )
//raycaster.set( player.camera.getWorldPosition(), player.camera.getWorldDirection() );

// ground plane

let floorGeometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
floorGeometry.rotateX( - Math.PI / 2 );
const material = new THREE.MeshLambertMaterial( {color: 0x1c1c1c, side:
THREE.DoubleSide} );
mesh = new THREE.Mesh(floorGeometry, material);
mesh.overdraw = true;
scene.add(mesh);

//const ditherMat = new THREE.DitherShader();

// OMINOUS SPHERE
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
    player.camera.aspect = width / height;
    player.camera.updateProjectionMatrix();

    // update any render target sizes here
  }
}

function randomNumber(min, max) { 
    return Math.random() * (max - min) + min;
} 

// ----------------Environment------------------- //

  let rainGeo;
  let droplet;
  let rain;
  let dropAmount = 1000;

function GenerateRain()
{
  rainGeo = new THREE.Geometry();
  for(let i = 0; i < dropAmount; i++){
		// TODO: Make these numbers make sense
    droplet = new THREE.Vector3(
      Math.random() * 1000 - 300,
      Math.random() * 500 - 220,
      Math.random() * 800 - 850
    );
    droplet.velocity = {};
    droplet.velocity = 0;
    droplet.acceleration = 0.24;
    rainGeo.vertices.push(droplet);
  }

  let sprite = new THREE.TextureLoader().load('../images/raindrop.png');

  let rainMaterial = new THREE.PointsMaterial({
    color: 0x555555,
    size: 0.2,
    map: sprite
  });

  //rainMaterial.transparency = true;

  rain = new THREE.Points(rainGeo, rainMaterial);
  scene.add(rain);
}

GenerateRain();

function ToggleRain()
{
  if(animateRain)
  { animateRain = false; }
  else {
    animateRain = true;
  }
}

// TODO: add bloom to make glowing objects glow (add bloom pass before dither?)

animate();

// footstep controls
var stepLength = 3;
var currentStep = 0;

function CheckFootStep()
{
  currentStep += 0.01;

  if(currentStep >= stepLength && !footstepNoise.isPlaying)
  {
    // play sound
    // console.log(player.camera.position.clone());
    // console.log(player.camera.position.clone().add(new THREE.Vector3(velocity.x, 0, velocity.z)));
    footstepNoise.play();
    currentStep = 0;
  }
}

var collidingWithSomething = false;

// TODO: make these collision objects a class with their own mesh variables and booleans for collision color applied
// can add methods like onPlayerEnter, onPlayerExit to collision object classes
// which would certainly help with trigger events later on...

// collider mat for debug

function dogInit()
{
  // threejs doesnt support blender emission materials > 1
  // so this adjusts the dog's eyes emission
}
function pickupObject(o)
{
  player.camera.add(o);
  o.updateMatrix(true);
  o.frustumCulled = false;
  //scene.getObjectByName( "Ramen" ).position.set(0.5,-0.3,-1);
  o.position.set(2.2,-1,-4);
  o.scale.set(30,30,30);

  // move object to front
  o.renderOrder = 999;
  o.onBeforeRender = function( renderer ) { renderer.clearDepth(); };

  // moves object to front but messes up normals
  //o.material.depthTest = false;
  //o.material.depthWrite = false;

  o.updateMatrix(true);

  // testing material adjustment
  doggie.visible = true;
  doggie.traverse((o) => {
    var i = 0;
    if (o.isMesh) 
    {
      console.log(o.material);
      if(o.material.name == "wolfEyes")
      {
        o.material.emissiveIntensity = 1000.0;
      }
      console.log(o.material);
      i++;
    }
  });

  kitchen_plight.visible = false;
  // var direction = new THREE.Vector3();
  // var distance = 1;
  // player.camera.getWorldDirection(direction);
  // o.position.add(direction.multiplyScalar(distance));
}

function dropObject(o)
{
  o.visible = false;
  scene.getObjectByName( "Ramen" ).visible = false;
  o.renderOrder = 0;
  o.updateMatrix(true);
  o.onBeforeRender = function( renderer ) {};
  kitchen_plight.visible = true;
  doggie.visible = false;
}

var hasFood = false;
var microwaveActive = false;
var currentObject; // current obj being held

function animate() {

  // if(currentTime % 24 == 0)
  // {
  //   console.log(player.camera.rotation);
  //   //onmousemove = e => console.log( e.clientX )
  // }

  raycaster.setFromCamera( new THREE.Vector2(), player.camera );
  var intersects = raycaster.intersectObjects([scene], true);

  // outline objects
  if(intersects.length > 0)
  {
    var object = intersects[0].object;
    console.log(object.name); //debug obj names

    if(object.name == "microwave" || object.name == "microwave001")
    {
      if(hasFood == true)
      {
        outlinePass.selectedObjects = [scene.getObjectByName("microwave")];
        if(interact == true && hasFood == true)
        {
          dropObject(currentObject);
          hasFood = false;
        }
      }
    }

    else if (object.name == "Ramen")
    {
      outlinePass.selectedObjects = [object];
      if(interact == true)
      {
        hasFood = true;
        currentObject = object;
        pickupObject(object)
      }
    }

    else
    {
      outlinePass.selectedObjects = [placeholder];
    }
  }

  playerMesh.position.copy(player.camera.position);
  // calculate player hitbox position every frame
  player.hitbox.copy(playerMesh.geometry.boundingBox).applyMatrix4(playerMesh.matrixWorld);

  if(typeof hitboxes !== 'undefined') // wait for hitboxes to populate
  {
    player.calculateCollisions();  // run collision checks for every other hitbox
  }

	//stats.begin(); // debug
  rainGeo.verticesNeedUpdate = true;
	requestAnimationFrame( animate );

  const time = performance.now(); // not sure
  resizeCanvasToDisplaySize(); // make sure canvas fits dom

  // check if pointer is locked
  if ( controls.isLocked === true ) { // char controller from https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_pointerlock.html

    const delta = ( time - prevTime ) / 1000;
    if ( mixer ) mixer.update( delta ); // update animations

    // movespeeds (higher is slower)
    velocity.x -= velocity.x * 45.0 * delta;
    velocity.z -= velocity.z * 45.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    direction.z = Number( moveForward ) - Number( moveBackward );
    direction.x = Number( moveRight ) - Number( moveLeft );
    direction.normalize(); // this ensures consistent movements in all directions

    if ( moveForward || moveBackward ) 
    {
      velocity.z -= direction.z * 400.0 * delta;

      CheckFootStep();
    }

    if ( moveLeft || moveRight ) 
    {
      velocity.x -= direction.x * 400.0 * delta;

      CheckFootStep();
    }

    // check if player is idle
    if (!moveLeft && !moveRight && !moveForward && !moveBackward)
    {
      footstepNoise.isPlaying = false;
      currentTime += delta * 5;

      if(currentTime >= playerIdleTime)
      {
        currentStep = 0; // player idle -- reset step count
        //console.log("reset step count");
        currentTime = 0;
      }
    }

    
    // these update player camera transforms
    controls.moveRight( - velocity.x * delta );
    controls.moveForward( - velocity.z * delta );

    // update player mesh and hitbox transforms
    playerMesh.position.copy(player.camera.position);
    player.hitbox.copy(playerMesh.geometry.boundingBox).applyMatrix4(playerMesh.matrixWorld);

    if(player.isColliding)
    {
      // move camera back to previous position
      controls.moveRight( velocity.x * delta );
      controls.moveForward( velocity.z * delta );
    }
    

    controls.getObject().position.y += ( velocity.y * delta ); // new behavior

    if ( controls.getObject().position.y < 10 ) {

      velocity.y = 0;
      controls.getObject().position.y = 10;

      canJump = true;

    }

    // animate rain
    if(animateRain){
      rainGeo.vertices.forEach(d => {
        var xWind = 20;
        d.velocity -= randomNumber(d.acceleration * 0.9, d.acceleration);
        d.y += d.velocity * delta;
        d.x += xWind * delta;

        if(d.y < -200) {
          d.y = 500 + (Math.random() * 250); // 250 randomizes height
          d.x = Math.random() * 600 - 300;
          d.velocity = 0;
        }
      });
    }
}

  prevTime = time;

	// required if controls.enableDamping or controls.autoRotate are set to true
	renderer.render( scene, player.camera );
  composer.render( scene, player.camera );
}
