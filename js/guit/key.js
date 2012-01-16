

function Key(){

    this.keyName = "C";
    this.keyNum = 3;
    this.A = 0;
	
    this.keyNameArr = [ "A", "A#/Bb","B","C","C#/Db","D","D#/Eb","E","F","F#/Gb","G","G#/Ab" ];
    this.flatKeyNameArr = [ "A", "Bb","B","C","Db","D","Eb","E","F","Gb","G","Ab" ];
    this.sharpKeyNameArr = [ "A", "A#","B","C","C#","D","D#","E","F","F#","G","G#" ];
	
    this.Key = function() {
		
	}

    this.Key = function( keyName) {
		this.setKeyName(keyName);
	}
	
    this.Key = function( keyNum) {
		this.setKeyNum(keyNum);
	}

    this.getKeyName = function() {
		return this.keyName;
	}

    this.setKeyName = function( keyName) {
		this.keyName = keyName;
		this.keyNum = findIndex(this.keyNameArr,keyName);
	}
    this.getKeyNum = function() {
		return this.keyNum;
	}
    this.setKeyNum = function( keyNum) {
		this.keyNum = keyNum;
		this.keyName = this.keyNameArr[keyNum];
	}
	
    this.getRootRelativeToA = function() {
		return this.keyNum-3; 
	}

    this.getNoteAtOffsetInteval = function(keyName, interval) {
	  var index = this.getRootRelativeToA(keyName);
	  var newInterval = index + interval;
	  var numTones = this.flatKeyNameArr.length;
	  if( newInterval >= numTones ) {
		newInterval -= numTones;
	  } else if( newInterval < 0 ) {
		newInterval += numTones;
	  }
	  return this.flatKeyNameArr[newInterval];
	}

    this.getRootRelativeToA = function( keyName) {
	  if(keyName=="Fb") keyName = "E";
	  if(keyName=="Cb") keyName = "B";
	  if(keyName=="E#") keyName = "F";
	  if(keyName=="B#") keyName = "C";
	  var index = findIndex(this.flatKeyNameArr,keyName);
		if( index == -1) {
		  return findIndex(this.sharpKeyNameArr,keyName);
		}
		return index;
	}
}
