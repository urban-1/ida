TMPS = $.extend({},TMPS,{
	"pie.gws.essex.ac.uk": [
		{
		  name: "Temperature",
		  fluxOpts: {
				select: ["TMP36"],
				where: ["time > now()-1d"]
			},
		  plotOpts:{
				type: "time", 
				cursor:{ 
						show: true,
						zoom:true, 
						showTooltip:true
				},
				axesDefaults:{
						pad: 1.2
				},
				seriesDefaults:{
						showMarker: false
				},
				axes: {
						yaxis: {
							  pad: 0,
							  tickOptions: {
							      formatter: I.Formatters.unitFormat
							  }
						}
				},
				legend: {
						show:true, 
						location: 'nw',
						labels: ["Rx", "Tx", "Speed"]
				}
		  }
		},
		{
		  name: "TotalElectricity",
		  fluxOpts: {
				select: ["TotalElectricity"],
				where: ["time > now()-1d"]
		  },
		  plotOpts:{
				type: "time", 
				cursor:{ 
						show: true,
						zoom:true, 
						showTooltip:true
				},
				axesDefaults:{
						pad: 1.2
				},
				seriesDefaults:{
						showMarker: false
				},
				axes: {
						yaxis: {
								pad: 0,
								tickOptions: {
								    formatter: I.Formatters.unitFormat
								}
						}
				},
				legend: {
						show:true, 
						location: 'nw',
						labels: ["Rx", "Tx", "Speed"]
				}
		  }
		},
		{
		  name: "BoilerTemp1",
		  fluxOpts: {
				select: ["BoilerTemp1"],
				where: ["time > now()-1d"]
		  },
		  plotOpts:{
				type: "time", 
				cursor:{ 
						show: true,
						zoom:true, 
						showTooltip:true
				},
				axesDefaults:{
						pad: 1.2
				},
				seriesDefaults:{
						showMarker: false
				},
				axes: {
						yaxis: {
								pad: 0,
								tickOptions: {
								    formatter: I.Formatters.unitFormat
								}
						}
				},
				legend: {
						show:true, 
						location: 'nw',
						labels: ["Rx", "Tx", "Speed"]
				}
		  }
		},
		{
		  name: "BoilerTemp2",
		  fluxOpts: {
				select: ["BoilerTemp2"],
				where: ["time > now()-1d"]
		  },
		  plotOpts:{
				type: "time", 
				cursor:{ 
						show: true,
						zoom:true, 
						showTooltip:true
				},
				axesDefaults:{
						pad: 1.2
				},
				seriesDefaults:{
						showMarker: false
				},
				axes: {
						yaxis: {
								pad: 0,
								tickOptions: {
								    formatter: I.Formatters.unitFormat
								}
						}
				},
				legend: {
						show:true, 
						location: 'nw',
						labels: ["Rx", "Tx", "Speed"]
				}
		  }
		},
		{
		  name: "BoilerTemp3",
		  fluxOpts: {
				select: ["BoilerTemp2"],
				where: ["time > now()-1d"]
		  },
		  plotOpts:{
				type: "time", 
				cursor:{ 
						show: true,
						zoom:true, 
						showTooltip:true
				},
				axesDefaults:{
						pad: 1.2
				},
				seriesDefaults:{
						showMarker: false
				},
				axes: {
						yaxis: {
								pad: 0,
								tickOptions: {
								    formatter: I.Formatters.unitFormat
								}
						}
				},
				legend: {
						show:true, 
						location: 'nw',
						labels: ["Rx", "Tx", "Speed"]
				}
		  }
		}
	],
	"pie.gws.essex.ac.uk.actions": [
  {
    name: "Actions by Source",
		  fluxOpts: {
		      select: ["count(action)"],
		      where: ["time < now() group by source "]
		  },
		  plotOpts:{
		  	type: "histogram",
				seriesDefaults: {
					// Make this a pie chart.
					renderer: $.jqplot.PieRenderer, 
					rendererOptions: {
						// Put data labels on the pie slices.
						// By default, labels show the percentage of the slice.
						showDataLabels: true
					}
			}, 
			legend: {
				show:true, 
				location: 'e'
			},
			highlighter: {
				show: true,
				formatString:'%s', 
				tooltipLocation:'sw', 
				useAxesFormatters:false
			}
		}
  },
  {
    name: "Actions by Type",
		  fluxOpts: {
		      select: ["count(action)"],
		      where: ["time < now() group by action "]
		  },
		  plotOpts:{
		  	type: "histogram",
				seriesDefaults: {
					// Make this a pie chart.
					renderer: $.jqplot.PieRenderer, 
					rendererOptions: {
						// Put data labels on the pie slices.
						// By default, labels show the percentage of the slice.
						showDataLabels: true
					}
			}, 
			legend: {
				show:true, 
				location: 'e'
			},
			highlighter: {
				show: true,
				formatString:'%s', 
				tooltipLocation:'sw', 
				useAxesFormatters:false
			}
		}
  }
 ]
});
