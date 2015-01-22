
// Gui tree
var tree={};

// Templates
var TMPS={};

// Plots
var plots={};

// Popup message (template select)
var popup={};

// Refresh timer to be able to cancel
var refreshTimer=null;

// Plot resizing options
// helper fucks up!
var resizeOpts = {
    containment: "#flowContainer"
//       helper: "ui-resizable-helper"
};

var dtFormat = {
    dateFormat: "yy-mm-dd",
    timeFormat: "HH:mm:ss"
}

$().ready(function(){
    popup = new I.Popup();

    for (var t=0; t<templates.length; t++){
			$.getScript("js/templates/temp."+templates[t]+".json.js");
    }

    /**
     * resize can be triggered by the resizable
     * divs. We do not want to update ALL plots
     * when one is scaled
     */
    $(window).on("resize", function(e){
	if (e.target!=window) {
	    var plotId = $(e.target).children(":first").attr("id");
	    
	    if (plots[plotId])
		plots[plotId].replot({resetAxes:['xaxis','yaxis']});
	    return;
	}
		 
	for (var p in plots){
	    if (!plots[p].jq) return;
	    plots[p].replot({resetAxes:['xaxis','yaxis']});
	}
    })
    
    // Refresh timer
    if (typeof INT === 'number') refresh(INT);
    $('#stopRefresh').on("click", function(){
	if (refreshTimer) {
	    clearInterval(refreshTimer);
	    refreshTimer=null;
	    $(this).html("Start Refresh");
	}
	else if (typeof INT === 'number') {
	    refresh(INT);
	    $(this).html("Stop Refresh");
	}
    })
    
    // Add motion to the plots
    $('.divfloat').resizable(resizeOpts);
    
    // DateTime fields
    $('#startDT').datetimepicker(dtFormat);
    $('#endDT').datetimepicker(dtFormat);
    $('#updateDT').on("click", function(){
	var start = $('#startDT').val();
	var end   = $('#endDT').val();
	
	if (start=="" && end=="") return;
	
	var timeStr = "";
	if (start!="" && end!="") {
	    // Fool-proof code :)
	    if ($('#endDT').datetimepicker('getDate') < $('#startDT').datetimepicker('getDate')){
		var tmp = start;
		$('#startDT').val(end);
		start=end;
		$('#endDT').val(tmp);
		end = tmp;
	    }
	    timeStr+="time > '"+start+"' AND time < '"+end+"'";
	}else if (start!="") timeStr+="time > '"+start+"'";
	else if (end!="") timeStr+="time < '"+end+"'";
	// Store the current time to be used when adding a new 
	// plot
	$('#curTime').val(timeStr);
	
	for (var p in plots){
	    // We need to update plots that do not exist!
	    // (They may had no data before...)
// 	    if (!plots[p].jq) return;
	    plots[p].setTime(timeStr);
	    plots[p].fullRefresh({restoreZoom: false});
	}
	
	
  })

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
			  plugins: ["dnd","contextmenu"],
			  "contextmenu": {
		    "items": function ($node) {
		    	//For the leaf nodes
					if(!$node.children.length) {
			      return {
			          "Edit": {
			              "label": "Edit the series template",
			              "action": function (obj) {
			              	// Make path for node
											var node = tree.get_node($node.id);
											var path=tree.get_path(node);
											
											//And edit the template
			                editTemplate(path);
			              }
			          },
			          "Delete": {
			              "label": "Delete the series",
			              "action": function (obj) {
			                  showMessageDialog("Operation not supported yet!");
			              }
			          },
			      };
					}
					//For all the other nodes apart from the root
					else if($node.parents.length>1) {
						return {
			          "Delete": {
			              "label": "Delete the item",
			              "action": function (obj) {
			                  showMessageDialog("Operation not supported yet!");
			              }
			          },
			      };
					}
		    }
			}
		}).data('jstree');
  }).on("mousedown", function(event){
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
  
  
  
  $('#addDiv').on('click',function(){
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
    refreshTimer = setInterval(function(){
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
    
    if (TMPS[full]) return TMPS[full];
    if (TMPS[part]) return TMPS[part];
    if (TMPS[last]) return TMPS[last];
    if (TMPS[mini]) return TMPS[mini];  
    
    return [];
}

function handlePlotDrop(event,target,path, tmpIdx) {
	
  
  var classN = target.className;
  cl(target)
  
  if (classN.indexOf('divfloat')==-1 && classN.indexOf('jqplot')==-1 && classN.indexOf('divplot')==-1) return;
  else if (classN.indexOf('jqplot')>-1 || classN.indexOf('divplot')>-1 ) {
    var n = target;
    while (n && n.className.indexOf('divfloat')==-1){
      n = n.parentNode;
    }
    target = n;
  }
  if (!target)
      return;
  
  // Each float has 1 plot
  var id = $(target).find('.divplot')[0].id;
  
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
  
  TMPS=fixJSONFunctions(TMPS, 0);
  
  var title = (template.plotOpts.title) ? template.plotOpts.title : path.join('.');
  
  // Check and delete from plots...
  if (plots[id] && plots[id].jq) 
      plots[id].jq.destroy();
  
  // Save the plot
  plots[id] = new I.InfluxPlot($('#'+id),{
		fluxHost: HOST,
		flux: $.extend(true,{},template.fluxOpts,{db:path[1],from: path[2]}),
		plot: $.extend(true,{},template.plotOpts,{title:title}),
		curTime: ($('#curTime').val()!="") ? $('#curTime').val() : ""
  });
  
  TMPS=fixJSONFunctions(TMPS, 1);
}


/********************* Message Function *************************/
/*	
 * This function presents a new window showing the message 
 * provided as an input. There is only on OK button shown
 * to close the windows, and no other functionality exists.
 */
function showMessageDialog(message) {

	//If there is indeed a message
	if(message!='') {
		$( "#message-dialog" ).find("#message").text(message);

		//Open the Dialog
		$( "#message-dialog" ).dialog({
		  modal: true,
		  resizable: false,
		  width: 500,
		  maxHeight: 400,
		  draggable: true,
		  show: 'fade',
		  hide: 'fade',
		  dialogClass: 'main-dialog-class',
			buttons: {
				"OK": function() {		
					$( "#message-dialog" ).find("#message").text('');
					$( this ).dialog( "close" );
				},
			}
		});
	}
	
	return false;
}
/***************************************************************/


/****************** Edit Template Function *********************/
/*	
 * This function presents a new window with two tabs for editing
 * the selected template. The first tab contains a for for easier
 * editing while the second one reveals the JSON code for 
 * advanced editing. Once the template have been changed an
 * AJAX call is made to the server for updating the appropriate
 * template files.
 */
function editTemplate(path) {

	//Set the path in the form's attributes
	$("#edit-temp-form").attr("path",JSON.stringify(path));
	
	//Clear all fields
	$("#template-select").html("");
  var $inputs = $('.form_table :input');
  $inputs.each(function() {
  	$(this).val("");
  });

	//Get the available template
	var template = findTemplate(path);
    
	//Add the template options for this series
	$("#template-select").append($('<option></option>').val("").html(""));
	for (var i=0; i<template.length; i++){
		$("#template-select").append(
        $('<option></option>').val(template[i]["name"]).html(template[i]["name"])
    );
	}
	
	//Plot the template in the edit text areas
	$('#template_textfield').val( JSON.stringify(template, undefined, 2) );

	//Open the Dialog
	$( "#edit-temp-form" ).data("path", path).data("template", template).dialog({
    modal: false,
    resizable: true,
    width: $(window).width() / 2,
    height: $(window).height() / 1.5,
    draggable: true,
    show: 'fade',
    hide: 'fade',
    dialogClass: 'main-dialog-class',
    open: function() { $('#tabs-movie').tabs({}); },
		buttons: {
			"Save": function() {	
				//To determine if the object is new or not
				var newObj = true;
				
				//Depending on which tab is open create the new template
				switch($('#tabs-movie').tabs( "option", "active" )) {
					//The form tab
					case 0:
						//Create a JSON object from the available fields
						var obj = form2JSON('.form_table');
						//Check for the correct template entry
						$.each(template, function(i, item) {
							//When found
							if(item.name === obj.name) {
								template[i] = obj;
								newObj = false;
							}
						});
						break;					
					//The manual edit tab
					case 1:
						//Parse the text field into a JSON object			
						try {
							template = $.parseJSON($('#template_textfield').val());
							newObj = false;
						} 
						catch (e) {
							showMessageDialog("The string provided was not in a correct JSON format!");
							return false;
						}
						break;
				}
				
				//If this is a new object create the template from scratch
				if(newObj) {
					//template = [];
					console.log(template);
					template.push(obj);
					//TMPS = $.extend({},TMPS, { path[2] : template } );
				}
				//Otherwise just update it
				else {
					//Check the path parts
					var full = path.join('.');
					var part = [path[1],path[2]].join('.');
					var last = path[2];
					var mini = path[2].split('.')
				
					//Save the matches in TMPS
					if (TMPS[full]) TMPS[full] = template;
					if (TMPS[part]) TMPS[part] = template;
					if (TMPS[last]) TMPS[last] = template;
					if (TMPS[mini]) TMPS[mini] = template;
				}

				//Save the template
				saveTemplate(path, template, 
					function(msg) {
						showMessageDialog(msg);
					}
				);
				
				//Close Dialog
				$( this ).dialog( "close" );
			},
			Cancel: function() {
				//Clear all fields
				$('.form_table :input').each(function() {
					$(this).val("");
				})
				
				//Close Dialog
				$( this ).dialog( "close" );	
			}
		}
	});
}
/***************************************************************/


/****************** The form2JSON Function *********************/
/*	
 * This function parses the form provided in order to construct 
 * a JSON element of the template. The input fields of this form
 * should contain the appropriate names to be correctly located.
 * These are:
 * temp_name: for a new template name
 * temp_name_sel: for an existing template name
 * temp_select: the influxDB select option
 * temp_where: the influxDB where option
 * temp_group: the influxDB group option
 * temp_type: whether the grah is a line chart, pie etc...
 */
function form2JSON(field) {
	//Initialize local variables
	var _temp, _name, _fluxOpts, _plotOpts;

	//Read all inputs
	var $inputs = $(field + ' :input');
	$inputs.each(function() {	
		if(this.name=="temp_name")
			_name = $(this).val();
		else if(this.name=="temp_name_sel" && _name.length === 0)
			_name = $(this).val();
		else if(this.name=="temp_select" && $(this).val().length>0)
			_fluxOpts = $.extend({},_fluxOpts,{ select : $(this).val().split(',') });
		else if(this.name=="temp_where" && $(this).val().length>0)
			_fluxOpts = $.extend({},_fluxOpts,{ where : $(this).val().split(',') });
		else if(this.name=="temp_group" && $(this).val().length>0) 
			_fluxOpts = $.extend({},_fluxOpts,{ group : $(this).val().split(',') });
		else if(this.name=="temp_type") {
			if($(this).val() == "lines") {
				_plotOpts = $.extend({},_plotOpts,{ 
					"type": "time", 
					"cursor":{ 
							"show": true,
							"zoom":true, 
							"showTooltip":true
					},
					"axesDefaults":{
							"pad": 1.2
					},
					"seriesDefaults":{
							"showMarker": false
					},
					"axes": {
							"yaxis": {
									"pad": 0,
									"tickOptions": {
									    "formatter": "I.Formatters.unitFormat"
									}
							}
					},
					"legend": {
							"show":true, 
							"location": 'nw',
							"labels": [_name]
					}
				});
			}
			else if($(this).val() == "pie") {
				_plotOpts = $.extend({},_plotOpts,{ 
					"type": "histogram",
					"seriesDefaults": {
							"renderer": "$.jqplot.PieRenderer", 
							"rendererOptions": {
								"showDataLabels": true
							}
					}, 
					"legend": {
						"show":true, 
						"location": "e"
					},
					"highlighter": {
						"show": true,
						"formatString":"%s", 
						"tooltipLocation":"sw", 
						"useAxesFormatters":false
					}
				});
			}
		}
  });

  //Now extend the whole template
  _temp = $.extend({},_temp,{ name: _name, fluxOpts: _fluxOpts, plotOpts: _plotOpts });
  return _temp;
}
/***************************************************************/


/****************** The fillInForm Function ********************/
/*	
 * This function fills in the template editing form from the 
 * data loaded during initialization. Again the input fields of
 * the form should be given specific names in order to be
 * correctly adintified. These are:
 * temp_name: for a new template name
 * temp_name_sel: for an existing template name
 * temp_select: the influxDB select option
 * temp_where: the influxDB where option
 * temp_group: the influxDB group option
 * temp_type: whether the grah is a line chart, pie etc...
 */
function fillInForm(e) {
	//Get the template path from the form
	var path=JSON.parse($("#edit-temp-form").attr("path"));
	var template = findTemplate(path);

	//Check for the correct template entry
	$.each(template, function(i, item) {
		//When found
		if(item.name === $(e).val()) {
			//Fill in the inputs
			var $inputs = $('#edit-temp-form :input');
			$inputs.each(function() {	
				if(this.name=="temp_name")
					$(this).val(item.name);
				else if(this.name=="temp_select")
					$(this).val(item.fluxOpts.select);
				else if(this.name=="temp_where")
					$(this).val(item.fluxOpts.where);
				else if(this.name=="temp_group")
					$(this).val(item.fluxOpts.group);
				else if(this.name=="temp_type") {
					//Check if it is a line or a pie graph
					if(item.plotOpts.type == "time") {
						$(this).val("lines");
					}
					else {
						$(this).val("pie");
					}
				}
			});
		}
});
}
/***************************************************************/


/***************** The saveTemplate Function *******************/
/*	
 * This function uses an AJAX call to send the given template to
 * the web server, which will deal with storing it in the correct
 * template file. Notice that the data is sent in a specific JSON
 * format, comprising of the involved template files, the path of 
 * the template and its data. A callback function is also provided 
 * by the function's arguments.
 */
function saveTemplate(path, template, callback) {	
	//Save the new template in the file using AJAX
	//Get the message sent by ajax
	$.ajax({
			type: "POST",
			timeout:10000,  // I chose 10 secs for kicks
			url: "./php/saveTemplate.php",
			data: { 
				files: templates,
				path: path,
				template : JSON.stringify(template),
			},
			success: function (msg) {
					//Sanity check
					if(msg=='undefined' || msg=='' || msg==null) {		
						callback("Unknown error while saving template");
						return;
					}

					//Give back the received reply
					callback(msg);
			},
			error: function(jqXHR, textStatus) {
					//Give back the received reply
					callback(textStatus);
			}
	});
}
/***************************************************************/


function fixJSONFunctions(obj, flag) {
	//For all templates
	$.each(obj, function(key, template) {
	//For all the entries of the template
		$.each(template, function(i, item) {
		
			if(item["plotOpts"].hasOwnProperty("seriesDefaults")) {
				if(item["plotOpts"]["seriesDefaults"].hasOwnProperty("renderer")) {
					//If the strings are set to functions
					if(flag==0) {
						item["plotOpts"]["seriesDefaults"]["renderer_backup"] =
							item["plotOpts"]["seriesDefaults"]["renderer"];
						item["plotOpts"]["seriesDefaults"]["renderer"] = 
							eval(item["plotOpts"]["seriesDefaults"]["renderer"]); 
					}
					//Else the functions are put back to strings
					else {
						item["plotOpts"]["seriesDefaults"]["renderer"] =
							item["plotOpts"]["seriesDefaults"]["renderer_backup"];
						delete item["plotOpts"]["seriesDefaults"]["renderer_backup"];
					}
				}
			}
		
			if(item["plotOpts"].hasOwnProperty("axes")) {
				if(item["plotOpts"]["axes"].hasOwnProperty("yaxis")) { 
					if(item["plotOpts"]["axes"]["yaxis"].hasOwnProperty("tickOptions")) { 
						if(item["plotOpts"]["axes"]["yaxis"]["tickOptions"].hasOwnProperty("formatter")) {
							//If the strings are set to functions
							if(flag==0) {
								item["plotOpts"]["axes"]["yaxis"]["tickOptions"]["formatter_backup"] = 
									item["plotOpts"]["axes"]["yaxis"]["tickOptions"]["formatter"] ; 
								item["plotOpts"]["axes"]["yaxis"]["tickOptions"]["formatter"] = 
									eval(item["plotOpts"]["axes"]["yaxis"]["tickOptions"]["formatter"]);
							}
							//Else the functions are put back to strings
							else {
								item["plotOpts"]["axes"]["yaxis"]["tickOptions"]["formatter"] = 
									item["plotOpts"]["axes"]["yaxis"]["tickOptions"]["formatter_backup"]; 
								delete item["plotOpts"]["axes"]["yaxis"]["tickOptions"]["formatter_backup"];
							}
						}
					}
				}
			}
			template[i]=item;
		}); // end template
		obj[key]=template;
	}); // end TMPS
	
	//Return the fixed object
	return obj;
}
