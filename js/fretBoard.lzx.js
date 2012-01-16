function fadeCDots(cdots) {

	if(cdots != undefined && cdots != null ) {

		for(var i = 0; i < cdots.length; ++i) {
			var op = cdots[i].opacity;
			cdots[i].setOpacity(op-1/HISTORY_DEPTH);
		}
	}
}

function destroyCDots(cdots) {

	if(cdots != undefined && cdots != null ) {

		for(var i = 0; i < cdots.length; ++i) {
			cdots[i].destroy();
		}
		while(cdots.length>0) {
			cdots.pop();
		}
	}
}


var neck = function(options) {
	if(options){
		for(option in options) {
			this[option] = options[option];
		}
	} else {
	    options = {};
	}
	if(!options.hasOwnProperty('rotating')){			this.rotating = false;	}
	if(!options.hasOwnProperty('chordDotRadius')){			this.chordDotRadius = 11;	}
	if(!options.hasOwnProperty('totalFrets')){			this.totalFrets = 18;	}
	if(!options.hasOwnProperty('chordDots')){			this.chordDots = null;	}
	if(!options.hasOwnProperty('chordDotHistory')){			this.chordDotHistory = null;	}
	if(!options.hasOwnProperty('currChordInfo')){			this.currChordInfo = null;	}
	if(!options.hasOwnProperty('doShowAll')){			this.doShowAll = false;	}
	if(!options.hasOwnProperty('showHistory')){			this.showHistory = false;	}
	if(!options.hasOwnProperty('fretboard')){			this.fretboard = null;	}
	if(!options.hasOwnProperty('key')){			this.key = null;	}
	if(!options.hasOwnProperty('orientation')){			this.orientation = 'h';	}
	if(!options.hasOwnProperty('showBass')){			this.showBass = false;	}
	if(!options.hasOwnProperty('currentTabWin')){			this.currentTabWin = null;	}
	if(!options.hasOwnProperty('lastChordBox')){			this.lastChordBox = null;	}
	if(!options.hasOwnProperty('fretThickness')){			this.fretThickness = 7;	}
	if(!options.hasOwnProperty('clickDelegate')){			this.clickDelegate = null;	}
	if(!options.hasOwnProperty('tin')){			this.tin = 0;	}

	this.oninit();
};

neck.prototype.nullClick = function(  ) {

	

	
	
};

neck.prototype.testCDots = function( f ) {

	
	for(var i = 0; i < 6; ++i ) {
		for(var j = -1; j < 1; ++j ) {
			this.markFret(i,j+f,0,false);
		}
	}
	
	
};

neck.prototype.setNewClickDelegate = function( obj,method ) {

	this.clickDelegate.unregisterAll();
	this.clickDelegate = new lz.Delegate(obj, method, this, "onclick");
};

neck.prototype.chordSelected = function( chordBox ) {

	if(typeof this.lastChordBox != "undefined" && this.lastChordBox != null) {
		this.lastChordBox.opacity =  1.0;
	}
	chordBox.opacity =  0.5;
	this.showChord(chordBox.chordInfo);
	this.lastChordBox = chordBox;
	
};

neck.prototype.reset = function(  ) {
	
};

neck.prototype.setTitle = function( title ) {
	
};

neck.prototype.showBoard = function( s ) {

};

neck.prototype.show = function(  ) {
	
	this.clearLastChord();
	this.display();
};

neck.prototype.display = function(  ) {

	//consolewrp.log( "display: " + this.currChordInfo );
	if(typeof this.currChordInfo != "undefined" && this.currChordInfo != null &&
	   typeof this.currChordInfo.chord != "undefined" && this.currChordInfo.chord != null) {

		if(doShowAll) {
			this.fretboard.renderAll(this.currChordInfo.chord, range.minIncFactor-1, range.maxIncFactor);
		} else {
		    //consolewrp.log( "marked currChordInfo: " + currChordInfo.chord.hasMarkedFingering());

            if(this.currChordInfo.chord.hasMarkedFingering()) {

                this.fretboard.render   (this.currChordInfo.chord, range.minIncFactor-1, range.maxIncFactor);

			} else {

			    this.fretboard.renderVoicing   (this.currChordInfo.chord, range.minIncFactor-1, range.maxIncFactor);
			}
		    consolewrp.log( "marked currChordInfo: " + currChordInfo.chord.hasMarkedFingering());
		}
	}
};

