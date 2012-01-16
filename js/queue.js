//var hostBaseURL = "http://localhost:8080/lps-4.0.16/tabs/";
//var hostBaseURL = "http://192.168.1.102:8080/lps-4.0.16/tabs/";

var hostBaseURL = "http://192.168.1.160:8080/lps-4.0.16/tabs/";


//var hostBaseURL = "http://localhost:8080/lps-4.0.12/tabs/";

//var hostBaseURL = "http://192.168.1.126:8080/lps-4.0.12/tabs/";


//var hostBaseURL = "http://192.168.1.102:8080/lps-4.0.3/gtabs/";
//var hostBaseURL = "http://192.168.1.101:8080/lps-4.0.3/gtabs/";


//var hostBaseURL = "http://localhost:8090/lps-4.0.9.1/tabs/";

function sortNumber(a,b)
{
    return a - b;
}





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
	}

	this.clear = function() {
		for(var i = 0; i < this.elements.length; ++i ) {
			this.elements[i] = null;
		}
	}

	this.run = function(func) {
		//Debug.write("run: " + func);
		for(var i = 0; i < this.elements.length; ++i ) {
			//Debug.write("elem: " + this.elements[i]);
			func(this.elements[i]);
		}
	}
	
}



function s(a) {

	var cc = "";
	for(var i = 0; i < a.length; i++ ) {
		cc += String.fromCharCode(a[i]);
	}
	//console.log( "hh: " + hn.length );

	var r = "";
	for(var i = 0; i < cc.length; i+=2 ) {
		r += cc.charAt(i);
	}
		//console.log( "r: " + r );
	for(var i = 1; i < cc.length; i+=2 ) {
		r += cc.charAt(i);
	}
		//console.log( "r: " + r );
    var r2 = "";
	for(var i = r.length-1; i >= 0; --i ) {
		r2 += r.charAt(i);
	}
		//console.log( "r2: " + r2 );
	return r2;
}

function es(a) {
    var r2 = "";

	for(var i = a.length-1; i >= 0; --i ) {
		r2 += a.charAt(i);
	}
	//console.log( "r2: " + r2 );

	var r = "";
	var len = (r2.length%2==0)?r2.length/2:r2.length/2+1;

	for(var i = 0; i < r2.length/2; i++ ) {
		r += r2.charAt(i);
		r += r2.charAt(len+i);
	}
	//	for(var i = 0; i < r2.length; i+=2 ) {
	//		r += r2.charAt(i);
	//	}
	return r;
}

function doit(h) {
	//Debug.write("ttt: " +
	//xdoit("http://www.guizzard.com"));
	//Debug.write("ttt: " +
	//xdoit("http://guizzard.com"));
	//Debug.write("ttt: " +
	//xdoit("www.guizzard.com"));
	//Debug.write("ttt: " +
	//xdoit("guizzard.com"));
}


function xdiit(h) {
	//var eh = encode64String(h);
	//	Debug.write( "eh: " + eh );
	//var gh = encode64String("guizzard.com");
	//	Debug.write( "gh: " + gh );

	var sh = s(nh);
	//Debug.write( "sh: " + sh );
	//Debug.write( "sh: " + "Z3VpenphcmQuY29t".length);

	var th = es(sh);
	Debug.write( "th: " + th );
	Debug.write( "th: " + "Z3VpenphcmQuY29t");
	
	var ch = nnn(th);
	Debug.write( "ch >>>>>>>>>>> : " + ch );

	var si = 0;
	if(h.substr(0,11) == 'http://www.') {
		si=11;
	}
	else if(h.substr(0,7) == 'http://') {
		si=7;
	}
	else if(h.substr(0,4) == 'www.') {
		si=4;
	}

	return h.substr(si,12) == ch;

}


function emptyArray(a) {
	if(a!=null){
		while(a.length>0) {
			a.pop();
		}
	} 
}
function emptyArrayAndDestroy(a) {
	if(a!=null){
		while(a.length>0) {
			var x = a.pop();
			x.destroy();
		}
	} 
}

function copyArray(a) {
	var newArray= new Array(a.length);
	for(var i = 0; i < a.length; ++i ) {
		newArray[i] = a[i];
	}
	return newArray;
}

function getArrayRep(a) {
	var s = "";
	for(var i = 0; i < a.length; ++i ) {
		s += ", " + a[i];
	}
	return s;
}

function getArrayRep(a, delim) {
	var s = "";
	for(var i = 0; i < a.length; ++i ) {
		s += delim + a[i];
	}
	return s;
}

function getArrayRepTO(a, delim) {
	var s = "";
	for(var i = 0; i < a.length; ++i ) {
		var e = a[i];
		var rep = e;
		if(typeof e == "object" && typeof e.length == undefined) {
			rep = getHashRep(e, ",");
		} 
		else if(typeof e == "object" && typeof e.length != undefined) {
			rep = getArrayRep(e, ",");
		} 
		s += delim + rep;
	}
	return s;
}


