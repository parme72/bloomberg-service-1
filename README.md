# OpenFin Bloomberg Service

This project contains the OpenFin Bloomberg Service code to allow OpenFin applications to communicate with a Bloomberg terminal running on the same desktop. This service provides BLPAPI requrest / response capability, market data subscriptions, as well as Termincal Connect (TC) automation APIs.

## Prerequites

Both the BLPAPI and TC features require that the Bloomberg Terminal is running on the machine and currently logged in. For development purposes, the service provides a limited-functionalty terminal emulator which can be configured to be selected when a terminal is unavailable.

Additionally, users wishing to take advantage of the Terminal Connect API require additional configuration in order to utilize a Bloomberg-registered strong name signing key. Specific steps are provided, below.

## How to Run the Demo

If OpenFin is already installed on the desktop, you can launch the demo directly from a browser or the system **Run...** dialog.

```
fins://openfin.github.io/bloomberg-service/demo/app.json
```

Or otherwise you can generate an installer using our installer generation service:
[Bloomberg Service Demo Installer](https://install.openfin.co/download/?os=win&config=https%3A%2F%2Fopenfin.github.io%2Fbloomberg-service%2Fdemo%2Fapp.json&fileName=bloomberg-service-demo-installer)

## Running the Project Locally

Clone this repository and execute the following commands:

```
npm install
npm start
```

This will launch the project in debug mode, which will show the usually-headless service manager and service provider applications on the user desktop for additional troubleshooting and debugging.

In order to use the Bloomberg emulator instead of connecting to an actual terminal:

```
npm start -- mock
```

## Re-signing and Hosting Assets Locally
### (Required for TermincalConnect API)

