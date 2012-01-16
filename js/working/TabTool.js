var HLBxoffset1 = 18;
var HLBxoffset2 = 8;
var globalCallBacks = [];
var stringPitches = [-5, 0, 5, 10, 14, 19 ]; // standard tuning

TabTool = function(options, json, repeatJson) {
	if(options){
		for(option in options) {
			this[option] = options[option];
		}
	} else {
		options = {	};
	}
	if(!options.hasOwnProperty('neck')){			this.neck = null;	}
	if(!options.hasOwnProperty('step')){			this.step = 0;	}
	if(!options.hasOwnProperty('backstep')){			this.backstep = 0;	}
	if(!options.hasOwnProperty('stopped')){			this.stopped = true;	}
	if(!options.hasOwnProperty('doTime')){			this.doTime = false;	}
	if(!options.hasOwnProperty('maxHeight')){			this.maxHeight = 400;	}
	if(!options.hasOwnProperty('amountScrolled')){			this.amountScrolled = 0;	}
	if(!options.hasOwnProperty('durationFactor')){			this.durationFactor = 480;	}
	if(!options.hasOwnProperty('loopMode')){			this.loopMode = false;	}
	if(!options.hasOwnProperty('traceMode')){			this.traceMode = false;	}
	if(!options.hasOwnProperty('tuning')){			this.tuning = null;	}
	if(!options.hasOwnProperty('markLock')){			this.markLock = true;	}
	if(!options.hasOwnProperty('isBassTab')){			this.isBassTab = false;	}
	if(!options.hasOwnProperty('startPlayOnLoad')){			this.startPlayOnLoad = true;	}
	if(!options.hasOwnProperty('Title')){			this.Title = null;	}
	if(!options.hasOwnProperty('artist')){			this.artist = null;	}
	if(!options.hasOwnProperty('authorEmail')){			this.authorEmail = null;	}
	if(!options.hasOwnProperty('tabPathSpec')){			this.tabPathSpec = null;	}
	if(!options.hasOwnProperty('edit')){			this.edit = false;	}
	if(!options.hasOwnProperty('editController')){			this.editController = null;	}
	if(!options.hasOwnProperty('loopModeSetStart')){			this.loopModeSetStart = true;	}
	if(!options.hasOwnProperty('loopModeStartBeatInfo')){			this.loopModeStartBeatInfo = null;	}
	if(!options.hasOwnProperty('loopModeEndBeatInfo')){			this.loopModeEndBeatInfo = null;	}
	if(!options.hasOwnProperty('lastStaffIndexClicked')){			this.lastStaffIndexClicked = -1;	}
	if(!options.hasOwnProperty('lastBeatIndexClicked')){			this.lastBeatIndexClicked = -1;	}
	if(!options.hasOwnProperty('staffIterator')){			this.staffIterator = null;	}
	if(!options.hasOwnProperty('chordLibArr')){			this.chordLibArr = null;	}
	if(!options.hasOwnProperty('chordLib')){			this.chordLib = null;	}
	if(!options.hasOwnProperty('nonStaffLineHash')){			this.nonStaffLineHash = null;	}
	if(!options.hasOwnProperty('traceChordArray')){			this.traceChordArray = null;	}
	if(!options.hasOwnProperty('tabScroller')){			this.tabScroller = null;	}
	if(!options.hasOwnProperty('tabWin')){			this.tabWin = null;	}
	if(!options.hasOwnProperty('beater')){			this.beater = null;	}
	if(!options.hasOwnProperty('leftBracketPositioner')){			this.leftBracketPositioner = null;	}
	if(!options.hasOwnProperty('rightBracketPositioner')){			this.rightBracketPositioner = null;	}
	if(!options.hasOwnProperty('doBeatDelegate')){			this.doBeatDelegate = null;	}
	if(!options.hasOwnProperty('rootSelector')){			this.rootSelector = null;	}

	this.tabViewPortal = new NewTabDisplay(null,{highLightSelector: "#pointer", tabTool: this, rootSelector: this.rootSelector});

	globalCallBacks.push(_.bind(this.onstep,this));

	this.beatCallBackFunc = "globalCallBacks[" + (globalCallBacks.length-1) + "]()";
	this.playStepper = new stepper(null, {callback: this.beatCallBackFunc, max: 5000});
	this.playStepper.rate = (this.playStepper.max - this.playStepper.max * 0.75)/3 + 104;

	this.staffIterator = new StaffIterator('image');
	this.staffIterator.parseTabNEWinit();
	consolewrp.log( "repeatJson: " + repeatJson );
	for(var i = 0; i < json.length; ++i){
		this.staffIterator.parseTabNEW( json[i] );
	}

	if(repeatJson && repeatJson.length > 0) {
		this.initRepeats(repeatJson);
	}
	var timeSigHandler = new TimeSigHandler ("4/4,960");
	this.staffIterator.timeSigHandler = timeSigHandler;
	timeSigHandler.staffIterator = this.staffIterator;
	this.staffIterator.parseTabNEWfinish();
	this.tabViewPortal.setStaffIterator(this.staffIterator);

	this.startLoopPointerIcon = this.tabViewPortal.startLoopIcon;
	this.endLoopPointerIcon = this.tabViewPortal.endLoopIcon;

	this.hasAudio = !audioProcessor.isDummy();

	theNeck.currentTabWin =  this;
	
	this.c = "#fff";
	this.showPointer();

	this.setTempo(0.25);
	//this.initAudio(60);
	//this.processAudio();

	//this.tp = audioProcessor.getNoteDuration(1/8)/audioProcessor.sampleRate;
	//this.tempo = ((960)/this.durationFactor * this.playStepper.rate)/1000 * 60;
	//this.timingCorrection = audioProcessor.getNoteDuration(1/16);


	this.tp = 0;
	this.deadTime = 0;
	this.elaspedTime = -0.19;

	if(this.hasAudio){
		audioProcessor.reinitDevice();
	}
	this.waiting=false;

};
var xxxx2=0;
TabTool.prototype.adjustTiming = function(currentWritePosition) {


	//consolewrp.log( "snd: " + snd );
	var s = currentWritePosition/audioProcessor.sampleRate - this.deadTime - this.elaspedTime;// + 100*snd;


	//consolewrp.log( "s: " + s );
	//consolewrp.log( "n be: " + ((s/60)*this.tempo/2) );
	if(!audioProcessor.stopped){ // && !this.waiting) {
		//this.doStep2(1,((s/60)*this.tempo) );
		this.elaspedTime += s;
		//consolewrp.log( "cxyz: " + currentWritePosition/audioProcessor.sampleRate );
		//consolewrp.log( "deadTime: " + this.deadTime );
	//if(++xxxx2%10==0) {
		//consolewrp.log( "elaspedTime: " + this.elaspedTime );
	//}

		this.doStep2(1,((this.elaspedTime/60)*audioProcessor.tempo) );

		//this.doStep2(1,((s/60)*this.tempo/3) );
	} else {
		this.deadTime += s;
		
	}
};


