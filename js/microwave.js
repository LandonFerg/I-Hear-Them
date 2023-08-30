loadMicrowave = function()
{
    const manager = new THREE.LoadingManager();
    const loader = new THREE.GLTFLoader(manager);
    var o;
    loader.load( '../objects/micTest.glb', 
    function ( gltf ) {
        o = gltf.scene;
        this.scene.add( o );
        gltf.scene.scale.set(30,30,30) // scale here
        })
    return o;
}

class Microwave {
        constructor (scene) {
        this.scene = scene;
        this.microwave = loadMicrowave();
        this.lightOn = false;
    }



    turnOnMicrowave = function(){
        
    }
}