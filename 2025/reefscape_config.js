var config_data = `
{
    "dataFormat": "tsv",
    "title": "Scouting PASS 2025",
    "page_title": "REEFSCAPE",
    "checkboxAs": "10",
    "prematch": [
        {
            "name": "Scouter Initials",
            "code": "s",
            "type": "scouter",
            "size": 5,
            "maxSize": 5,
            "required": "true"
        },
        {
            "name": "Event",
            "code": "e",
            "type": "event",
            "defaultValue": "2025mirr",
            "required": "true"
        },
        {
            "name": "Match Level",
            "code": "l",
            "type": "level",
            "choices": {
                "qm": "Quals<br>",
                "sf": "Semifinals<br>",
                "f": "Finals"
            },
            "defaultValue": "qm",
            "required": "true"
        },
        {
            "name": "Match #",
            "code": "m",
            "type": "match",
            "min": 1,
            "max": 150,
            "required": "true"
        },
        {
            "name": "Robot",
            "code": "r",
            "type": "robot",
            "choices": {
                "r1": "Red-1",
                "b1": "Blue-1<br>",
                "r2": "Red-2",
                "b2": "Blue-2<br>",
                "r3": "Red-3",
                "b3": "Blue-3"
            },
            "required": "true"
        },
        {
            "name": "Team #",
            "code": "t",
            "type": "team",
            "min": 1,
            "max": 99999
        },
        {
            "name": "Auto Start Position",
            "code": "as",
            "type": "clickable_image",
            "filename": "2025/half_field.png",
            "clickRestriction": "one",
            "dimensions": "6 6",
            "allowableResponses": "1 7 13 19 25 31",
            "shape": "circle 5 black red true"
        }
    ],
    "auton": [
        {
            "name": "Leave Starting Line",
            "code": "al",
            "type": "bool"
        },
        {
            "name": "Coral L1",
            "code": "ac1",
            "type": "counter"
        },
        {
            "name": "Coral L2",
            "code": "ac2",
            "type": "counter"
        },
        {
            "name": "Coral L3",
            "code": "ac3",
            "type": "counter"
        },
        {
            "name": "Coral L4",
            "code": "ac4",
            "type": "counter"
        },
        {
            "name": "Processor Score",
            "code": "aps",
            "type": "counter"
        },
        {
            "name": "Net Score",
            "code": "ans",
            "type": "counter"
        }
    ],
    "teleop": [
        {
            "name": "Coral L1",
            "code": "tc1",
            "type": "counter"
        },
        {
            "name": "Coral L2",
            "code": "tc2",
            "type": "counter"
        },
        {
            "name": "Coral L3",
            "code": "tc3",
            "type": "counter"
        },
        {
            "name": "Coral L4",
            "code": "tc4",
            "type": "counter"
        },
        {
            "name": "Processor Score",
            "code": "tps",
            "type": "counter"
        },
        {
            "name": "Net Score",
            "code": "tns",
            "type": "counter"
        }
    ],
    "endgame": [
        {
            "name": "Final Robot Status",
            "code": "efs",
            "type": "radio",
            "choices": {
                "bp": "Parked<br>",
                "ba": "Parked/Failed Climb<br>",
                "bs": "Shallow Cage<br>",
                "bd": "Deep Cage<br>",
                "x": "Not attempted"
            },
            "defaultValue": "x"
        }
    ],
    "postmatch": [
        {
            "name": "Attained Coopertition Pt",
            "code": "cop",
            "type": "bool"
        },
        {
            "name": "Pickup From",
            "code": "tpu",
            "type": "radio",
            "choices": {
                "s": "Coral Station<br>",
                "f": "Floor<br>",
                "b": "Both<br>",
                "x": "Not Attempted"
            },
            "defaultValue": "x"
        },
        {
            "name": "Driver Skill",
            "code": "ds",
            "type": "radio",
            "choices": {
                "n": "Not Effective<br>",
                "a": "Average<br>",
                "v": "Very Effective<br>",
                "x": "Not Observed"
            },
            "defaultValue": "x"
        },
        {
            "name": "Defense Rating",
            "code": "dr",
            "type": "radio",
            "choices": {
                "b": "Below Average<br>",
                "a": "Average<br>",
                "g": "Good<br>",
                "e": "Excellent<br>",
                "x": "Did not play defense"
            },
            "defaultValue": "x"
        },
        {
            "name": "Speed Rating",
            "code": "sr",
            "type": "radio",
            "choices": {
                "1": "1 (slow)<br>",
                "2": "2<br>",
                "3": "3<br>",
                "4": "4<br>",
                "5": "5 (fast)"
            },
            "defaultValue": "3"
        },
        {
            "name": "Died/Immobilized",
            "code": "die",
            "type": "bool"
        },
        {
            "name": "got coral stuck for more than 10 seconds",
            "code": "corstu",
            "type": "bool"
        },
        {
            "name": "Tippy<br>(almost tipped over)",
            "code": "tip",
            "type": "bool"
        },
        {
            "name": "Dropped Coral (>2)",
            "code": "dc",
            "type": "bool"
        },
        {
            "name": "Dropped Algae (>2)",
            "code": "da",
            "type": "bool"
        },
        {
        "name": "Citrus Rank",
        "code": "cr",
        "type": "radio",
        "choices": {
            "1": "1 (best) <br>",
            "2": "2 <br>",
            "3": "3 (worst)"
        },
        "defaultValue": "2"
    },
        {
            "name": "Comments",
            "code": "co",
            "type": "text",
            "size": 15,
            "maxSize": 55
        }
    ]
}`
