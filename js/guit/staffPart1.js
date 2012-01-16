     var effectLetterToNameTable = {
       'b': "bend",
       't': "tremoloBar",
       'h': "harmonic",
       'g': "grace",
       'r': "trill",
       'k': "tremoloPicking",
       'v': "vibrato",
       'm': "mute",
       'u': "slide",
       'z': "quickslide",
       'H': "hammerOn",
       'G': "ghost",
       'a': "accent",
       'A': "heavyaccent",
       'p': "palmmute",
       's': "staccato",
       'T': "tap",
       'S': "slap",
       'P': "pop",
       'f': "fadein"};

var noteToDelete=null;
function deleteNoteFunc(note, index, notes) {
	return note != noteToDelete;
}




function is2DigitNote(d1, d2) {
	if(isNote(d2) && isNote(d1) ) {
		var lb = d1.charCodeAt(0)-48;
		return (d2.charCodeAt(0)-48-1+lb*10) < 24;
	}
	return false;
}




var NUM_STRINGS=6;

// anim types
var NONE="none";
var v = 90;
var BEND="bend";
var SLIDE="slide";
var PULL_OFF="pull_off";
var TREMOLO="tremolo";
var WEAK="weak";
var HARMONIC="harmonic";

var BEND_SYM="b";
var UP_SLIDE_SYM="/";
var DOWN_SLIDE_SYM="\\";
var le = 117; 
var PULL_OFF_SYM="p";
var TREMOLO_SYM="~";

//var specialSymMap = { "~": '~', "}": 'b', "|": 'r', "{": 'h', "z": '/', "y": '\\', "x": '(', "y": ')', ":": '<', ";": '>'};

var specialSymMap = { "~": '~', "}": 'b', "|": 'r', "{": 'h', "z": '/', "y": '\\', "x": 'p', "w": '(', ":": ')', ";": '<', "9": '>'};
var specialCharsArr = ['~','b','r','h', '/', '\\', 'p','(',')',',','<','>','f'];

function NoopAnim() {
  this.type=NONE;
	this.encode = function() {
		return "null";
	}
}


var NOOPANIM=new NoopAnim();
var g = 112; 
//var IgnoreAnim=new IgnoreAnim();

function TremoloAnim(nb) {
	this.type=TREMOLO;
	this.numBeats=nb;

	this.encode = function() {
		return "{ \"name\": \"t\", \"step\": 0.5 }";
	}
}

function Bend(sn, p) {

	this.type=BEND;
	this.startNote=sn;

	this.points = p;
}


function Slide(sn, en) {
	this.type=SLIDE;
	this.startNote=sn;
	this.endNote=en;
	this.duration=(typeof en != "undefined" && en != null)? en.otherInfo: 0;

	this.isUp = function() {
		if(typeof this.endNote != "undefined" && this.endNote != null 
		   && typeof this.startNote != "undefined" && this.startNote != null ) {
			return this.endNote.higher(this.startNote);
		} else {
			return true;
		}
	}

	this.encode = function() {
		return "{ \"name\": \"s\", \"step\": 0.5 }";
	}
}


function PullOff(sn, en) {
	this.type=PULL_OFF;
	this.startNote=sn;
	this.endNote=en;

	this.encode = function() {
		return "{ \"name\": \"p\", \"step\": 0.5 }";
	}
}

function Harmonic(n) {
	this.type=HARMONIC;
	this.note=n;

	this.encode = function() {
		return "{ \"name\": \"h\", \"step\": 0.5 }";
	}
}

function Weak(n) {
	this.type=WEAK;
	this.note=n;

	this.encode = function() {
		return "{ \"name\": \"w\", \"step\": 0.5 }";
	}
}

