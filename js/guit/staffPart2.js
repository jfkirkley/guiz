function noteInfo(f,s,n,b,a, np2, dm, sx, sy, tx, ty) {
	this.fret = f;
	this.string = s;
	this.numBeats = n;
	this.animInfo = [NOOPANIM];
	this.btxt = b;
	this.atxt = a;

	this.otherInfo = 0;

	//	this.sx = sx; 
	//	this.sy = sy;
	//	this.tx = tx; 
	//	this.ty = ty;

	// these values should be here, so individual notes of the beat can have unique durations
	// presently, however, the whole beatInfo takes the same values
/*
  duration:   
     length = 1/2^y  or 2^(-y) or negPow2
             where 
             negPow2 = (0,1,2,3,4,5,6,..,9) for w,h,q,e,s,32nd, 64th,..,512th respectively

     modifier range 1-9, where 1 means NO modifier
              currently (triplet,quinteplet,septeplet) or (3,5,7) are encoded as 2,3,4 respectively
*/

	this.negPow2 = typeof np2 != "undefined"? np2:0;
	this.durationModifier = typeof dm != "undefined"? dm:0;
	this.duration = typeof dm != "undefined" && dm == -1? np2:0;

	this.bendPoint = 0;

	this.getFret = function(s) {
		return this.fret;
	}

	this.getDurationRep = function(s) {
		var rep = this.duration;
		if(this.negPow2>=0 && this.negPow2 < durationStringReps.length){
			rep = durationStringReps[this.negPow2] + " Note";
		}
		if(this.durationModifier == 2) {
			rep += " Triplet";
		} else if(this.durationModifier == 3) {
			rep += " Quinteplet";
		} else if(this.durationModifier == 4) {
			rep += " Septeplet";
		}

		return rep;
	}

	this.getString = function(s) {
		return this.string;
	}

	this.incNumBeats = function() {
		return ++this.numBeats;
	}

	this.decNumBeats = function(v) {
		return this.numBeats-=v;
	}

	this.getNumBeats = function(s) {
		return this.numBeats;
	}

	this.compareNumBeats = function(otherNumBeats) {
		return this.numBeats==otherNumBeats? 0: this.numBeats<otherNumBeats? -1:1;
	}

	this.compare = function(other) {
		return this.numBeats==other.numBeats? 0: this.numBeats<other.numBeats? -1:1;
	}

	this.after = function(other) {
		return this.compare(other) == 1;
	}

	this.before = function(other) {
		return this.compare(other) == -1;
	}

	this.comparePitch = function(other) {
		if(this.string==other.string) {
			return this.fret==other.fret? 0: this.fret<other.fret? -1:1;
		} 
		return -19;
	}

	this.higher = function(other) {
		return this.comparePitch(other) == 1;
	}

	this.lower = function(other) {
		return this.comparePitch(other) == -1;
	}

	this.sameNote = function(otherNote) {
		return this.fret==otherNote.getFret() && this.string==otherNote.getString();
	}

	this.clone = function(otherNote) {
//(f,s,n,b,a, np2, dm) {
		var newNote = new noteInfo(this.getFret(), this.getString(), this.getNumBeats(), this.btxt, this.atxt, this.negPow2, this.durationModifier);
		newNote.animInfo = this.animInfo;
		return newNote;
	}

	this.copy = function(otherNote) {
		this.fret = otherNote.getFret();
		this.string = otherNote.getString();
		this.numBeats = otherNote.getNumBeats();
	}

	this.debug = function(prefix) {
		consolewrp.log(this.string + " : " + this.fret + ": " + this.numBeats + ": " + this.getEffectDebug());
	}

	this.strRep = function() {
		return this.string + " : " + this.fret + ": " + this.numBeats + ": " + this.getEffectDebug();
	}

	this.getEffectDebug = function() {
		var s = "";
		if( typeof this.animInfo != "undefined" && this.animInfo != null && this.animInfo.length > 0 ) {
			for(var i = 0; i < this.animInfo.length; ++i ) {
				s += this.animInfo[i].type + ", ";
			}
		}
		return s;
	}

	this.encodeAnimInfo = function() {
		var s = "[";
		var comma = "";
		for(var i = 0; i < this.animInfo.length; ++i ) {
			s += comma + this.animInfo[i].encode();
			comma = ", ";
		}
		return s + "]";
	}

	this.setEffectFollowingNote = function(followingNote) {
		if( typeof this.animInfo != "undefined" && this.animInfo != null && this.animInfo.length > 0 ) {
			for(var i = 0; i < this.animInfo.length; ++i ) {
				this.animInfo[i].followingNote = followingNote;
			}
		}
	}

//	this.setAnimInfo = function(staff, bi) {
		//consolewrp.log("ai: " + iter.getPreText(this.string) + " - " + iter.getPostText(this.string));
//		var preText  = staff.getPreText (NUM_STRINGS-this.string-1, bi);
//		var postText = staff.getPostText(NUM_STRINGS-this.string-1, bi);
//		this.animInfo = parseAnimInfo(this,preText,postText);
//	}

	this.getAnimInfo = function() {
		return this.animInfo;
	}

	this.encode = function() {
		// [ 3, 3, { "name": "BEND", "step": 0.5 }, [3,4]] ]
		return "[ " + (this.fret+1) + ", " + this.string + ", " + this.encodeAnimInfo() + ", " + (this.durationModifier == -1? this.duration: this.negPow2) + ", " + this.durationModifier + "]";
	}


	this.getEffectType = function() {
		if( typeof this.animInfo != "undefined" && this.animInfo != null && this.animInfo.length > 0 ) {
			return this.animInfo[0].type;
		}
		return "none";
	}

	this.addEffect = function(effect) {
		if( typeof this.animInfo == "undefined" || this.animInfo == null) {
			this.animInfo = new Array();
		}
		this.animInfo.push(effect);
	}
}

