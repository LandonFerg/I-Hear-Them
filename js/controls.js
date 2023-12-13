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