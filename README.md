# OpenFin Bloomberg Service

This project contains the OpenFin Bloomberg Service code to allow OpenFin applications to communicate with a Bloomberg terminal running on the same desktop. This service provides BLPAPI request / response capability, market data subscriptions, as well as Terminal Connect (TC) automation APIs.

## Prerequites

Both the BLPAPI and TC features require that the Bloomberg Terminal is running on the machine and currently logged in. For development purposes, the service provides a limited-functionality terminal emulator which can be configured to be selected when a terminal is unavailable.

Additionally, users wishing to take advantage of the Terminal Connect API require additional configuration in order to utilize a Bloomberg-registered strong name signing key. Specific steps are provided, below.

## Running the Project Locally

Clone this repository and execute the following commands:

```
npm install
npm start
```

This will launch the project in debug mode, which will provide onscreen debugging and log file generation for additional debugging and troubleshooting support.

In order to use the Bloomberg Terminal emulator instead of connecting to an actual terminal, pass the addition argument:

```
npm start -- mock
```

# Including the Bloomberg Service in a Project

## Launching the Service

Include the following services declaration in the application manifest:

```
"services": [
  {
     "name": "bloomberg",
     "manifestUrl": "https://cdn.openfin.co/release/bloomberg/0.2.2/provider/app.json"
  }
]
```

## Including the Client

Unlike other services which are available as an NPM module, currently the Bloomberg Service is available as ES6 Modules.
For BLP API access, import the module as follows:

```
<script type="module">
  import blpApi from "https://cdn.openfin.co/release/bloomberg/0.2.2/client/bloomberg-blpapi-service.js";
  
  // blpApi code goes here...
</script>
```

Likewise, for Terminal Connect access, import the module as follows:

```
<script type="module">
  import terminalApi from "https://cdn.openfin.co/release/bloomberg/0.2.2/client/bloomberg-terminalapi-service.js";
  
  // terminalApi code goes here...
</script>
```

# Getting Started with the API

## Connecting to a Bloomberg Session

```
let blpClient = await blpApi.getClient();
let sessionStarted = await blpClient.startSession();
```

## Requesting Data

```
let blpClient = await blpApi.getClient();
let response = await blpClient.serviceRequest('//blp/refdata', 'ReferenceDataRequest', {
  securities: ['IBM US Equity', 'VOD LN Equity'],
  fields: ['PX_LAST', 'DS002', 'EQY_WEIGHTED_AVG_PX'],
  overrides: [
      { fieldId: 'VWAP_START_TIME', value: '9:30' },
      { fieldId: 'VWAP_END_TIME', value: '11:30' }
  ]
});
```

## Subscribing to Market Data

```
let blpClient = await blpApi.getClient();
let correlationIDs = await blpClient.subscribe([
  security: 'IBM US Equity',
  fields: ['LAST_PRICE', 'VOLUME']
]);

blpClient.addEventListener('market-data', e => {
  if(e.data.correlationID === correlationIDs[0]) {
    // do something...
  }
});
```

## Re-signing and Hosting Assets Locally
### (Required for TerminalConnect API)

