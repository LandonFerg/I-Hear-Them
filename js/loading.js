function LoadHouse()
{
    // Load house
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
}