neck.prototype.setRootNote = function( rootNote ) {
	
	if(this.currChordInfo.isPersisted) {
		var ci = new lz.chordInfo(canvas, null);
		ci.copyChord(this.currChordInfo);
		ci.setRootNote(rootNote);
	} else {
		this.currChordInfo.setRootNote(rootNote);
	}
	
	
};

neck.prototype.setFretRange = function(  ) {

	var lf = range.minIncFactor-1;
	var hf = range.maxIncFactor;
	
	//consolewrp.log("lfhf: " + lf + ", " + hf);

	var lfx = getFretPosition(lf) + this.fretThickness + guitY;
	var hfx = getFretPosition(hf) + guitY;

	range.setBarStart(lfx);				
	range.setBarEnd(hfx-lfx);

	if( typeof this.currChordInfo != "undefined" && this.currChordInfo != null ) {
		this.currChordInfo.chord.checkFingering( range.minIncFactor-1, range.maxIncFactor);
	}

	this.show();
	
	
};

neck.prototype.setNoteAnimation = function( noteInfo, dot, duration ) {
	var offset = dot.jqDivObj.offset();
	
	if( typeof noteInfo.animInfo != "undefined" && noteInfo.animInfo != null && noteInfo.animInfo.length > 0 ) {

		for( var i = 0; i < noteInfo.animInfo.length; ++i ) {

			var animInfo = noteInfo.animInfo[i];
			//consolewrp.log( i + " animInfo: " + noteInfo.animInfo[i].type );

			var stringAxis = this.orientation=="v" ? "top": "left";
			var fretAxis =   this.orientation=="v" ? "left": "top";

			var stringAxisPos = this.orientation=="v" ? offset.top: offset.left;
			var fretAxisPos =   this.orientation=="v" ? offset.left: offset.top;

			var stringAxisTargetObj = this.orientation=="v" ? {top: null} : {left: null};
			var fretAxisTargetObj = this.orientation=="v" ? {left: null} : {top: null};

			if(animInfo.type == NONE) {

				//dot.animate("opacity", 0.0, duration-50, false, {motion: "easein"});

			} else if(animInfo.type == BEND) {

                //consolewrp.log("p: " + animInfo.points.length);
                //consolewrp.log("bend points: " + getArrayRep(animInfo.points, ","));

				//var ag = stringBendAnimatorArray[animInfo.points.length/2-1];
				doBend(animInfo.points, duration, dot, this.orientation == "v", noteInfo, this.stringView);
				//this.stringView.strings[noteInfo.string].bend

				//var startPitch = animInfo.startNote.fret;
				//var endPitch = animInfo.endNote.fret;
				//var diff = Math.abs(endPitch-startPitch);
				//var dir = (noteInfo.string>2)? (this.orientation=="v"? -1:1):(this.orientation=="v"? 1:-1);
				//dot.animate(fretAxis, dir*diff*3, this.currentTabWin.getTempo()/3, true, {motion: "easeboth"});

			} else if(animInfo.type == SLIDE) {

				var startPos = getDotPosition(animInfo.startNote.fret);
				var endPos = 0;

				if(animInfo.endNote != null) {
					endPos = getDotPosition(animInfo.endNote.fret);
				} else {
					endPos = getDotPosition(animInfo.startNote.fret+1);
				}

				var diff = endPos-startPos;
				var slideDuration = 0;

				if(animInfo.duration == 0) {
					slideDuration = duration/2;
				} else {
					slideDuration = this.currentTabWin.getDuration(animInfo.duration);
				}
				//consolewrp.log( duration + " slideDuration: " + slideDuration + " : " + animInfo.duration );
				stringAxisTargetObj[stringAxis] = stringAxisPos + diff + "px";
				dot.jqDivObj.animate(stringAxisTargetObj, slideDuration);
				//dot.animate(stringAxis, diff, slideDuration, true, {motion: "linear"});
				//dot.animate("opacity", 0.0, slideDuration, false, {motion: "linear"});

			} else if(animInfo.type == PULL_OFF) {

				var startPitch = animInfo.startNote.fret;
				var endPitch = animInfo.endNote.fret;
				var diff = Math.abs(endPitch-startPitch);

				fretAxisTargetObj[fretAxis] = fretAxisPos + diff*5 + "px";
				dot.jqDivObj.animate(fretAxisTargetObj, {duration: duration/4, easing: "easeInOutQuad"});

				//dot.animate(fretAxis, diff*5, this.currentTabWin.getTempo()/4, true, {motion: "easeboth"});

			} else if(animInfo.type == TREMOLO) {

				var anim = new lz.tremAnim(this);
				anim.target =  dot;
				if(this.orientation=="v") {
					anim.axis = "x";

					//							this.tremAnimX.target =  dot;
					//							this.tremAnimX.doStart(); 
				} else {
					anim.axis = "y";
					//							this.tremAnimY.target =  dot;
					//							this.tremAnimY.doStart(); 
				}
				anim.doStart();
			}
		}
	}
	
};