TabTool.prototype.updatePosition = function(si, bi, isLoopEnd, isPlay, isLoopStart) {//.0625
	this.tp = this.calculateDurationToBeat(si,bi);

	if(isLoopStart){
		this.gotoStaff(si, bi, isLoopEnd, isPlay);	
		var x = 0;

		if(this.waiting){
			x  = (this.tp-this.currBeatInfo.duration/960+0)*60/audioProcessor.tempo - 0.19;			
			this.waiting=false;
		} else {
			x  = (this.tp)*60/audioProcessor.tempo - 0.19;			
		}

		this.deadTime += this.elaspedTime-x;
		this.elaspedTime = x;
		//this.waiting = true;
	} else {
		this.setLoopPosition(si, bi, isLoopEnd, isPlay);		
		this.elaspedTime = (this.tp-this.currBeatInfo.duration/960+0)*60/audioProcessor.tempo - 0.19;
	}
	//

//	if(!isLoopStart) {
//	}
	this.currBeatInfo = null;
	audioProcessor.setBeat(this.tp);
	consolewrp.log( "elaspedTime2: " + this.elaspedTime );
};

TabTool.prototype.initAudio = function(tempo) {

	//if(this.totalTime == 0) {
	this.totalTime = 0;
	
	for(var si = 0 ; si < this.staffIterator.staffInfoList.length; ++si ) {
		this.totalTime += this.staffIterator.staffInfoList[si].getStaffDuration(0);
	}
	this.totalTime/=960;
	//}

	consolewrp.log( "totalTime: " + this.totalTime );

	//audioProcessor.setTempo(((960)/this.durationFactor * this.playStepper.rate)/1000 * 60);
	audioProcessor.setTempo(tempo);
	audioProcessor.setLength(this.totalTime);
};


TabTool.prototype.processAudio = function() {
	
	this.staffIterator.rewind();
	var beatInfo = this.staffIterator.next(true);
	var timingPointer = 0;
	while(beatInfo != null){
		var notes = beatInfo.notes;
		if(notes){
			
			for(var i = 0; i < notes.length; ++i) {
				//consolewrp.log( i + " > notes: " + notes[i].strRep() );
				var noteInfo = notes[i];
				var sp = stringPitches[noteInfo.string]-12+noteInfo.fret;

				if( typeof noteInfo.animInfo != "undefined" && 
					noteInfo.animInfo != null && 
					noteInfo.animInfo.length > 0 ) {
						var animInfo = noteInfo.animInfo[0];
						if(animInfo.type == BEND) {
							audioProcessor.appendNoteBend(sp, animInfo.points, noteInfo.duration/960, timingPointer);
						} else {
							audioProcessor.appendNote(sp, noteInfo.duration/960, timingPointer);
							
						}
					} else {
						audioProcessor.appendNote(sp, noteInfo.duration/960, timingPointer);
						
					}
			}
		}
		//consolewrp.log( "timingPointer: " + timingPointer );
		timingPointer += beatInfo.duration/960;
		beatInfo = this.staffIterator.next(true);	
	}

	this.staffIterator.rewind();
	audioProcessor.setWriteCallback(_.bind(this.adjustTiming,this));

};

TabTool.prototype.calculateDurationToBeat = function( si, bi ) {

	var tp = 0;

	for(var i =0 ; i < si; ++i ) {
		tp += this.staffIterator.staffInfoList[i].getStaffDuration(0);///960;
	}

	tp = tp/960;

	var bil = this.staffIterator.staffInfoList[si].beatInfoList;

	for(i = 0; i < bi; ++i ) {

		tp += bil[i].duration/960;
		//consolewrp.log( "tp: " + tp );
	}

	return tp;

};


TabTool.prototype.initRepeats = function(repeatJson) {
	this.staffIterator.measureNumToRepeatInfoMap = {};
	this.staffIterator.hasRepeats = true;
	this.staffIterator.tabDisplay = this;

	var a = null;
	var lastRI = null;
	var x = 0;
	var ri = null;

	for(var i = 0; i < repeatJson.length; ++i) {
		var rdata = repeatJson[i];
		//s = rdata[0];
		//consolewrp.log( "s: " + repeatJson[i] );
		var s = rdata[0];
		var e = rdata[1];

		ri = new repeatInfo(s,e,rdata[2]);
		if(rdata.length>3){

			// single alt ending before the end is meaningless
			if(rdata.length > 5 || rdata[3] >= e){
				
				ri.alternateEndings = [];
				for(var j=3;j<rdata.length;j+=2) {
					//ri.alternateEndings.push(rdata[j]);
					var n = rdata[j];
					var repeatNumBits = rdata[j+1];

					for (var k = 0; k < 8; k++) {
						if ((repeatNumBits & (1 << k)) != 0) {
							ri.alternateEndings[k] = n;
						}
					}

				}
			}

		}
		this.staffIterator.measureNumToRepeatInfoMap[rdata[0]+""] = ri;
		this.staffIterator.measureNumToRepeatInfoMap[rdata[1]+""] = ri;
	}

};

TabTool.prototype.onstep = function() {
	//consolewrp.log( "rate: " + this.playStepper.rate );

	if(false){
		
		$("#alphaIndex button:first").css("background", this.c);

		if(this.c == "#fff") this.c = "#000";
		else this.c = "#fff";
		//consolewrp.log( "c: " + 960/this.durationFactor * this.playStepper.rate);

		//setTimeout( this.beatCallBackFunc, 1000);//960/this.durationFactor * this.playStepper.rate);
		setTimeout( this.beatCallBackFunc, 960/this.durationFactor * this.playStepper.rate);
	}

	//if(false)
	if(this.staffIterator.hasStaffs() ) {
		this.doBeat();	
	} else {

		if(!this.tabViewPortal.doScrollStep()) {
			this.stopPlayer();
		}
	}
};

TabTool.prototype.setTempo = function(percent) {

		this.playStepper.rate = (this.playStepper.max - this.playStepper.max * percent)/3 + 104;

		if(audioProcessor){
			var tempo = 232.5 - (((960)/this.durationFactor * this.playStepper.rate)/1000 * 60);	

			this.initAudio(tempo);
			this.processAudio();
			consolewrp.log( "tempo: " + tempo );
			$("#tempoValueDisp").text(Math.round(tempo)+"");
		}
		



	//consolewrp.log( "rate: " + this.playStepper.rate );
	//consolewrp.log( "durationFactor: " + this.durationFactor );
	//consolewrp.log( "c: " + 960/this.durationFactor * this.playStepper.rate);
};

TabTool.prototype.showPointer = function() {
	this.tabViewPortal.showPointer();

};

TabTool.prototype.setStaffIterator = function(json) {
	
	this.amountScrolled=0;

	this.staffIterator=new StaffIterator('image');
	this.staffIterator.parseTabNEWinit();
	this.staffIterator.parseTabNEW( json );						    
	
};

