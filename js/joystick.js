var START_X = 0;
var START_Y = 0;
var JOYSTICK_START_X = 0;
var JOYSTICK_START_Y = 0;
var MOVE_RANGE = 180;
var JOYSTICK_SIZE = 245;
var RADIUS = JOYSTICK_SIZE / 2;
var LAST_SEND = {x:0,y:0};

//if (window.DeviceMotionEvent) {
    addListeners();
//}


function joysticktouchMove(event) {
    event.preventDefault();
    var touchobj = event.changedTouches[0];
    drawJoystick(parseInt(touchobj.clientX), parseInt(touchobj.clientY));
}

drawJoystick(0, 0, true);

function joystickTouchEnd() {
    drawJoystick(0, 0, true);
    START_X = 0; START_Y = 0;
    var joystickDiv = document.getElementById("joystick-button");
    joystickDiv.style.left = 0;
    joystickDiv.style.top = 0;

}

function drawJoystick(touchX, touchY, clear) {
    if(clear) {
        console.log("CLEAR");
        try {
           //stop motion of user doesnt touch joystick, but keep rotation of player
           sendOrientationVector(LAST_SEND.x/100000000,LAST_SEND.y/100000000,0);
        } catch (e) {
            console.error("Simple error in initialization",e);
            //do nothing
        }
    }

    var joystickDiv = document.getElementById("joystick-button");

    JOYSTICK_START_X = joystickDiv.getBoundingClientRect().left + window.scrollX;
    JOYSTICK_START_Y = joystickDiv.getBoundingClientRect().top + window.scrollY;

    var dx = touchX-START_X;
    var dy = touchY-START_Y;

    if (clear) {
        touchX = 0;
        touchY = 0;
    }

    // vzorec: ( (x1-x0)^2 + (y1-y0)^2 ) < r
    if (Math.sqrt(Math.pow(touchX - START_X, 2) + Math.pow(touchY - START_Y, 2)) < RADIUS) {
        if (dx > MOVE_RANGE) dx = MOVE_RANGE;
        if (dy > MOVE_RANGE) dy = MOVE_RANGE;
        if (dx < -MOVE_RANGE) dx = -MOVE_RANGE;
        if (dy < -MOVE_RANGE) dy = -MOVE_RANGE;

        if (!clear) {
            LAST_SEND.x = dx;
            LAST_SEND.y = -dy;
            sendOrientationVector(dx, -dy, 0);
            console.log("sending: " + dx + ", " + -dy);
        }
    }

    joystickDiv.style.top = dy + "px";
    joystickDiv.style.left = dx + "px";
}

function joysticktouchStart() {
    var touchobj = event.changedTouches[0];
    START_X = parseInt(touchobj.clientX);
    START_Y = parseInt(touchobj.clientY);

    event.preventDefault()
}

function addListeners() {
    joystickCanvasElement = document.getElementById("joystick-button");
    joystickCanvasElement.addEventListener("touchmove", joysticktouchMove, false);
    joystickCanvasElement.addEventListener("touchend", joystickTouchEnd);
    joystickCanvasElement.addEventListener("touchstart", joysticktouchStart);
}

function removeListeners() {
    joystickCanvasElement = document.getElementById("joystick-button");
    joystickCanvasElement.removeEventListener("touchmove", joysticktouchMove, false);
    joystickCanvasElement.removeEventListener("touchend", joystickTouchEnd);
    joystickCanvasElement.removeEventListener("touchstart", joysticktouchStart);
}