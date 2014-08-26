

/**
 * Constructor: Element, Options: 
 * 
 * flux host, flux options (template,db,series), plot options
 * and curTime. If the curTime is provided, the constructor will call setTime before
 * loading the plot (to avoid 2ble tapping the db)
 */
I.InfluxPlot = function (el,opts){
  this.el = el;

  this.flux = $.extend(true,{},opts.flux);
  this.fluxHost = $.extend(true,{},opts.fluxHost);
  this.plot = $.extend(true,{},opts.plot);
  this.data={}; // Not used atm
  
  // If time is "" use the default 
  // from the template
  if (opts.curTime) {
      this.setTime(opts.curTime);
  }
  
  // Before calling _init, get all parameters!
  this._handleParams();
  
  // Init with default zoom
  this._init();
}




I.InfluxPlot.prototype = {
    
    _handleParams: function(){
	var len = this.flux.where.length;
	var titleExt = []
	for (var i=0; i<len; i++){
	    if (typeof this.flux.where[i]=="string") continue;
	    var param = this.flux.where[i];
	    var value = window.prompt(param.prompt,"");
	    // Error control here?
	    var nval = param.pattern.replace("{}","'"+value+"'");
	    this.flux.where[i] = nval;
	    titleExt.push(nval);
	}
	
	this.plot.title = this.plot.title+"("+titleExt.join(',')+")";
    },

/**
 * Init a graph. If cursor is given, zoom to that 
 * cursor level!
 */
_init: function (cursor){
  var f = this.flux
  
  
  var q="select "+f.select.join(',')+" from "+f.from;
  if (f.where) q+=" where "+f.where.join(' AND ');
  if (f.group) q+=" group by "+f.group;
  
  var ifplot = this;
//   cl(q)
  this.fluxHost._post(q,f.db,null,function(d){
    ifplot.processData(d);
    if (cursor && ifplot.plot.type=="time") {
	var c = ifplot.jq.plugins.cursor;
	ifplot.jq.plugins.cursor=cursor;
	var dataP = cursor._zoom.datapos;
	var gridP = cursor._zoom.gridpos;
	c.doZoom(
	    gridP, dataP, ifplot.jq, cursor
	);
    }
  });
  
  
},

/**
 * Re-initializes fetching data and ploting
 */
fullRefresh: function(opts){
    var z = false
    
    if (this.jq) {
	
	if (opts.restoreZoom)
	    z = $.extend({},this.jq.plugins.cursor);
	
	this.jq.destroy();
	this.jq = null;
	this.el.empty();
    }
    this._init(z);
},

/**
 * Replot only with the same data but reset axis
 * since date may change to time, etc
 */
replot: function(opts){
    if (this.jq) this.jq.replot(opts);
},

/**
 * Pure redraw, no axis will change
 */
redraw: function(){
  this.jq.redraw();
},

setTime: function(newTime){
    if (newTime=="") 
	newTime="time > now() -1h";
    
    var len = this.flux.where.length;
    
    for (var i=len-1; i>=0; i--){
	if (typeof this.flux.where[i]!="string") continue;
	if (this.flux.where[i].indexOf("time")!=-1){
	    this.flux.where.splice(i,1);
	    i--;
	}
    }
    this.flux.where.push(newTime)
},


/**
 * Process RAW reply from InfluxHost
 */
processData: function(d){
  
    if (!d) return;
    if (!d.length) {
	this.el.html("No data for "+this.plot.title)
	this.el.css({
	    width: '',
	    height: ''
	})
	return;
    }
    this.el.html("");
    this.el.css({
	width: '100%',
	height: '100%'
    })
    
    // Before sending to the rest, check
    // that the data are same order as the
    // select....
    this._shortLegend(d);
    
    // Check plot type
    if (this.plot.type == "time") 
	this.processTimeSeriesData(d[0]);
    else if (this.plot.type == "histogram") 
	this.processHistogramData(d[0]);
},

_shortLegend: function(d){
    
    if (!this.plot.legend || !this.plot.legend.labels) return;
    
    // returnned columns
    var col = d[0].columns;
    
    var less = 0;
    if ($.inArray("time", d[0].columns)!=-1) less++;
    if ($.inArray("sequence_number", d[0].columns)!=-1) less++;
    
    var sel = this.flux.select;
    
    
    for (var from=0; from<sel.length; from++){
	
	var to = col.indexOf(sel[from]);
	// Invalid, may be a mean
	if (to == -1) break;
	to-=less;
	
	// 
	if (from==to) continue;
	// Change the select order!
	this.flux.select.splice(to, 0, this.flux.select.splice(from, 1)[0]);
	// Change the legend order
	this.plot.legend.labels.splice(to, 0, this.plot.legend.labels.splice(from, 1)[0]);
    }

},

/**
 * Process histogram data and create a pie
 * chart. This is str8 forward. The only thing
 * we do is to convert 0/1 values if appeared as
 * "label" values to "False/Down" and "True/Up"
 * respectively
 */
processHistogramData: function(d){

  var len = d.points.length;

  if (len==0) return;
  
  var inlen = d.points[0].length;
  var cpos  = d.columns.indexOf("count");
  var plotData = [];
  
  
  
  for (var i=0; i<len; i++) {
    var val= d.points[i][inlen-1];
    if ((val=="" || !val) && val!==0){
	val="NA";
    }else if (val ==1 || val==0){
      val = (val==1) ? "True/Up" : "False/Down"
    }
    
    // Add meta-data?
//     var meta={}
//     for (var j=0; j<inlen; j++) {
// 	meta[d.columns[j]] = d.points[i][j];
//     }
    
    plotData.push([val,d.points[i][cpos]/*,meta*/]); // fixme: get count pos
  }
  
  this.jq = $.jqplot(this.el.attr("id"), [plotData], this.plot);
},

/**
 * This is the core plotting function that deals
 * with time-series. It expects data in order of
 * IMPORTANCE except time that is always column 0!
 * 
 * Example: Column sequence_number of influx comes
 * first (after time always) thus can/should be ignored
 * if it is there... ANY column after the "ignored" or 
 * "special" are ploted as time-series data.
 * 
 * Additionally, this function deals with a number of options
 * that can be supplied through the template.plot.typeOpts. At
 * the moment we support min/max based error bar/area diagrams.
 * As explained earlier, min and max are special data and not
 * time series data. Therefore the expected order is:
 * 
 * time, IGNORE(maybe), min, max, data
 */
processTimeSeriesData: function(d){
  if (d.points.length==0) return;
  var plotData = [];
  var minMax = [];
  var time = []
  var col = d.points[0].length;
  
  var less = 0;
  if ($.inArray("time", d.columns)!=-1) less++;
  if ($.inArray("sequence_number", d.columns)!=-1) less++;
  
  
  var isMinMax = false;
  if (this.plot.typeOpts && this.plot.typeOpts.minMax) {
      isMinMax=true;
      less+=2;
  }
  
  // init dimensions
  for (var j=less; j<col; j++) {
      plotData[j-less] = [];
  }
  
  for (var i=0; i<d.points.length; i++) {
    for (var j=less; j<col; j++) {
      plotData[j-less].push([d.points[i][0],d.points[i][j]]);
      if (isMinMax) {
	  minMax.push([d.points[i][j-2],d.points[i][j-1]]);
      }
    }
  }
  
  this.plot = $.extend(true,this.plot,
    {axes:{xaxis:{renderer:$.jqplot.DateAxisRenderer}}}
  );
  
//   // TODO:Maybe move into templates
//   this.plot = $.extend(true,this.plot,
//     
//   );
  
  if (isMinMax){
      this.plot = $.extend(true,this.plot,{
	series: [{
            rendererOptions: {
                // Set the band data on the series.
                // Bands will be turned on automatically if
                // valid band data is present.
                bandData: minMax
            }
        }]
    });
  }
  
  this.jq = $.jqplot(this.el.attr("id"), plotData, this.plot);

}

}; // End of I.InfluxPlot

