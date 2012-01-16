var HISTORY_DEPTH=2;

var theNeck = null;
var tabDimensions = { pageHeight: 500, maxViewableHeight: 500, diff: 0};
var theScale=1200;
//var theScale=920;
var guitY=30;
var NUM_STRINGS=6;
var scrollBarPresent = false;
//var key = new Key();

var fretPositions =  [0, 67.350824781968, 130.921538231593, 190.924301695543, 247.55936881908, 301.015753873991, 351.471862576143, 399.096087497979, 
                      444.047370063076, 486.475730998367, 526.522771014376, 564.322143384423, 600, 633.675412390984, 665.460769115796, 695.462150847771, 
					  723.77968440954, 750.507876936996, 775.735931288071, 799.54804374899, 822.023685031538, 843.237865499184, 863.261385507188, 882.161071692211, 900 ] ;

var dotPositions = [0, 68.675412390984, 134.13618150678, 195.922919963568, 254.241835257311, 309.287561346536, 361.243808225067, 410.283975037061, 
                    456.571728780528, 500.261550530722, 541.499251006372, 580.4224571994, 617.161071692211, 651.837706195492, 684.56809075339, 
					715.461459981784, 744.620917628656, 772.143780673268, 798.121904112533, 822.641987518531, 845.785864390264, 867.630775265361, 
					888.249625503186, 907.7112285997, 926.080535846106, 943.418853097746 ] ;


function getFretPosition(fretNum) {
	// d = s - (s / (2 ^ (n / 12)))

	//return fretPositions[fretNum];

	return theScale - (theScale/ Math.pow(2, fretNum/12));
}

function getDotPosition(fretNum) {
	var f1 = getFretPosition(fretNum);
	var f2 = getFretPosition(fretNum+1);
	return guitY + f1 + (f2-f1)/2 + 5;

	//Debug.write( "fretNum: " + fretNum );

    //return dotPositions[fretNum+1];
}



var guitStr = function(options) {
	this.parent = parent? parent: null;
	if(options){
		for(option in options) {
			this[option] = options[option];
		}
	} else {
	    options = {};
	}

	if(!options.hasOwnProperty('x')){			    this.x = 0;	}
	if(!options.hasOwnProperty('y')){			    this.y = 0;	}
	if(!options.hasOwnProperty('xoffset')){			this.xoffset = 0;}
	if(!options.hasOwnProperty('yoffset')){			this.yoffset = 0;}
	if(!options.hasOwnProperty('height')){			this.height = 0;}
	if(!options.hasOwnProperty('width')){			this.width = 0;	}
	if(!options.hasOwnProperty('rootSelector')){	this.rootSelector = null;	}
	if(!options.hasOwnProperty('bars')){			this.bars = null;	}
	if(!options.hasOwnProperty('orientation')){		this.orientation = 'h';	}

	if(!options.hasOwnProperty('resolution')){		this.resolution = 8;}
	if(!options.hasOwnProperty('origX')){			this.origX = null;	}
	if(!options.hasOwnProperty('origY')){			this.origY = null;	}
	if(!options.hasOwnProperty('res')){			    this.res = null;	}
	if(!options.hasOwnProperty('bent')){			this.bent = false;	}
	
	this.numBars = 0;
	this.divSelector = "";

	// 6 + (120 + 31)
	// 0.040 + 0.746 + 0.214
	// w = 6+120 = 0.786
	// 0.786 = x - 0.214
	// w = x - 0.214
	// x = 0.786x + 0.214*x
	// x = 0.786x + 0.214x
	// w = 0.786x 
	// x = w/0.786
	
	this.totalStringLength  = this.width/0.786;
	this.playableStrLength = this.totalStringLength - 0.04*this.width;
	this.numBarsBeforeNut = Math.round((0.04*this.totalStringLength)/this.resolution);
	//consolewrp.log( "numBarsBeforeNut: " + this.numBarsBeforeNut );
	this.extraInvisibleBarsToBridge = Math.round((0.214*this.playableStrLength)/this.resolution);
	//consolewrp.log( "extraInvisibleBarsToBridge: " + this.extraInvisibleBarsToBridge );

	this.oninit();
};


