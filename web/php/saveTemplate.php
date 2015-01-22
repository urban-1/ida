<?php 

//Initialize the static variables
$temp_path = "../js/templates/";
$temp_prefix = "temp.";
$temp_suffix = ".json.js";
$temp_start = "TMPS = $.extend({},TMPS,";
$temp_stop = ");";
									
/****************** The readTemplate Function *******************/
/**
 * It read the template file given and returns the contained
 * templates as a PHP object.
 */
function readTemplate($filename) {
	global $temp_start, $temp_stop;
	$str = file_get_contents($filename,true);
	
	//Revove the file start, stop and control characters
	$str = str_replace($temp_start, "", $str);
	$str = str_replace($temp_stop, "", $str);
	$str = preg_replace( '/[^[:print:]]/', '',$str);
	$str = stripslashes($str);
	
	//Decode the object
	$json = json_decode($str);
	
	//Return the template
	return $json;
}
/****************************************************************/


/***************** The writeTemplate Function *******************/
/**
 * Write the given template to the specified template file.
 */
function writeTemplate($filename, $template) {
	global $temp_start, $temp_stop;
	file_put_contents($filename, $temp_start . 
										json_encode($template, JSON_PRETTY_PRINT) . 
										$temp_stop);
}
/****************************************************************/

//Initialize the rest of the variables
$files =  [];
$path =  [];
$template =  null;
$template_string = "";

//Check the input parameters
foreach( $_REQUEST as $key => $value ) {
	//Read the provided JSON inputs
	if(strpos($key,"files")!==false) {
		$files = $value;
	}
	else if(strpos($key,"path")!==false) {
		$path = $value;
	}
	else if(strpos($key,"template")!==false) {
		$template = json_decode($value);
	}
}

//Check all the available template files
foreach($files as $file) {
	
	//Get the template object
	$json = readTemplate($temp_path.$temp_prefix.$file.$temp_suffix);

	//Now check to find the correct series files
	foreach($json as $name => $data) {
		//Check the series name if it matches the given one
		if($name == $path[2]) {
			$json->$name = $template;
			writeTemplate($temp_path.$temp_prefix.$file.$temp_suffix, $json);
			echo "Template file '" . $temp_prefix.$file.$temp_suffix . "' updated succesfully!";
			return;
		}
	}
}

//Get the template object
$json = readTemplate($temp_path.$temp_prefix."auto".$temp_suffix);
//If the object doesn't exist
if(json_encode($json) == "null"){
	$json = array($path[2] => $template);
}
else {
	$json->$name = $template;
}
writeTemplate($temp_path.$temp_prefix."auto".$temp_suffix, $json);
echo "Template file '" . $temp_prefix."auto".$temp_suffix . "' created succesfully!";
return;
?> 