function NEW_EFFECT(name,bi,tnote,fnote) {
	this.type=name;
	this.beatInfo=bi;
	this.targetNote=tnote;
	this.followingNote=fnote;

	this.encode = function() {
		return "null";
	}
	this.nextBeatHigher = function() {
		//consolewrp.log( "targetNote: " + this.targetNote.strRep() );
		//consolewrp.log( "this.followingNote: " + this.followingNote.strRep() );
		if(typeof this.followingNote != "undefined" && this.followingNote != null ) {
			return this.followingNote.higher(this.targetNote);
		}
		return false;
	}
	this.encode = function() {
		return "null";
	}
	this.debug = function() {
		consolewrp.log( "Effect:: type: " + this.type );
		this.beatInfo.debug();
		this.targetNote.debug();
		if(typeof this.followingNote != "undefined" && this.followingNote != null ) {
			this.followingNote.debug();
		}
	}
}

function getFollowingNote(noteInfo, beatInfo, staffIterator) {

	var beats = staffIterator.getNextNBeats(beatInfo,10);
	var d     = beatInfo.duration; // we want the duration to the nextNote

	if(beats == null) return null;

	for(var j=0; j< beats.length; ++j) {
		var nextBeatInfo = beats[j];

		d += nextBeatInfo.duration;

		if(nextBeatInfo.notes && nextBeatInfo.notes.length > 0) {
			
			for(var i = 0; i < nextBeatInfo.notes.length; ++i ) {

				if(nextBeatInfo.notes[i].string == noteInfo.string) {
					nextBeatInfo.notes[i].otherInfo = d; // now store this duration here
					return nextBeatInfo.notes[i];
					
				}
			}
		}

	}
	return null;
}


function parseNoteInfo(text, ni) {
	var num = 0;
	var theNI = ni.clone();
	//consolewrp.log(text);
	for(var i = 0; i < text.length-1; ++i ) {
		//consolewrp.log(text.substring(i,i+1));
		var n = getNote(text.substring(i,i+1));
		//consolewrp.log(n);
		if(n == null) {
			if(num>0) {
				break;
			}
		} else {
			num = num*10+n;
		}
		//consolewrp.log(num);
	}
	if(num==0){
		return null;
	}
	theNI.fret=num-1;
	return theNI;
}


function buildAnimInfoFromObject(animInfoArray, noteInfo, beatInfo, staffIterator){

	var animArray = new Array();
	if(animInfoArray == null || animInfoArray.length == 0) {
		animArray.push( NOOPANIM );
		return animArray;
	}
	//	consolewrp.log( "animInfoArray: " + getArrayRep(animInfoArray) );

	var animInfo = null;
	var animArray = new Array();
	for(var i = 0; i < animInfoArray.length; ++i ) {
		var animInfoObject = animInfoArray[i];
		var name = animInfoObject["name"];
		animInfo = null;

		if( name == "bend" ) {

			animInfo = new Bend(noteInfo,animInfoObject["points"]);

		} else if( name == "slide" ) {

			animInfo = new Slide(noteInfo, getFollowingNote(noteInfo, beatInfo, staffIterator));

		} else if( name == "quickslide" ) {

			animInfo = new Slide(noteInfo, null);

		} else if( name == "p" ) {

			animInfo = new PullOff(noteInfo,noteInfo);

		} else if( name == "t" ) {

			animInfo = new TremoloAnim(1);

		} else if( name == "h" ) {

			animInfo = new Harmonic(noteInfo);

		} else if( name == "w" ) {

			animInfo = new Weak(noteInfo);

		}
		if(animInfo)animArray.push(animInfo);
		
		//		animArray.push(new NEW_EFFECT(name, beatInfo, noteInfo, null));//getFollowingNote(noteInfo, bi, staffIterator));
	}
	return animArray;

}


function isStaffLine(s) {
	var c = 0;
	for(var i = 0; i < s.length; ++i ) {
		if(s.charAt(i) == '-') ++c;
	}
	return c > s.length/3;
}