guitStr.prototype.oninit = function(  ) {

	
	var offset = $(this.stringView.rootSelector).offset();
	this.xoffset = offset.left;
	this.yoffset = offset.top;

	var x = this.x;
	var y = this.y;
	var w = this.width;
	var h = this.height;

	this.origX = x;
	this.origY = y;
	this.numBars = (this.orientation == "h" ) ? Math.ceil(w/this.resolution): Math.ceil(h/this.resolution);
	
	this.numBars = Math.ceil(w/this.resolution);
	//this.width = this.resolution;
	var html = "<div class='hstringall'>";
	
	for(var i = 0; i < this.numBars; ++i ) {
		html += "<div class='hstring'></div>";
	}
	html += "</div>";

	$(this.stringView.rootSelector).append(html);

	this.divSelector = " > div:eq(" + this.stringNum + ")";

	var stringSegmentDivs = $(this.stringView.rootSelector + this.divSelector + " > div").get();

	if(this.orientation == "h" ) {			
		for(var i = 0; i < this.numBars; ++i ) {
			//$(this.stringView.rootSelector + " div:last").css("left", x+i*this.resolution);
			stringSegmentDivs[i].style.left = this.xoffset+x+i*this.resolution+"px";
			stringSegmentDivs[i].style.top = (this.yoffset+y) + "px";
		}

	} else {
		
		for(var i = 0; i < this.numBars; ++i ) {
			//$(this.stringView.rootSelector + " div:last").css("left", x+i*this.resolution);
			stringSegmentDivs[i].style.top = this.yoffset+y+i*this.resolution+"px";
			stringSegmentDivs[i].style.left = (this.origX+this.xoffset+x) + "px";
		}
	}

	$(this.stringView.rootSelector + this.divSelector + " > div").css({position: 'absolute', 
															 width: this.resolution  + "px", 
															 height: this.height  + "px"
															});

	
};

guitStr.prototype.setRes = function( newRes ) {

    // set div dimension here	

	//for(var i = 0; i < numBars; ++i ) {
		//if(newRes == 'bar') 
		//bars[i].resource = newRes;
	//}
	
	
};

guitStr.prototype.setBarX = function( x ) {

//	$(this.stringView.rootSelector + " div").css("left", (x+this.xoffset) + "px");

	var stringSegmentDivs = $(this.stringView.rootSelector + this.divSelector + " div").get();

	for(var i = 0; i < stringSegmentDivs.length; ++i ) {
		//stringSegmentDivs[i].style.left = (x+this.xoffset) + "px";
		stringSegmentDivs[i].style.left = (x) + "px";
	}

	
};

guitStr.prototype.setBarY = function( y ) {

//	$(this.stringView.rootSelector + " div").css("top",  (y+this.yoffset) + "px");
	
	var stringSegmentDivs = $(this.stringView.rootSelector + this.divSelector + " div").get();

	for(var i = 0; i < stringSegmentDivs.length; ++i ) {
		stringSegmentDivs[i].style.top = (y+this.yoffset) + "px";
	}
};

guitStr.prototype.unbend = function( y ) {

	if( this.bent ) {
		var w = this.width;
		var h = this.height;

		if(w>h) {
			this.setBarY(this.origY);
		} else {
			//this.setBarX(this.origX);
			this.setBarX(this.x);
		}
		this.bent = false;
	}
	
};

