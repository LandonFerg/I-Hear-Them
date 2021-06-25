debugColorApplied = false;

class Player {
    constructor (hitbox, camera) {
        this.hitbox = hitbox;
        this.camera = camera;
        this.isColliding = false;
        this.goingToCollide = false;
    }

    calculateCollisions = function() {
        var collidedDebugMat = new THREE.MeshBasicMaterial( { color: 0xff00ff, wireframe: true } );
        this.goingToCollide = false; // not going to collide -- as far as we know!
        this.isColliding = false;
        for (let i = 0; i < hitboxes.length; i++) 
        {
            const h = hitboxes[i]; // probably should rename generic hitboxes name

            // just check if player intersects
            if(h.intersectsBox(this.hitbox))
            {
                this.isColliding = true;
                // colliders[i].traverse((o) => {
                // if (o.isMesh) o.material = collidedDebugMat;
                // });
                break;
            }
            else
            {
                // colliders[i].traverse((o) => {
                // if (o.isMesh) o.material = debugColor; // set to default color
                // });
            }

            // get future position in world space
            // this.camera.updateMatrixWorld();
            // var cameraPos = player.camera.position.clone();
            // cameraPos.applyMatrix4( player.camera.matrixWorld );
            // var futurePos = cameraPos.clone().add(
            // new THREE.Vector3(velocity.x, 0, velocity.z));
            
            // // check if future position intersects with walls
            // if(hitboxes[i].containsPoint(futurePos))
            // {
            //     this.goingToCollide = true;
            // }
        }
    }

    isColliding = function() {
        return this.colliding;
    }
}