TabTool.prototype.toggleplay = function(  ) {
	
	if(this.stopped) {

		//this.staffIterator.debug();

		if(this.loopMode) {
			this.waiting = true;
			this.setLoopStart();
			//this.startLoopPointerIcon.hide();
			//this.endLoopPointerIcon.hide();
		}

        if(this.hasAudio){
			audioProcessor.stopIt();
		} else {
			this.playStepper.start();			
		}


		//theNeckWin.bringToFront();

		//audioProcessor.setBeat(this.tp);

		//this.playStepper.start();

		$("#play")
			.button({text: false, icons: { primary:  "ui-icon-pause" }});

	} else {
        if(this.hasAudio){
			audioProcessor.stopIt();
		} else {
			this.playStepper.stop();
		}
		//
		$("#pointer").hide();

		$("#play")
			.button({text: false, icons: { primary:  "ui-icon-play" }});


	}
	this.stopped = !this.stopped;
	
};

TabTool.prototype.stopPlayer = function(  ) {
	this.playStepper.stop();
	//|this.tabCntrlBorder.tabCntrl.stopPlay();
	this.stopped = true;
};

TabTool.prototype.gotoStaff = function( si,bi,isLoopend,isPlay ) {

	this.currBeatInfo = this.staffIterator.setAndAdjust(si,bi);

	//				if(!this.loopMode) {
	//					this.staffIterator.prev();
	//				}

    this.tabViewPortal.goToStaff(si, bi, 1, isLoopend,isPlay);
	
};

TabTool.prototype.setStart = function(  ) {
			
	this.staffIterator.setToCurrStaffStart();
				//consolewrp.log("SetStaff Start: " );
				//staffIterator.debug();
			
};


TabTool.prototype.doBeat = function( timeOffset ) {

	
	//consolewrp.log("doBeat: ");

	//var p = (this.doTime)? pulse(this.neck): doStep(this.neck, 1,true);
	var p = this.doStep(1,timeOffset);

	if(p == null) {
		consolewrp.log("end of the zong: ");
		
		if(!this.loopMode) {
			this.playStepper.stop();
			//|this.tabCntrlBorder.tabCntrl.stopPlay();
			this.stopped = true;
			this.gotoStaff(0,0,false,false);
			this.staffIterator.currBeatInfoListIndex=-1;
			//|var ts = 0;
			//|for(ts in this.staffIterator.measureNumToRepeatInfoMap) {
			//|this.staffIterator.measureNumToRepeatInfoMap[ts].reset();
			//|}
			this.staffIterator.currRepeatInfo = null;

		} else {
			consolewrp.log("looping - goto start ");
		}
		


	} else if(!this.stopped) {

		if(this.staffIterator.hasStaffs() ) {
			if(this.playStepper.running) {
				this.playStepper.stop();
			}
			var duration = this.staffIterator.currBeatInfo.getDuration();

			//this.staffIterator.currBeatInfo.debug();

			
			//consolewrp.log("duration: " + 960 +  "  wait: " + ((960)/this.durationFactor * this.playStepper.rate));
			//consolewrp.log("duration: " + duration +  "  wait: " + ((duration)/this.durationFactor * this.playStepper.rate));
			
			//doBeat();
			setTimeout( this.beatCallBackFunc, (duration)/this.durationFactor * this.playStepper.rate);
		}
	}

	//this.staffIterator.debug();

	
	
};

TabTool.prototype.isLoopEnd = function(  ) {

	//consolewrp.log( "===========loopModeEndBeatInfo: " + loopModeEndBeatInfo );
	//this.loopModeEndBeatInfo.debug();
	//this.loopModeStartBeatInfo.debug();

	if(this.loopModeEndBeatInfo.isAfter(this.loopModeStartBeatInfo)) {
		return this.staffIterator.isAfter(this.loopModeEndBeatInfo);
	} else {
		return this.staffIterator.isAfter(this.loopModeEndBeatInfo) && this.staffIterator.isBefore(this.loopModeStartBeatInfo);
	}
	
};

var nnnn=0;
TabTool.prototype.doStep = function( numSteps, timeOffset ) {

	var beatInfo = null;
	var movedToNextStaff = false;
	//consolewrp.log("numsteps: " + numSteps);
	//this.staffIterator.debug();
	for(var i = 0; i < numSteps; ++i ) {

		beatInfo = this.staffIterator.next(true);

		//consolewrp.log("beatInfo: " + beatInfo);

		//consolewrp.log( "nnnn: " + nnnn );
		if(beatInfo == null) {

			if( numSteps > 1) {

				// in this case we have come to the start or end before numsteps is used up, 
				// so take the start or end beat
				beatInfo = this.staffIterator.currBeatInfo;
				break;
			} 
			return null;
		}

		this.tp += beatInfo.duration/960;
		//consolewrp.log( "tp: " + this.tp );

		if(this.loopMode && this.isLoopEnd() ) {
			this.setLoopStart();
			beatInfo = this.staffIterator.getCurrBeat();
		}
		movedToNextStaff |= this.checkNextStaff();

	}

	//consolewrp.log("final beatInfo: ");
	//beatInfo.debug();

	//return beatInfo;
	var retval = this.displayBeat(beatInfo, true, !this.stopped);
	if(movedToNextStaff){
		this.tabViewPortal.nudgeScore();
	}
	return retval;
	
	
};

TabTool.prototype.doStep2 = function( numSteps, timeOffset ) {

	var beatInfo = null;
	var movedToNextStaff = false;
	//consolewrp.log("numsteps: " + numSteps);
	//this.staffIterator.debug();

	if(this.currBeatInfo == null){
		this.currBeatInfo = this.staffIterator.next(true);		
	}

	if(timeOffset>=this.tp){
		//consolewrp.log( "timeOffset: " + timeOffset );
		//consolewrp.log( "tp: " + this.tp );
		movedToNextStaff |= this.checkNextStaff();
		
		var retval = this.displayBeat(this.currBeatInfo, true, !this.stopped);
		if(movedToNextStaff){
			this.tabViewPortal.nudgeScore();
		}
		if(this.currBeatInfo){
			this.tp += this.currBeatInfo.duration/960;
			//consolewrp.log( "tp: " + this.tp );
		}
		//this.currBeatInfo = this.staffIterator.next(true);		
		if(this.loopMode && this.isLoopEnd() ) {
			this.setLoopStart();
			this.currBeatInfo = this.staffIterator.getCurrBeat();
		} else {
			this.currBeatInfo = this.staffIterator.next(true);		
		}


	}



	//consolewrp.log("final beatInfo: ");
	//beatInfo.debug();

	//return beatInfo;

	return retval;
	
	
};


TabTool.prototype.backStep = function( numSteps ) {
	var movedToPrevStaff = false;

	if(typeof numSteps == "undefined" || numSteps == null ) {
		numSteps = 1;
	}
	var beatInfo = null;

	for(var i = 0; i < numSteps; ++i ) {

		beatInfo = this.staffIterator.prev();
		if(this.loopMode && this.isLoopEnd() ) {
			this.setLoopStart();
			beatInfo = this.staffIterator.next(true);
		}
		movedToPrevStaff |= this.checkPrevStaff();

		if(beatInfo == null && numSteps > 1) {
		}

		if(beatInfo == null) {
			beatInfo = this.staffIterator.currBeatInfo;
			this.setStart();
			break;
		}
	}
	var retval = this.displayBeat(beatInfo, true, !this.stopped);
	if(movedToPrevStaff){
		this.tabViewPortal.nudgeScore();
	}
	return retval;
//	return this.displayBeat(beatInfo, true, !this.stopped);
	
	
};


