# MMM-WSF-Schedule

This [MagicMirror²](https://github.com/MichMich/MagicMirror/) module fetches and displays WSF route schedules and shows delays.


## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file.

First you will need to get a WSDOT Traveler API key by going to [this](http://www.wsdot.wa.gov/traffic/api/) page and entering your email in the box at the bottom.  Copy this key into your config under the property `apiKey` as seen below.

Other config properties are explained below in the **Configuration Options** section.

```js
var config = {
    modules: [
        {
            module: 'MMM-WSF-Schedule',
            config: {
                apiKey: "123-456-abc-def-789"   // see above ^
                myRouteID: 10,                  // ana-sid
                myDepartingTerminalID: 1,       // leaving from ana
                myArrivingTerminalID: 19        // arriving at sid
            }
        }
    ]
}
```

## Getting your route abbreviation
Route ID lookup table

| Route Name                    | Abbreviation | RouteID | Terminal 1  | Terminal 2 |
| ------------------------------|:------------:|:-------:|:-----------:|:-----------:
| Anacortes / Sidney B.C        | ana-sid      | 10      |     1       |      19    |
| Anacortes / San Juan Islands  | ana-sj       | 9       |      Route Not Supported      | Route Not Supported     |
| Port Townsend / Coupeville    | pt-key       | 8       |     17      |      11    |
| Mukilteo / Clinton            | muk-cl       | 7       |     14      |      5     |
| Edmonds / Kingston            | ed-king      | 6       |       8     |    12      |
| Seattle / Bainbridge Island   | sea-bi       | 5       |     7       |       3    |
| Seattle / Bremerton           | sea-br       | 3       |      7      |       4    |
| Fauntleroy / Vashon           | f-v          | 14      |       9     |   22       |
| Fauntleroy / Southworth       | f-s          | 13      |       9     |    20      |
| Southworth / Vashon           | s-v          | 15      |      20     |     22     |
| Pt Defiance / Tahlequah       | pd-tal       | 1       |      16     |      21    |


## Configuration options

| Option           | Description
|----------------- |-----------
| `apiKey`        | *Required* **Type:** string<br>Your key to accessing the WSDOT Traveler API.
| `myRouteID`        | *Required* **Type:** int<br>Your route ID.
| `myDepartingTerminalID`        | *Required* **Type:** int<br>Your departing terminal e.g. your home terminal.
| `myDepartingTerminalID`        | *Required* **Type:** int<br>Your arriving terminal (required because some terminals have multiple destinations e.g. Seattle->Bainbridge & Seattle->Bremerton.)
| `updateInterval`        | *Optional* How often to check for route updates. <br><br>**Type:** `int`(milliseconds) <br>Default 60000 milliseconds (1 minute)
