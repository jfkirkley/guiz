chordDot2Chars = function(parent, options) {
	this.parent = parent? parent: null;
	if(options){
		for(option in options) {
			this[option] = options[option];
		}
	} else {
	    options = {};
	}
	if(!options.hasOwnProperty('fret')){		this.fret = 0;	}
	if(!options.hasOwnProperty('string')){		this.string = 0;	}
	if(!options.hasOwnProperty('interval')){	this.interval = 0;	}
	if(!options.hasOwnProperty('dead')){		this.dead = false;	}
	if(!options.hasOwnProperty('color')){		this.color = null;	}
	if(!options.hasOwnProperty('origY')){		this.origY = 0;	}
	if(!options.hasOwnProperty('origX')){		this.origX = 0;	}
	if(!options.hasOwnProperty('noteInfo')){	this.noteInfo = null;	}
	if(!options.hasOwnProperty('allowBend')){	this.allowBend = false;	}
};

chordDot2Chars.prototype.setNoteInfo = function( ni ) {

	this.origY = this.getAttribute("y");
	this.origX = this.getAttribute("x");
	this.noteInfo = ni;
	this.noteInfo.bendPoint = theNeck.orientation=="v"? this.getAttribute("x"): this.getAttribute("y");
	
};

chordDot2Chars.prototype.canBeDestroyed = function( ) {
	
	if(typeof this.noteInfo != "undefined" && 
	   this.noteInfo != null && 
	   typeof this.noteInfo.animInfo != "undefined" &&
	   this.noteInfo.animInfo != null ) {
		   for(var i = 0; i < this.noteInfo.animInfo.length; ++i ) {
			   if( this.noteInfo.animInfo[i].type == "slide" ) { return false;}
		   }
	   }
	return true;
};

chordDot2Chars.prototype.onclick = function(  ) {
	
	theNeck.showOnlyThis(this);
	
};

chordDot2Chars.prototype.onx = function(  ) {

	if(this.allowBend && 
	   !theNeck.rotating && 
	   theNeck.orientation=="v" && typeof this.noteInfo != "undefined" && this.noteInfo != null) {

		var x = this.getAttribute("x");

		var diff = x-this.origX;
		var dir = diff<0? -1:1;

		diff = Math.abs(diff);
		strings.doStringBendAnim(this.noteInfo, diff,dir);
	}
	
};

chordDot2Chars.prototype.ony = function(  ) {

	
	if(this.allowBend && !theNeck.rotating && 
	   theNeck.orientation=="h" && typeof this.noteInfo != "undefined" && 
	   this.noteInfo != null) {

		var y = this.getAttribute("y");

		var diff = y-this.origY;
		var dir = diff<0? -1:1;

		diff = Math.abs(diff);
		strings.doStringBendAnim(this.noteInfo, diff,dir);

	}
	
};

chordDot = function(options) {
	this.parent = parent? parent: null;
	if(options){
		for(option in options) {
			this[option] = options[option];
		}
	} else {
	    options = {};
	}
	if(!options.hasOwnProperty('fret')){			this.fret = 0;	}
	if(!options.hasOwnProperty('string')){			this.string = 0;	}
	if(!options.hasOwnProperty('interval')){			this.interval = 0;	}
	if(!options.hasOwnProperty('origY')){			this.origY = 0;	}
	if(!options.hasOwnProperty('origX')){			this.origX = 0;	}
	if(!options.hasOwnProperty('noteInfo')){			this.noteInfo = null;	}
	if(!options.hasOwnProperty('allowBend')){			this.allowBend = false;	}
	if(!options.hasOwnProperty('color')){			this.color = null;	}

//	this.divElement = $(this.selector).get();

	this.jqDivObj = $(this.divElement);
	this.jqDivObj.css('position', 'absolute');

};

chordDot.prototype.setNoteInfo = function( ni ) {
	
	this.origY = this.x;
	this.origX = this.y;
	this.noteInfo = ni;
	this.noteInfo.bendPoint = theNeck.orientation=="v"? this.x: this.y;
	
};

chordDot.prototype.canBeDestroyed = function(  ) {

	if(typeof this.noteInfo != "undefined" && 
	   this.noteInfo != null && 
	   typeof this.noteInfo.animInfo != "undefined" &&
	   this.noteInfo.animInfo != null ) {

		   for(var i = 0; i < this.noteInfo.animInfo.length; ++i ) {
			   if( this.noteInfo.animInfo[i].type == "slide" ) { return false;}
		   }
	   }
	return true;
	
};

chordDot.prototype.setVals = function( x, y, sym, string, fret, interval, opacity ) {

	this.setXY(x,y);
	this.jqDivObj.show().css("opacity", opacity);

	this.sym =  sym;
	this.string =  string;
	//consolewrp.log( this.name + " string: " + string );
	this.fret =  fret;
	//consolewrp.log( this.name + " fret: " + fret );
	this.interval =  interval;
	this.visible = true;

	this.opacity =  opacity;

	
};

chordDot.prototype.setXY = function(x,y  ) {

			this.divElement.style.left = x + "px";
	//consolewrp.log( "x: " + x + ", " + y);
	this.divElement.style.top  = y + "px";
	
};


chordDot.prototype.hide = function(x,y) {
	this.visible = false;
	this.jqDivObj.hide().stop();

//	this.divElement.style.display  = "none";
};

chordDot.prototype.fade = function(duration  ) {

	//this.jqDivObj.effect('fade', null, duration);
	this.jqDivObj.animate( {opacity: 0.0}, {duration: duration, easing: 'easeInCubic'});
	
};



chordDot.prototype.onclick = function(  ) {

	theNeck.showOnlyThis(this);
	
};

chordDot.prototype.onx = function(  ) {

	if(this.allowBend && !theNeck.rotating && theNeck.orientation=="v" && 
	   typeof this.noteInfo != "undefined" && this.noteInfo != null) {

		var x = this.getAttribute("x");

		var diff = x-this.origX;
		var dir = diff<0? -1:1;

		diff = Math.abs(diff);
		strings.doStringBendAnim(this.noteInfo, diff,dir);

	}
	
	
};

chordDot.prototype.ony = function(  ) {

	if(this.allowBend && !theNeck.rotating && 
	   theNeck.orientation=="h" && typeof this.noteInfo != "undefined" && 
	   this.noteInfo != null) {

		var y = this.getAttribute("y");

		var diff = y-this.origY;
		var dir = diff<0? -1:1;

		diff = Math.abs(diff);
		strings.doStringBendAnim(this.noteInfo, diff,dir);

	}
	
};

tremAnim = function(parent, options) {
	this.parent = parent? parent: null;
	if(options){
		for(option in options) {
			this[option] = options[option];
		}
	} else {
	    options = {};
	}
	if(!options.hasOwnProperty('axis')){			this.axis = 'x';	}
};

tremAnim.prototype.onstop = function(  ) {
	
	strings.unbend();
	
};