TabTool.prototype.handleRotate = function( orientation ) {
	this.tabViewPortal.handleRotate(orientation);
};


TabTool.prototype.checkNextStaff = function(  ) {

	if(this.staffIterator.movedToNewStaff()) {

		//var beforeText = getTextAt(this.staffIterator.staffIndex-1);
		//var afterText  = getTextAt(this.staffIterator.staffIndex);
		
		var staffYpos = this.tabViewPortal.forwardStaff();  //(afterText, beforeText);
		return true;
	}
	return false;
	
	
};

TabTool.prototype.checkPrevStaff = function(  ) {

	
	if(this.staffIterator.movedToNewStaff()) {

		//var beforeText = getTextAt(this.staffIterator.staffIndex-1);
		//var afterText = getTextAt(this.staffIterator.staffIndex);

		var staffYpos = this.tabViewPortal.backStaff(); //(afterText, beforeText);
		return true;
	}
	return false;
	
};


TabTool.prototype.getDuration = function( d ) {
	return (d)/this.durationFactor * this.playStepper.rate;
};


TabTool.prototype.displayBeat = function( beatInfo, doAnim, isPlaying ) {

	
	if( beatInfo != null ) {

		this.neck.clearLastChord();

        if(beatInfo.notes != null) {
			var d = (beatInfo.duration)/this.durationFactor * this.playStepper.rate;
			if(this.traceMode) {
				
				if(typeof this.traceChordArray != "undefined" && this.traceChordArray != null) {
					this.traceChordArray = getChordTraceArray(this.traceChordArray,this.staffIterator.clone());
				} else {
					this.traceChordArray = getChordTraceArray(null, this.staffIterator.clone());
				}

				this.neck.markFrets(this.traceChordArray,-1, true, d, doAnim);
			}

			this.neck.markFrets(beatInfo.notes,-1,false, d, doAnim);
		}
		if( beatInfo.has2DigitNotes ){
			this.tabViewPortal.setPosition(this.staffIterator.staffIndex,this.staffIterator.currBeatInfoListIndex,2, beatInfo, isPlaying);

		} else {
			this.tabViewPortal.setPosition(this.staffIterator.staffIndex,this.staffIterator.currBeatInfoListIndex,1, beatInfo, isPlaying);

		}
		return beatInfo;

	}	
	return null;
	
	
};

TabTool.prototype.onloopMode = function(  ) {
	this.loopMode = !this.loopMode;
	if(this.loopMode) {
		this.toggleLoopStart(true);
	} else {
		this.stopLooping();
	}
	
};



TabTool.prototype.stopLooping = function(  ) {

	

	this.loopMode = false;

	this.startLoopPointerIcon.hide();
	this.endLoopPointerIcon.hide();

	//startLoopPointerIcon.locked =  false;
	//endLoopPointerIcon.locked =  false;

	//this.tabCntrlBorder.tabCntrl.top.loopOffButton.enabled =  false;
	
	//this.setMarkings(0x000000);

	this.loopModeStartBeatInfo = null;
	this.loopModeEndBeatInfo = null;
	
	//this.tabView.tabdisplay.endLoopMode();
	
	
};

TabTool.prototype.toggleLoopStart = function( isStart ) {

	
	this.loopModeSetStart = isStart;

	//consolewrp.log(this.tabCntrlBorder.tabCntrl);
	//consolewrp.log(this.tabCntrlBorder.tabCntrl.bottom.loopOffButton);
    
	//this.tabCntrlBorder.tabCntrl.top.loopOffButton.enabled =  true;
	//this.tabCntrlBorder.tabCntrl.top.loopOffButton.enabled =  false;

	var icon = null;
	if(isStart) {
		icon = this.startLoopPointerIcon;
		//endLoopPointerIcon.hide();
	} else {
		//startLoopPointerIcon.hide();
		icon = endLoopPointerIcon;
	}
	this.tabViewPortal.handleLoopStart(icon);
	this.loopMode = true;
	
	
};

TabTool.prototype.setLoopStart = function(  ) {

	
	//this.gotoStaff(this.loopModeStartBeatInfo.staffIndex, this.loopModeStartBeatInfo.arrayIndex,false,false); 

	this.updatePosition(this.loopModeStartBeatInfo.staffIndex, this.loopModeStartBeatInfo.arrayIndex,false,false, true);

	//this.staffIterator.setAndAdjust(this.loopModeStartBeatInfo.staffIndex, this.loopModeStartBeatInfo.arrayIndex); 
	//this.staffIndex.prev();

	//this.tabView.tabdisplay.goToStaff(this.loopModeStartBeatInfo.staffIndex, this.loopModeStartBeatInfo.arrayIndex, 1);
	
};


TabTool.prototype.setLoopPosition = function( si, bi ) {
	
	//consolewrp.log("bi: " + bi + "  si: " + si);

	this.lastBeatIndexClicked  = bi;
	this.lastStaffIndexClicked = si;

	var dispBeatInfo = null;

	if(this.loopMode || this.edit) {
		//this.setMarkings(0x000000);

		if(this.loopModeSetStart) {

            if(this.loopModeEndBeatInfo!=null) {
				//qwin.warning("To change loop positions, turn looping off and on again, then set new positions.");
				return;
			}

			this.loopModeStartBeatInfo = this.staffIterator.getBeat(si,bi);
			this.loopModeStartBeatInfo.arrayIndex = bi;

			//this.loopModeStartBeatInfo.debug();

			dispBeatInfo = this.loopModeStartBeatInfo;

			//if(!this.loopMode && this.edit ) { // && this.loopModeSetStart) {
			this.loopModeEndBeatInfo = null;
			//}

            this.gotoStaff(si,bi, false,false);
			//startLoopPointerIcon.locked =  true;

			//this.startLoopPointerIcon.hide();
			this.endLoopPointerIcon.show();

			this.tabViewPortal.handleLoopStart(this.endLoopPointerIcon);

			//this.tabView.tabdisplay.markStaff(this.loopModeStartBeatInfo.staffIndex, 
			//        this.loopModeStartBeatInfo.arrayIndex, this.loopModeStartBeatInfo.arrayIndex+1, c);


		} else {

			consolewrp.log( "loopModeEndBeatInfo: " + this.loopModeEndBeatInfo );
            if(this.loopModeEndBeatInfo!=null) {
				qwin.warning("To change loop positions, turn looping off and on again, then set new positions.");
				return;
			}

			this.loopModeEndBeatInfo = this.staffIterator.getBeat(si,bi);
			this.loopModeEndBeatInfo.arrayIndex = bi;

			//consolewrp.log("set End");
			//this.loopModeEndBeatInfo.debug();

			dispBeatInfo = this.loopModeEndBeatInfo;						

            this.gotoStaff(si,bi, true, false);
			//this.endLoopPointerIcon.hide();

            //|this.gotoStaff(this.loopModeStartBeatInfo.staffIndex, this.loopModeStartBeatInfo.arrayIndex, false, false); 

			//endLoopPointerIcon.locked =  true;
			//this.tabView.tabdisplay.markStaff(this.loopModeEndBeatInfo.staffIndex, 
            //this.loopModeEndBeatInfo.arrayIndex, this.loopModeEndBeatInfo.arrayIndex+1, c);
		}

		if(!this.loopMode && this.edit) {
			//this.setMarkings(0x00FFFF);
			//if( !this.markLock ) this.loopModeSetStart = !this.loopModeSetStart;
		} else {
			//this.setMarkings(0x00FF00);
			this.loopModeSetStart = !this.loopModeSetStart;
		}

	} 
	if(!this.loopMode) {
		this.gotoStaff(si,bi,false,false);
	}

	if(dispBeatInfo!=null){
		//consolewrp.log( "----------- xxx dispBeatInfo: " + dispBeatInfo );
		//this.displayBeat(dispBeatInfo,false, false);
		//this.editController.setCurrBeatInfo(dispBeatInfo);
	}
	
};

