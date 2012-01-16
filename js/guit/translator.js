

function Translator(){
	
	this.tuning = new Tuning();
	this.key = new Key();
	
    this.Translator = function() {
		this.tuning = new Tuning();
		this.key = new Key();
	}

    this.getTuning = function() {
		return tuning;
	}

    this.setTuning = function( tuning) {
		this.tuning = tuning;
	}

    this.getKey = function() {
		return key;
	}

    this.setKey = function( key) {
		this.key = key;
	}

    this.getFret = function( chord, string) {
		var interval = chord.getStringInterval(string);
		var baseInterval = this.tuning.getStringPitch(string);
		var keyOffset = this.key.getRootRelativeToA();
		var relOffset = chord.getRootRelativeInterval();
		return relOffset + keyOffset - baseInterval + interval;
	}

    this.getFret = function( chord, interval, string) {
		var baseInterval = this.tuning.getStringPitch(string);
		var keyOffset = this.key.getRootRelativeToA();
		var relOffset = chord.getRootRelativeInterval();
		return relOffset + keyOffset - baseInterval + interval;
	}

    this.getString = function( chord, interval, usedStrings) {
		var rootString = chord.getRootString();
		
		var nextString = rootString;
		var lastString = rootString;

		var rootFret = this.getFret(chord, ROOT, rootString);
		var upperFretBound = rootFret + chord.getFretRangeRightOfRoot();
		var lowerFretBound = rootFret - chord.getFretRangeLeftOfRoot();
		
		lowerFretBound = lowerFretBound > 0 ? 0: lowerFretBound; 
		
//		alert();
//		alert("--------------------------------------------------------------------------------------");
//		alert("chord: " + chord);
//		alert("interval: " + interval);
		//alert("rootString: " + rootString);
//		alert("rootFret: " + rootFret);
//		alert("upperFretBound: " + upperFretBound);
//		alert("lowerFretBound: " + lowerFretBound);


//		alert();
//		alert();

		var fret = this.getFret(chord, interval, nextString);
		if( fret <= upperFretBound && fret >= lowerFretBound && findIndex(usedStrings,nextString) == -1) { 
			return nextString;
		}
		
		do{
			var intervalToNextString = this.tuning.getIntervalDiff(rootString, nextString);
			var maxIntervalPossible = intervalToNextString + upperFretBound-rootFret;
			fret = this.getFret(chord, interval, nextString);
			
            //alert("intervalToNextString: " + intervalToNextString);
            //alert("maxIntervalPossible: " + maxIntervalPossible);
//    		alert("fret: " + fret);
            
			if( fret <= upperFretBound && fret >= lowerFretBound && findIndex(usedStrings,nextString) == -1 && interval <= maxIntervalPossible) {
				return nextString;
			}
			
			lastString = nextString;
			nextString = this.tuning.getHigherAdjacentString(lastString);
			
            //alert("nextString: " + nextString);
//			alert("lastString: " + lastString);
//			alert();
			
		} while(nextString!=rootString);
		
		return lastString;
	}
		
}