guitStr.prototype.bend = function( bendPoint, factor, duration, easing ) {

	var dir = 1;
	if(factor < 0 ){
		dir = -1;
		factor *= -1;
	}
	
	this.bent = true;
	var w = this.width;
	var h = this.height;


	var x = this.x;
	var y = this.y;

	//consolewrp.log("bend: " + this.bars[0] + ", " + this.bars[0].x + ", " +this.bars[0].getAttribute("y"));
	//consolewrp.log("bend: " + this.bars[0] + ", " + x + ", " + y);
	//consolewrp.log("bend: " + x);
	// 
//	if(w<h) {
//		bendPoint = this.height-(this.numBarsBeforeNut+this.extraInvisibleBarsToBridge)*this.resolution-bendPoint;
//		consolewrp.log( "bendPoint: " + bendPoint );
//	}

	var fulcrumIndex = Math.round(bendPoint/this.resolution)-1;
	var increment = 0;
	var diffPerBar = factor/(fulcrumIndex-this.numBarsBeforeNut);
	var opDiffPerBar = factor/(this.numBars+this.extraInvisibleBarsToBridge-fulcrumIndex);

	var offset = 0;
	var opOffset = factor;

	//consolewrp.log("bendit: " + fulcrumIndex + "," + bendPoint + ", " + increment  + ", " + offset + ", " + diffPerBar + ", " + dir  + ", " + (w>h));

	var stringSegmentDivs = $(this.stringView.rootSelector + this.divSelector + " div").get();
	var numSegs = stringSegmentDivs.length;

	var origFulcrumIndex = fulcrumIndex;
	if(w<h) {
		diffPerBar = factor/(fulcrumIndex-this.numBarsBeforeNut+1);
		fulcrumIndex = numSegs-fulcrumIndex-this.numBarsBeforeNut+1;
		dir = dir*-1;
		$(stringSegmentDivs[fulcrumIndex]).animate({left: dir*factor+x+"px"}, {duration: duration, easing: easing });
	} else {
		$(stringSegmentDivs[fulcrumIndex]).animate({top: dir*factor+y+this.yoffset+"px"}, {duration: duration, easing: easing });
	}

	if(w<h) {
		
		var last = 0;
		for(var i = numSegs-this.numBarsBeforeNut; i > fulcrumIndex; --i ) {

			offset += diffPerBar;

			$(stringSegmentDivs[i]).animate({left: dir*Math.round(offset)+x+"px"}, {duration: duration, easing: easing });

		}

	

		diffPerBar = factor/(this.numBars+this.extraInvisibleBarsToBridge-(origFulcrumIndex));//-this.numBarsBeforeNut);
		increment = 0;

		offset = (this.extraInvisibleBarsToBridge)*diffPerBar;

		//consolewrp.log("bendit: " + fulcrumIndex + "," + bendPoint + ", " + increment  + ", " + offset + ", " + diffPerBar + ", " + dir  + ", " + (w>h));
		
		for(i = 0; i < fulcrumIndex; ++i ) {
			
			offset += diffPerBar;

			$(stringSegmentDivs[i]).animate({left: dir*Math.round(offset)+x+"px"}, {duration: duration, easing: easing });

		}

	} else {

		var last = 0;
		for(var i = this.numBarsBeforeNut; i < fulcrumIndex; ++i ) {

			offset += diffPerBar;

			$(stringSegmentDivs[i]).animate({top:  dir*Math.round(offset)+y+this.yoffset+"px"}, {duration: duration, easing: easing });

		}

		diffPerBar = factor/(this.numBars+this.extraInvisibleBarsToBridge-fulcrumIndex);
		increment = 0;

		offset = this.extraInvisibleBarsToBridge*diffPerBar;

		//consolewrp.log("bendit: " + fulcrumIndex + "," + bendPoint + ", " + increment  + ", " + offset + ", " + diffPerBar + ", " + dir  + ", " + (w>h));
		
		for(i = this.numBars-1; i > fulcrumIndex; --i ) {
			
			offset += diffPerBar;

			$(stringSegmentDivs[i]).animate({top: dir*Math.round(offset)+y+this.yoffset+"px"}, {duration: duration, easing: easing });

		}
	}
	

};

guitStr.prototype.multiplyDimension = function( dim,val,offset ) {

	this[dim] = this[dim]*val-offset;
	$(this.stringView.rootSelector + this.divSelector + " div").css(dim,  this[dim] + "px");
	
//	for(var i = 0; i < this.numBars; ++i ) {
//		this.bars[i][dim] = (val*this.bars[i].getAttribute(dim))-offset;
		//this.bars[i].animate(dim,(val*this.bars[i].getAttribute(dim))-offset, 1000, false);
//	}
	
	
};

