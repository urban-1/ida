

var tree={};
var TMPS={};
var plots={};
var popup={};
var resizeOpts = {
    containment: "#flowContainer"
//       helper: "ui-resizable-helper"
};

$().ready(function(){
    popup = new I.Popup();

    for (var t=0; t<templates.length; t++){
	$.getScript("js/templates/temp."+templates[t]+".json.js");
    }

    $(window).on("resize", function(){
	for (var p in plots){
	    if (!plots[p].jq) return;
	    plots[p].replot({resetAxes:['xaxis','yaxis']});
	}
    })
    
    if (typeof INT === 'number') refresh(INT);
    
    // Add motion to the plots
    $('.divfloat').resizable(resizeOpts);
    /*.on('resizestop',function(){
	var id = $(this).children(":first").attr("id");
// 	plots[id].replot();
    });*/

    // Bind dataChanged to populate tree
    $('body').on("dataChanged", function(e,d){

	// Init tree
	tree=$('#hostList').jstree({ 
	    core: {
	    data: [ HOST.getData() ],
	    check_callback: function(){
		return false
	    }
	    },
	    dnd:{
	    copy: false,
	    is_draggable: function(el){
		var el = el[0];
		if (el.li_attr.series) return true;
		return false;
	    }
	    },
	    plugins: ["dnd"]
	}).data('jstree');
	
    }).on("mousedown", function(){
	if (popup) popup.hide();
    })

    // Doc drop
    $(document).on('dnd_stop.vakata', function(e,obj){
	var nid = obj.data.nodes[0];
	var node = tree.get_node(nid);

	// Make path for node
	var path=tree.get_path(node);
	
	handlePlotDrop(obj.event,obj.event.target,path);

    });

    // USed like "live"
    $('body').on('mousedown','.tmpSel', function(){
	var data = JSON.parse($(this).attr('data-all'));
	var target = document.getElementById(data.tid);
	handlePlotDrop(null,target,data.path,data.idx);
    })
  
  
  
    $('.addDiv').on('click',function(){
	var max = -1;
	$('div[id^=df]').each(function(){
	    var num = parseInt(this.id.replace("df",""));
	    if (num>max) max = num;
	})
	max++;
	// <div class="divfloat"><div id='df4' class='divplot'></div></div>
	var n = $("<div class='divfloat'><div class='divplot' id='df"+max+"'></div></div>");
	n.resizable(resizeOpts)
	$('#flowContainer').append(n);
    })
  
  
})

function refresh(INT){
    setInterval(function(){
	for (var p in plots){
	    if (!plots[p].jq) return;
	    plots[p].fullRefresh({restoreZoom:true});
	}
    },INT)
}


function findTemplate(path){
  var full = path.join('.');
  var part = [path[1],path[2]].join('.');
  var last = path[2];
  var mini = path[2].split('.')
  mini.pop()
  mini = mini.join('.');
  
  // Argg domain exceptions
  if (mini.indexOf("net.ping")!=-1){
    mini = path[2].split('.')
    mini = [mini[0],mini[1]].join(".");
  }
  cl(full,part,last,mini)
  if (TMPS[full]) return TMPS[full];
  if (TMPS[part]) return TMPS[part];
  if (TMPS[last]) return TMPS[last];
  if (TMPS[mini]) return TMPS[mini];
  
  
  return false;
}

function handlePlotDrop(event,target,path, tmpIdx) {

  var id = target.id;
  var classN = target.className;
  
  
  if (classN.indexOf('divplot')==-1 && classN.indexOf('jqplot')==-1) return;
  else if (classN.indexOf('divplot')==-1 && classN.indexOf('jqplot')>-1) {
  cl(target)
  cl(classN.indexOf('jqplot'))
    var n = target;
    while (n && n.className.indexOf('divplot')==-1){
      n = n.parentNode;
      cl(n)
    }
    id = n.id;
  }
  
  
  var template = findTemplate(path);
  if (!template) {
    alert("No template for '"+path.join('.')+"'")
    return;
  }
  
  if (template.length) {
    if (template.length==1){
	template = template[0];
    }
    else if (tmpIdx!==undefined){
	template = template[tmpIdx];
    }
    else {
	// handle pop up
	var msg = "<ul>";
	for (var i=0; i<template.length; i++){
	    var data = {
		idx: i,
		tid: id,
		path: path
	    }
	    msg+="<li><a class='tmpSel' data-all='"+JSON.stringify(data)+"'>"+template[i].name+"</a></li>";
	}
	msg+="</ul>";
	popup.setMsg(msg);
	popup.showAt(event.clientX,event.clientY);
	
	return;
    }
  }
  
  var title = (template.plotOpts.title) ? template.plotOpts.title : path.join('.');
  
  // Check and delete from plots...
  if (plots[id] && plots[id].jq) 
      plots[id].jq.destroy();
  
  // Save the plot
  plots[id] = new I.InfluxPlot($('#'+id),HOST,
	      $.extend({},template.fluxOpts,{db:path[1],from: path[2]}),
	      $.extend({},template.plotOpts,{title:title})
	    );
}



