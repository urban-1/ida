// TODO: GUI select (tree)
var DB="mon.serusl03" 

var FLUX = {
  host :"serusl03",
  port:8086,
  user: "root",
  pass: "root",
  db: DB
}





$().ready(function(){
  
  // Make options
  var fluxOpts = $.extend(FLUX, {
    from: "net.if.eth0",
    select: ["rx", "tx", "speed"],
    where: "time > now() -1h"
//     group: ""
  });
  
  var plotOpts = {
      type: "time", 
      kmgUnits: true,
      cursor:{ 
	show: true,
	zoom:true, 
	showTooltip:true
      },
      title: "net.if.eth0",
      axesDefaults:{
	pad: 1.2
      },
      axes: {
	xaxes:{
	  
	}
      }
  };
  var tp = new InfluxPlot($('#test'),fluxOpts,plotOpts);
  
})