guitStr.prototype.divideDimension = function( dim,val,offset ) {

	this[dim] = (this[dim]+offset)/val;
	$(this.stringView.rootSelector + this.divSelector + " div").css(dim,  this[dim] + "px");
	
	//for(var i = 0; i < this.numBars; ++i ) {
		//this.bars[i][dim] = (this.bars[i].getAttribute(dim)+offset)/val;
		//this.bars[i].animate(dim,(this.bars[i].getAttribute(dim)+offset)/val, 1000, false);
	//}
};

guitStr.prototype.reset = function( s ) {
	
	if( this.orientation == "v") {

		$(this.stringView.rootSelector + this.divSelector + " div").css("left",  (this.x) + "px");
		//		for(var i = 0; i < this.numBars; ++i ) {
		//			this.bars[i].x =  x;
		//		}
	} else {
		var y = this.origY;

		$(this.stringView.rootSelector + this.divSelector + " div").css("top",  (y+this.yoffset) + "px");
		//		for(var i = 0; i < this.numBars; ++i ) {
		//			this.bars[i].y =  y;
		//		}
	}

	
	
};

guitStr.prototype.handleWindowResize = function( offset ) {

//  if(isThereAScrollBar()){
//	  consolewrp.log( "Yes isThereAScrollBar: " );
	  
//  }else{
//	  consolewrp.log( "No isThereAScrollBar: "  );
//not scrolling
//}

	var x = this.x;
	var y = this.y;

//	this.origX = x;
//	this.origY = y;

	var stringSegmentDivs = $(this.stringView.rootSelector + this.divSelector + " div").get();

	if(this.orientation == "h" ) {			
		this.xoffset = offset.left;
		this.yoffset = offset.top;

		for(var i = 0; i < this.numBars; ++i ) {
			stringSegmentDivs[i].style.left = this.xoffset+x+i*this.resolution+"px";
			stringSegmentDivs[i].style.top = (this.yoffset+y) + "px";
		}

	} else {
		var farLeft = this.stringView.width - this.y + offset.left;		
		this.x = farLeft;
		var currLength = 0;
		for(var i = 0; i < this.numBars; ++i ) {

			stringSegmentDivs[i].style.left = farLeft + "px";
			stringSegmentDivs[i].style.top  = (currLength + this.yoffset) + 7 + "px";

			currLength += this.resolution;
		}
		this.xoffset = offset.left;
		this.yoffset = offset.top;

	}

};

guitStr.prototype.rotate = function( s ) {

	this.orientation = (this.orientation == "h")? "v": "h";
	$(this.stringView.rootSelector).get();
	var offset = $(this.stringView.rootSelector).offset();

	$(this.stringView.rootSelector + this.divSelector).toggleClass("vstringall").toggleClass("hstringall");

	var stringSegmentDivs = $(this.stringView.rootSelector + this.divSelector + " div").get();

	if(this.orientation == "h") {
		this.yoffset = offset.top;

		this.x = this.origX;

		var x = this.x;
		var y = this.y;

		this.y = this.origY;

		for(var i = 0; i < this.numBars; ++i ) {

			var w = stringSegmentDivs[i].style.width;
			var h = stringSegmentDivs[i].style.height;

			stringSegmentDivs[i].style.height = w;
			stringSegmentDivs[i].style.width  = h;

			stringSegmentDivs[i].style.left = offset.left+x+i*this.resolution+"px";
			stringSegmentDivs[i].style.top = (this.origY+this.yoffset) + "px";
			stringSegmentDivs[i].setAttribute("class", "hstring");
		}

	} else {

		this.yoffset = guitY;
		//var sz = $("#theNeckVert img").get(0);
		//consolewrp.log( "sz: " + sz );

		//var farLeft = this.width + this.xoffset - this.y;

		var farLeft = this.stringView.width - this.y + offset.left;
		//consolewrp.log( "farLeft: " + farLeft );

		var currLength = 0;
		this.x = farLeft;
		this.y = this.origY;

		for(var i = stringSegmentDivs.length-1; i >= 0;  --i ){

			var w = stringSegmentDivs[i].style.width;
			var h = stringSegmentDivs[i].style.height;

			stringSegmentDivs[i].style.height = w;
			stringSegmentDivs[i].style.width  = h;

			//var x = stringSegmentDivs[i].style.left + w;
			//var y = stringSegmentDivs[i].style.top  + h;

			stringSegmentDivs[i].style.left = farLeft + "px";
			stringSegmentDivs[i].style.top  = (currLength + this.yoffset - 15) + "px";

			stringSegmentDivs[i].setAttribute("class", "vstring");

			currLength += this.resolution;
		}
	}

	this.xoffset = offset.left;
	var temp = this.width;
	this.width = this.height;
	this.height = temp;
	//consolewrp.log( "height: " + this.width + ", " + this.height );
//	this.yoffset = offset.top;

};


