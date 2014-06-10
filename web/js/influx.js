
function cl(x) { console.log (x);}

function unitFormat1024(format, val) { 
  if (typeof val == 'number') { 
      if (!format) { 
	  format = '%.1f'; 
      } 
      if (Math.abs(val) >= 1073741824 ) {
	  return (val / 1073741824).toFixed(1) + 'G';
      }
      if (Math.abs(val) >= 1048576 ) {
	  return (val / 1048576 ).toFixed(1) + 'M';
      }
      if (Math.abs(val) >= 1024) {
	  return (val / 1024).toFixed(1) + 'K';
      }
      return String(val.toFixed(1));
  } 
  else { 
      return String(val); 
  }
}

function unitFormat(format, val) { 
  if (typeof val == 'number') { 
      if (!format) { 
	  format = '%.1f'; 
      } 
      if (Math.abs(val) >= 1000000000 ) {
	  return (val / 1000000000).toFixed(1) + 'G';
      }
      if (Math.abs(val) >= 1000000 ) {
	  return (val / 1000000 ).toFixed(1) + 'M';
      }
      if (Math.abs(val) >= 1000) {
	  return (val / 1000).toFixed(1) + 'K';
      }
      return String(val.toFixed(1));
  } 
  else { 
      return String(val); 
  }
} 

/**
 * Constructor: Element, flux options, plot options
 */
function InfluxPlot(el,flux,plot){
  this.el = el;
  this.flux = flux;
  this.plot = plot
  this.el.html("Loading... please wait")
  this._init();
}

InfluxPlot.prototype._init = function (){
  
  var f = this.flux
  var urlBase = "http://"+f.host+":"+f.port+"/db/"+f.db+"/series?u="+f.user+"&p="+f.pass;
  var q="select "+f.select+" from "+f.from;
  
  if (f.where) q+=" where "+f.where;
  if (f.group) q+=" group by "+f.group;
  
  var postData = {u: f.user, p: f.pass, q:q}
  
  
  urlBase+="&q="+q;
  
  var ifplot = this;
  
  $.ajax({
    url: urlBase,
    type: "GET",
    dataType: "json",
//     data: JSON.stringify(postData),
    success: function(data){
      ifplot.el.html("");
      // 1 reply!
      data=data[0];
      ifplot.processData(data);
    },
    error: function (error){ cl(error.responseText) }
  });
 
}

InfluxPlot.prototype.processData = function(d){
  if (this.plot.type == "time") this.processTimeSeriesData(d);
}

InfluxPlot.prototype.processTimeSeriesData = function(d){
  if (d.points.length==0) return;
  var plotData = []
  var time = []
  var col = d.points[0].length;
  
  // init dimensions
  for (var j=2; j<col; j++) plotData[j-2] = []
  
  for (var i=0; i<d.points.length; i++) {
    for (var j=2; j<col; j++) {
      plotData[j-2].push([d.points[i][0],d.points[i][j]]);
    }
  }
  
  
  this.plot = $.extend(true,this.plot,
    {axes:{xaxis:{renderer:$.jqplot.DateAxisRenderer}}}
  );
  
  this.plot = $.extend(true,this.plot,
    {seriesDefaults:{showMarker:false}}
  );
  

  
  if (this.plot.kmgUnits) {
    var options = {
        axes: {
            yaxis: {
                min: 0,
                tickOptions: {
                    formatter: unitFormat
                }
            }
        }
    };
    this.plot = $.extend(true,options,this.plot);
  }
  this.jq = $.jqplot(this.el.attr("id"), plotData, this.plot);

}

InfluxPlot.prototype.getThis = function (){
  return this;
}