neck.prototype.markFrets = function( notes, sym, isTrace, duration, doAnim ) {

	
	//if(this.showHistory) {
	//this.chordDots = new Array();
	//}
	if(typeof doAnim == "undefined" || doAnim==null) {
		doAnim = true;
	}
	this.stringView.reset();
	for(var i = 0; i < notes.length; ++i) {
		//consolewrp.log( i + " > notes: " + notes[i].strRep() );
		
		var noteInfo = notes[i];

		if(noteInfo != null) {
			if(isTrace) noteInfo.animInfo = null;
			var dot = this.markFret(noteInfo.getString(), noteInfo.getFret(), sym, isTrace);
			dot.setNoteInfo(noteInfo);

			if(doAnim) {
				//consolewrp.log( "doAnim: " + doAnim );
				this.setNoteAnimation(noteInfo,dot,duration);
			}
			var noteDuration = duration;//this.currentTabWin.getDuration(noteInfo.duration);
			
			if(!isTrace)dot.fade(noteDuration);

			//consolewrp.log( "noteDuration: " + noteDuration + "  duration: " + duration );
			
			//dot.animate("opacity", 0.0, noteDuration-50, false, {motion: "easein"});
		}
	}
	if(this.showHistory) {

		//consolewrp.log("run that fadeDots ==");
		this.chordDotHistory.run(fadeCDots);
		this.chordDotHistory.add(this.chordDots);
	}
	
};

neck.prototype.getDotX = function( string,fret ) {

//	consolewrp.log(this.stringView.orientation + ": " + this.stringView.x  + ", " + 
//				   (this.stringView.getStringX(string)) + " , " + this.chordDotRadius + ", " + getDotPosition(fret));
	var scrollOffset = scrollBarPresent? 31:21;
	return this.stringView.orientation=="v" ? 
		this.stringView.getStringX(string) - this.chordDotRadius:
		this.stringView.x + getDotPosition(fret)-scrollOffset;
	
};

neck.prototype.getDotY = function( string,fret ) {

//	consolewrp.log(this.stringView.orientation + ": " + this.stringView.y  + ", " + 
//				   (this.stringView.getStringY(string)) + " , " + this.chordDotRadius + ", " + getDotPosition(fret));

	return this.stringView.orientation=="h" ? 
		this.stringView.y + this.stringView.getStringY(string) - this.chordDotRadius-1: 
		this.stringView.y + getDotPosition(fret);
	
};

var dotIndex = 0;


neck.prototype.markFret = function( string,fret,interval, isTrace ) {

	
	var color = (fret<0)? 0x0FE01D: 0x010fFe;
	var sym = getSymbol(interval);
	var op = isTrace? 0.3 : 1.0;

	var x = this.getDotX(string,fret);
	var y = this.getDotY(string,fret);


    //consolewrp.log(string + " :: " + y );

	if(this.showBass){
		if(this.orientation=="h") {
			if(string < 2 ) y -= 30;
			else y -= 35+(string-2);
		}
		else {
			if(string < 2 ) x += (9+string*2);
			else x += 15+(string-2)*2;
		}
		//consolewrp.log(string + " - " + fret);
		//consolewrp.log(x + " : " + y);

	}
	++dotIndex;
	dotIndex = dotIndex % (this.chordDots.length);
	//consolewrp.log( "dotIndex: " + dotIndex );
	
//	var chordDot = (fret==-1)? this.chordDots[string*2]: this.chordDots[dotIndex];
	var chordDot = this.chordDots[dotIndex];

	chordDot.setVals( x, y, sym, string, fret, interval, op );

	return chordDot;

	
	
};

