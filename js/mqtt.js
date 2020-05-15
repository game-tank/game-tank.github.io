var hostname = "mqttws.kpi.fei.tuke.sk";
var port = Number(80);
//var port = Number(443);
var uid = "hackathon2k18" + Date.now();
var gameId = new URLSearchParams(window.location.search).get('id');
var destination = "openlab/game/" + gameId + "/" + uid;
var subscribe = "openlab/game/" + gameId + "/" + uid;
// var destination = "openlab2/game/" + gameId + "/" + uid;
// alert(destination);
// called when the client connects
console.log("Client ID: " + uid);

// Create a client instance
var client = new Paho.Client(hostname, port, uid);
// set callback handlers
client.onConnectionLost = onConnectionLost;

client.onMessageArrived = onMessageArrived;


// connect the client
client.connect({onSuccess: onConnect, reconnect:true, /*useSSL: true, */keepAliveInterval: 10, timeout: 10});

function onConnect() {
  connected = true;
  notificationConnectionSuccess();
    // Once a connection has been made, make a subscription and send a message.
    // message = new Paho.Message("Hello");
    // client.subscribe("World");
    // console.log(message);
    // message.destinationName = destination;
    // client.send(message);
    sendToDefaultDestination("new");
    checkName();
    client.subscribe(subscribe, {onSuccess: onMessageArrived});
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.error("onConnectionLost:" + responseObject.errorMessage);
        connected = false;
        notificationConnectionLost()
    }
}

// called when a message arrives
function onMessageArrived(message) {
    console.log("onMessageArrived:" + message.payloadString);

    var messagePayload = message.payloadString;

    //if (messagePayload == undefined) return;
    //setPlayerColor("red");
    var colors = ["red","blue","green2","green","yellow","pink"];
    var randomIndex = 0;
    //setPlayerColor(colors[randomIndex]);
    switch (messagePayload) {
        case "0":
            //newQuestion(messageSplit[1]); // index.js
            //console.log("red:" + message.payloadString);
            //setPlayerColor("red");
            randomIndex = 0;
            break;

        case "1":
            //newQuestion(messageSplit[1]); // index.js
            //console.log("blue:" + message.payloadString);
            //setPlayerColor("blue");
            randomIndex = 1;
            break;
        case "2":
            //newQuestion(messageSplit[1]); // index.js
            //setPlayerColor("green2");
            randomIndex = 2;
            break;
        case "3":
            //newQuestion(messageSplit[1]); // index.js
            //setPlayerColor("green");
            randomIndex = 3;
            break;
        case "4":
            //newQuestion(messageSplit[1]); // index.js
            //setPlayerColor("yellow");
            randomIndex = 4;
            break;
        case "5":
            //setPlayerColor("pink");
            randomIndex = 5;
            break;
    }

    setPlayerColor(colors[randomIndex]);
}

var connected = false;
var connectionSnackbar = undefined;

function notificationConnectionLost() {
  if (!connected) {
    connectionSnackbar = $.snackbar(
      {
        content:"Stratili sme spojenie",
        timeout:0,
        onClose: notificationConnectionLost
      }
    );
  }
}

function notificationConnectionSuccess() {
  if (connectionSnackbar) {
    connectionSnackbar.snackbar("hide");
  }
}

function sendOrientationVector(leftRight, frontBack, rotation) {
  if (connected) {
    message = "move:" + leftRight + "," + frontBack + "," + rotation;
    // client.send(new Paho.Message(message));
    sendToDefaultDestination(message);
  } else {
    console.log("Cannot send orientation vector message we are not connected");
  }
}

function sendDisplayClickCoordinates(x, y) {
    message = "click:" + x + "," + y;
    // client.send(new Paho.Message(message));
    sendToDefaultDestination(message);
}

function sendDisplayClickOnHalfOfDisplay(isRight) {
    message = "click:";
    if (isRight) {
        message += "right";
    } else {
        message += "left";
    }
    // client.send(new Paho.Message(message));
    sendToDefaultDestination(message);
}

function sendClick() {
    message = "click";
    // client.send(new Paho.Message(message));
    sendToDefaultDestination(message);
}

function msgInit(message) {
    msg = new Paho.Message(message);
    msg.destinationName = destination;
    return msg;
}

/*function onMessageArrived(message){
    out_msg = "Message received " + message.payloadString + "<br>";
    out_msg = out_msg = "Message received Topis " + message.destinationName;
    console.log(out_msg);
}*/
function sendToDefaultDestination(msg) {
    message = msgInit(msg);
    if (connected) {
      //console.log("SENDING message: "+msg);
      client.send(message);
      // console.log("END SENDING");
    } else {
      console.log("NOT CONNECTED, while trying to send message: "+msg);
    }
}

function fire() {
    message = msgInit("fire");
    console.log("fire");
    client.send(message);
}
function scope() {
    message = msgInit("scope");
    console.log("scope");
    client.send(message);
}
function change() {
    message = msgInit("change");
    console.log("change");
    client.send(message);
}

function sendName(name) {
    sendToDefaultDestination("name:" + name);
}