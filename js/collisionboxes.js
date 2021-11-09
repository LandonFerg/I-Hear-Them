var objectIndex = 0;
var doneLoadingBox = false;

// TODO: populate file array based on level (seperate folders)
var files = ['../objects/wall01.glb','../objects/wall01.glb',
'../objects/wall02.glb','../objects/wall03.glb','../objects/wall04.glb',
'../objects/wall05.glb','../objects/wall06.glb','../objects/wall07.glb',
'../objects/wall08.glb','../objects/wall09.glb','../objects/table_collider.glb'];

const wireframeDebug = false;
const boxLoadManager = new THREE.LoadingManager();
var colliders = [];
var hitboxes = [];
const collisionLoader = new THREE.GLTFLoader(boxLoadManager); // initialize new loader
var debugColor = new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: true } );

// load our collision objects
for (let i = 0; i < files.length; i++) {
    const f = files[i];
    collisionLoader.load(f, ObjCallback);
}

var callbackIteration = 0;
function ObjCallback(data)
{
    scene.add(data.scene);
    data.scene.scale.set(30,30,30);
    // add name to obj
    var filename = files[callbackIteration].replace(/^.*[\\\/]/, '');
    data.scene.name = filename;

    data.scene.visible = false;

    // debug
    if(wireframeDebug)
    {
        data.scene.visible = true;
        
        data.scene.traverse((o) => {
        if (o.isMesh) o.material = debugColor;
        });
    }

    colliders.push(data.scene);
    callbackIteration++;
}

boxLoadManager.onLoad = function ( ) {
	console.log( 'Loading complete!');
    GenerateHitboxes();
};

// create AABBs
function GenerateHitboxes()
{
    for (let index = 0; index < colliders.length; index++) {
        const c = colliders[index];
        var bBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        bBox.setFromObject(c);
        hitboxes.push(bBox);
    }
}
