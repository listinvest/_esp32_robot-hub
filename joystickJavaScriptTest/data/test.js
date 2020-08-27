var hasGP = false;
var repGP;
var repSendDat;
var ws = null;
var connectedToWebSocket = false;

let lastJoys = [[0, 0], [0, 0]];

//The functions for the enable and disable buttons
function openWebsocket() {
  //Starts websocket pointed at given domain. This domain must be changed to the local IP if mDNS is not being used.
  ws = new WebSocket("ws://robot.local/");
  //Funtion to be used when the enable button is pressed
  ws.onopen = function() {
    document.getElementById("connectButton").disabled = true;
    document.getElementById("connectButton").style.background = 'green';
    document.getElementById("disconnectButton").disabled = false;
    document.getElementById("disconnectButton").style.background = 'white';
    connectedToWebSocket = true;
  };
  //Function to be used when the disable button is pressed
  ws.onclose = function() {
    document.getElementById("connectButton").disabled = false;
    document.getElementById("connectButton").style.background = 'white';
    document.getElementById("disconnectButton").disabled = true;
    document.getElementById("disconnectButton").style.background = 'red';
    connectedToWebSocket = false;
  };
}

//These functions are for dealing with the websocket and controler api
function closeWebsocket() {ws.close();}
function sendData() {ws.send(arguments[0]);}
function canGame() {return "getGamepads" in navigator;}

//This function gets the controller button data and returns it over the websocket
function reportOnGamepadData() {
  if(connectedToWebSocket) {  //Check if enabled
    var gp = navigator.getGamepads()[0];  //Get the gamepad data
    var dataOutput = "";
    for(var i=0;i<gp.buttons.length;i++) {  //Parse through the buttons to check their states
      dataOutput += ((gp.buttons[i].pressed)? ("1|") : ("0|"));
    }
    for(var i=0;i<gp.axes.length; i++) {  //Parse throught the joysticks to check their states
      dataOutput += ((((gp.axes[i]).toFixed(2))*100)+"|");
    }
    sendData(dataOutput); //Send the gamepad data back over websocket
  }
}

//This function reads the controler and updates the webpage values
function reportOnGamepad() {
    var gp = navigator.getGamepads()[0];  //Get gamepad data
    var html = "";  //Create variable to hold constructed HTML output
        html += "id: "+gp.id+"<br/>"; //Get the controler devices ID
    for(var i=0;i<gp.buttons.length;i++) {  //Parse through buttons
        var buttonNum = (i+1);
        html += "Button "+buttonNum+": ";
        if(gp.buttons[i].pressed) { //Check if button is pressed
          html += " pressed";
        }
        html += "<br/>";  //Add break to constructed HTML output
    }
    for(var i=0;i<gp.axes.length; i+=2) { //Parse throught the joystics
      var joyNum = (Math.ceil(i/2)+1);
      var joyX = (gp.axes[i]);
      var joyY = (gp.axes[i+1]);
      html += "Stick "+joyNum+": "+joyX+","+joyY+"<br/>"; //Add joystick data to the constructed HTML
    }
    $("#gamepadDisplay").html(html);  //Display the constructed HTML output
}

//Runs at begining
$(document).ready(function() {
    if(canGame()) {
        var prompt = "Connect a controler and press any button!"; //Display the prompt of the controler connection status
        $("#gamepadPrompt").text(prompt);
        $(window).on("gamepadconnected", function() {
            hasGP = true;
            $("#gamepadPrompt").html("Controler connected!");
            repGP = window.setInterval(reportOnGamepad,100);
            repSendDat = window.setInterval(reportOnGamepadData,50);  //Set interval for websocket data return rate
        });
        //This is the function run when the controller is disconnected
        $(window).on("gamepaddisconnected", function() {
            $("#gamepadPrompt").text(prompt);
            window.clearInterval(repGP);  //Stop trying to update gamepad data
            window.clearInterval(repSendDat); //Stop the websocket processes
            closeWebsocket(); //Stop the websocket processes
        });

        //setup an interval for Chrome
        var checkGP = window.setInterval(function() {
            if(navigator.getGamepads()[0]) {
                if(!hasGP) $(window).trigger("gamepadconnected");
                window.clearInterval(checkGP);
            }
        }, 500);
    }
});
