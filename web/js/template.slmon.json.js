TMPS = $.extend({},TMPS,{
  "net.if": [
  {
    name: "General Interface Plot",
    fluxOpts: {
	select: ["mean(rx)", "mean(tx)", "mean(speed)"],
	where: "time > now() - 1d",
	group: "time(10s)"
    },
    plotOpts:{
	type: "time", 
	kmgUnits: I.unitFormat,
	cursor:{ 
	    show: true,
	    zoom:true, 
	    showTooltip:true
	},
	title: "replace this",
	axesDefaults:{
	    pad: 1.2
	},
	axes: {
	    xaxis:{
	      
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
	select: ["mean(avg)", "mean(max)", "mean(min)"],
	where: "time > now() - 1d",
	group: "time(10s)"
    },
    plotOpts:{
	type: "time", 
	cursor:{ 
	    show: true,
	    zoom:true, 
	    showTooltip:true
	},
	axesDefaults:{
	    pad: 1.2,
	    labelRenderer: $.jqplot.canvasAxisLabelRenderer
	},
	axes: {
	    yaxis: {
	      label: 'RTT in milliseconds'
	    },
	    xaxis: {
	      label: 'Time'
	    }
	},
	legend: {
	    show:true, 
	    location: 'nw',
	    labels: ["Avg", "Max", "Min"]
	}
    }
  }
  ],
  
  
  "cpu": [
  {
    name: "General CPU Plot",
    fluxOpts: {
	select: ["system", "user", "total"],
	where: "time > now() - 1d",
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
	    pad: 1.2,
	    labelRenderer: $.jqplot.canvasAxisLabelRenderer
	},
	axes: {
	    yaxis: {
	      label: 'Utilization'
	    },
	    xaxis: {
	      label: 'Time'
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
	name: "Uptime",
	fluxOpts: {
	    select: ["histogram(status)"],
	    where: "time > now() - 1d",
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
	  }
	}
      },
      {
	name: "Time 0/1 Services Plot",
	fluxOpts: {
	    select: ["status"],
	    where: "time > now() - 1d",
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
	    axes: {
		xaxis:{
		  
		}
	    }
	}
      }
  ],
  "mem": [
  {
    name: "General MEM Plot",
    fluxOpts: {
	select: ["mean(used)", "mean(free)"],
	where: "time > now() - 1d",
	group: "time(10s)"
    },
    plotOpts:{
	type: "time", 
	kmgUnits: I.unitFormat1024,
	cursor:{ 
	    show: true,
	    zoom:true, 
	    showTooltip:true
	},
	title: "replace this",
	axesDefaults:{
	    pad: 1.2
	},
	axes: {
	    xaxis:{
	      
	    }
	},
	legend: {
	    show:true, 
	    location: 'nw',
	    labels: ["Used", "Free"]
	}
    }
  }
  ]
});