function Staff() {
	this.tabTextLineNumber = -1;
	this.strings = new Array();


	this.addString = function(s, lineNumber) {
		if(isStaffLine(s)) {

			this.strings.push(s);
			if(this.strings.length==1) {
				this.tabTextLineNumber = lineNumber;
			}
		} 
	}

	this.done = function() {
		return this.strings.length == NUM_STRINGS;
	}

	this.getData = function() {
		return this.strings;
	}
	
	this.peek = function(index) {
		if(index+1 < this.strings[0].length ) {
			var notes = new Array();
			
			for(var i = 0; i < NUM_STRINGS; ++i ) {
				notes.push(this.strings[i].charAt(index+1));
			}
			return notes;
		}
		return null;
	}

	this.lookBack = function(index) {
		if(index-1 >= 0 ) {
			var notes = new Array();
			
			for(var i = 0; i < NUM_STRINGS; ++i ) {
				notes.push(this.strings[i].charAt(index-1));
			}
			return notes;
		}
		return null;
	}

	this.get = function(index) {
		if(index < this.strings[0].length ) {
			var notes = new Array();
			
			for(var i = 0; i < NUM_STRINGS; ++i ) {
				notes.push(this.strings[i].charAt(index));
			}
			return notes;
		}
		return null;
	}

	this.last = function(index) {
		return index==this.strings[0].length;
	}

	this.getPreText = function(string, index) {
		//consolewrp.log("pre: " + string + ", " + index + ": " + this.strings[string]);
		if(index > 5 ) {
			return this.strings[string].substring(index-5, index);
		}
		else {
			return this.strings[string].substring(0,index);
		}
	}

	this.getPostText = function(string, index) {
		//consolewrp.log("post: " + string + ", " + index);
		if(index < this.strings[string].length-5) {
			return this.strings[string].substring(index+1, index+5);
		} 
		else {
			return this.strings[string].substring(index+1);
		}

	}
}


function getNote(rep) {
	if(isNote(rep) ) {
		return rep.charCodeAt(0)-48;
	}
	return null;
}

function isNote(rep) {
	return rep.charCodeAt(0) >= 48 && rep.charCodeAt(0) <= 57;
}

function hasNotes(beat) {
	for(var i = 0; i < beat.length; ++i ) {
		if(isNote(beat[i])){
			return true;
		}
	}
	return false;
}

function isAbove10(beat, i, nextBeat) {
	return nextBeat != null && (beat[i] == "1" || beat[i] == "2") && isNote(nextBeat[i]);
}



var durationStringReps = ["Whole", "Half", "Quarter", "Eigth", "Sixteenth", "Thirty Second"];


function getChordTraceArray(currTraceArray, iter) {

	if(currTraceArray==null) {
		currTraceArray = new Array(NUM_STRINGS);
	}

	iter.prev();

	for(var j = 0; j < currTraceArray.length; ++j ) {
		if(currTraceArray[j] !=null) {

			if(currTraceArray[j].compareNumBeats(5)>0){
				currTraceArray[j]=null;
			} else {
				currTraceArray[j].incNumBeats();
			}
		}
	}

	var bi = iter.next();
	var notes = (bi!=null)?bi.notes:null;

	if(notes != null) {
		for(var j = 0; j < notes.length; ++j ) {
			currTraceArray[notes[j].getString()] = notes[j];
		}
	}

	for(var i = 0; i < 5; ++i ) {

		bi = iter.next();
		notes = (bi!=null)?bi.notes:null;

		if(notes != null) {

			for(var j = 0; j < notes.length; ++j ) {

				var note = currTraceArray[notes[j].getString()];

				if(note != null) {

					if(!note.sameNote(notes[j]) && note.compareNumBeats(i) <= 0) {
						for(var j = 0; j < currTraceArray.length; ++j ) {
							if(currTraceArray[j] !=null) {
								currTraceArray[j].decNumBeats(i);
							}
						}
						return currTraceArray;
					} else {
						currTraceArray[notes[j].getString()] = notes[j];
					}

				} else {
					currTraceArray[notes[j].getString()] = notes[j];
				}
			}

			for(var j = 0; j < currTraceArray.length; ++j ) {
				if(currTraceArray[j] !=null) {
					currTraceArray[j].incNumBeats();
				}
			}
			
		} else {
			break;
		}
	}
	for(var j = 0; j < currTraceArray.length; ++j ) {
		if(currTraceArray[j] !=null) {
			currTraceArray[j].decNumBeats(5);
		}
	}
	return currTraceArray;

}