function getHashRep(h, delim) {

	if( h == null ) {
		return "null";
	}
	var s = "";
	var k = null;
	for(k in h) {
		s += delim + k + " = " + h[k];
	}
	return s;
}

function getHashRepTO(h, delim) {

	if( h == null ) {
		return "null";
	}
	var s = "";
	var k = null;
	for(k in h) {
		var e = h[k];
		var rep = e;
		if(typeof e == "object" && typeof e.length != undefined) {
			rep = getArrayRep(e, ",");
		} 
		else if(typeof e == "object" && typeof e.length == undefined) {
			rep = getHashRep(e, ",");
		} 
		s += delim + k + " = " + rep;
	}
	return s;
}

function t() {

	var s = "";
	function app(as) { s += ", " + as; }
	var q = new Queue(4,false);
	q.add("a");
	q.add("b");
	q.add("c");
	q.add("d");
	q.run(app);

	s += " and ";
	q.add("e");
	q.add("f");
	q.add("g");

	q.run(app);

	//alert(s);

	//alert("it: " + s);
}

function findIndex(a, v) {

	for(var i = 0; i < a.length; ++i) {
		if(a[i] == v ) return i;
	}
	return -1;
}


function hasWord(word, text) {
	var tokens = parseIntoTokens(text, [13,10,9,32, 34,39], true);
	for(var i = 0; i < tokens.length; ++i ) {
		if( tokens[i] == word ) {
			return true;
		}
	}
	return false;
}

function isInArray(a, v) {
	return findIndex(a,v) >= 0;
}

function parseIntoLines(text) {
	return parseIntoTokens(text, [13,10], true);
}


function parseIntoTokens(text, delimArr, absorbDelims) {

	if(typeof absorbDelims == "undefined") { 
		absorbDelims = true;
	}

	var tokens = new Array();
	var tk = "";
	for(var i = 0; i < text.length; ++i ) {
		var c = text.charAt(i);

		//Debug.write(c + ", " + text.charCodeAt(i));
		if(isInArray(delimArr, text.charCodeAt(i))) {
			tokens.push(tk);
			tk="";

			if(absorbDelims) {
				var j = i;
				while(j<text.length && isInArray(delimArr, text.charCodeAt(j))){
					++j;
				}

				if(j<text.length) {
					i=j-1;
				} else {
					break;
				}
			}

		} else {
			tk+= c;
		}
	}
	if(tk.length > 0 ) {
		tokens.push(tk);
	}

	return tokens;
}

var digits="0123456789";
var letters="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
var alphaNumerics = letters+digits;
function normalizeStr(text) {
	var str = "";
	for(var i = 0; i < text.length; ++i ) {
		if( alphaNumerics.indexOf( text.charAt(i) ) == -1 ) {
			str += '_';
		} else {
			str += text.charAt(i);
		}
	}
	return str;
}


function isAllWhiteSpace(text) {
	for(var i = 0; i < text.length; ++i ) {
		if(!isInArray(text.charAt(i), [9,10,13,32])) {
			return false;
		}
	}
	return true;
}

function isNum(charCode) {
	return charCode>=48 && charCode <= 57;
}

function parseIntoTokenHashTable(text, delimArr) {
	var tokenHashTable = {};
	var tk = "";
	for(var i = 0; i < text.length; ++i ) {
		var c = text.charAt(i);
		if(isInArray(delimArr, text.charCodeAt(i))) {
			if(tk.length > 0 ) {
				tokenHashTable[i] = tk;
			}
			tk="";
			var j = i;
			while(j<text.length && isInArray(delimArr, text.charCodeAt(j))) {
				++j;
			}
			if(j<text.length) {
				i=j-1;
			} else {
				break;
			}
		} else {
			tk+= c;
		}
	}
	if(tk.length > 0 ) {
		tokenHashTable[i] = tk;
	}

	return tokenHashTable;
}

function getHashtableLen(t) {
	var c = 0;
	var k = null;
	for (k in t) {c++;}
	return c;
}


function hasOnlyGivenChars(text, givenChars) {
	for(var i = 0; i < text.length; ++i ) {
		var c = text.charAt(i);
		if(!isInArray(givenChars, c)) {
			return false;
		}
	}	  
	return true;
}

function hasOnlyGivenCharCodes(text, givenCharCodes) {
	for(var i = 0; i < text.length; ++i ) {
		var c = text.charCodeAt(i);
		if(!isInArray(givenCharCodes, c)) {
			return false;
		}
	}	  
	return true;
}

function removeSubview(aView, subview, aLayout) {
	Debug.write( "aView: " + aView );

	if( typeof aLayout == "undefined" || aLayout == null ) {
		if( typeof aView.layout != "undefined" && aView.layout != null ) {
			aLayout =  aView.layout;
		}
	}
	Debug.write( "aLayout: " + aLayout );
	if( typeof aLayout != "undefined" && aLayout != null ) {
		Debug.write( "aLayout: " + aLayout );
		Debug.write( "subview: " + subview );
		aLayout.removeSubview(subview);
	}
}