neck.prototype.clearLastChord = function(  ) {


	if(!this.showHistory && typeof this.chordDots != "undefined" && this.chordDots != null) {
		for(var i = 0; i < this.chordDots.length; ++i ) {
			this.chordDots[i].hide();
		}
	}

	
	
};

neck.prototype.showOnlyThis = function( chordDot ) {

	var hadOtherNotes=false;
	var chordDots = this.chordDots;
	for(var i = 0; i < chordDots.length; ++i ) {
		if(!chordDots[i].dead && chordDots[i]!=chordDot && chordDots[i].string==chordDot.string) {
			chordDots[i].dead=true;
			chordDots[i].visible = false;
			hadOtherNotes=true;
		}
	}

	if(typeof this.currChordInfo != "undefined" && this.currChordInfo != null ) {
		if(!hadOtherNotes) {
			chordDot.visible = false;
			this.currChordInfo.chord.markFingering(chordDot.string, -2, chordDot.interval);
		} else {
			this.currChordInfo.markFingering(chordDot);
		}
	}

	//consolewrp.log( "currentTabWin: " + this.currentTabWin );
	if(typeof this.currentTabWin != "undefined" && this.currentTabWin != null ) {
		this.currentTabWin.chordDotClicked(chordDot);
	}
	
};

neck.prototype.showChord = function( chordInfo ) {

	

	if(typeof this.chordDots == "undefined" || this.chordDots==null) {
		this.chordDots = new Array();
		this.chordDotHistory = new Queue(NUM_STRINGS, true);
	}

	//this.currChordInfo.debug();
	chordInfo.debug();
	this.clearLastChord();

	//consolewrp.log( "showChord: "  + currChordSymbol);

	if(typeof this.currChordSymbol != "undefined" && this.currChordSymbol!=null) {
		//consolewrp.log( "showChord: "  );
		currChordSymbol.setChord(chordInfo);
	}
	this.currChordInfo=chordInfo;
	//consolewrp.log( "chordInfo: " + chordInfo );
	this.display();

	
	
};

neck.prototype.showChordVoicing = function( chordInfo ) {

	

	if(typeof this.chordDots == "undefined" || this.chordDots==null) {
		this.chordDots = new Array();
		this.chordDotHistory = new Queue(NUM_STRINGS, true);
	}

	this.clearLastChord();


	if(typeof this.currChordSymbol != "undefined" && this.currChordSymbol!=null) {
		currChordSymbol.setChord(chordInfo);
	}
	this.currChordInfo=chordInfo;

	this.fretboard.renderVoicing   (this.currChordInfo.chord, range.minIncFactor-1, range.maxIncFactor);

};

	
neck.prototype.rotate = function( s ) {
	this.orientation = (this.orientation === "h")? "v": "h";
	this.currentTabWin.handleRotate(this.orientation);
	this.resetDots();

};


neck.prototype.resetDots = function( s ) {
	if(typeof this.chordDots != "undefined" && this.chordDots != null ) {

		for(var i = 0; i < this.chordDots.length; ++i) {

			var string = this.chordDots[i].string;
			var fret = this.chordDots[i].fret;

			var x = this.getDotX(string,fret);
			var y = this.getDotY(string,fret);

			this.chordDots[i].setXY(x,y);


		}
	}
};