TabTool.prototype.resizeHeight = function(  ) {
	return this.tabViewPortal.resizeHeight();
};


function getCssPosAsInt(cssPos){
	
	if(typeof cssPos == 'string' && cssPos.substring(cssPos.length-2) == "px") {
		return parseInt(cssPos.substring(0, cssPos.length-2));
	}
	return cssPos;
}


HighLightBar = function(selector, offset, pageHeight) {
	this.selector = selector;
	this.xoffset = HLBxoffset1;
	this.yoffset = 33;

	this.realX = 0;

	this.realY = 0;
	this.visibleX = 0;

	this.visibleY = 0;

	this.minX = offset.left;

	this.minY = offset.top;

	this.maxX = offset.left+1000;
	this.maxY = offset.top+pageHeight+17;
	this.jqObj = $(this.selector);
	this.fullHeight = getCssPosAsInt(this.jqObj.css("height"));
	this.currHeight = this.fullHeight;

	this.jqObj.css("position", "absolute");
	this.visible = false;
};

HighLightBar.prototype.setPosition = function(x,y) {
	var scrollBarXOffset = scrollBarPresent? -20:-10;
	//consolewrp.log( "scrollBarXOffset: " + scrollBarXOffset );
	this.realX = x+this.xoffset+scrollBarXOffset;
	this.realY = y+this.yoffset;
	this.visibleX = this.realX;
	this.visibleY = this.realY;

	this.showPointer();

//	this.jqObj.css({left: (x+this.xoffset) + "px", top:  (y+this.yoffset) + "px"});

	this.show();
};

HighLightBar.prototype.show = function() {
	this.jqObj.css({height: this.fullHeight + "px"}).show();
	this.visible = true;
};

HighLightBar.prototype.hide = function() {
	this.jqObj.hide();
	this.visible = false;
};

HighLightBar.prototype.showPointer = function() {
	this.jqObj.css({left: this.realX + "px", top:  this.realY + "px"});
	//this.debug();
};

HighLightBar.prototype.debug = function() {
//	consolewrp.log( "visibleX: " + visibleX + ", " + visibleY );

//	consolewrp.log( "visibleX: " + this.visibleX);
//	consolewrp.log( "visibleY: " + this.visibleY);
//	consolewrp.log( "minX: " + this.minX );
//	consolewrp.log( "minY: " + this.minY );
	consolewrp.log( "realX: " + this.realX );
	consolewrp.log( "xoffset: " + this.xoffset );
	//consolewrp.log( "yoffset: " + this.offset );
//	consolewrp.log( "realY: " + this.realY );
};

HighLightBar.prototype.css = function(p1,p2) {
	return p2? this.jqObj.css(p1,p2):this.jqObj.css(p1);
};

HighLightBar.prototype.adjustHeight = function(ydiff) {

	this.maxY += ydiff;

	if(this.realY > this.maxY ) {
		this.currHeight = 0;
	} else if(this.realY >= this.maxY - this.fullHeight) {
		this.currHeight = this.maxY-this.realY;
	} else {
		this.currHeight = this.fullHeight;
	}

	//consolewrp.log( "currHeight: " + this.currHeight );
	if(this.currHeight > 0) {
		this.jqObj.css({left: (this.visibleX) + "px", top:  (this.visibleY) + "px", 
						height:  (this.currHeight) + "px"});
	} else {
		this.currHeight = 0;
		this.jqObj.css("height",  (this.currHeight) + "px");
	}
};

HighLightBar.prototype.adjust = function(xdiff,ydiff) {

	this.realX += xdiff;
	this.realY += ydiff;

	this.visibleX = this.realX;
	this.visibleY = this.realY;

	if(this.realY < this.minY) {
		this.visibleY = this.minY;
		this.currHeight = this.fullHeight - (this.minY-this.realY);
		if(this.currHeight < 0) this.currHeight = 0;
	} else if(this.realY > this.maxY ) {
		this.currHeight = 0;
	} else if(this.realY >= this.maxY - this.fullHeight) {
		this.currHeight = this.maxY-this.realY;
	} else {
		this.currHeight = this.fullHeight;
	}

	//consolewrp.log( "currHeight: " + this.currHeight );

	if(this.currHeight > 0) {
		this.jqObj.css({left: (this.visibleX) + "px", top:  (this.visibleY) + "px", 
						height:  (this.currHeight) + "px"});
	} else {
		this.currHeight = 0;
		this.jqObj.css("height",  (this.currHeight) + "px");
	}
};



HighLightBar.prototype.getOffset = function() {
	return this.jqObj.offset();
};