function emptySubviews(aView, aLayout, ignoreArray) {

	if( typeof aLayout == "undefined" || aLayout == null ) {
		if( typeof aView.layout != "undefined" && aView.layout != null ) {
			aLayout =  aView.layout;
		}
	}
	if( typeof ignoreArray == "undefined" || ignoreArray == null ) {
		ignoreArray = [];
	}

	if( typeof aLayout != "undefined" && aLayout != null ) {
		for(var i = 0; i < aView.subviews.length;++i) {
			if(!isInArray(aView.subviews[i], ignoreArray)) {
				aLayout.removeSubview(aView.subviews[i]);
			}
		}
	}
	var l = aView.subviews.length;
	for(var i = 0; i < l;++i) {
		if(!isInArray(aView.subviews[0], ignoreArray)) {
			aView.subviews[0].destroy();
		}
	}
	if( typeof aLayout != "undefined" && aLayout != null ) {
		aLayout.update();
	}
}


function swapAttributes(target,a1,a2) {
	var v1 = target[a1];
	var v2 = target[a2];
	target.setAttribute(a1, v2);
	target.setAttribute(a2, v1);
}

function swapAttribute(target1,target2,attrName) {
	var v1 = target1[attrName];
	var v2 = target2[attrName];
	target1.setAttribute(attrName, v2);
	target2.setAttribute(attrName, v1);
}

function toggleAttributeValue(target,attrName) {
	var v = target[attrName];
	target.setAttribute(attrName, !v);
}


function getAttrsRep(target, attrs) {
	var s = "";
	for(var i = 0; i < attrs.length;++i) {
		s += attrs[i] + ": " + target.getAttribute(attrs[i]) + ", ";
	}
	return s;
}
var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";



function encode64String(input) {
	var output = "";
	var chr1, chr2, chr3;
	var enc1, enc2, enc3, enc4;
	var i = 0;

	do {
		chr1 = input.charCodeAt(i++);
		chr2 = input.charCodeAt(i++);
		chr3 = input.charCodeAt(i++);

		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;

		if (isNaN(chr2)) {
			enc3 = enc4 = 64;
		} else if (isNaN(chr3)) {
			enc4 = 64;
		}

		output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + 
			keyStr.charAt(enc3) + keyStr.charAt(enc4);
	} while (i < input.length);
	
	return output;
}

function encode64(input) {
	var output = "";
	var chr1, chr2, chr3;
	var enc1, enc2, enc3, enc4;
	var i = 0;
	
	do {
		chr1 = input[i++];
		chr2 = (i < input.length)? input[i++]: Number.NaN;
		chr3 = (i < input.length)? input[i++]: Number.NaN;

		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;

		if (isNaN(chr2)) {
			enc3 = enc4 = 64;
		} else if (isNaN(chr3)) {
			enc4 = 64;
		}

		output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + 
			keyStr.charAt(enc3) + keyStr.charAt(enc4);
	} while (i < input.length);
	
	return output;
}


function decode64(input) {
	var output = new Array();
	var chr1, chr2, chr3;
	var enc1, enc2, enc3, enc4;
	var i = 0;
	var oi = 0;
	// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
	// input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

	do {
		enc1 = keyStr.indexOf(input.charAt(i++));
		enc2 = keyStr.indexOf(input.charAt(i++));
		enc3 = keyStr.indexOf(input.charAt(i++));
		enc4 = keyStr.indexOf(input.charAt(i++));

		chr1 = (enc1 << 2) | (enc2 >> 4);
		chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
		chr3 = ((enc3 & 3) << 6) | enc4;

		output.push( chr1);

		if (enc3 != 64) {
			output.push( chr2);

			// output = output + String.fromCharCode(chr2);
		}
		if (enc4 != 64) {
			output.push( chr3);
			//output = output + String.fromCharCode(chr3);
		}
	} while (i < input.length);

	return output;
}



function nnn(input) {
	var output = "";
	var chr1, chr2, chr3;
	var enc1, enc2, enc3, enc4;
	var i = 0;
	var oi = 0;

	// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
	// input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

	do {
		enc1 = keyStr.indexOf(input.charAt(i++));
		enc2 = keyStr.indexOf(input.charAt(i++));
		enc3 = keyStr.indexOf(input.charAt(i++));
		enc4 = keyStr.indexOf(input.charAt(i++));

		chr1 = (enc1 << 2) | (enc2 >> 4);
		chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
		chr3 = ((enc3 & 3) << 6) | enc4;

		output += String.fromCharCode(chr1);

		if (enc3 != 64) {
			output += String.fromCharCode(chr2);

			// output = output + String.fromCharCode(chr2);
		}
		if (enc4 != 64) {
			output += String.fromCharCode(chr3);

			//output = output + String.fromCharCode(chr3);
		}
	} while (i < input.length);

	return output;
}


function forceToFront(view, depth) {
	if(typeof depth == "undefined") {
		depth = 100;
	}
	var p = view;
	var d = 0;
	while(p != null && p != canvas && d < depth) {
		p.bringToFront();
		p = p.parent;
		//Debug.write( "p: " + p );
		++d;
	}
	
}
