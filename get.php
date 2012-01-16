<?php

function isImage($fileName) {
  $l = strlen($fileName);
  if(substr($fileName, $l - 3, 3) == "png" ) {
	return true;
  }
  return false;
  }

extract ( $_GET  );

$url = "http://www.guizzard.com/itabs";
#$url = "file:///mnt/w3/itabs";
#$tarpath = "/mnt/w3/itabs/0/";
$tarpath = "/home2/guizzard/public_html/itabs/0/";
$tarfile = "";
$targetfilepath = "";

$s1 = "6mjivzuewd8b4rl7hq0sko5t9fc3pg2xny1a";
$s2 = "abcdefghijklmnopqrstuvwxyz0123456789";
;

# /0/1/1/0/Meta.js
#echo escape(convert_uuencode($id));
#echo urlencode(convert_uuencode($id));
#echo convert_uudecode($id);
#echo urldecode($id);
if(isset($rev) ) {
  $tmp = $s1;
  $s1 = $s2;
  $s2 = $tmp;
}

$len = strlen($id);
$path = "/0/";

for ($k = 0; $k < $len; $k++) {
  $char = substr($id, $k, 1);
  $i = strpos($s2, $char);
  $target = substr($s1, $i, 1);

  $path .= $target . "/"; 
  if($k < $len - 1) {
	$tarpath .= $target . "/"; 
  } else {
	$tarfile = $target.".tar";
	$targetfilepath = $target . "/" . $fileName;
  }

}

$url .= $path . $fileName;

#  if(isImage($fileName)) {
#	echo $url;
#echo "tar xvf " . $tarfile;
#echo $tarpath;
#exit;
#  }



if(isImage($fileName)) {

#  if( $path == '/0/1/1/0/'  && !file_exists($tarpath . $targetfilepath)) {
  if( !file_exists($tarpath . $targetfilepath)) {
#	echo $tarpath . "<br/>";
#	echo $tarfile . "<br/>";
#	echo $tarpath . $targetfilepath . "<br/>";
#	echo "tar xvf " . $tarfile . " " . $targetfilepath . "<br/>";
#	exit;
	chdir($tarpath);
	exec("tar xvf " . $tarfile . " " . $targetfilepath);
  }


  header('Content-type: image/png');
  
  // curl binary stuff
  $curl = curl_init($url);

  curl_setopt($curl, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);
  curl_setopt($curl, CURLOPT_FOLLOWLOCATION, FALSE);
  curl_setopt($curl, CURLOPT_AUTOREFERER, TRUE);
  $result = curl_exec($curl);		

} else {

  $curl = curl_init($url);

#  if( $path == '/0/1/1/0/'  && !file_exists($tarpath . $targetfilepath)) {
  if( !file_exists($tarpath . $targetfilepath)) {
	chdir($tarpath);
	exec("tar xvf " . $tarfile . " " . $targetfilepath);
  }

  header('Content-type: text/plain');

  curl_setopt($curl, CURLOPT_POSTFIELDS, $postquery); 

#curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

  $json = curl_exec($curl);		

  curl_close($curl);
}

?>