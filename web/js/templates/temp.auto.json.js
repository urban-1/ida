TMPS = $.extend({},TMPS,{
    "pia.gws.essex.ac.uk": [
        {
            "name": "TotalGas",
            "fluxOpts": {
                "select": [
                    "TotalGas"
                ],
                "where": [
                    "time>now()-1d"
                ]
            },
            "plotOpts": {
                "type": "time",
                "cursor": {
                    "show": true,
                    "zoom": true,
                    "showTooltip": true
                },
                "axesDefaults": {
                    "pad": 1.2
                },
                "seriesDefaults": {
                    "showMarker": false
                },
                "axes": {
                    "yaxis": {
                        "pad": 0,
                        "tickOptions": {
                            "formatter": "I.Formatters.unitFormat"
                        }
                    }
                },
                "legend": {
                    "show": true,
                    "location": "nw",
                    "labels": [
                        "TotalGas"
                    ]
                }
            }
        },
        {
            "name": "TotalElectricity",
            "fluxOpts": {
                "select": [
                    "TotalElectricity"
                ],
                "where": [
                    "time>now()-20d"
                ]
            },
            "plotOpts": {
                "type": "time",
                "cursor": {
                    "show": true,
                    "zoom": true,
                    "showTooltip": true
                },
                "axesDefaults": {
                    "pad": 1.2
                },
                "seriesDefaults": {
                    "showMarker": false
                },
                "axes": {
                    "yaxis": {
                        "pad": 0,
                        "tickOptions": {
                            "formatter": "I.Formatters.unitFormat"
                        }
                    }
                },
                "legend": {
                    "show": true,
                    "location": "nw",
                    "labels": [
                        "TotalElectricity"
                    ]
                }
            }
        }
    ]
});