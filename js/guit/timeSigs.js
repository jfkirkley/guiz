function TimeSig( valuesArray ) {

	this.measureNum  = valuesArray[0];
	this.numerator   = valuesArray[1];
	this.denominator = valuesArray[2];
	this.duration    = valuesArray[3];

	this.toString = function() {
		return this.measureNum + ": " + this.numerator + "/" + this.denominator + " at " + this.duration;
	}
}


function TimeSigHandler( inputStr ) {

	this.measureNumToTimSigMap = {};
	this.staffIterator = null;

	this.init = function(inputStr) {
		consolewrp.log( "-------inputStr: " + inputStr );
		var measureNum = 0;
		var valuesArray = [1,0,0,0];
		var valuesArrayIndex = 1;
		var currNum = 0;

		for(var i = 0; i < inputStr.length; ++i ) {
	
			var cc = inputStr.charCodeAt(i);
			//consolewrp.log( "cc: " + cc );
	
			if(cc >= 48 && cc <= 57) {      // 0 - 9
				currNum = currNum*10+(cc-48);
	
			} else if(cc == 10 || cc == 32) { // space or newline
				continue;
	
			} else if(cc == 58 ) {   // ':'
	
				measureNum = valuesArray[0];
				this.measureNumToTimSigMap[measureNum+""] = new TimeSig( valuesArray );

				valuesArrayIndex=0;
				valuesArray[valuesArrayIndex++] = currNum;
				currNum = 0;
	
			} else if(cc == 47 ) {   // '/'

				valuesArray[valuesArrayIndex++] = currNum;
				currNum = 0;
			
			} else if(cc == 44 ) {   //  comma

				valuesArray[valuesArrayIndex++] = currNum;
				currNum = 0;
			}
		}
	}

	this.toString = function() {

		var s = "";
		var ts = null;
		for(ts in this.measureNumToTimSigMap) {
			s += "    " + this.measureNumToTimSigMap[ts].toString() + "\n";
		}

		return s;
	}


	this.isRestMeasure = function(measureNum) {

		var bil = this.staffIterator.staffInfoList[this.staffIterator.staffIndex].beatInfoList;
		
        for(var i = this.staffIterator.currBeatInfoListIndex; i < bil.length; ++i ) {
            if(bil[i].m != measureNum) {
				break;
			}
            if(bil[i].notes != null) {
				return false;
			}
		}

		return true;
	}


	this.init(inputStr);
}