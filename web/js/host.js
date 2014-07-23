// TODO: GUI select (tree)
var DB="UEssexC" 
var HOST;






$().ready(function(){
  HOST = new I.InfluxHost({
    host :"scampus",
    port:8086,
    user: "root",
    pass: "root"
  });
  
  
  cl(HOST);
  
  // Make options
  var fluxOpts = $.extend(HOST.getHostConfig(), {
    from: "net.if.eth0",
    db: DB,
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
  var tp = new I.InfluxPlot($('#test'),fluxOpts,plotOpts);
  
})