NewTabDisplay = function(parent, options) {
	this.parent = parent? parent: null;
	if(options){
		for(option in options) {
			this[option] = options[option];
		}
	} 
	else {
		options = {};
	}
	if(!options.hasOwnProperty('lineSpacing')){			this.lineSpacing = 12;	}
	if(!options.hasOwnProperty('tabTool')){			this.tabTool = null;	}
	if(!options.hasOwnProperty('staffs')){			this.staffs = null;	}
	if(!options.hasOwnProperty('chordLines')){			this.chordLines = null;	}
	if(!options.hasOwnProperty('tabScrollBar')){			this.tabScrollBar = null;	}
	if(!options.hasOwnProperty('tabScrollBarX')){			this.tabScrollBarX = null;	}
	if(!options.hasOwnProperty('maxLen')){			this.maxLen = 0;	}
	if(!options.hasOwnProperty('textLines')){			this.textLines = null;	}
	if(!options.hasOwnProperty('showText')){			this.showText = true;	}
	if(!options.hasOwnProperty('lastWasRest')){			this.lastWasRest = false;	}
	if(!options.hasOwnProperty('showTabs')){			this.showTabs = true;	}
	if(!options.hasOwnProperty('showChords')){			this.showChords = true;	}
	if(!options.hasOwnProperty('staffIterator')){			this.staffIterator = null;	}
	if(!options.hasOwnProperty('container')){			this.container = null;	}
	if(!options.hasOwnProperty('maxContainerHeight')){			this.maxContainerHeight = 400;	}
	if(!options.hasOwnProperty('staffSpacing')){			this.staffSpacing = 25;	}
	if(!options.hasOwnProperty('numStrings')){			this.numStrings = 6;	}
	if(!options.hasOwnProperty('highlight')){			this.highlight = "blue";	}
	if(!options.hasOwnProperty('loophighlight')){			this.loophighlight = "yellow";	}
	if(!options.hasOwnProperty('fontName')){			this.fontName = "courier";	}
	if(!options.hasOwnProperty('tuningStr')){			this.tuningStr = "EBGDAE";	}
	if(!options.hasOwnProperty('fontSize')){			this.fontSize = 15;	}
	if(!options.hasOwnProperty('currStaffIndex')){			this.currStaffIndex = 0;	}
	if(!options.hasOwnProperty('baseImageName')){			this.baseImageName = "swt";	}
	if(!options.hasOwnProperty('lastMeasureNum')){			this.lastMeasureNum = 0;	}
	if(!options.hasOwnProperty('maxheight')){			this.maxheight = 3200;	}
	if(!options.hasOwnProperty('maxwidth')){			this.maxwidth = 700;	}
	if(!options.hasOwnProperty('lastY')){			this.lastY = -1;	}
	if(!options.hasOwnProperty('rootSelector')){			this.rootSelector = ".tabView";	}
	//if(!options.hasOwnProperty('pageHeight')){			tabDimensions.pageHeight = $(this.rootSelector).css("height");}

	this.rootViewObj = 	$(this.rootSelector);
	//consolewrp.log( "rootSelector: " + this.rootSelector );

	globalCallBacks.push(_.bind(this.doScroll,this));

	this.scrollCallBackFunc = "globalCallBacks[" + (globalCallBacks.length-1) + "]()";
	this.scrollStepper = new stepper(null, {callback: this.scrollCallBackFunc, max: 5000, rate: 10});

	this.numMouseMovesBeforeScrollStop = 0;
	tabDimensions.pageHeight = getCssPosAsInt(tabDimensions.pageHeight);
	consolewrp.log( "pageHeight: " + tabDimensions.pageHeight );

	tabDimensions.maxViewableHeight = tabDimensions.pageHeight;

	this.orientation = "h";
	this.fullHeight = false;
	//tabDimensions.pageHeight -= 40;

	var offset = this.rootViewObj.offset();
	this.xoffset = offset.left;
	this.yoffset = offset.top;
	this.y = 0;
	consolewrp.log( "offset: " + offset.top + ", " + offset.left );

	this.minY = offset.top;
	this.maxY = tabDimensions.pageHeight + offset.top;

	this.currLoopIcon = null;
	this.highLightBar1 = new HighLightBar(options['highLightSelector'], offset, tabDimensions.pageHeight);

	this.startLoopIcon = new HighLightBar("#startLoopIcon", offset, tabDimensions.pageHeight);
	this.endLoopIcon = new HighLightBar("#endLoopIcon", offset, tabDimensions.pageHeight);

	var classroot = this;

	$(window).resize(function() {
						 var offset = classroot.rootViewObj.offset();
						 classroot.xoffset = offset.left;
						 classroot.yoffset = offset.top;
					  });

	this.rootViewObj.click(function(e) {
								   e.preventDefault();

								   //var x = canvas.getMouse('x') - this.getAttributeRelative("x", canvas);
								   //var y = canvas.getMouse('y') - this.getAttributeRelative("y", canvas);
								   var st = classroot.rootViewObj.scrollTop();

								   if(st*-1 != classroot.y){
									   classroot.y = -st;
								   }

								   var offset = classroot.rootViewObj.offset();
								   classroot.handleClick(e.pageX - offset.left-24, e.pageY - offset.top - classroot.y );

							   });

	this.y = 0;

    this.rootViewObj.scroll(function () { 
									var st = classroot.rootViewObj.scrollTop();

									if(st*-1 != classroot.y){

										var ydiff =  st + classroot.y ;
										//consolewrp.log(classroot.y + " - " + st +  " = " + ydiff );
										classroot.y = -st;
										
										classroot.highLightBar1.adjust(0,-ydiff);

										if(classroot.startLoopIcon.visible && classroot.startLoopIcon != classroot.currLoopIcon) classroot.startLoopIcon.adjust(0,-ydiff);
										if(classroot.endLoopIcon.visible  && classroot.endLoopIcon != classroot.currLoopIcon)   classroot.endLoopIcon.adjust(0,-ydiff);

									}

								});

};

NewTabDisplay.prototype.doScroll = function(  ) {

	
	var st = this.rootViewObj.scrollTop();
	this.rootViewObj.scrollTop(st+this.scrollYDiff);
	//consolewrp.log( "doScroll: " + this.scrollStepper.running);
	if(this.scrollStepper.running) {
		setTimeout( this.scrollCallBackFunc, this.scrollStepper.rate);
	}
	
};


NewTabDisplay.prototype.nudgeScore = function(  ) {
	
	var st = this.rootViewObj.scrollTop();
	this.rootViewObj.scrollTop(st+1);
	
};


NewTabDisplay.prototype.showPointer = function() {
	this.highLightBar1.showPointer();

};


NewTabDisplay.prototype.handleLoopStart = function( icon ) {
	this.currLoopIcon = icon;
	//icon.show();
	var iconH = icon.fullHeight/2;
	var classroot = this;
 	this.rootViewObj
		.bind("mousemove",
			  function(e){
				  if(classroot.scrollStepper.running) {
					  if(++classroot.numMouseMovesBeforeScrollStop > 10 ) {
						  classroot.scrollStepper.stop();
						  classroot.numMouseMovesBeforeScrollStop = 0;
					  }
					  //consolewrp.log( "mousemove: " + classroot.scrollStepper.running);
				  } else if(classroot.currLoopIcon != null){
	
					  //consolewrp.log( "e: " + e.pageX );
					  var yExtensionBottom = e.pageY + iconH - classroot.maxY;
					  var yExtensionTop = e.pageY - iconH - classroot.minY;

					  //consolewrp.log( "yExtensionBottom: " + yExtensionBottom + ", " + classroot.maxY);
					  //consolewrp.log( "iconH: " + iconH );
					  //consolewrp.log( "pageY: " + e.pageY + ", " + classroot.minY );

					  if(!classroot.currLoopIcon.visible){
						  classroot.currLoopIcon.css({top: (e.pageY-iconH)+"px", left: (e.pageX+20)+"px"});
						  classroot.currLoopIcon.show();

					  } else if(yExtensionBottom > 0 ) {
						  //var st = classroot.rootViewObj.scrollTop();
						  classroot.scrollYDiff = yExtensionBottom/4;
						  classroot.scrollStepper.start();
						  //classroot.rootViewObj.scrollTop(st+yExtensionBottom/2);

						  //consolewrp.log( "yExtensionBottom: " + yExtensionBottom );
					  } else if( yExtensionTop < 0 ) {
						  //var st = classroot.rootViewObj.scrollTop();
						  //classroot.rootViewObj.scrollTop(st+yExtensionTop/2);
						  classroot.scrollYDiff = yExtensionTop/4;
						  classroot.scrollStepper.start();

						  //consolewrp.log( "yExtensionTop: " + yExtensionTop );
						  //classroot.rootViewObj.scrollTop(st-(classroot.minY-e.pageY+20));
					  } else {
						  //icon.css("top", e.pageY-iconH + "px").css("left", e.pageX+20 + "px");
						  classroot.currLoopIcon.css({top: (e.pageY-iconH)+"px", left: (e.pageX+20)+"px"});
						  classroot.scrollStepper.stop();
						  //consolewrp.log( "e: " + (e.pageY-iconH)  + ", " + (e.pageX+20)+"px");
					  }
				  }
			  });
};