//var nh = [v,a,r,l,e,n,g,te,h,va,ar,le,en,eng,leng,th];

function beatInfo(h2dn, bi, si, n,d,np2,dm, x,m) {
	this.has2DigitNotes = h2dn;
	this.index = bi;
	this.staffIndex = si;
	this.notes = n;
	this.arrayIndex = 0;
	this.duration = 0;
	this.negPow2 = typeof np2 != "undefined"? np2:0;
	this.durationModifier = typeof dm != "undefined"? dm:0;

	this.isStaccato	= false;
	this.numDots = 0;
	this.complexModifier;

	this.x = x;
	this.m = m;

	this.parseDuration = function() {

		var modifier = this.durationModifier;

		if (modifier >= 100) {
			this.complexModifier = modifier / 100;
			modifier = modifier % 100;
		}

		if (modifier >= 10) {
			this.isStaccato = true;
			modifier -= 10;
		}

		this.numDots = modifier;
	}

	this.parseDuration();

	this.addNote = function(noteInfo) {
		this.notes.push(noteInfo);
	}

	this.noFret = function() {
		if( typeof this.notes != "undefined" && this.notes != null && this.notes.length > 0 ) {
			return this.notes[0].fret < -1;
		}
		return false;
	}


	this.isRest = function() {
		if( typeof this.notes != "undefined" && this.notes != null && this.notes.length > 0 ) {
			return this.notes[0].fret == -4;
		}
		return false;
	}

	this.isTied = function() {
		if( typeof this.notes != "undefined" && this.notes != null && this.notes.length > 0 ) {
			return this.notes[0].fret == -3;
		}
		return false;
	}

	this.debug = function() {
		consolewrp.log(this.index  + ", d = " + this.duration + ", si = " + this.staffIndex  + 
					", ai: " + this.arrayIndex + ", m: " + this.m + 
					", dm: " + this.durationModifier +  ", np2: " + this.negPow2 + ", has2DigitNotes: " +  
					this.has2DigitNotes + ": " + this.getArrayRep(this.notes));
	}

	this.compare = function(bi) {
		if(bi.staffIndex == this.staffIndex) {
			return bi.index==this.index? 0: bi.index>this.index? -1: 1;
		}
		return bi.staffIndex>this.staffIndex? -1: 1;
	}

	this.isBefore = function(beatInfo) {
		return this.compare(beatInfo) == -1;
	}


	this.isAfter = function(beatInfo) {
		return this.compare(beatInfo) == 1;
	}

	this.samePosition = function(bi) {
		return (bi.staffIndex == this.staffIndex) && (bi.index==this.index);
	}

	this.getArrayRep = function(a) {
		if(a){
			
			var s = "";
			for(var i = 0; i < a.length; ++i ) {
				s += ", " + a[i].strRep();
			}
			return s;
		}
		return null;
	}

	this.buildNoteAnims = function(staffIterator) {

		if(this.notes) {
			
			for(var i = 0; i < this.notes.length; ++i ) {

				var n = this.notes[i];

				if( typeof n.animInfo != "undefined" || n.animInfo != null) {
					// n.animInfo is initially set as the raw anim data array by the staff parser
					n.animInfo = buildAnimInfoFromObject(n.animInfo, n, this, staffIterator);
				}
			}
		}

	}

	this.deleteNote = function(n) {
		var newNotes = new Array();
		consolewrp.log("deleteNote before: " + this.getArrayRep(this.notes));

		for(var i = 0; i < this.notes.length; ++i ) {
			if(n.comparePitch(this.notes[i]) != 0) {
				newNotes.push(this.notes[i]);
			}
		}
		this.notes = newNotes;
		consolewrp.log("deleteNote after: " + this.getArrayRep(this.notes));
	}

	this.duplicate = function(bi) {
		this.notes = bi.notes;
		this.durationModifier = bi.durationModifier;
		this.negPow2 = bi.negPow2;
		this.duration = bi.duration;
		this.staffIndex = bi.staffIndex;
		this.index = bi.index;
	}

	this.clone = function() {
		// NOTE: this shares the note array
		return new beatInfo(this.has2DigitNotes, this.index, this.staffIndex, this.notes, this.duration, this.negPow2, this.durationModifier);
	}

	this.copy = function() {
		// NOTE: this does not share the note array  (h2dn, bi, si, n,d,np2,dm) {
		var newNotes = new Array();
		for(var i = 0; i < this.notes.length; ++i ) {
			newNotes.push(this.notes[i].clone());
		}
		return new beatInfo(this.has2DigitNotes, this.index, this.staffIndex, newNotes, this.duration, this.negPow2, this.durationModifier);
	}

	this.updateNextBeatInfo = function(nextBeatInfo) {
		var nextNotes = nextBeatInfo.notes;
		consolewrp.log( "updateNextBeatInfo: " );

		for(var i = 0; i < this.notes.length; ++i ) {
			var n = this.notes[i];
			//consolewrp.log( "n: " + n.strRep() );

			for(var j = 0; j < nextNotes.length; ++j ) {
				//consolewrp.log( "nn: " + nextNotes[j].strRep() );
				if(nextNotes[j].string == n.string ) {
					n.setEffectFollowingNote(nextNotes[j]);
				}
			}
		}
		return nextNotes;
	}

	this.getDuration = function() {
		//consolewrp.log( "durationModifier: " + this.durationModifier +  " negPow2: " + this.negPow2 );
		if(this.durationModifier == -1) {
			// special realtime duration
			return this.duration;
		}
		var d = 32;
		for(var i = 0; i < this.negPow2; ++i ) {
			d = d/2;
		}
		//consolewrp.log( "da: " + d );

		if(this.durationModifier == 2) {
			d = 2*d/3;
		} else if(this.durationModifier == 3) {
			d = 4*d/5;
		} else if(this.durationModifier == 4) {
			d = 4*d/7;
		}
		//consolewrp.log( "db: " + d );
		return d;
	}

	this.encode = function() {
		var s = "{ \"bi\": [\n";
		var comma = "";

		for(var i = 0; i < this.notes.length; ++i ) {
			s +=  comma + this.notes[i].encode() + "\n";
			comma = ",";
		}
		return s + "] }";
	}

}