neck.prototype.rotateOrig = function( s ) {

	
	swapAttributes(theNeckWin, "width", "height");

	this.rotating = true;

	swapAttributes(theNeck, "width", "height");

	this.orientation = (this.width > this.height)? "h": "v";

	if(this.orientation=="h") {

		theNeckWin.x =  0;
		theNeckWin.y =  5;
		theNeckWin.width =  960;
		theNeckWin.height =  neckWidth;
        //bannerDispTop.visible = false;
        //bannerDispBottom.visible = true;

		if(showBass) {
			theNeck.resource = "bassNeckHorz";
		} else {
			theNeck.resource = "guitNeckHorz";
		}

	} else {

		if(showBass) {
			theNeck.resource = "bassNeckVert";
		} else {
			theNeck.resource = "guitNeckVert";
		}

        theNeckWin.x =  790;
        theNeckWin.y =  guitY;
		theNeckWin.width =  neckWidth;
		theNeckWin.height =  960;
		//bannerDispTop.visible = true;
		//bannerDispBottom.visible = false;

	}


	if(typeof this.chordDots != "undefined" && this.chordDots != null ) {

		for(var i = 0; i < this.chordDots.length; ++i) {

			var string = this.chordDots[i].string;
			var fret = this.chordDots[i].fret;

			var x = this.getDotX(string,fret);
			var y = this.getDotY(string,fret);

			if(this.showBass){
				if(this.orientation=="h") {
					if(string < 2 ) y += 30;
					else y += 35+(string-2);
				}
				else {
					if(string < 2 ) x += (6+string*2);
					else x += 12+(string-2)*2;
				}

				//consolewrp.log(string + " - " + fret);
				//consolewrp.log(x + " : " + y);
			}

			this.chordDots[i].x =  x;
			this.chordDots[i].y =  y;

		}
	}

	consolewrp.log( "theNeck: " + theNeckWin.x );
	consolewrp.log( "theNeck: " + theNeckWin.y );
	this.rotating = false;
	
	
};

neck.prototype.getChordDot = function( string ) {

	
	for(var i = 0; i < this.chordDots.length; ++i) {
		if(chordDots[i].string==string) {
			return chordDots[i];
		}
	}
	return null;
	
	
};

neck.prototype.doNoteBend = function( p,f,dot ) {

	



	
	
};

neck.prototype.getClickedNoteInfo = function(  ) {

	
	//var x = canvas.getMouse('x') - rootView.x - this.x/2;
	//var y = canvas.getMouse('y') - rootView.y - this.y/2;

	//consolewrp.log( x + ", " + canvas.getMouse('x') + ", " +  rootView.x + ", " + this.x );
	//consolewrp.log( y + ", " + canvas.getMouse('y') + ", " +  rootView.y + ", " + this.y );

	var string = 0;
	var fret = 0;

	//if( this.orientation=="v" ) {
	//string = strings.getClosestStringToX(x); //-GUIT_VERT_X);
	//fret = getClosestFret(y+6);
	//} else {
	//string = stringView.getClosestStringToY(y);
	//fret = getClosestFret(x+6);
	//}


	//consolewrp.log( "fret: " + fret + " string: " + string );

	return new noteInfo(fret,string,8);
	
	
};

neck.prototype.getClosestFret = function( point ) {

	

	//point += Math.floor
	if(point < 40) return -1;

	point -= 5;

	var diff = 1000;				
	var f = -1;
	for(var i = 0; i < 32; ++i ) {
		//consolewrp.log("string " + i);
		var fretP = getDotPosition(i);
		if(Math.abs(point-Math.round(i/2)-fretP) < diff ) {
			diff = x;
			f = i;
		} 
	}
	return f;
	
	
};

neck.prototype.oninit = function(  ) {

	
	this.fretboard = new FretBoard();
	this.fretboard.fretBoardGUI = this;
	this.key = new Key();
//	this.clickDelegate = new lz.Delegate(this, "nullClick", this, "onclick");

	this.chordDots = [];//chordDotArray;

	var dotDivs = $('#dots div').get();
	for(var i = 0; i < dotDivs.length; ++i ) {
		this.chordDots.push(new chordDot({divElement: dotDivs[i]}));
	}
	
};

neck.prototype.onclick = function(  ) {

	
	// we need this so delegates will work 
	
	
};

neck.prototype.onshowBass = function(  ) {

	
	if(showBass) {

		NUM_STRINGS = 4;
		//theScale = 1400;
		this.stringView.setAsBass();

		if(this.orientation == "v" ) {

			theNeck.resource = "bassNeckVert";

		} else {

			theNeck.resource = "bassNeckHorz";

		}


	} else {

		NUM_STRINGS = 6;
		//theScale = 1200;
		this.stringView.setAsGuitar();

		if(this.orientation == "v" ) {

			theNeck.resource = "guitNeckVert";

		} else {

			theNeck.resource = "guitNeckHorz";

		}

	}
	
	
};

neck.prototype.onshowHistory = function(  ) {

	
	if(typeof this.chordDotHistory == "undefined" || this.chordDotHistory == null) {
		this.chordDotHistory = new Queue(HISTORY_DEPTH, destroyCDots);
	} else {
		this.chordDotHistory.clear();
	}
	
	
};

