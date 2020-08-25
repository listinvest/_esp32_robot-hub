/*
    JoystickJavaScriptTest.ino
    Created by: Anthony Scalise

    This program takes advantage of the wifi functionality of the ESP32.
    There are a few parameters to coustomize. First the WiFi ssid and password
    for your WiFi must be entered so that it can host the control page on your
    network. This program uses apple bonjour based mDNS to allow for acess without
    knowing the devices local IP. This does not work without some additional setup
    on windows. In this case just upload the code and the IP will be printed into the
    serial monitor where you can copy, add it to the code and re-flash. If you are using
    the mDNS service you can access the page at "http://robot.local/". To use the robots
    web control page simply plug in a controler. Logitech F310 gamepads are what this
    software is designed for; however, the javascript api used supports almost all
    USB HID's. This can be tweaked and configured to work with other remotes and some
    may work without any modification. This software also requires the ESP32 SPIFFS tool
    to be installed. Use this to upload the "test.js" and "index.html" to the ESP's internal
    file system to be mounted for hosting.
    *NOTE you need to change the websocket domain in "test.js" if you are not using mDNS.
*/


#include "WiFi.h"
#include "SPIFFS.h"
#include "ESPmDNS.h"
#include "ESPAsyncWebServer.h"

const char* ssid = "YOUR SSID GOES HERE";  //This takes your wifi ssid
const char* password =  "YOUR PASSWORD GOES HERE";  //This takes your wifi password

AsyncWebServer server(80);  //Creates an asyncronomous webserver on port 80
AsyncWebSocket ws("/"); //Creates an asyncronomous web socket at subdomain "/"

//Sets up mDNS
void initializeDNS() {
  if (!MDNS.begin("robot")) { //Creates dns name in this case it is robot.
    Serial.println("Error setting up MDNS responder!");
  } else {
    Serial.println("DNS server started");
  }
}

//Starts SPIFFS file system for files to be used for hosting
void initializeFiles() {
  if (!SPIFFS.begin()) {
    Serial.println("SPIFFS Mount failed");
  } else {
    Serial.println("SPIFFS Mount succesfull");
  }
}

//Function to interact with the incoming websocket data
void onWsEvent(AsyncWebSocket * server, AsyncWebSocketClient * client, AwsEventType type, void * arg, uint8_t *data, size_t len){
  if(type == WS_EVT_CONNECT) {  //If the websocket is connected
    Serial.println("Websocket client connection started");
    Serial.println("---------------------------------------");
  } else if(type == WS_EVT_DISCONNECT) {  //If the websocket is not connected
    Serial.println("Client disconnected");
    Serial.println("-----------------------");
  } else if(type == WS_EVT_DATA) {
    for(int i=0; i < len; i++) {  //Parse through incoming data to print character by character
          Serial.print((char) data[i]);
    }
    Serial.println();
  }
}

void setup(){
  Serial.begin(115200);
  WiFi.begin(ssid, password); //Start WiFi
  delay(3000);

  initializeFiles();  //Starts file system
  Serial.print("Connecting to WiFi.");  while(WiFi.status() != WL_CONNECTED) {Serial.print("."); delay(500);} //Wait for connection to wifi
  Serial.println();
  Serial.println(WiFi.localIP()); //Print local IP address
  initializeDNS();  //Start mDNS server on local network

  ws.onEvent(onWsEvent);  //Create event for websockets
  server.addHandler(&ws); //Put websocket event in the schedule handler for the server

  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){  //If a HTTP_GET request is recived for "/" subdomain serve the index.html page
    request->send(SPIFFS, "/index.html", "text/html");
  });
  server.on("/test.js", HTTP_GET, [](AsyncWebServerRequest *request){ //If a HTTP_GET request is recived for "/test.js" serve javascript file
    request->send(SPIFFS, "/test.js", "text/javascript");
  });

  server.begin(); //Start the server schedule handler
  Serial.println("Server Started");
}

void loop(){
}
