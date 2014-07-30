/**
 * @file
 * Main declaration of I and general helper functions
 */
 
var I = {
  version: "0.1"
};

cl =  Function.prototype.bind.call(console.log,console);


/**
 * Get query string as array (special case)
 */
I.getQueryString = function() {
    var qs = {};
    var query = window.location.href;
    query = query.replace("http:\/\/","");
    query = query.split('/');
    
    qs.host = query[0];
    qs.webRoot = query[1];
    qs.cfg = query[2];
  
    return qs;
} 



I.Formatters = {
    unitFormat1024: function (format, val) { 
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
    },

    unitFormat: function (format, val) { 
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
    },
    tooltipShowValue: function(str, seriesIndex, pointIndex, plot){
	return  str +  ", (" +  plot.data[0][pointIndex][1]+")";
    }
} // end of formatters


