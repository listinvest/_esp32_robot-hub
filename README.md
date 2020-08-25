# Microbot32_WebControl
#### A modular ui that can be hosted localy on an ESP32 based robot to interface with the robot through a browser using a usb HID controller. This is meant to be simmilar to the First FRC smart dashboard. 

## How to use
#### The ESP32 SPIFFS file system tool is needed to use this software. Heres how to [install](https://randomnerdtutorials.com/install-esp32-filesystem-uploader-arduino-ide/).
#### Modify the WiFi SSID and password in the sketch file for your local network.
#### If you are using windows you will need to change the domain name for the websocket in the javascript file. Alternatively you could install bonjour and setup windows for mDNS.
#### Use the SPIFFS tool to upload the data file in the sketch folder to the ESP32's onboard memory.
#### Lastly upload the arduino code script to the ESP32.
