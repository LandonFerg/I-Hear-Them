var objectIndex = 0;
var doneLoadingBox = false;
var files = ['../objects/wall01.glb','../objects/wall01.glb',
'../objects/wall02.glb','../objects/wall03.glb','../objects/wall04.glb',
'../objects/wall05.glb','../objects/wall06.glb','../objects/wall07.glb',
'../objects/wall08.glb','../objects/wall09.glb','../objects/table_collider.glb'];

const boxLoadManager = new THREE.LoadingManager();
var colliders = [];
var hitboxes = [];
const collisionLoader = new THREE.GLTFLoader(boxLoadManager);
var debugColor = new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: true } );
// const collisionLoader = new THREE.GLTFLoader(manager); adds to main loader (makes loading long)

// function PreLoadBoxes()
// {
//     if (objectIndex > files.length - 1) {AddCollidersToScene(); return;}

//     collisionLoader.load( files[objectIndex], function ( coll ) {
//         console.log("added " + files[objectIndex]);
        
//         // override material
//         var currentObj = coll.scene;
//         //scene.add( coll.scene );
//         // coll.scene.scale.set(30,30,30); // scale here
//         // currentObj.traverse((o) => {
//         // if (o.isMesh) o.material = debugColor;
//         // });
//         // coll.scene.translateY(2);
        
//         colliders.push(coll.scene);
//         objectIndex++;
//         PreLoadBoxes();

//     }, undefined, function ( error ) {

//         console.error( error );

//     } );
// }

// since loading is async, it's actually faster to just ctrl+c & ctrl+v these lines
collisionLoader.load(files[0], ObjCallback);
collisionLoader.load(files[1], ObjCallback);
collisionLoader.load(files[2], ObjCallback);
collisionLoader.load(files[3], ObjCallback);
collisionLoader.load(files[4], ObjCallback);
collisionLoader.load(files[5], ObjCallback);
collisionLoader.load(files[6], ObjCallback);
collisionLoader.load(files[7], ObjCallback);
collisionLoader.load(files[8], ObjCallback);
collisionLoader.load(files[9], ObjCallback);
collisionLoader.load(files[10], ObjCallback);

var callbackIteration = 0;
function ObjCallback(data)
{
    scene.add(data.scene);
    data.scene.scale.set(30,30,30);
    // add name to obj
    var filename = files[callbackIteration].replace(/^.*[\\\/]/, '');
    data.scene.name = filename;
    data.scene.traverse((o) => {
    if (o.isMesh) o.material = debugColor;
    });

    colliders.push(data.scene);
    callbackIteration++;
}

function FindType(object, type)
{
    object.children.forEach((child) => {
        if (child.type === type) {
            console.log(child);
        }
        findType(child, type);
    });
}

boxLoadManager.onLoad = function ( ) {
	console.log( 'Loading complete!');
    GenerateHitboxes();
};

function GenerateHitboxes()
{
    for (let index = 0; index < colliders.length; index++) {
        const c = colliders[index];

        var bBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        bBox.setFromObject(c);
        hitboxes.push(bBox);
        console.log(bBox);
    }
}

// function AddCollidersToScene()
// {
//     colliders.forEach(c => {
//         console.log("added " + c);
//         scene.add(c);
//         c.scale.set(30,30,30);
//         c.traverse((o) => {
//         if (o.isMesh) o.material = debugColor;
//         });
//     });
//     return;
// }
//PreLoadBoxes(); // load collider info