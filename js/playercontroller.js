debugColorApplied = false;

class Player {
    constructor (hitbox, camera) {
        this.hitbox = hitbox;
        this.camera = camera;
    }

    calculateCollisions = function() {
        var collidedDebugMat = new THREE.MeshBasicMaterial( { color: 0xff00ff, wireframe: true } );

        for (let i = 0; i < hitboxes.length; i++) 
        {
            const h = hitboxes[i]; // probably should rename generic hitboxes name

            if(h.intersectsBox(this.hitbox))
            {
                //console.log("HIT!!!!!!!!!!!!!!");

                colliders[i].traverse((o) => {
                if (o.isMesh) o.material = collidedDebugMat;
                });
            }
            else
            {
                colliders[i].traverse((o) => {
                if (o.isMesh) o.material = debugColor; // set to default color
                });
            }
        }
    }
}