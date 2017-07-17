# MMM-WSF-Ferries

This [MagicMirror²](https://github.com/MichMich/MagicMirror/) module fetches and displays WSF route schedules and shows delays.


## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file.

The config property `myRoute` is required to set the route you are tracking. Use the lookup table below to set the correct route abbreviation for your route.

```js
var config = {
    modules: [
        {
            module: 'MMM-WSF-Ferries',
            config: {
                myRoute: "ana-sid",
                myRouteID: 10
            }
        }
    ]
}
```

## Getting your route abbreviation
Route ID lookup table

| Route Name                    | Abbreviation | RouteID |
| ------------------------------|:------------:|:-------:|
| Anacortes / Sidney B.C        | ana-sid      | 10      |
| Anacortes / San Juan Islands  | ana-sj       | 9       |
| Port Townsend / Coupeville    | pt-key       | 8       |
| Mukilteo / Clinton            | muk-cl       | 7       |
| Edmonds / Kingston            | ed-king      | 6       |
| Seattle / Bainbridge Island   | sea-bi       | 5       |
| Seattle / Bremerton           | sea-br       | 3       |
| Fauntleroy / Vashon           | f-v          | 14      |
| Fauntleroy / Southworth       | f-s          | 13      |
| Southworth / Vashon           | s-v          | 15      |
| Pt Defiance / Tahlequah       | pd-tal       | 1       |


## Configuration options

| Option           | Description
|----------------- |-----------
| `myRoute`        | *Required* **Type:** string<br>Your route abbreviation.
| `myRouteID`        | *Required* **Type:** int<br>Your route ID.
| `updateInterval`        | *Optional* How often to check for route updates. <br><br>**Type:** `int`(milliseconds) <br>Default 60000 milliseconds (1 minute)
