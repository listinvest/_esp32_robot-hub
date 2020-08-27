# Microbot32_WebControl
#### A modular UI that can be hosted localy on an ESP32 based robot to interface with the robot through a browser using a USB HID controller. This is meant to be simmilar to the First FRC smart dashboard. 

## How to use
### The ESP32 SPIFFS file system tool is needed to use this software. Heres how to [install](https://randomnerdtutorials.com/install-esp32-filesystem-uploader-arduino-ide/).
#### 1. Modify the WiFi SSID and password in the sketch file for your local network.
#### 2. If you are using windows you will need to change the domain name for the websocket in the javascript file to the local ip of the ESP32. Alternatively you could install bonjour and setup windows for mDNS.
#### 3. Use the SPIFFS tool to upload the data file in the sketch folder to the ESP32's onboard memory.
#### 4. Lastly upload the arduino code script to the ESP32.
