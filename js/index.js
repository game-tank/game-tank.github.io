// In landscape
var beta_threshold = 0; // left, right
var gamma_threshold = -30; // up, down
var half_size = screen.width / 2;
var noSleep = new NoSleep();
var storage = window.localStorage;
var HARTBEAT_RATE_IS_SECONDS = 1;


setInterval(function () {
    sendToDefaultDestination("alive")
}, HARTBEAT_RATE_IS_SECONDS * 1000);

window.addEventListener("load", init, false);

// if (window.DeviceMotionEvent) {
but = document.getElementById("button-right");
    but.addEventListener("touchstart", touchStart);

but1 = document.getElementById("button-right2");
but1.addEventListener("touchstart", touchStart2);

but2 = document.getElementById("button-right3");
but2.addEventListener("touchstart", touchStart3);

// } else {
//     document.getElementById("1").innerHTML = "DeviceMotionEvent is not supported";
//     document.getElementById("2").innerHTML = "We're so sorry";
//
// }


var handleOrientationEvent = function (frontToBack, leftToRight, rotateDegrees) {
    // do something amazing
    // document.getElementById("test-block").innerHTML = "ftb " + frontToBack.toFixed(3) + " ltr: " + leftToRight.toFixed(3) + " r: " + rotateDegrees.toFixed(3);
    sendOrientationVector(frontToBack.toFixed(3), leftToRight.toFixed(3), rotateDegrees.toFixed(3));
    gradientChange(frontToBack, leftToRight, rotateDegrees);
};

function motion(event) {
    document.getElementById("1").innerHTML = "Alpha: " + event.alpha.toFixed(3);
    document.getElementById("2").innerHTML = "Beta: " + event.beta.toFixed(3);
    document.getElementById("3").innerHTML = "Gamma: " + event.gamma.toFixed(3);

    if (event.gamma < gamma_threshold - 20) {
        // document.getElementById("result").innerHTML = "DOWN";
        document.getElementById("1").style.background = "red";
    }
    else if (event.gamma > gamma_threshold + 20) {
        // document.getElementById("result").innerHTML = "UP";
        document.getElementById("2").style.background = "green";
    }
    else if (event.beta < beta_threshold - 20) {
        // document.getElementById("result").innerHTML = "LEFT";
        document.getElementById("3").style.background = "blue";
    }
    else if (event.beta > beta_threshold + 20) {
        // document.getElementById("result").innerHTML = "RIGHT";
        document.getElementById("result").style.background = "magenta";
    }
    else {
        document.getElementById("1").style.background = "white";
        document.getElementById("2").style.background = "white";
        document.getElementById("3").style.background = "white";
        document.getElementById("result").style.background = "white";
    }
}

function touchStart() {
    fire();
}
function touchStart2() {
    scope();
}
function touchStart3() {
    change();
    var x = document.getElementById("move");
    var y = document.getElementById("rotate");
    if (x.style.display === "none") {
        x.style.display = "block";
        y.style.display = "none";
    } else {
        x.style.display = "none";
        y.style.display = "block";
    }
}

function gradientChange(ftb, ltr, r) {
    var percentage;
    var percentage2;

    if (ftb < 0) {
        // Left
        percentage = 50 - 50 / 30 * (-ftb);
        document.body.style.backgroundImage = "radial-gradient(at " + percentage + "% 35%, magenta 20%, red)";
    } else if (ftb > 0) {
        // Right
        percentage = 50 + 50 * ftb / 30;
        document.body.style.backgroundImage = "radial-gradient(at " + percentage + "% 35%, magenta 20%, red)";
    } else {
        // Center
        document.body.style.backgroundImage = "linear-gradient(90deg, red, magenta 50%, red)";
    }

    if (ltr < -40 ) {
        // Down
        percentage2 = 50 + 50 * -(ltr+40) / 30;
        document.body.style.backgroundImage = "radial-gradient(at " + percentage + "% " + percentage2 + "%, magenta 20%, red)";
    } else if (ltr > -40 ) {
        // Up
        percentage2 = -50 * (ltr + 40) / 30 + 50;
        document.body.style.backgroundImage = "radial-gradient(at " + percentage + "% " + percentage2 + "%, magenta 20%, red)";
    }
}

function saveNameModal(event) {
    event.preventDefault();
    setName($("#nameInput").val());
}

function fakeFormSubmit(event) {
    event.preventDefault();
}

function showPrompt(event) {
    event.preventDefault();
    var name = prompt("Zadaj meno", storage.getItem('name') !== null ? storage.getItem('name') : "");
    if(name !== null) {
        setName(name);
    }
}

function init() {
    updateName();
    updateMenuItems();
}

function getName() {
    return storage.getItem("name");
}

function setName(newName) {
  storage.setItem('name', newName);
  updateName();
  updateMenuItems();
  checkName();
  $('#nameInput').val(newName);
}

function updateName() {
    if(storage.getItem('name') === null) {
        document.getElementById("buttonMenu2").innerHTML = "Hosť";
    } else {
        document.getElementById("buttonMenu2").innerHTML = getName();
    }
}

function updateMenuItems() {
    if(storage.getItem('name') === null) {
        document.getElementById("login").style.display = "block";
        document.getElementById("changeName").style.display = "none";
    } else {
        document.getElementById("login").style.display = "none";
        document.getElementById("changeName").style.display = "block";
    }
}

function evaluateForm(event) {
    event.preventDefault();
    var radios = document.getElementsByName("optionsRadios");
    var i = 0;
    for(;i < radios.length; i++) {
        if(radios[i].checked) {
            if(radios[i].value === "gyroscope") {
                removeListeners();
                addOrintationListeners();
            } else {
                removeOrientationListeners();
                addListeners();
            }
            break;
        }
    }
}

function orientationHandler(event) {
    // alpha: rotation around z-axis
    var rotateDegrees = event.alpha;
    // gamma: left to right
    var leftToRight = event.gamma;
    // beta: front back motion
    var frontToBack = event.beta;

    handleOrientationEvent(frontToBack, leftToRight, rotateDegrees);
}

function addOrintationListeners() {
    window.addEventListener("deviceorientation", orientationHandler, true);

    document.getElementById("joistick-container").style.display = "none";
    document.getElementById("button-right").style.display = "none";
}

function removeOrientationListeners() {
    window.removeEventListener("deviceorientation", orientationHandler, true);

    document.body.style.background = "magenta";
    document.body.style.backgroundImage = "none";
    document.getElementById("joistick-container").style.display = "block";
    document.getElementById("button-right").style.display = "block";
}

function checkName() {
    if(getName() !== null) {
        sendName(getName());
    }
}

//setRandomPlayerColor();

/*function setRandomPlayerColor() {
  var colors = ["pink","blue","green","yellow","orange","red"];
  var randomIndex = Math.ceil(Math.random()*colors.length-1);
  setPlayerColor(colors[randomIndex]);
}*/

function setPlayerColor(color) {
  document.body.className =  document.body.className + " " + color;
}