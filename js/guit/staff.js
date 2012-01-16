
function StaffIterator(type) {
	this.type = type;
	this.staffIndex=0;
	this.maxStaffDuration = 64;

	this.lastRepeatBeatInfo=null;
	this.currBeatInfo=null;
	this.lastBeat=null;
	this.currRepeatInfo = null;
	this.newStaff=false;
	this.tabDisplay=null;

	this.currBeatInfoList=null;
	this.currBeatInfoListIndex=0;
	this.staffInfoList=null;
	this.timeSigHandler=null;
	this.measureNumToRepeatInfoMap = null;
	this.hasRepeats = false;
	this.firstBeatsInMeasure = new Array();

	this.initialize = function() {
		this.staffIndex=-1;
		this.currBeatInfoListIndex=-1;
		this.staffInfoList = new Array();
		this.currBeatInfoList = null;
	}

	this.rewind = function() {
		this.staffIndex=-1;
		this.moveToNextStaff(true);
		this.newStaff = false;
	}

	this.showAllStaffs = function() {
		for( var i = 0; i < this.staffInfoList.length; ++i ) {
			this.staffInfoList[i].debug();
		}
	}


	this.debugCurrStaff = function() {
		if(this.staffIndex > 0 && this.staffIndex < this.staffInfoList.length ) {
			this.staffInfoList[this.staffIndex].debug();
		}
	}

	this.addBeatInfo = function(bi) {
		//consolewrp.log("this.currBeatInfoList: " + this.getCurrStaffDuration() + " : " +  this.maxStaffDuration);

		var bindex = this.getCurrStaffDuration();

		if( bindex >= this.maxStaffDuration ) {
		    bindex -= this.maxStaffDuration;
		}
		bi.index = bindex;

		if(typeof this.currBeatInfoList == "undefined" || this.currBeatInfoList == null 
		   || this.getCurrStaffDuration() >= this.maxStaffDuration) {

			this.staffInfoList.push( new staffInfo(new Array()) );
			this.staffIndex = this.staffInfoList.length-1; 
			this.currBeatInfoList = this.staffInfoList[this.staffIndex].beatInfoList;
		}
		bi.staffIndex = this.staffIndex;
		//this.debug();
		//this.showAllStaffs();
		this.currBeatInfoList.push(bi);
		this.currBeatInfoListIndex = this.currBeatInfoList.length-1;
		if( this.lastBeat != null ) {
			this.lastBeat.updateNextBeatInfo(bi);
		}
		this.lastBeat = bi;
		bi.arrayIndex = this.currBeatInfoList.length-1;
	}
  
	this.addNewStaff = function() {
		this.currBeatInfoList = null;
		this.staffIndex++;
	}

	this.getCurrStaffDuration = function() {
		return this.getStaffDuration(this.staffIndex);
	}

	this.encode = function() {
		var s = " \"staffs\": [\n";
		var comma = "";

		for(var i = 0; i < this.staffInfoList.length; ++i ) {
			s +=  comma + this.staffInfoList[i].encode() + "\n";
			comma = ",";
		}
		return s + "]\n";
	}


	this.getStaffDuration = function(si) {
		if(typeof this.staffInfoList != "undefined" && this.staffInfoList != null && si < this.staffInfoList.length && si >= 0) {
			var d = this.maxStaffDuration;
			for(var i = 0; i <= si; ++i ) {
				d = this.staffInfoList[i].getStaffDuration(d-this.maxStaffDuration);
			}
			return d;
		}
		return 0;
	}

	this.parseTabNEWinit = function() {

		if(typeof this.staffInfoList == "undefined" || this.staffInfoList == null) {
			this.staffInfoList = new Array();
		} else {
			emptyArray(this.staffInfoList);
		}

		this.reset();

		this.staffIndex = -1;

//		this.staffInfoList.push( new staffInfo(new Array()) );
//		this.staffIndex = this.staffInfoList.length-1; 
//		this.currBeatInfoList = this.staffInfoList[this.staffIndex].beatInfoList;
	}

	this.debugStr = "";
	this.parseTabNEW = function(encodedStaffData) {

		var staffs = encodedStaffData["staffs"];
		var measurePositions = null;

//		consolewrp.log("type: " + this.type );

		if(typeof encodedStaffData["m"] != "undefined" && encodedStaffData["m"] != null) {
			measurePositions = encodedStaffData["m"];
			consolewrp.log( "measurePositions: " + measurePositions );
		}

		if(this.type == "new" || this.type == "pwt" || this.type == "image" ) {
			this.currStaffDuration = 0;
			
			if(this.type == "image" ) {
				this.staffInfoList.push( new staffInfo(new Array(), measurePositions, encodedStaffData["y1"], encodedStaffData["y2"]) );
			} else {
				this.staffInfoList.push( new staffInfo(new Array(), measurePositions));
			}
			this.staffIndex = this.staffInfoList.length-1; 
			this.currBeatInfoList = this.staffInfoList[this.staffIndex].beatInfoList;
		}

		//consolewrp.log("len: " + staffs.length);
		for( var si = 0; si < staffs.length; ++si ) {
			//consolewrp.log("xxx>>>" + staffs[si]);
			this.parseStaffNEW(staffs[si], measurePositions, si);
		}
		//consolewrp.log( "debugStr: " + this.debugStr );
		//this.debugStr = "";


	}

	this.parseTabNEWfinish = function() {

		this.currBeatInfoListIndex = -1;
		this.currBeatInfoList = this.staffInfoList[0].beatInfoList;
		this.staffIndex = 0;

		// 

		var lastBI = null;
		for( var i = 0; i < this.staffInfoList.length; ++i ) {

			var bil = this.staffInfoList[i].beatInfoList;
			for( var j = 0; j < bil.length; ++j ) {

				bil[j].buildNoteAnims(this);

				if(lastBI == null || lastBI.m != bil[j].m) {

					if(lastBI != null ) {
						var space = bil[j].m - lastBI.m;
						for(var k = 1; k < space; ++k ) {
							var bi = new beatInfo();
							bi.m = lastBI.m + k;
							this.firstBeatsInMeasure.push(bi);
						}
					}

					this.firstBeatsInMeasure.push(bil[j]);
				} 
				lastBI = bil[j];
			}
		}
	}

	this.parseTab = function(staffs) {

		if(typeof this.staffInfoList == "undefined" || this.staffInfoList == null) {
			this.staffInfoList = new Array();
		} else {
			emptyArray(this.staffInfoList);
		}

		this.reset();

		for( this.staffIndex = 0; this.staffIndex < staffs.length; ++this.staffIndex ) {
			var beatInfoList = this.parseStaff(staffs[this.staffIndex]);
			if(beatInfoList != null) {
				this.staffInfoList.push( new staffInfo(beatInfoList));
			}
		}
		this.currBeatInfoListIndex = -1;
		this.currBeatInfoList = this.staffInfoList[0].beatInfoList;
		this.staffIndex = 0;
	}

	this.hasStaffs = function() {
		return this.staffInfoList && this.staffInfoList.length > 0;
	}

	this.getCurrMeasurePositions = function() {
		if( this.staffIndex >= 0 && this.staffIndex < this.staffInfoList.length) {
			return this.staffInfoList[this.staffIndex].measurePositions;
		}
		return null;
	}

	this.moveToNextStaff = function(toStart) {
		
		if( this.staffIndex >= 0 ) {
			this.staffInfoList[this.staffIndex].resetRepeats();
		}

		

		if( this.staffIndex < this.staffInfoList.length-1) {
			this.staffIndex+=1;

			this.currBeatInfoListIndex=toStart?-1:0;
			this.currBeatInfoList = this.staffInfoList[this.staffIndex].beatInfoList;

			while(this.currBeatInfoList.length == 0 && this.staffIndex < this.staffInfoList.length) {
				this.staffIndex+=1;
				this.currBeatInfoList = this.staffInfoList[this.staffIndex].beatInfoList;
			}

//			if( this.staffIndex > this.staffInfoList.length - 10)  {
//				consolewrp.log( this.currBeatInfoList.length + " ::staffIndex: " + this.staffIndex + " : " + " staffInfoList.length: " + this.staffInfoList.length );
//			}

			if(this.currBeatInfoList.length == 0 && this.staffIndex == this.staffInfoList.length-1) {
				this.newStaff=false;
				return false;
			}

			this.newStaff=true;

		} else {

			this.newStaff=false;
			return false;
		}
		return true;
	}

	this.moveToPrevStaff = function(toStart) {

		if( this.staffIndex > 0 ) {

			this.staffIndex-=1;
			this.currBeatInfoList = this.staffInfoList[this.staffIndex].beatInfoList;

			while(this.currBeatInfoList.length == 0 && this.staffIndex > 0) {
				this.staffIndex-=1;
				this.currBeatInfoList = this.staffInfoList[this.staffIndex].beatInfoList;
			}

			if(toStart) {
				this.currBeatInfoListIndex = -1;
				this.newStaff=false;
				
			} else {
				this.currBeatInfoListIndex = this.currBeatInfoList.length-1;
				this.newStaff=true;
			}

			if(this.currBeatInfoList.length == 0 && this.staffIndex == 0) {
				this.newStaff=false;
				return false;
			}

		} else {
			this.newStaff=false;
			return false;
		}

		return true;
	}

	this.getNumStaffs = function() {
		return this.staffInfoList.length;
	}

	this.moveToStaff = function(index) {

		if( index >= 0 && index < this.staffInfoList.length ) {

			this.staffIndex=index;
			this.currBeatInfoList = this.staffInfoList[this.staffIndex].beatInfoList;

			this.currBeatInfoListIndex = -1;
			this.newStaff=false;

		} else {
			this.newStaff=false;
			return false;
		}

		return true;
	}

	this.getStaffIndex = function() {
		return this.staffIndex;
	}

	this.isBefore = function(beatInfo) {
		return this.currBeatInfo.compare(beatInfo) == -1;
	}

	this.isAfter = function(beatInfo) {
		return this.currBeatInfo.compare(beatInfo) == 1;
	}

	this.samePosition = function(beatInfo) {
		return this.currBeatInfo.samePosition(beatInfo);
	}

	this.setPosition = function(beatInfo) {
		//consolewrp.log( "setPosition: "  + beatInfo.staffIndex + " , " + beatInfo.arrayIndex);
		//beatInfo.debug();
		this.setAndAdjust(beatInfo.staffIndex,beatInfo.arrayIndex);
	}

	this.getNextNBeats = function(beatInfo, n) {
		var si = beatInfo.staffIndex;
		//consolewrp.log( "si: " + si );

		if(si < 0 || si > this.staffInfoList.length) return null;

		var bi = beatInfo.arrayIndex+1;
		//consolewrp.log( "bi: " + bi );
		var beats = new Array();

		while( si < this.staffInfoList.length ) {
			var bil = this.staffInfoList[si].beatInfoList;


			while(bi >= 0 && bi < bil.length) {

				beats.push(bil[bi]);

				if(beats.length == n ) {
					return beats;
				}
				++bi;
			}
			bi = 0;
			si++;
		}
		return null;
	}

	this.getBeatAfterThis = function(beatInfo) {
		var si = beatInfo.staffIndex;
		var bi = beatInfo.arrayIndex+1;
		if( si >= 0 && si < this.staffInfoList.length ) {
			var bil = this.staffInfoList[si];
			if(bi >= 0 && bi < bil.length) {
				return bil[bi];
			} else if( bi >= bil.length) {
				si++;
				if( si < this.staffInfoList.length ) {
					bil = this.staffInfoList[si];
					return bil[0];
				}
			}
		}
		return null;
	}

	this.atEnd = function() {

		if(this.staffIndex==-1 && this.staffInfoList.length==0){
			return true;
		}
		// empty iterator
			// or at end

		consolewrp.log( "atEnd: " + (this.staffInfoList.length-1 == this.staffIndex && this.currBeatInfoList.length-1 == this.currBeatInfoListIndex));

		if(this.staffInfoList.length-1 == this.staffIndex && this.currBeatInfoList.length-1 == this.currBeatInfoListIndex){
			return true;
		}
		return false;
	}

	this.setAndAdjust = function(si,bi) {

		if(si >= 0 && si < this.staffInfoList.length ) {
			if(this.staffIndex != si ) {
				this.staffIndex = si;

				this.currBeatInfoList = this.staffInfoList[this.staffIndex].beatInfoList;
			}

			//     for( var i = 0; i < this.currBeatInfoList.length; ++i ) {
			//     if(this.currBeatInfoList[i].index >= bi) {
			//       this.currBeatInfoListIndex = i-1;
			//       break;
			//     }
			//     }

			if(bi < this.currBeatInfoList.length && bi >= 0) {
				this.currBeatInfoListIndex = bi;
			}
			//consolewrp.log("csbii: " + this.currBeatInfoListIndex + ": " + this.currBeatInfoList.length + ": " + this.currBeatInfoList[this.currBeatInfoList.length-1].index);
			return this.currBeatInfoList[this.currBeatInfoListIndex];
		} 
		return null;
	}  

	this.getClosestBeatInfo = function(beatInfo,dir) {
		var bi = beatInfo.index;
		var si = beatInfo.staffIndex;

		return this.getClosestBeat(si,bi,dir);
	}  

	this.getLastBeatOnStaff = function(si) {
		var beatInfoList = this.staffInfoList[si].beatInfoList;
		return beatInfoList[beatInfoList.length-1];
	}

	this.getIndexOfLastBeat = function(si) {
		var beatInfoList = this.staffInfoList[si].beatInfoList;
		return beatInfoList.length-1;
	}

	this.getFirstBeatOnStaff = function(si) {
		if( si < this.staffInfoList.length ) {
			var beatInfoList = this.staffInfoList[si].beatInfoList;
			return beatInfoList[0];
		}
		return null;
	}

	this.getNumBeatsOnStaff = function(si) {
		var beatInfoList = this.staffInfoList[si].beatInfoList;
		return beatInfoList.length;
	}


	this.getClosestBeat = function(si,bi,dir) {
		if(si >= 0 && si < this.staffInfoList.length ) {
			var beatInfoList = this.staffInfoList[si].beatInfoList;

			if(dir=="before") {
				if(bi < beatInfoList.length ) {
					//if( beatInfoList[i].index >= bi ) {
					var ptr = bi==0?0:bi-1
					return beatInfoList[ptr];
				} 
			} else {
				if(bi < beatInfoList.length - 1) {
					var ptr = bi==0?0:bi-1
					return beatInfoList[ptr];
					return beatInfoList[bi+1];
				} else {
					return beatInfoList[beatInfoList.length - 1];
				}
			}
		}

		//     for( var i = 0; i < beatInfoList.length; ++i ) {
		//     if(dir=="before") {
		//       if( beatInfoList[i].index >= bi ) {
		//       var ptr = i==0?0:i-1
		//       return beatInfoList[ptr];
		//       } 
		//     } else {
		//       if(beatInfoList[i].index > bi) {
		//       return beatInfoList[i];
		//       }
		//     }
		//     }

		return null;
	}

	this.getCurrBeat = function(si,bi) {
		return this.currBeatInfo = this.currBeatInfoList[this.currBeatInfoListIndex];
	}

	this.getBeat = function(si,bi) {
		if(si >= 0 && si < this.staffInfoList.length ) {
			var beatInfoList = this.staffInfoList[si].beatInfoList;

			if(bi>= 0 && bi < beatInfoList.length ) {
				return beatInfoList[bi];
			}
		}
		return null;
	}

	this.debug = function(prefix) {
		consolewrp.log("si: " + this.staffIndex + " currBeatInfoListIndex: " + this.currBeatInfoListIndex + " num staffs: " +  
					this.staffInfoList.length +  " this.currBeatInfoList.length: " + this.currBeatInfoList.length);
	}

	this.movedToNewStaff = function() {
		//consolewrp.log("sl: " + this.currBeatInfoList.length);
		return this.newStaff;
	}

	this.clone = function() {
		var cloneIter = new StaffIterator();
		cloneIter.staffInfoList = this.staffInfoList;
		cloneIter.staffIndex = this.getStaffIndex();
		cloneIter.currBeatInfoListIndex = this.currBeatInfoListIndex;
		cloneIter.currBeatInfoList = this.currBeatInfoList;
		cloneIter.newStaff = this.newStaff;
		//this.showAllStaffs();
		//this.debug();
		//cloneIter.showAllStaffs();
		return cloneIter;
	}

	this.copy = function(iter) {

		this.staffIndex = iter.getStaffIndex();
		this.currBeatInfoListIndex = iter.currBeatInfoListIndex;
		this.currBeatInfoList = iter.currBeatInfoList;
		this.newStaff = iter.newStaff;

	}

	this.getNumStaffsMore = function() {
		return this.staffInfoList.length - this.staffIndex - 1;
	}
	this.reset = function() {
		this.staffIndex = 0;
	}

	this.setToCurrStaffStart = function() {
		this.currBeatInfoListIndex=-1;
		this.newStaff = false;
	}

	this.setPositionByNumBeats = function(nb) {
		var snb = 0;
		var lastStaffTotal = 0;
        
		for(var si = 0; si < this.staffInfoList.length; ++si ) {
			if(snb > nb) {
				this.staffIndex = si-1;
				this.currBeatInfoListIndex = nb - lastStaffTotal-1;
				this.currBeatInfoList = this.staffInfoList[this.staffIndex].beatInfoList;
				break;
			}
			snb += this.staffInfoList[si].beatInfoList.length;
			if(si > 0) {
				lastStaffTotal += this.staffInfoList[si-1].beatInfoList.length;
			}
		}
	}

	this.getBeatDuration = function() {
		var start = this.currBeatInfo.index;
		var end = start+4;
		if(this.currBeatInfoListIndex < this.currBeatInfoList.length-1) {
			end = this.currBeatInfoList[this.currBeatInfoListIndex+1].index;
		} 
		//else if( this.staffIndex < this.staffInfoList.length-1) {
		//   end = this.staffInfoList[this.staffIndex+1].beatInfoList[0].index;
		return end - start;
	}
	


	//   this.nudgeBack = function() {
	//   this.currBeatInfoListIndex--;
	//   }

	//   this.nudgeForward = function() {
	//   this.currBeatInfoListIndex++;
	//   }

	this.next = function(isPlay) {

		if(typeof this.currBeatInfoList == "undefined" || this.currBeatInfoList == null ) {
			this.currBeatInfoListIndex=-1;
		}

		this.currBeatInfoListIndex++;

		//consolewrp.log("currBeatInfoListIndex: " + this.currBeatInfoListIndex + " == " + this.currBeatInfoList.length);

		if(this.currBeatInfoListIndex < this.currBeatInfoList.length) {

			this.newStaff=false;
			this.currBeatInfo = this.currBeatInfoList[this.currBeatInfoListIndex];

		} else if(this.moveToNextStaff() ) {

			//consolewrp.log("xxcurrBeatInfoListIndex: " + this.currBeatInfoListIndex);
			this.currBeatInfo = this.currBeatInfoList[this.currBeatInfoListIndex];

		} else {
			this.currBeatInfoListIndex--;
			return null;
		}

		if(isPlay && this.hasRepeats) {
			this.staffInfoList[this.staffIndex].getRepeatBeat(this,this.currBeatInfo.m);
		}

		return this.currBeatInfo;

	}

	this.prev = function() {

		if(this.currBeatInfoListIndex>=0) {
			this.currBeatInfoListIndex--;
		}
		if(this.currBeatInfoListIndex >= 0) {

			this.newStaff=false;
			this.currBeatInfo = this.currBeatInfoList[this.currBeatInfoListIndex];
			return this.currBeatInfo;

		} else if(this.moveToPrevStaff() ) {

			this.currBeatInfo = this.currBeatInfoList[this.currBeatInfoListIndex];
			return this.currBeatInfo;

		} else {
			this.currBeatInfoListIndex=0;
		}
		return null;
	}

/*
	this.getSpecialChar = function(value) {
		// WE REVERSE (byte) (255 - (code-33) [+ (code>57 ? 10: 0))];
		// so given value = 255 - code + 33
		// => code = 255 - value + 33
		// if code > 47 we add 10 (displaced digits)
		var code = 255 - value + 33;
		code +=  code> 47 ? 10: 0;
		return String.fromCharCode(code);
	}

	this.getPostText = function(value) {
		if(index < staff.length-1 ) {
			var num = staff.charCodeAt(index+1);
			//consolewrp.log("ai: " + num);
			if( num >= 117 && num <= 126) {
				//consolewrp.log(specialSymMap[staff.charAt(index+1)]);
				return specialSymMap[staff.charAt(index+1)];
			}
			return ' ';
		}
	}

New Staff format SHOULD
 get rid of these limitations
  - size of staff
  - tying of visual rep of duration to actual duratoin
  - length of notes 
  - lack of random note length (now tied to index)
  - lack of independent note characteristics within one beat
  - deal with time signatures
  - etc.


  (fret-string),stylization,duration

  sty = 
	if(animInfo.type == NONE) { 
        1;
	} else if(animInfo.type == BEND) {
        5;
	} else if(animInfo.type == SLIDE) {
        10 (up)  11(down);
	} else if(animInfo.type == PULL_OFF) {
        15;
	} else if(animInfo.type == TREMOLO) {
        20;
	} else if(animInfo.type == HARMONIC) {
        25;
	} else if(animInfo.type == WEAK) {
        30;
	}

  duration:   
          length = 1/2^y
             where 
             y = (0,1,2,3,4,5,6,..,9) for w,h,q,e,s,32nd, 64th,..,512th respectively

          modifier range 1-9, where 1 means NO modifier
              currently (triplet,quinteplet,septeplet) or (3,5,7) are encoded as 2,3,4 respectively

          both encoded as one 2 digit integer (d1d2),where d1 = y and d2 = m


  0,sty,[fs1,fs2,fs3,...],(y,m)
  



	this.parseStaffNEW = function(staff) {
		var beatInfoList = new Array();
		var staffArray = decode64(staff);
		var notes = new Array();
		var style = 0;
		var lastNote = null;

		for(var i = 0; i < staffArray.length;) {

			style = staffArray[i];

			while(staffArray[i] != 0) {
				notes.push(staffArray[i++]);
			}
			var durationCode = notes.pop();

			var actualNotes = new Array();
			for(var j = 0; j<notes.length; ++j) {
				var t2 = notes[j];
				var string = Math.floor((t2)/24);
				var fret = (t2)%24;

				var n  = new noteInfo(fret-1,string,0);
				n.animInfo = decodeAnimInfo(style,n);

				// set anim info note params
				if(lastNote != null) {
					var ai = lastNote.animInfo;
					if(ai != null) {
						if(ai.type==SLIDE || ai.type == BEND) {
							ai.endNote = n;
						}
						if(ai.type==PULL_OFF) {
							ai.startNote = n;
						}
					}
				}
				actualNotes.push(n);
			}
			
			lastNote = actualNotes[actualNotes.length-1];

			var y = Math.floor(durationCode/10);
			var m = durationCode%10;

			var newBeatInfo = new beatInfo(currHas2DigitNotes, bi, this.staffIndex, notes);

			newBeatInfo.duration = y;
			newBeatInfo.durationModifier = m;
			
			beatInfoList.push(newBeatInfo);

		}

		return beatInfoList;

	}
*/

//  staff1,staff2,...
//
//  staff = [ { fret, string, style, duration},
//            { fret, string, style, duration},
//             ... ],
//
//  style = { "name": "BEND", "step": 0.5 }
	//  duration = [ negPow2, durationModifier ]
//
// example:
// staff = [ [ 3, 2, { "name": "BEND", "step": 0.5 }, [3,4]],
//           [ 3, 3, { "name": "BEND", "step": 0.5 }, [3,4]] ]

//
	this.currHas2DigitNotes=false;
	this.currNegpow2=0;
	this.currDurationModifier=0;
	this.lastNote = null;
	this.beatDuration = -1;

	this.buildNoteInfo  = function(noteInfoArray, newBeatInfo) {
		var fret = noteInfoArray[0];
		var string = noteInfoArray[1];

		var n  = new noteInfo(fret-1,string,0);
		this.currHas2DigitNotes=this.currHas2DigitNotes||fret>9;

		n.animInfo = noteInfoArray[4];

		//		if(typeof noteInfoArray[4] != "undefined" ) {
		//			n.animInfo = buildAnimInfoFromObject(noteInfoArray[4], n, newBeatInfo, this);
		//		} else {
		//			n.animInfo = buildAnimInfoFromObject(null, n, newBeatInfo, this);
		//		}

		//consolewrp.log("ni : " + getArrayRep(noteInfoArray) + " :: " + JSON.stringify(noteInfoArray));
		//consolewrp.log("duration : " + this.beatDuration + " - " + noteInfoArray[2] + " = " + (this.beatDuration-noteInfoArray[2]));
         
		this.currNegpow2=(this.beatDuration+noteInfoArray[2]);
		this.currDurationModifier=noteInfoArray[3];

		n.currNegpow2=(this.beatDuration+noteInfoArray[2]);
		n.durationModifier=noteInfoArray[3];

		if(n.durationModifier == -1 ) {
			// in the case that the duration is a realtime value, it has been put in the powNeg2 value index
			n.duration = n.currNegpow2;
			n.negPow2 = -1;
		}
		if(typeof noteInfoArray[6] != "undefined" ) {
			n.sx=noteInfoArray[5];
			n.sy=noteInfoArray[6];
		}
		if(typeof noteInfoArray[8] != "undefined" ) {
			n.tx=noteInfoArray[7];
			n.ty=noteInfoArray[8];
		}
		
		return n;
	}

	this.currStaffDuration = 0;

	this.parseStaffNEW = function(rawBeatInfo, measurePositions, beatIndex) {

		var n = null;

		if(typeof rawBeatInfo["bi"] == "undefined" || rawBeatInfo["bi"] == null ) {
			
			var newBeatInfo = new beatInfo(false, 0, 0, null, rawBeatInfo["i"],  0, -1, rawBeatInfo["x"]);
                                //beatInfo(h2dn, bi,si,    n,         d,np2, dm, x);

			if(typeof rawBeatInfo["m"] != "undefined" ) {
				newBeatInfo.m = rawBeatInfo["m"];
			}

			//consolewrp.log( "ii: " + rawBeatInfo["i"]);
			//newBeatInfo.debug();
			newBeatInfo.duration = rawBeatInfo["i"];
			if( typeof this.currBeatInfoList == "undefined" ||  this.currBeatInfoList == null ) {

				this.staffInfoList.push( new staffInfo(new Array(), measurePositions) );
				this.staffIndex = this.staffInfoList.length-1; 
				this.currBeatInfoList = this.staffInfoList[this.staffIndex].beatInfoList;

			}

			this.currBeatInfoList.push(newBeatInfo);
			newBeatInfo.arrayIndex = this.currBeatInfoList.length-1;
			newBeatInfo.staffIndex = this.staffIndex;
			return;
		}

		var notes = new Array();

		var beatInfoArray = rawBeatInfo["bi"];
		//consolewrp.log("ni: " + beatInfoArray);

		var newBeatInfo = new beatInfo(false, 0, 0, notes);
		if(typeof rawBeatInfo["x"] != "undefined" ) {
			newBeatInfo.x = rawBeatInfo["x"];
		}
		if(typeof rawBeatInfo["m"] != "undefined" ) {
			newBeatInfo.m = rawBeatInfo["m"];
		}

		var bindex = rawBeatInfo["i"];// = this.currStaffDuration;// = 0;
		this.beatDuration = bindex;

		this.currHas2DigitNotes = false;
		for(var j = 0; j < beatInfoArray.length; ++j ) {
			//consolewrp.log("ni: " + beatInfoArray[j]);
			n = this.buildNoteInfo(beatInfoArray[j], newBeatInfo);
			notes.push(n);
		}
		newBeatInfo.has2DigitNotes = this.currHas2DigitNotes;

		newBeatInfo.negPow2 = this.currNegpow2;
		newBeatInfo.durationModifier = this.currDurationModifier;
		if( this.currDurationModifier < 0 ) { //== -1 || this.currDurationModifier == -2 ) {
			// special case for realtime durations
			newBeatInfo.duration = this.beatDuration;//this.currNegpow2;
			newBeatInfo.durationModifier = -1;
		}

		//consolewrp.log("this.currBeatInfoList: " + this.getCurrStaffDuration() + " : " +  this.maxStaffDuration);
		//consolewrp.log( "currDurationModifier: " + this.currDurationModifier );


		if(this.type == "new" ) {
			//bindex = this.currStaffDuration;

			if( bindex >= this.maxStaffDuration ) {
				bindex -= this.maxStaffDuration;
				this.staffInfoList.push( new staffInfo(new Array(), measurePositions) );
				this.staffIndex = this.staffInfoList.length-1; 
				this.currBeatInfoList = this.staffInfoList[this.staffIndex].beatInfoList;
			}

		} else if( this.currDurationModifier <= -2 ) {

//			bindex = -1*(this.currDurationModifier + 1);
			this.staffInfoList.push( new staffInfo(new Array(), measurePositions) );
			this.staffIndex = this.staffInfoList.length-1; 
			this.currBeatInfoList = this.staffInfoList[this.staffIndex].beatInfoList;

		} 
		else 
			if( typeof this.currBeatInfoList == "undefined" ||  this.currBeatInfoList == null ) {

			this.staffInfoList.push( new staffInfo(new Array(), measurePositions) );
			this.staffIndex = this.staffInfoList.length-1; 
			this.currBeatInfoList = this.staffInfoList[this.staffIndex].beatInfoList;

		}
		newBeatInfo.index = beatIndex;
		//this.debugStr += "(" + bindex + ", " + newBeatInfo.getDuration() + "), ";
		newBeatInfo.staffIndex = this.staffIndex;

		this.currBeatInfoList.push(newBeatInfo);
		newBeatInfo.arrayIndex = this.currBeatInfoList.length-1;
		//newBeatInfo.debug();
//		this.currStaffDuration = bindex + newBeatInfo.getDuration();

		//this.addBeatInfo(newBeatInfo);

		//consolewrp.log( "newBeatInfo: " + newBeatInfo.x );

		if(this.lastNote != null) {
			var aiArr = this.lastNote.animInfo;
			if(aiArr != null) {
				for(var i = 0; i < aiArr.length; ++i ) {
					var ai = aiArr[i];
					if(ai.type==SLIDE || ai.type == BEND) {
						ai.endNote = n;
					}
					if(ai.type==PULL_OFF) {
						ai.startNote = n;
					}
				}
			}
		}

		this.lastNote = n;

	}


/*
Presently Notes are encoded as follows:
- each note group that is played at the same time is called a beat, thus beatInfo
  this can be 1 or more notes.  They share time, and animation information
- beats are organized into staffs and each beat in a staff is separted by a 0
- the first number is the index of the note on the staff (this is a hack to determine
  the duration of the note from a raw text tab).  
- The most common durations are whole, half, quarter, eighth, sixteenth and 32nd notes, where a whole note
  has a duration of 32.  The total staff length is 96, or 3 whole notes.

*/
	this.lastParsedBeatInfo = null;


/*
	this.parseNextOld = function(staff, beatIndex) {

		var currHas2DigitNotes = false;

		if(undefined == staff || staff == null) {
			this.reset();
		}
		
		var notes = new Array();

		while(notes.length == 0) {

			var beat = staff.get(++beatIndex);
			
			if(beat==null) {
				return null;
			}
			
			var nextBeat = staff.get(beatIndex+1);

			for(var i = 0; i < beat.length; ++i ) {

				if(isNote(beat[i]) && !is2DigitNote(beat[i], nextBeat[i])) {//isAbove10(beat, i, nextBeat)) {

					if(this.lastBeat != null && is2DigitNote(this.lastBeat[i], beat[i])) {
						//isNote(this.lastBeat[i]) && get2DigitNote(this.lastBeat[i], beat[i]) < 24) {

						var lb = this.lastBeat[i].charCodeAt(0)-48;
						var n  = new noteInfo(beat[i].charCodeAt(0)-48-1+lb*10, NUM_STRINGS-i-1, 0);
						n.setAnimInfo(staff, beatIndex);
						notes.push(n);
						currHas2DigitNotes = true;

					} else {
						var n = new noteInfo(beat[i].charCodeAt(0)-48-1, NUM_STRINGS-i-1, 0);
						n.setAnimInfo(staff, beatIndex);
						notes.push(n);
					}

				}
			}
			this.lastBeat = beat;
		}

		if(notes!=null) {
			return new beatInfo(currHas2DigitNotes, beatIndex, this.staffIndex, notes);
		}
		return null;
	}
	// EDITING FUNCTIONS
	this.copy = function(ssi,sbi, esi,ebi) {
		if(ssi >= 0 && ssi < this.staffInfoList.length &&
		   esi >= ssi && esi < this.staffInfoList.length ) {

			consolewrp.log( "ssi: " + ssi );
			consolewrp.log( "sbi: " + sbi );
			consolewrp.log( "esi: " + esi );
			consolewrp.log( "ebi: " + ebi );
			
			var copyIter = new StaffIterator();
			copyIter.initialize();

			for(var si = ssi; si <= esi; si++ ) {
				var cbil = this.staffInfoList[si];
				var bi = si == ssi ? sbi: 0;
				var lastIndex = si == esi ? ebi: cbil.beatInfoList.length-1;

			    //consolewrp.log( si + ", " + bi + " lindex: " + lastIndex);
				for(; bi <= lastIndex; bi++ ) {
					copyIter.addBeatInfo(cbil.beatInfoList[bi].copy());
				}
			}
			return copyIter;
		}
		return null;
	}

	this.cut = function(ssi,sbi, esi,ebi) {
		var ci = this.copy(ssi,sbi, esi,ebi);
		this.deleteIt(ssi,sbi, esi,ebi);
		return ci;
	}

	this.deleteIt = function(ssi,sbi, esi,ebi) {
		if(ssi >= 0 && ssi < this.staffInfoList.length &&
		   esi >= ssi && esi < this.staffInfoList.length ) {

			consolewrp.log( "ssi: " + ssi );
			consolewrp.log( "sbi: " + sbi );

			// save old data
			var oldStaffInfoList = copyArray( this.staffInfoList );
			this.initialize();

			// copy back all upto paste point
			for(var i = 0; i < ssi; ++i) {
				this.staffInfoList.push(oldStaffInfoList[i]);
			}

			//consolewrp.log("copyback 1 -------------" );
			//this.showAllStaffs();


			// ... including the start staff of the paste upto sbi
			this.currBeatInfoList = null;
			this.staffIndex = ssi-1;			

			for(var i = 0; i < sbi; ++i) {
				this.addBeatInfo(oldStaffInfoList[ssi].beatInfoList[i]);
			}

			//consolewrp.log("copyback 2 -------------" );
			//this.showAllStaffs();

			// finally copy back the remainder of the original 
			for(var si = esi; si < oldStaffInfoList.length; ++si) {
				var cbil = oldStaffInfoList[si];
				var bi = si == esi ? ebi+1: 0;
				var lastIndex = cbil.beatInfoList.length-1;

			    //consolewrp.log( si + ", " + bi + " lindex: " + lastIndex);
				for(; bi <= lastIndex; bi++ ) {
					this.addBeatInfo(cbil.beatInfoList[bi]);
				}
			}

		}

	}

	this.paste = function(iter, ssi,sbi, before) {
		consolewrp.log("orig -------------" );
		this.showAllStaffs();
		consolewrp.log("paste -------------" );
		iter.showAllStaffs();
		if(ssi >= 0 && ssi < this.staffInfoList.length ) {
			consolewrp.log( "ssi: " + ssi );
			consolewrp.log( "sbi: " + sbi );

			// save old data
			var oldStaffInfoList = copyArray( this.staffInfoList );
			this.initialize();

			// copy back all upto paste point
			for(var i = 0; i < ssi; ++i) {
				this.staffInfoList.push(oldStaffInfoList[i]);
			}

			consolewrp.log("copyback 1 -------------" );
			this.showAllStaffs();


			// ... including the start staff of the paste upto sbi
			this.currBeatInfoList = null;
			this.staffIndex = ssi-1;			

			if(!before) {  // inc last index for pasting after 
				sbi++;
			}

			for(var i = 0; i < sbi; ++i) {
				this.addBeatInfo(oldStaffInfoList[ssi].beatInfoList[i]);
			}

			consolewrp.log("copyback 2 -------------" );
			this.showAllStaffs();

			// copy in the paste iter
			var binfo = iter.next();
			while(binfo != null) {
				this.addBeatInfo(binfo.clone());
				binfo = iter.next();
			}
			consolewrp.log("paste in -------------" );
			this.showAllStaffs();

			// finally copy back the remainder of the original 
			for(var si = ssi; si < oldStaffInfoList.length; ++si) {
				var cbil = oldStaffInfoList[si];
				var bi = si == ssi ? sbi: 0;
				var lastIndex = cbil.beatInfoList.length-1;

			    //consolewrp.log( si + ", " + bi + " lindex: " + lastIndex);
				for(; bi <= lastIndex; bi++ ) {
					this.addBeatInfo(cbil.beatInfoList[bi]);
				}
			}

		}
		consolewrp.log("result -------------" );
		this.showAllStaffs();

	}

*/

}



