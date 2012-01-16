
function Tuning(){
	

	this.stringPitchesLetters = ["E", "A", "D", "G", "B", "E" ];

	this.stringPitches = [-5, 0, 5, 10, 14, 19 ]; // standard tuning
	
    this.Tuning = function() {
		
	}

    this.getStringPitches = function() {
		return this.stringPitches;
	}

    this.setStringPitches = function(stringPitches) {
		this.stringPitches = stringPitches;
	}
	
    this.setStringPitch = function( stringNum, pitch) {
		this.stringPitches[stringNum] = pitch;
	}
	
    this.getStringPitch = function( stringNum) {
		return this.stringPitches[stringNum];
	}

    this.getIntervalToNextString = function( currStrNum) {
		if(currStrNum < this.stringPitches.length-2) {
			return this.stringPitches[currStrNum+1] - this.stringPitches[currStrNum];
		}
		return (this.stringPitches[0] - this.stringPitches[currStrNum]) % OCTAVE;
	}
	
    this.getIntervalDiff = function( thisStrNum, toThisStringNum) {
		if(thisStrNum < toThisStringNum) { 
			return this.stringPitches[toThisStringNum] - this.stringPitches[thisStrNum];
		}
		return (this.stringPitches[thisStrNum] - this.stringPitches[toThisStringNum]) % OCTAVE;
	}
	
    this.getHigherAdjacentString = function( currStrNum) {
		return (currStrNum < this.stringPitches.length-1)? currStrNum+1:0;
	}
}
