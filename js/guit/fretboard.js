

function FretBoard(){

    this.E_STRING = 0;
    this.A_STRING = 1;
    this.D_STRING = 2;
    this.G_STRING = 3;
    this.B_STRING = 4;
    this.e_STRING = 5;

    //this.translator
	this.translator = new Translator();

    this.fretBoardGUI = null;//=new FretBoardGUI();
    this.guitOutGUI=null;
    this.numFrets = 24;

	this.tuning = new Tuning();
	this.key = new Key();

    this.FretBoard = function( ) {
		this.translator = new Translator();
		this.fretBoardGUI=null;//new FretBoardGUI();
	}
    this.FretBoard = function( fretBoardGUI, guitOutGUI) {
		this.fretBoardGUI = this.fretBoardGUI;
		this.guitOutGUI = guitOutGUI;
		
		this.translator = new Translator();
	}

	this.normalizeNote = function(note) {
		note %= OCTAVE;
		if(note<0) note += OCTAVE;
		return note;
	}

	this.getFretInRange = function (note, string, minFretRange, maxFretRange) {

		for(var f = minFretRange; f < maxFretRange; ++f ) {
			if(note==this.normalizeNote(this.tuning.getStringPitch(string) + f+1)){
				return f;
			}
		}
		return -2;
	}

    this.findLowestStringForNote = function( note, minFretRange, maxFretRange ) {
		note = this.normalizeNote(note);
		for(var i = 0; i < this.tuning.getStringPitches().length; ++i ) {
			if(this.getFretInRange(note, i, minFretRange, maxFretRange) != -1 ) {
				return i;
			}
		}
		return -2;
	}

    this.render = function( chord, minFretRange, maxFretRange ) {
		this.fretBoardGUI.reset();
		this.fretBoardGUI.setTitle(chord.getName());

		if(chord.hasMarkedFingering()) {
			consolewrp.log("singering: " + chord.stringFingering);
			for(var string = 0; string < this.tuning.getStringPitches().length; ++string ) {
				if(chord.getMarkedFret(string) > -1) {
					var cd = this.fretBoardGUI.markFret(string, chord.getMarkedFret(string)-1, chord.getMarkedInterval(string), false);
					cd.bringToFront();
				}
			}

		} else {

			var usedStrings = new Array();
			var usedIntervals = new Array();
			var intervals = chord.getIntervals();
			var offsetFromA = chord.getRootRelativeInterval();

			for(var string = 0; string < this.tuning.getStringPitches().length; ++string ) {
				var i = 0;
				for (; i< intervals.length; ++i) {

					if(!isInArray(usedIntervals, intervals[i])) {
						var interval = this.normalizeNote(intervals[i]+offsetFromA);

						var fret = this.getFretInRange(interval,string,minFretRange,maxFretRange);

						if(fret!=-2) {
							var cd = this.fretBoardGUI.markFret(string, fret, intervals[i], false);
							cd.bringToFront();
							//usedStrings.push(string);
							usedIntervals.push(intervals[i]);
							break;
						}
					}
				}
				if( i == intervals.length ) {
					for (var i = 0; i< intervals.length; ++i) {

						var interval = this.normalizeNote(intervals[i]+offsetFromA);

						var fret = this.getFretInRange(interval,string,minFretRange,maxFretRange);

						if(fret!=-2) {
							var cd = this.fretBoardGUI.markFret(string, fret, intervals[i], false);
							cd.bringToFront();

							//usedStrings.push(string);
							usedIntervals.push(string);
							break;
						}
					}
				}
			}
		}
	}

    this.renderVoicing = function( chord, minFretRange, maxFretRange ) {

		this.fretBoardGUI.reset();
		this.fretBoardGUI.setTitle(chord.getName());

		var usedStrings = new Array();
		var usedIntervals = new Array();
		var intervals = chord.getIntervals();
		var offsetFromA = chord.getRootRelativeInterval();

		if(chord.stringFingering == null ) {
			chord.stringFingering = new Array();
		}

		var i = 0;
		for(var string = 0; string < this.tuning.getStringPitches().length; ++string ) {
			var interval = this.normalizeNote(intervals[i]+offsetFromA);
			//consolewrp.log( "interval: " + interval );

			var fret = this.getFretInRange(interval,string,minFretRange,maxFretRange);
			//consolewrp.log( "fret: " + fret );

			if(fret!=-2) {
				var cd = this.fretBoardGUI.markFret(string, fret, intervals[i], false);
				cd.bringToFront();

				chord.stringFingering[string] = fret+1;
				//usedStrings.push(string);
				i++;
			}
		}
		if(chord.stringFingering[chord.stringFingering.length-1] != "NCFnd" ) {
			chord.stringFingering.push("NCFnd");
		}
	}


    this.renderAll = function( chord, minFretRange, maxFretRange ) {
		this.fretBoardGUI.reset();
		this.fretBoardGUI.setTitle(chord.getName());

		var intervals = chord.getIntervals();
		var offsetFromA = chord.getRootRelativeInterval();
		
		for (var j = 0; j< intervals.length; ++j) {
			var interval = this.normalizeNote(intervals[j]+offsetFromA);
			//var s = interval + ": ";

			for(var string = 0; string < this.tuning.getStringPitches().length; ++string ) {
				//s += string + " = ";
				
				var fret = this.getFretInRange(interval,string,minFretRange,maxFretRange);
				//s += fret  + ", ";

				if(fret!=-2) {
					var cd = this.fretBoardGUI.markFret(string, fret, intervals[j], false);
					cd.bringToFront();
				}

			}
			//consolewrp.log(s);
		}
	}


    this.getTranslator = function() {
		return this.translator;
	}

    this.setTranslator = function( translator) {
		this.translator = translator;
	}


    this.getNumStrings = function() {
		return this.translator.getTuning().getStringPitches().length;
	}
	


    this.setNumFrets = function( numFrets) {
		this.numFrets = numFrets;
	}

    this.getNumFrets = function() {
		return this.numFrets;
	}


}