stringView = function(options) {

	if(options){
 		for(option in options) {
			this[option] = options[option];
		}
	} else {
	    options = {};
	}
	this.width=126;
	if(!options.hasOwnProperty('stringColor')){	this.stringColor = null;	}
	if(!options.hasOwnProperty('orientation')){	this.orientation = 'h';	}
	if(!options.hasOwnProperty('isBass')){		this.isBass = false;	}
	if(!options.hasOwnProperty('vx')){			this.vx = null;	}
	if(!options.hasOwnProperty('hy')){			this.hy = null;	}

	this.rootSelector= '#theNeck';
	theNeck = this.neck = new neck({stringView: this});

	var classroot = this;
	var offset = $(this.rootSelector).offset();
	this.x = offset.left;
	this.y = offset.top;
	//consolewrp.log( "offset: " + offset.top + ", " + offset.left );


//		.css({
//				 top: (offset.top-18+152)  + "px", 
//				 left: (offset.left+900)  + "px"
//			 });

	$(window).resize(function() { classroot.handleWindowResize(); });

	this.strings = [];
	for(var i = 0; i < 6; ++i){
		this.strings.push(new guitStr({stringNum: i, 
									   x: -15, y: 4+i*24-Math.floor(i/2), 
									   width: getFretPosition(24)+guitY*2, 
									   height: 1+Math.floor(i/2), 
									   stringView: this,
									   resolution:32}));
	}

	this.handleWindowResize(true);
};

stringView.prototype.handleWindowResize = function( isInit ) {
	var offset = $(this.rootSelector).offset();
	this.x = offset.left;
	this.y = offset.top;

	//this.resetToggleNeckViewButton();
						 
	for(var i = 0; i < 6; ++i){
		this.strings[i].handleWindowResize(offset);
	}
	this.neck.resetDots();

	if(!isInit){
		this.rotate();
		this.rotate();		
	}


};

stringView.prototype.getString = function( noteInfo ) {
	var s = noteInfo.getString();
	return this.strings[NUM_STRINGS-s-1];
};

stringView.prototype.doStringBendAnim = function(noteInfo, factor, dir  ) {
	var string = noteInfo.getString();
	var fret = noteInfo.getFret();

	var lf = getFretPosition(fret);
	var hf = getFretPosition(fret+1);
	
	var s = this.orientation=="v" ? string: 6+(5-string);
	this.subviews[s].bend((lf+hf+4*guitY+fret/2)/2, factor, dir);

	//Debug.write("itis: " + factor + "," + string + ", " + fret  + ", " + lf + ", " + hf + ", " + s  + ", " + this.orientation);
};


stringView.prototype.resetToggleNeckViewButton = function(  ) {

	if( this.orientation=="h"){
		var offset = $(this.rootSelector).offset();

		$("#toggleNeckView")
			.css({
					 top: (offset.top-18+152)  + "px", 
					 left: (offset.left+900)  + "px"
				 });

	} else {

		var offset = $(this.rootSelector).offset();

		$("#toggleNeckView")
			.css({
					 top: (offset.top+30)  + "px", 
					 left: (offset.left+136)  + "px"
				 });
	}
};


