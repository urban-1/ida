/**
 * CLONE AN OBJECT (instead of pointing to it)
 * NEW: Added array option. JS is fucked
 * when it comes to array vs object...
 */
function clone(o) {
     if(typeof(o) != 'object' || o == null) return o;
   
     var newO = new Object();
     if (Object.prototype.toString.call( o ) === '[object Array]' ) 
       newO = new Array();
   
     for(var i in o) {
      // Detect dom ones
      
      if (o["map"] == o[i]){
	newO[i] = o[i];
      }else if (o[i].parentNode == undefined){
	newO[i] = clone(o[i]);
      }else{
	newO[i] = o[i].cloneNode(false);
      }
     }
     return newO;
 }
 
var I = {
  version: "0.1"
};

cl =  Function.prototype.bind.call(console.log,console);

I.unitFormat1024 = function (format, val) { 
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

I.unitFormat = function (format, val) { 
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
I.InfluxPlot = function (el,flux,plot){
  this.el = el;

  this.flux = flux;
  this.plot = plot
  this.el.html("Loading... please wait")
  this._init();
}

I.InfluxPlot.prototype = {

_init: function (){
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
    success: function(data){
      ifplot.el.html("");
      // 1 reply!
      data=data[0];
      ifplot.processData(data);
    },
    error: function (error){ cl(error.responseText) }
  });
 
},

processData: function(d){
  if (!d) return;
  if (this.plot.type == "time") this.processTimeSeriesData(d);
  if (this.plot.type == "histogram") this.processHistogramData(d);
},

processHistogramData: function(d){

  var len = d.points.length;

  if (len==0) return;
  
  var inlen = d.points[0].length;
  var plotData = [];
  
  for (var i=0; i<len; i++) {
    var val= d.points[i][inlen-1];
    if (val ==1 || val==0){
      val = (val==1) ? "True/Up" : "False/Down"
    } 
    plotData.push([val,d.points[i][inlen-2]]);
  }
  this.jq = $.jqplot(this.el.attr("id"), [plotData], this.plot);
},

processTimeSeriesData: function(d){
  if (d.points.length==0) return;
  var plotData = []
  var time = []
  var col = d.points[0].length;
  
  var less = 0;
  if ($.inArray("time", d.columns)!=-1) less++;
  if ($.inArray("sequence_number", d.columns)!=-1) less++;
  

  
  // init dimensions
  for (var j=less; j<col; j++) plotData[j-less] = []
  
  for (var i=0; i<d.points.length; i++) {
    for (var j=less; j<col; j++) {
      plotData[j-less].push([d.points[i][0],d.points[i][j]]);
    }
  }
  
  this.plot = $.extend(true,this.plot,
    {axes:{xaxis:{renderer:$.jqplot.DateAxisRenderer}}}
  );
  
  this.plot = $.extend(true,this.plot,
    {seriesDefaults:{showMarker:false}}
  );
  

  
  if (typeof this.plot.kmgUnits=='function') {
    var options = {
        axes: {
            yaxis: {
                min: 0,
                tickOptions: {
                    formatter: this.plot.kmgUnits
                }
            }
        }
    };
    this.plot = $.extend(true,options,this.plot);
  }
  cl(this.plot)
  this.jq = $.jqplot(this.el.attr("id"), plotData, this.plot);

},

getThis: function (){
  return this;
}

}; // End of I.InfluxPlot

/**
 * I.InfluxHost implementation. Global single configuration
 * atm. Supports quering for available dbs and list series 
 * in each DB.
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

_post: function(q, db, cb){
  
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
      if (cb) cb(data,db);
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
  
  this._post(null, null,
    function(data){
      // Link for shortcut
      var len = data.length;
      
      for (var i=0; i<len; i++) {
	if (data[i].name=="") continue;
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
  
  for (var i=0; i<this.data.children.length; i++) {
    
    this._post("list series",this.data.children[i].text,function(data,db){
      var len = data.length;
      var dbidx = ifhost._getDataIdxForDB(db);
      
      // Sort based on name so they do not change order!
      data.sort(ifhost._DynCompare('name'));
      
      // Each series
      for (var i=0; i<len; i++) {
	ifhost.data.children[dbidx].children.push({
	  text:data[i].name,
	  li_attr: {series:true}
	});
      }
      
      // All in place, trigger event
      $('body').trigger("dataReady");
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

};