function getClosestPow2(duration) {
	var d = 0;
	while(duration >= 2 && d < 5) {
		duration /= 2;
		d++;
	}
	return -1*(d-5);
}

function repeatInfo(startMeasure, endMeasure, times, alternateEndings) {

	this.startMeasure = startMeasure;
	this.endMeasure = endMeasure;
	this.times = times;
	this.alternateEndings = alternateEndings;

	this.currRepCount = 0;

	this.toString = function() {
		var altRep = (this.alternateEndings != null) ? getArrayRep(this.alternateEndings, ","): "none";
		return this.currRepCount + ": " + this.startMeasure + " - " + this.endMeasure + " x: " + this.times + " alts: " + altRep;
	}

	this.reset = function() {
		this.currRepCount = 0;
	}

	this.setRepeatBeat = function(iter, m) {

		++this.currRepCount;

		consolewrp.log(m +  " setRepeatBeat: " + this.toString() );

		var newMeasure = -1;
		var retVal = false;

		if(this.alternateEndings != null) {

			if(this.currRepCount <= this.alternateEndings.length) {
				newMeasure = this.alternateEndings[this.currRepCount-1];
				if(newMeasure <= this.endMeasure) {
					newMeasure = this.startMeasure;
					retVal = true;
				} else {
					retVal = this.currRepCount < this.alternateEndings.length;
				}
			}

		} else if( this.currRepCount <= this.times) {
			newMeasure = this.startMeasure;
			retVal = true;
		}

		if( newMeasure != -1 ) {
			iter.currBeatInfo = iter.firstBeatsInMeasure[newMeasure-1];
			iter.currBeatInfo.debug();
			
			iter.tabDisplay.gotoStaff(iter.currBeatInfo.staffIndex, iter.currBeatInfo.arrayIndex,1,false,true);
			return retVal;
		} 

		return false;
	}

	this.inBounds = function(si) {

		//consolewrp.log(si +  " inBounds: " + this.toString() );

		if(this.alternateEndings == null ) {
			return si >= this.startMeasure && si <= this.endMeasure;
		} else {
			var altEndMeasure = this.alternateEndings[this.currRepCount];
			if( altEndMeasure <= this.endMeasure ) {
				return si >= this.startMeasure && si <= this.endMeasure;

			} else if(this.currRepCount > 0 && this.currRepCount <= this.alternateEndings.length) {
				altEndMeasure = this.alternateEndings[this.currRepCount-1];
				return si >= this.startMeasure && si < altEndMeasure;
			}
		}
	}
}

