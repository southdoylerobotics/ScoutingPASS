var config_data = `
{
  "dataFormat": "tsv",
  "title": "Pit Scouting 2026",
  "page_title": "PIT SCOUTING",
  "checkboxAs": "10",
  "prematch": [
    { "name": "Scouter Name",
      "code": "s",
      "type": "scouter",
      "size": 10,
      "maxSize": 20,
      "required": "true"
    },
    { "name": "Team Number",
      "code": "t",
      "type": "number",
      "min": 1,
      "max": 9999,
      "required": "true"
    },
    { "name": "Event",
      "code": "e",
      "type": "event",
      "defaultValue": "2026Pit",
      "required": "true"
    },
    { "name": "Match #",
      "code": "m",
      "type": "match",
      "min": 1,
      "max": 1,
      "defaultValue": "1",
      "required": "true"
    },
    { "name": "Chassis Width (in)",
      "code": "wid",
      "type": "number",
      "defaultValue": "0"
    },
    { "name": "Chassis Length (in)",
      "code": "len",
      "type": "number",
      "defaultValue": "0"
    },
    { "name": "Weight (lbs)",
      "code": "wei",
      "type": "number",
      "defaultValue": "0"
    },
    { "name": "# of Batteries",
      "code": "nob",
      "type": "number",
      "defaultValue": "0"
    },
    { "name": "Max Fuel Capacity",
      "code": "mcf",
      "type": "number",
      "defaultValue": "0"
    },
    { "name": "Comments",
      "code": "co",
      "type": "text",
      "size": 20,
      "maxSize": 250
    }
  ],
  "auton": [],
  "teleop": [],
  "endgame": [],
  "postmatch": []
}`;