/**
 * I.InfluxHost implementation. Global single configuration
 * atm. Supports quering for available dbs and list series 
 * in each DB.
 * 
 * Options.exclude can be use to exclude databases
 */
I.InfluxHost = function(opts){
  this.options = opts;
  this._init();
}

I.InfluxHost.prototype = {

/**
 * return the configuration to be used
 * in an InfluxPlot
 */
getHostConfig: function(){
  return {
    host: this.options.host,
    port: this.options.port,
    user: this.options.user,
    pass: this.options.pass
  };
},

getData: function(){
  return this.data;
},

_getBaseUrl: function(){
    var f = this.options;
    return "http://"+f.host+":"+f.port+"/db" ;
},

/**
 * Main function to post to an influx server
 * This takes the query, the database, a last
 * indicator and the callback. The last ind. is 
 * used in case of multiple calls in a loop
 */
_post: function(q, db, isLast, cb){
  
    var url = this._getBaseUrl();
    if (db) url+="/"+db+"/series";
    
    // XSR with Auth!
    //   var postData = {};
    //   if (q) postData=q;
    //   postData=JSON.stringify(postData);
    //   cl(postData)
    
    var ifhost = this;
    
    url+="?u="+this.options.user+"&p="+this.options.pass;
    if (q) url += "&q="+encodeURI(q);
    
    
    $.ajax({
	url: url,
	type: "GET",
    //     type: "POST",
    //     data: postData,
	dataType: "json",
	success: function(data){
	    if (cb) cb(data,db,isLast);
	},
	error: function (error){ cl(error.responseText) }
    //     ,
    //     beforeSend: function (xhr) {
    //       xhr.setRequestHeader ("Authorization", "Basic "+btoa(ifhost.options.user+":"+ifhost.options.pass)); 
    //     }
    });  
},

_initDatabases: function(){
  
  var ifhost = this;
  
  this._post(null, null, null,
    function(data){
      // Link for shortcut
      var len = data.length;
      
      for (var i=0; i<len; i++) {
	// Skip empty
	if (data[i].name=="") continue;
	// Skip excluded
	if (ifhost.options.exclude &&
	    ifhost.options.exclude.indexOf(data[i].name)!=-1) continue;
	
	ifhost.data.children.push({
	  text: data[i].name,
	  children: []
	});
      }
      
      // Sort based on name so they do not change order!
      ifhost.data.children.sort(ifhost._DynCompare('text'));
      
      ifhost._initEachDB();
    }
  );
},

_initEachDB: function(){
    if (!this.data || !this.data.children) return;
    
    var ifhost = this;
    var isLast = false
    var len = this.data.children.length;
    
    for (var i=0; i<len; i++) {
	    if (i==len-1)isLast = true
	    this._post("list series",this.data.children[i].text,isLast,function(data,db,isLast){
		var len = data.length;
		var dbidx = ifhost._getDataIdxForDB(db);
		
		// Sort based on name so they do not change order!
		data.sort(ifhost._DynCompare('name'));
		
		// Each series
		for (var j=0; j<len; j++) {
		    ifhost.data.children[dbidx].children.push({
			text:data[j].name,
			li_attr: {series:true}
		    });
		}
		// All in place, trigger event
		if (isLast)
		    $('body').trigger("dataChanged");
	    });
    }
},

_getDataIdxForDB: function(name){
    var len = this.data.children.length;
    for (var i=0; i<len; i++){
	if (this.data.children[i].text==name) return i;
    }
    return -1;
},

/**
 * Sort element in array based on the
 * property ('text') field
 */
_DynCompare: function (property) {
    return  function(a,b){
	return (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    }
},



_init: function(){
    this.data = {
	text: this.options.host,
	children: []
    };
    
    this._initDatabases();
}

}; // End of I.InfluxHost

/**
 * Popup Message
 */
I.Popup = function(){
    this._init();
}

I.Popup.prototype = {
    _init: function(){
	this.el = document.createElement('DIV');
	this.el.id="tmpPopup";
	this.el.className = "msg";
	this.el.style.display = "none";
	this.el.style.position = "fixed";
	this.el.style.zIndex = 1001;
	document.body.appendChild(this.el);
    },
    
    setMsg: function(msg){
	this.el.innerHTML=msg;
    },
    
    clear: function(){
	this.el.innerHTML = "";
    },
    
    showAt: function(x,y){
	this.el.style.left = x+'px';
	this.el.style.top = y+'px';
	this.show();
    },
    
    show: function(){
	this.el.style.display='block';
    },
    
    hide: function(){
	this.el.style.display='none'
    }
}
