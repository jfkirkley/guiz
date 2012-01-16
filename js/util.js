//var rootPath = "/itabs/sites/newGuizzard/index/";
var rootPath = "/";

//function to append a new theme stylesheet with the new style changes
function updateCSS(locStr){
	var cssLink = $('<link href="'+locStr+'" type="text/css" rel="Stylesheet" class="ui-theme" />');
	$("head").append(cssLink);
	
	
	if( $("link.ui-theme").size() > 1){
		$("link.ui-theme:first").remove();
	}	
}	


//?id=o/o2&artist=OASIS
//index.html?id=o.js
function setNavPath(id, artist, song){
    var html = "<b>/<a href=\"" + rootPath + "index.html\">home</a>";

	if(artist){
		var letter=id.substring(0,1).toLowerCase();
		html += "/<a href=\"" + rootPath + "index.html?id=" + letter + ".js\">" + letter.toUpperCase() + "</a>";

		if(song){
			html += "/<a href=\"" + rootPath + "index.html?id=" + id + "&artist=" + artist + "\">" + decodeURI(artist) + "</a>";
			consolewrp.log( "artist: " + decodeURI(artist) );
			consolewrp.log( "artist: " + decodeURIComponent(artist) );
		}

	} 
	html += "</b>";

	$("#navPath").append(html);
	
}

function get(letter) {
	window.location = rootPath + "index.html?id=" + letter.toLowerCase() + ".js";
}



var ConsoleWrapper = function(useAlerts) {
	this.useAlerts = useAlerts;
};

ConsoleWrapper.prototype.log = function(s) {
	if(typeof console == "undefined") {

		if(this.useAlerts) {
			alert(s);
		}

	}
	else {
		console.log( s );
	}

};


var consolewrp = new ConsoleWrapper(false);


function getOption(option, defaultValue, options) {
	return		(!options)?  defaultValue: 
		options.hasOwnProperty(option)? options[option]: defaultValue;
}


var Template = function(t) {
	var tks = t.split('#{');

	if(tks.length>1){
		
		this.parts = [];
		this.keys = [];

		this.parts.push(tks[0]);

		for(var i = 1; i < tks.length; ++i){
			//consolewrp.log( i + ": " + tks[i] );

			var x = tks[i].indexOf('}');

			if(x!=-1){
				this.keys.push(tks[i].substring(0,x));
				this.parts.push(tks[i].substring(x+1));
			}
			
		}
		//consolewrp.log( "parts: " + this.parts );
		//consolewrp.log( "keys: " + this.keys );
		
	} else {
		this.str = t;
	}
};


Template.prototype.evaluate = function(s) {

	if(this.parts){
		var str = "";
		
		for(var i = 0; i < this.parts.length-1; ++i){
			str += this.parts[i];
			str += s[this.keys[i]];
		}
		str += this.parts[i];
		//consolewrp.log( "str: " + str );

		return str;

		
	} else {
		return this.str;
	}
	
};






function Queue(sz, destroyFunc) {
	this.destroyFunc = destroyFunc;
	this.sz = sz;
	this.elements = new Array(this.sz);


	this.add = function(elem) {
		var t = this.elements[0];
		var e = null;
		for(var i = 1; i < this.elements.length; ++i ) {
			e=this.elements[i];
			this.elements[i] = t;
			t = e;
		}
		if(undefined != this.destroyFunc && this.destroyFunc != null) {
			this.destroyFunc(e);
		}
		this.elements[0] = elem;
	};

	this.clear = function() {
		for(var i = 0; i < this.elements.length; ++i ) {
			this.elements[i] = null;
		}
	};

	this.run = function(func) {
		//Debug.write("run: " + func);
		for(var i = 0; i < this.elements.length; ++i ) {
			//Debug.write("elem: " + this.elements[i]);
			func(this.elements[i]);
		}
	};
	
}

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}