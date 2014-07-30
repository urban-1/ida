TMPS = $.extend({},TMPS,{
  "net.if": [
  {
    name: "General Interface Plot",
    fluxOpts: {
	select: ["mean(rx)", "mean(tx)", "mean(speed)"],
	where: ["time > now() - 1d"],
	group: "time(10s)"
    },
    plotOpts:{
	type: "time", 
	cursor:{ 
	    show: true,
	    zoom:true, 
	    showTooltip:true
	},
	title: "replace this",
	axesDefaults:{
	    pad: 1.2
	},
	seriesDefaults:{
	    showMarker: false
	},
	axes: {
            yaxis: {
                min: 0,
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
  
  "net.ping": [
  {
    name: "General Ping Plot",
    fluxOpts: {
	select: ["mean(min)", "mean(max)","mean(avg)"],
	where: ["time > now() - 1d"],
	group: "time(10s)"
    },
    plotOpts:{
	type: "time", 
	typeOpts: {
	    minMax: true
	},
	seriesDefaults:{
	    showMarker: false
	},
	cursor:{ 
	    show: true,
	    zoom:true, 
	    showTooltip:true
	},
	axesDefaults:{
	    pad: 1.2,
	    labelRenderer: $.jqplot.CanvasAxisLabelRenderer
	},
	axes: {
	    yaxis: {
	      label: 'RTT in milliseconds'
	    }
	},
	legend: {
	    show:true, 
	    location: 'nw',
	    labels: ["Avg", "Max", "Min"]
	},
	series: [{
            rendererOptions: {
                highlightMouseDown: true,
                smooth: true
            }
        }]
    }
  }
  ],
  
  
  "cpu": [
  {
    name: "General CPU Plot",
    fluxOpts: {
	select: ["system", "user", "total"],
	where: ["time > now() - 1d"],
    },
    plotOpts:{
	type: "time", 
	seriesDefaults:{
	    showMarker: false
	},
	cursor:{ 
	    show: true,
	    zoom:true, 
	    showTooltip:true
	},
	title: "replace this",
	axesDefaults:{
	    pad: 1.2,
	    labelRenderer: $.jqplot.CanvasAxisLabelRenderer
	},
	axes: {
	    yaxis: {
	      label: 'Utilization'
	    }
	},
	legend: {
	    show:true, 
	    location: 'nw',
	    labels: ["Sys", "User", "Total"]
	}
    }
  }
  ],
 
 "srv": [
      {
	name: "Uptime Pie Chart",
	fluxOpts: {
	    select: ["histogram(status)"],
	    where: ["time > now() - 1d"],
	    group: "status"
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
	name: "Time 0/1 Services Plot",
	fluxOpts: {
	    select: ["status"],
	    where: ["time > now() - 1d"],
	},
	plotOpts:{
	    type: "time", 
	    seriesDefaults:{
		showMarker: false
	    },
	    cursor:{ 
		show: true,
		zoom:true, 
		showTooltip:true
	    },
	    title: "replace this"
	}
      }
  ],
  "mem": [
  {
    name: "General MEM Plot",
    fluxOpts: {
	select: ["mean(used)", "mean(free)"],
	where: ["time > now() - 1d"],
	group: "time(10s)"
    },
    plotOpts:{
	type: "time", 
	seriesDefaults:{
	    showMarker: false
	},
	cursor:{ 
	    show: true,
	    zoom:true, 
	    showTooltip:true
	},
	axesDefaults:{
	    pad: 1.2,
	    labelRenderer: $.jqplot.CanvasAxisLabelRenderer
	},
	axes: {
	    yaxis:{
		label: "Bytes (1024 KMG)",
		min: 0,
                tickOptions: {
                    formatter: I.Formatters.unitFormat1024
                }
	    }
        },
	legend: {
	    show:true, 
	    location: 'nw',
	    labels: ["Used", "Free"]
	}
    }
  }
  ],
  "disks": [
  {
    name: "General Disk Plot",
    fluxOpts: {
	select: [ "free","used"],
	where: ["time > now() - 1d"],
    },
    plotOpts:{
	type: "time", 
	stackSeries: true,
	showMarker: false,
	seriesDefaults: {
	    fill: true
	},
	cursor:{ 
	    show: true,
	    zoom:true, 
	    showTooltip:true
	},
	axesDefaults:{
	    pad: 1.2,
	    labelRenderer: $.jqplot.CanvasAxisLabelRenderer
	},
	axes: {
	    yaxis: {
		label: 'Bytes',
		min: 0,
		tickOptions: {
		    formatter: I.Formatters.unitFormat
		}
	    }
	},
	legend: {
	    show:true, 
	    location: 'nw',
	    labels: ["Free","Used"]
	}
    }
  }
  ]
});
