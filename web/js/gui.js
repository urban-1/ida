


$().ready(function(){
  
  for (var t=0; t<templates.length; t++){
    $.getScript("js/template."+templates[t]+".json.js");
  }
  
  $(window).on("resize", function(){
    for (var p in plots){
      if (!plots[p].jq) return;
      plots[p].jq.replot();
    }
  })
  
  // Bind dataReady to populate tree
  $('body').on("dataReady", function(e,d){
    
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

    
  })
  
  // Doc drop
  $(document).on('dnd_stop.vakata', function(e,obj){
    var nid = obj.data.nodes[0];
    var node = tree.get_node(nid);
    
    // Make path for node
    var path=tree.get_path(node);
    
    
    handlePlotDrop(obj.event.target,path);
    
  });
  
  
  
//   $('.divfloat').each(function(){
//     this.ondragover=function(ev){ev.preventDefault();}
//   })
  
  
})


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
  
  if (TMPS[full]) return TMPS[full];
  if (TMPS[part]) return TMPS[part];
  if (TMPS[last]) return TMPS[last];
  if (TMPS[mini]) return TMPS[mini];
  
  
  return false;
}

function handlePlotDrop(target,path) {
  var id = target.id;
  var classN = target.className;
  
  
  if (classN.indexOf('divfloat')==-1 && classN.indexOf('jqplot')==-1) return;
  else if (classN.indexOf('divfloat')==-1 && classN.indexOf('jqplot')>-1) {
  cl(target)
  cl(classN.indexOf('jqplot'))
    var n = target;
    while (n && n.className.indexOf('divfloat')==-1){
      n = n.parentNode;
      cl(n)
    }
    id = n.id;
  }
  
  var template = findTemplate(path);
  if (!template) {
    alert("No template for '"+path+"'")
    return;
  }
  
  if (template.length) {
    // handle pop up
    template = template[0];
  }
  
  var title = (template.plotOpts.title) ? template.plotOpts.title : path.join('.');
  
  // Save the plot
  plots[id] = new I.InfluxPlot($('#'+id),
	      $.extend({},template.fluxOpts,HOST.getHostConfig(),{
		    db:path[1],
		    from: path[2]
	      }),
	      $.extend({},template.plotOpts,{title:title})
	    );
}