NewTabDisplay.prototype.handleClick = function( x,y ) {

	var imageY = y;

	var si = 0;
	var bi = 0;

	var tp = 0;

    // get staff index
	for( ; si < this.staffIterator.staffInfoList.length; ++si ) {


		//consolewrp.log( si + " > this siy: " + this.staffIterator.staffInfoList[si].y1 );

		if( imageY < (this.staffIterator.staffInfoList[si].y1)) {
				
 			//&&
			//imageY < (this.staffIterator.staffInfoList[si].y2+50) ) {
			si = si>0?si-1:0;
			break;
		}


	}

	if(si == this.staffIterator.staffInfoList.length) {
		si = this.staffIterator.staffInfoList.length -1;
	}

	if(false){
		
	for(var i =0 ; i < si; ++i ) {
		tp += this.staffIterator.staffInfoList[i].getStaffDuration(0);///960;
		//consolewrp.log( "tp: " + tp );
	}

	tp = tp/960;
	}


    // get beat index
	if( si >= 0 && si < this.staffIterator.staffInfoList.length ) {

		var bil = this.staffIterator.staffInfoList[si].beatInfoList;

		for(; bi < bil.length; ++bi ) {
			//consolewrp.log( bi + " bil.x: " + bil[bi].x );

            if( x < (bil[bi].x-10) ) {
				//if(bi>0)
				//--bi;
				break;
			}
			tp += bil[bi].duration/960;
			consolewrp.log( "tp: " + tp );
		}
	}
	if(bi == bil.length) {
		bi = bil.length-1;
	}

	consolewrp.log( "si: " + si );
	consolewrp.log( "bi: " + bi );
	//consolewrp.log( "tp: " + tp );

	this.tabTool.updatePosition(si, bi,false,false);
};


NewTabDisplay.prototype.goToStaff = function( si,pos,len, isLoopingEnd,isPlay ) {
	
	
	var posY1 = this.staffIterator.staffInfoList[this.staffIterator.staffIndex].y1;
	consolewrp.log( "posY1: " + posY1 );
	var posY2 = this.staffIterator.staffInfoList[this.staffIterator.staffIndex].y2;

    var y = this.y;
	consolewrp.log( "y: " + y );
	var d1 = posY1+y;
	var d2 = posY2+y;
	consolewrp.log( "d2: " + d2 );

	if( d1 < 0 || d2 > tabDimensions.maxViewableHeight-80) {
		var st = posY1-tabDimensions.maxViewableHeight/2;
		this.rootViewObj.scrollTop(st);

		var ydiff =  st + this.y ;

		if(this.startLoopIcon.visible && this.startLoopIcon != this.currLoopIcon) this.startLoopIcon.adjust(0,-ydiff);
		if(this.endLoopIcon.visible  && this.endLoopIcon != this.currLoopIcon)   this.endLoopIcon.adjust(0,-ydiff);

		this.y =  -posY1+tabDimensions.maxViewableHeight/2;;


	}

	this.lastY=posY2;

	var bil = this.staffIterator.staffInfoList[si].beatInfoList;
	if(typeof isPlay == "undefined" ) isPlay = false;
    this.setPosition(si, 0,0, bil[pos],isPlay, isLoopingEnd);

	
	
};

NewTabDisplay.prototype.handleRotate = function( orientation ) {
	var offset = this.rootViewObj.offset();
	this.orientation = orientation;
//		this.highLightBar1.setPosition(this.xoffset+ x, this.yoffset + y1 + this.y);
    var xdiff = offset.left - this.xoffset;
	var ydiff = offset.top - this.yoffset;

	this.xoffset = offset.left;
	this.yoffset = offset.top;

	this.highLightBar1.minY = offset.top;
	this.startLoopIcon.minY = offset.top;
	this.endLoopIcon.minY = offset.top;


	if( orientation == "h") {
//		this.highLightBar1.yoffset = 33;
//		this.highLightBar1.xoffset = 25;

		tabDimensions.maxViewableHeight -= 150;

		this.highLightBar1.xoffset = HLBxoffset1;
		this.startLoopIcon.xoffset = HLBxoffset1;
		this.endLoopIcon.xoffset = HLBxoffset1;

		xdiff+=10;
	} else {

		tabDimensions.maxViewableHeight += 150;

		this.highLightBar1.xoffset = HLBxoffset2;

		this.startLoopIcon.xoffset = HLBxoffset2;
		this.endLoopIcon.xoffset = HLBxoffset2;

		xdiff-=10;

//		this.highLightBar1.yoffset = -123;
//		this.highLightBar1.xoffset = 15;
	}

	if(!this.fullHeight) {
		this.rootViewObj.css('height', tabDimensions.maxViewableHeight + "px");
		tabDimensions.pageHeight = tabDimensions.maxViewableHeight;
		$("#tabtab").css("height", (tabDimensions.pageHeight+tabDimensions.diff) + "px");
	}

	this.startLoopIcon.adjust(xdiff,ydiff);
	this.endLoopIcon.adjust(xdiff,ydiff);
	this.highLightBar1.adjust(xdiff,ydiff);

	this.maxY = tabDimensions.pageHeight + offset.top;
	this.minY = offset.top;


};

