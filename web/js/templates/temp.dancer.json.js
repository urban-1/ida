TMPS = $.extend({},TMPS,{
    "pie.gws.essex.ac.uk": [
        {
            "name": "Temperature",
            "fluxOpts": {
                "select": [
                    "TMP36"
                ],
                "where": [
                    "time > now()-1d"
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
                    "pad": "1.2"
                },
                "seriesDefaults": {
                    "showMarker": false
                },
                "axes": {
                    "yaxis": {
                        "pad": "0",
                        "tickOptions": {
                            "formatter": "I.Formatters.unitFormat"
                        }
                    }
                },
                "legend": {
                    "show": true,
                    "location": "nw",
                    "labels": [
                        "Temperature"
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
                    "time > now()-1d"
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
                    "pad": "1.2"
                },
                "seriesDefaults": {
                    "showMarker": false
                },
                "axes": {
                    "yaxis": {
                        "pad": "0",
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
        },
        {
            "name": "BoilerTemp1",
            "fluxOpts": {
                "select": [
                    "BoilerTemp1"
                ],
                "where": [
                    "time > now()-1d"
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
                    "pad": "1.2"
                },
                "seriesDefaults": {
                    "showMarker": false
                },
                "axes": {
                    "yaxis": {
                        "pad": "0",
                        "tickOptions": {
                            "formatter": "I.Formatters.unitFormat"
                        }
                    }
                },
                "legend": {
                    "show": true,
                    "location": "nw",
                    "labels": [
                        "BoilerTemp1"
                    ]
                }
            }
        },
        {
            "name": "BoilerTemp2",
            "fluxOpts": {
                "select": [
                    "BoilerTemp2"
                ],
                "where": [
                    "time > now()-1d"
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
                    "pad": "1.2"
                },
                "seriesDefaults": {
                    "showMarker": false
                },
                "axes": {
                    "yaxis": {
                        "pad": "0",
                        "tickOptions": {
                            "formatter": "I.Formatters.unitFormat"
                        }
                    }
                },
                "legend": {
                    "show": true,
                    "location": "nw",
                    "labels": [
                        "BoilerTemp2"
                    ]
                }
            }
        },
        {
            "name": "BoilerTemp3",
            "fluxOpts": {
                "select": [
                    "BoilerTemp3"
                ],
                "where": [
                    "time > now()-1d"
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
                    "pad": "1.2"
                },
                "seriesDefaults": {
                    "showMarker": false
                },
                "axes": {
                    "yaxis": {
                        "pad": "0",
                        "tickOptions": {
                            "formatter": "I.Formatters.unitFormat"
                        }
                    }
                },
                "legend": {
                    "show": true,
                    "location": "nw",
                    "labels": [
                        "BoilerTemp3"
                    ]
                }
            }
        }
    ],
    "pie.gws.essex.ac.uk.actions": [
        {
            "name": "Group by Action",
            "fluxOpts": {
                "select": [
                    "count(action)"
                ],
                "where": [
                    "time < now()"
                ],
                "group": "action"
            },
            "plotOpts": {
                "type": "histogram",
                "seriesDefaults": {
                    "renderer": "$.jqplot.PieRenderer",
                    "rendererOptions": {
                        "showDataLabels": true
                    }
                },
                "legend": {
                    "show": true,
                    "location": "e"
                },
                "highlighter": {
                    "show": true,
                    "formatString": "%s",
                    "tooltipLocation": "sw",
                    "useAxesFormatters": false
                }
            }
        },
        {
            "name": "Group by Source",
            "fluxOpts": {
                "select": [
                    "count(action)"
                ],
                "where": [
                    "time < now()"
                ],
                "group": "source"
            },
            "plotOpts": {
                "type": "histogram",
                "seriesDefaults": {
                    "renderer": "$.jqplot.PieRenderer",
                    "rendererOptions": {
                        "showDataLabels": true
                    }
                },
                "legend": {
                    "show": true,
                    "location": "e"
                },
                "highlighter": {
                    "show": true,
                    "formatString": "%s",
                    "tooltipLocation": "sw",
                    "useAxesFormatters": false
                }
            }
        }
    ]
});