stringView.prototype.rotate = function(  ) {
	$("#theNeck").toggle();
	$("#theNeckVert").toggle();

	if( this.orientation=="v"){
		//$("#tabView").css("top", "170px");

		$("#theNeckVert > div").remove().appendTo("#theNeck");
		this.rootSelector="#theNeck";
		this.orientation="h";

	} else {
		//$("#tabView").css("top", "20px");

		$("#theNeck > div").remove().appendTo("#theNeckVert");
		this.rootSelector="#theNeckVert";
		this.orientation="v";

	}


	var offset = $(this.rootSelector).offset();
	this.x = offset.left;
	this.y = offset.top;

	//this.resetToggleNeckViewButton();

	//reset();
	for(var i = 0; i < this.strings.length; ++i ) {
		this.strings[i].rotate();
	}


	if(this.isBass) {
	}
	this.neck.rotate();

};

stringView.prototype.unbend = function( ) {

	for(var i = 0; i < this.strings.length; ++i ) {
		this.strings[i].unbend();
	}
	    
};

stringView.prototype.reset = function( ) {

	for(var i = 0; i < this.strings.length; ++i ) {
		this.strings[i].reset();
	}
	    
};

stringView.prototype.getStringX = function( string ) {

	if( this.orientation == "v" ) {
		//return subviews[string].bars[0].x + subviews[string].width/2;
		return this.strings[NUM_STRINGS-string-1].x;
	} else {
		return this.getStringY(string);
	}
	    
};

stringView.prototype.getStringY = function( string ) {

	if( this.orientation == "v" ) {
		return -guitY;
	} else {
		var i = NUM_STRINGS-string-1;
		return this.strings[i].y + this.strings[i].height/2;
	}
	    
};

function setTitleInfo(){
	$("#songName").append("<i>" + metaInfo.SongName + "</i>");
	$("#artistName").append("<b>" + metaInfo.ArtistName + "</b>");
	$("#affiliateButton").button({label: "Get " + metaInfo.ArtistName + " stuff online!" });
};


function isThereAScrollBar() {

	var viewportwidth;
	var viewportheight;
	
	// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
	
	if (typeof window.innerWidth != 'undefined')
	{
		viewportwidth = window.innerWidth,
		viewportheight = window.innerHeight;
	}
	
	// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)

	else if (typeof document.documentElement != 'undefined'
			 && typeof document.documentElement.clientWidth !=
			 'undefined' && document.documentElement.clientWidth != 0)
	{
		viewportwidth = document.documentElement.clientWidth,
		viewportheight = document.documentElement.clientHeight;
	}
	
	// older versions of IE
	
	else
	{
		viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
		viewportheight = document.getElementsByTagName('body')[0].clientHeight;
	}

	var docHeight = $(document).height();
	//var scroll    = $(window).height() ;//+ $(window).scrollTop();
	if(docHeight > viewportheight) return true;
	else return false;
}


var tabJsonArray = [];
var tabRepeatJsonArray = [];
var tabTuningArray = [];
var tabToolArray = [];
var currTabIndex = 0;
//var tabURLPATH = "/itabs/sites/newGuizzard/get.php?id=";
var tabURLPATH = "/guiz/get.php?id=";