function staffInfo(bil, mi,y1, y2) {
	this.beatInfoList=bil;
	this.measurePositions = mi;
	this.y1=y1;
	this.y2=y2;


	//consolewrp.log( "y1: " + y1 );
	//consolewrp.log( "y2: " + y2 );
	
	this.repeatPositions=null;

	this.debug = function() {
		
		for(var i = 0; i < this.beatInfoList.length; ++i ) {
			consolewrp.log(this.y1 + "> " + this.beatInfoList[i].index + ": "  + 
						this.beatInfoList[i].negPow2 + ": " + this.getArrayRep(this.beatInfoList[i].notes));
		}
	}

	this.resetRepeats = function() {
	}

	this.getRepeatBeat = function(iter,m) {
		//if(iter.lastBeat!=null)iter.lastBeat.debug();
		//consolewrp.log( "m: " + m + " =?= " + iter.lastBeat.m );

		if(iter.lastBeat != null && iter.lastBeat.m != m ) {

			consolewrp.log(m + " currRepeatInfo: " + iter.currRepeatInfo);

			if(iter.currRepeatInfo != null) {

				if(iter.currRepeatInfo.inBounds(m)) {
					consolewrp.log("inbounds");

				} else if( !iter.currRepeatInfo.setRepeatBeat(iter,m) ) {

					consolewrp.log("out of bounds");

					iter.currRepeatInfo.reset();
					iter.currRepeatInfo = null;//iter.measureNumToRepeatInfoMap[m+""];

				}

			} else {

				iter.currRepeatInfo = iter.measureNumToRepeatInfoMap[m+""];
				consolewrp.log(m + " currRepeatInfo: null" );

			}
		}

		iter.lastBeat = iter.currBeatInfo;
		consolewrp.log( "cb: " + iter.currBeatInfo);
		return true;
	}

	this.getArrayRep = function(a) {
		var s = "";
		for(var i = 0; i < a.length; ++i ) {
			s += ", " + a[i].strRep();
		}
		return s;
	}

	this.getStaffDuration = function(offset) {
		//this.debug();
		//consolewrp.log("offset:" + offset);
		var d = offset;
		for( var i = 0; i < this.beatInfoList.length; ++i ) {
			d += this.beatInfoList[i].getDuration();
		}
		//consolewrp.log( "d: " + d );
		return d;


//		if(this.beatInfoList.length > 0 ) {
//			var lastBeat = this.beatInfoList[this.beatInfoList.length-1];
//			return lastBeat.index + lastBeat.duration;
//		} else {
//			return 0;
//		}
	}

//	this.encode = function() {
//		var s = "";
//		var comma = "";
//
//		for(var i = 0; i < this.beatInfoList.length; ++i ) {
//			s +=  comma + this.beatInfoList[i].encode() + "\n";
//			comma = ",";
//		}
//		return s;
//	}


}

function get2DigitNote(d1, d2) {
	var lb = d2.charCodeAt(0)-48;
	return d1.charCodeAt(0)-48-1+lb*10;
}





