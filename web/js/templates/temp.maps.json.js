
TMPS = $.extend({},TMPS,{
  "web.routing": [
  {
    name: "Routing Stats",
    fluxOpts: {
	select: ["histogram(to)"],
	where: ["time > now() - 1d"],
	group: "rlid,to"
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
	    useAxesFormatters:false,
	    tooltipContentEditor: I.Formatters.tooltipShowValue
	  }
    }
  }
  ],
  "web.search": [
  {
    name: "Search Stats",
    fluxOpts: {
	select: ["histogram(search)"],
	where: ["time > now() - 1d"],
	group: "lid,search"
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
	    useAxesFormatters:false,
	    tooltipContentEditor: I.Formatters.tooltipShowValue
	  }
    }
  },
  {
    name: "Search TimeLine by Name",
    fluxOpts: {
	select: ["count(search)"],
	where: [{
	 prompt: "Location Name",
	 pattern: "search={}"
	}],
	group: "time(1h)"
    },
    plotOpts:{
	  type: "time", 
	  legend: {
	    show:true, 
	    location: 'e'
	  }
    }
  }
  ]
});
