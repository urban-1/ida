
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
	    tooltipContentEditor: function(str, seriesIndex, pointIndex, plot){
		return  str +  ", (" +  plot.data[0][pointIndex][1]+")";
	    }
	  }
    }
  }
  ]
});