NewTabDisplay.prototype.resizeHeight = function(  ) {
	var h = $(this.rootSelector + " img").height() + 40;
	var ydiff = 0;

	this.fullHeight = !this.fullHeight;
	scrollBarPresent = !this.fullHeight;

	if(this.fullHeight){
		ydiff = h - tabDimensions.pageHeight;
		
		tabDimensions.pageHeight = h;
		$(this.rootSelector + " div").height(2*h);
		//tabDimensions.maxViewableHeight = tabDimensions.pageHeight;

	} else if(this.orientation == "h") {

		tabDimensions.pageHeight = 500;
		ydiff = tabDimensions.pageHeight - h;
		tabDimensions.maxViewableHeight = tabDimensions.pageHeight;

	} else {

		tabDimensions.pageHeight = 650;
		ydiff = tabDimensions.pageHeight - h;
		tabDimensions.maxViewableHeight = tabDimensions.pageHeight;

	}

	this.rootViewObj.css("height", tabDimensions.pageHeight + "px");
	$("#tabtab").css("height", (tabDimensions.pageHeight+tabDimensions.diff) + "px");
	
	this.highLightBar1.adjustHeight(ydiff);
	this.startLoopIcon.adjustHeight(ydiff);
	this.endLoopIcon.adjustHeight(ydiff);


	return this.fullHeight;
};


NewTabDisplay.prototype.forwardStaff = function(  ) {
	
	
	var posY1 = this.staffIterator.staffInfoList[this.staffIterator.staffIndex].y1;
	var posY2 = this.staffIterator.staffInfoList[this.staffIterator.staffIndex].y2;

//|    if(tabChoiceGroup.value==0) { // tab and score
//|		posY2 += 40;
//|	}

    if( posY2 != this.lastY ) {

        var y = this.y;
		var d = posY2+y;

		if( d > tabDimensions.maxViewableHeight - this.highLightBar1.fullHeight - 30 ) { //this.tabScrollBar.pageHeight ) {
			consolewrp.log( "d: " + d );
			//consolewrp.log( "pageHeight: " + this.tabScrollBar.pageHeight );
			//$('#tabViewScrollDiv').css('top', "-" + posY1 + "px");
			this.rootViewObj.scrollTop(posY1);

			this.lastY=posY2;
			this.y=-posY1;
		}

    }
	return posY1;
	
	
};

NewTabDisplay.prototype.backStaff = function(  ) {
	
	
	var posY = this.staffIterator.staffIndex==0? 0:this.staffIterator.staffInfoList[this.staffIterator.staffIndex].y1;

    if( posY != this.lastY ) {

        var y = this.y;
		var d = posY+y;

		if( d < 0 ) {
			this.rootViewObj.scrollTop(posY);
		}

		this.lastY=posY;
		this.y=-posY;

    }
	return posY;
	
	
};



NewTabDisplay.prototype.setStaffs = function( chordLib, baseImageName, numImages, maxWidth ) {

	baseImageName = itabHost + baseImageName;

	this["baseImageName"] =  baseImageName;
	this["maxwidth"]  = maxWidth;

	//consolewrp.log( "for: " + numImages );
	for( var i = 1; i <= numImages; ++i ) {

        //this.subviews[i-1].setSource(this.baseImageName + i + ".swf");

		//|new lz.ResourceView(this, {"sourceurl":  this.baseImageName + i + ".swf", "tabDisp": this, "imageNum":  i-1});

        consolewrp.log(this.baseImageName + i + ".swf");
	}
	
	this.width =  maxWidth;
};


NewTabDisplay.prototype.setStaffIterator = function( staffIterator,chordLib,numStrings, type, tuning ) {

	
	this.staffIterator = staffIterator;
	
	if(this.staffIterator.staffInfoList != null && this.staffIterator.staffInfoList.length > 0 &&
	   this.staffIterator.staffInfoList[0].beatInfoList != null &&
	   this.staffIterator.staffInfoList[0].beatInfoList.length > 0) {

		//this.setPosition(0,0);
		//|this.highLightBar1.setAttribute("visible",true);
		//|this.highLightBar1.bringToFront();
		//|this.setPosition(0,0,0,this.staffIterator.staffInfoList[0].beatInfoList[0],false,false);
		//|this.setAttribute('y', 0);

	}
	
	
};



NewTabDisplay.prototype.setPosition = function( si,pos,len, beatInfo, isPlaying, isLoopingEnd ) {

    var y1 = this.staffIterator.staffInfoList[this.staffIterator.staffIndex].y1;
    var y2 = this.staffIterator.staffInfoList[this.staffIterator.staffIndex].y2;
	var x = beatInfo.x;

    var m = beatInfo.m;

	//consolewrp.log( "m: " + m  + "  this.lastMeasureNum: " + this.lastMeasureNum );

    if(beatInfo.m != 0) {

		//beatInfo.debug();

		if(isPlaying && beatInfo.notes== null) {

			if(!this.lastWasRest) {
				this.lastWasRest = true;
				//|this.highLightBar1.setAttribute('opacity', 0.4);
			}

			if(m == this.lastMeasureNum || !this.staffIterator.timeSigHandler.isRestMeasure(m)) {
				//consolewrp.log( "m is a rest measure: " + m );
				return;
			}

		} else {

			this.lastWasRest = false;
			//|this.highLightBar1.setAttribute('opacity', 1.0);
		}
		
		this.lastMeasureNum = m;
	}
	
	if( this.tabTool.loopMode && this.currLoopIcon != null && typeof isLoopingEnd != "undefined" ) {
		//consolewrp.log( "isLoopingEnd: " + isLoopingEnd );
		//this.currLoopIcon.css({left: (this.xoffset + x)+"px", top: (this.yoffset + y1)+"px"});

		if(this.staffIterator.staffIndex==0){
			this.currLoopIcon.setPosition(this.xoffset+ x, this.yoffset + y1);
		} else {
			this.currLoopIcon.setPosition(this.xoffset+ x, this.yoffset + y1 + this.y);
		}


		if( isLoopingEnd ) {
			this.currLoopIcon = null;
			this.rootViewObj.unbind("movemouse");
			//this.highLightBar1.setPosition(this.xoffset+ x, this.yoffset + y1);

//			this.highLightBar2.setAttribute("visible",true);
//			this.highLightBar2.bringToFront();
//			this.highLightBar2.setAttribute('x', x+10);
//			this.highLightBar2.setAttribute('y', y1);

			
		} else {

//			this.highLightBar3.setAttribute("visible",true);
//			this.highLightBar3.bringToFront();
//			this.highLightBar3.setAttribute('x', x-10);
//			this.highLightBar3.setAttribute('y', y1);

		}
	} else {

		if(this.staffIterator.staffIndex==0){
			this.y = 0;
			this.highLightBar1.setPosition(this.xoffset+ x, this.yoffset + y1);
		} else {
			this.highLightBar1.setPosition(this.xoffset+ x, this.yoffset + y1 + this.y);
		}
	}

	var posX = this.x + x;

    //consolewrp.log( "x: " + x + " this.x: " + this.x + " posX: " + posX + " maxwidth: " + maxwidth );

//|    if( posX > tabWinWidth - 10 && this.maxwidth > tabWinWidth ) {
//|		if( this.maxwidth - x < tabWinWidth ) {
//|			this.setAttribute('x', tabWinWidth - this.maxwidth - 10 );
//|		} else {
//|			this.setAttribute('x', 10 - x );
//|		}
//|    }
//|
//|    if( posX < 0 ) {
//|		var newX = (x < tabWinWidth/2)? 0: -x+10;
//|		this.setAttribute('x', newX );
//|    }
//|	
};