$(document).ready(
	function(){





		var queryParams = getUrlVars();
		consolewrp.log( "queryParams: " + queryParams.tab );

		if(typeof queryParams.artist != "undefined") {

			if(typeof queryParams.song != "undefined") {
				setNavPath(queryParams.id, queryParams.artist, queryParams.song);
			} else {
				setNavPath(queryParams.artist, queryParams.artist);
			}
		} 


		var alphaButtonSize = "8px";
		$("#alphaIndex button:first")
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); })
			.parent()
			.buttonset();



		var sv = new stringView();

		var tabtab = $("#tabtab").tabs(
			{
				//tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>"
				show: function(event, ui) {

					var jsonFile= queryParams.type == "scoreAndTab" ? "TS" : queryParams.type == "score" ? "S": "T";
					jsonFile += ui.index + ".js";

					currTabIndex = ui.index;

					//consolewrp.log( "tabTool: " + tabTool );
					if(tabTool == "none" ) return;

					if(( tabJsonArray.length <= currTabIndex || tabJsonArray[currTabIndex] == null)) {

						$.getScript(//"/itabs/sites/newGuizzard/itabs" + queryParams.tab + "/" + jsonFile, 
							tabURLPATH + queryParams.tab + "&fileName=" + jsonFile,
							function(){
								
								tabTool.stopPlayer();

								tabTool = new TabTool({neck: sv.neck, rootSelector: "#tab" + currTabIndex + " .tabView"}, tabJsonArray[currTabIndex], tabRepeatJsonArray[currTabIndex]);


								tabToolArray[currTabIndex] = tabTool;
								//consolewrp.log( "___________________currTabIndex: " + currTabIndex );
								if(currTabIndex > 0){
									tabTool.tabViewPortal.handleRotate("v");
									tabTool.tabViewPortal.handleRotate("h");
								}

								//tabTool.toggleplay();

							});
					} else {
						if(tabTool)	{
							tabTool.stopPlayer();
						}

						tabTool = tabToolArray[currTabIndex];
						tabTool.showPointer();

						//tabTool.toggleplay();

					}

				},

				tabTemplate: "<li><a href='#{href}'>#{label}</a> </li>"
			});

		var tabTool = "none";
		var tabCount = 0;

		tabtab.bind( "tabsadd", function(event, ui) {
						 //var info = metaInfo["TrackName" + ui.index];
						 //var tabPngName = "itabs" + queryParams.tab + "/TS" + (ui.index) + "1.png";
						 var tabPngName = tabURLPATH + queryParams.tab + "&fileName=" + "TS" + (ui.index) + "1.png";
						 //consolewrp.log( "tabPngName: " + tabPngName );
						 $(ui.panel).append('  <div class="tabView">' +
											'<div id="tabViewScrollDiv' + (ui.index) + '">' +
											'<img src="' + tabPngName + '"/>' +
											'</div>' +
											'</div>');

						 if(tabTool == "none") {
							 tabTool = "init";
							 var jsonFile= queryParams.type == "scoreAndTab" ? "TS0.js" : queryParams.type == "score" ? "S0.js": "T0.js";
							 $.getScript(
								 tabURLPATH + queryParams.tab + "&fileName=" + jsonFile,

								 function(){
									 if(tabTool.stopPlayer) { //tabTool != "init")	{
										 tabTool.stopPlayer();
									 }

									 tabTool = new TabTool({neck: sv.neck, rootSelector: "#tab" + currTabIndex + " .tabView"}, tabJsonArray[currTabIndex], tabRepeatJsonArray[currTabIndex]);
									 tabToolArray[currTabIndex] = tabTool;

									 sv.rotate();
									 BrowserDetect.init();


								 });
						 } 
						 if(metaInfo.numTracks-1 == tabCount) {
							 var tabH = tabtab.height();
							 var tabTop = tabtab.offset().top;

							 tabTop = $('#header').height() + 135 +  + $('#songHeader').height() +  $('#controlBar').height();
							 tabDimensions.diff = $(".tabView", tabtab.get(0)).offset().top - tabtab.offset().top + 30;

							 var viewportWidth = $(window).width();

							 var viewportHeight = $(window).height();
							 var tabHeight = viewportHeight - tabTop - 150;

							 tabtab.height(tabHeight + "px");
							 tabDimensions.pageHeight = tabHeight - tabDimensions.diff;
							 tabDimensions.maxViewableHeight = tabHeight - tabDimensions.diff;

							 
						 }

					 });
		
		


		$("#theNeckVert").toggle();

		$("#dots div").toggle();


		//if(false){

		$.getScript(
					tabURLPATH  + queryParams.tab + "&fileName=Meta.js",
					function(){
						setTitleInfo();
						
						for(; tabCount < metaInfo.numTracks; ++tabCount){
							if(metaInfo["TrackName" + tabCount]) {
								//tabtab.tabs("add", "ui-tabs-" + i, metaInfo["TrackName" + i]);
								tabtab.tabs("add", "#tab" + tabCount, metaInfo["TrackName" + tabCount]);
								//consolewrp.log( "track: " + i );
							} else {
								totalTabs = i;
								break;
							}
						}
					});

		var sliding=false;
		$("#tempoSlider").slider({   value: 500, 
									 max: 1000,
									 change:
									 function(e,ui){
										 tabTool.setTempo(ui.value/1000);
										 sliding = false;
									 }

									 ,
									 slide:
									 function(e,ui){
										 if(!sliding){
											 $("#tempoValueDisp").text("??");
											 sliding = true;
										 }
									 }

								 });

		$("#toggleNeckView")

			.button({text: false, icons: { primary:  "ui-icon-triangle-1-se" }})
			.click(
				function(e) {
					e.preventDefault();
					sv.rotate();

					if(sv.orientation == "h"){
						$(this).button({text: false, icons: { primary:  "ui-icon-triangle-1-se" }});
					} else {
						$(this).button({text: false, icons: { primary:  "ui-icon-triangle-1-nw" }});
					}
				});


		//tabTool.playStepper.rate = 200;

		//var s = new guitStr(null, {x: 10, y: 40, width: getFretPosition(24)+guitY*2, height: 4, rootSelector: '#theNeck', resolution:32});

		$("#loopMode")
			.button({text: false, icons: { primary:  "ui-icon-refresh" }})
			.click(
			function(e) {
				e.preventDefault();
				tabTool.onloopMode();
			});


		$("#showAllScore")
			.button({text: false, icons: { primary:  "ui-icon-triangle-1-s" }})
			.click(
			function(e) {
				e.preventDefault();

				if(tabTool.resizeHeight()) {
					$(this).button({text: false, icons: { primary:  "ui-icon-triangle-1-n" }});
				} else {
					$(this).button({text: false, icons: { primary:  "ui-icon-triangle-1-s" }});
				}
				scrollBarPresent = isThereAScrollBar();

			});

		$("#printTab")
			.button()//{text: false, icons: { primary:  "ui-icon-triangle-1-s" }})
			.click(
			function(e) {
				e.preventDefault();

				var x = $("#tabViewScrollDiv" + currTabIndex + "").get(0);
				consolewrp.log( "x: " + x );
				
				$("#tabViewScrollDiv" + currTabIndex + "").printElement();

			});


		$("#trace")
			.button()//{text: false, icons: { primary:  "ui-icon-triangle-1-s" }})
			.click(
			function(e) {
				e.preventDefault();

				tabTool.traceMode = !tabTool.traceMode;
				sv.neck.onshowHistory();
				if(tabTool.traceMode) {
					$(this).button({label: "trace off"});
				} else {
					$(this).button({label: "trace on"});
				}
			});


		var f = 0;
		var dist = 20;
		$("#play")
			.button({text: false, icons: { primary:  "ui-icon-play" }})
			.click(
			function(e) {
				e.preventDefault();

				//$("#pointer").toggle();

				//$('#tabView').css('scrollTop', "-" + dist + "px");
				//$('#tabView').scrollTop(dist);
				//dist += 100;

				//sv.neck.testCDots(f++);

				tabTool.toggleplay();
				//audioProcessor.play();

				//if(s.bent)
					//s.unbend();
				//else 
					//s.bend(500, dist--, 1);

				//sv.rotate();

			});

		$("#back8")
			.button({icons: { primary:  "ui-icon-triangle-1-e" }})
			.click(
				function(e) {
					e.preventDefault();
					tabTool.backStep(8);

				})
			.next()
			.button({text: false, icons: { primary:  "ui-icon-triangle-1-w" }})
			.click(
				function(e) {
					e.preventDefault();
					tabTool.backStep(1);
				})
			.next()
			.button({text: false, icons: { primary:  "ui-icon-triangle-1-e" }})
			.click(
				function(e) {
					e.preventDefault();
					tabTool.doStep(1);
				})
			.next()
			.button({icons: { secondary:  "ui-icon-triangle-1-e" }})
			.click(
				function(e) {
					e.preventDefault();
					tabTool.doStep(8);
				})
			.parent()
			.buttonset();

		scrollBarPresent = isThereAScrollBar();

		$(window).resize(function() { scrollBarPresent = isThereAScrollBar(); });


	});
