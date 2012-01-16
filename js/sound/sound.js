

function AudioProcessor(sampleRate) {
	this.sampleRate = sampleRate;

	this.stopped = true;
	this.size = 0;
	this.currentWritePosition = 0;

	this.isStereo=false;
	this.writeCallback = null;

	this.index = 0;
	this.tempo = 120;
	this.currOffset = 0;

	this.timesStopped = 0;
	this.dev = null;

	this.cache = new Float32Array(500*22050); //22050 = 1 second
	this.cachePointers = [];
	this.lastIndex = 0;
};


AudioProcessor.prototype.setTempo = function(tempo) {
	this.tempo = tempo;
};

AudioProcessor.prototype.isDummy = function() {
	return this.dev? this.dev.type=='dummy': false;
};

AudioProcessor.prototype.setLength = function(numBeats) {
	var buffSize = Math.ceil(numBeats*60/this.tempo*this.sampleRate);
	consolewrp.log( "buffSize: " + buffSize );
	this.samples = new Float32Array(buffSize);
	for(var i=0; i < this.samples.length; i++){
		this.samples[i] = 0;
	}
	this.resetCache();
};

AudioProcessor.prototype.setWriteCallback = function(cb) {
	this.writeCallback = cb;
};


AudioProcessor.prototype.play = function() {
	this.stopped = false;
};

AudioProcessor.prototype.reinitDevice = function() {
	if(this.dev) this.dev.kill();
	var preBufferSize = 65536 * 4096;
	this.dev = audioLib.AudioDevice(_.bind(this.readFn,this), 
									this.isStereo?2:1, 
									preBufferSize, 
									this.sampleRate, 
									this.writeCallback);
};

var xxxx=0;
AudioProcessor.prototype.readFn = function(soundData) {
	if(this.stopped) return; // empty sampleBuffer, no prob

	//if(++xxxx%10==0) {			consolewrp.log( "currOffset: " + this.currOffset );}

	if(this.isStereo) {
		for(var i=0; i<soundData.length && i<this.samples.length-this.currOffset; i+=2){
			soundData[i] = this.samples[this.currOffset+i/2];
			soundData[i+1] = this.samples[this.currOffset+i/2];
		}
	} else {
		//		consolewrp.log( "isMono: " );
		for(var i=0; i<soundData.length && i<this.samples.length-this.currOffset; i++){
			soundData[i] = this.samples[this.currOffset+i];
		}			
	}
	this.currOffset+=i;

	//return soundData;
};


AudioProcessor.prototype.getNoteDuration = function(quarterNoteValue) {
	return this.sampleRate * quarterNoteValue * 60 / this.tempo;
};


AudioProcessor.prototype.getNoteValue = function(frequency) {
	return 2* Math.PI * frequency / this.sampleRate;
};


AudioProcessor.prototype.set = function(noteVal, duration, numSamples) {
	this.cachePointers[noteVal + ":" + duration] = this.lastIndex;
	this.lastIndex += numSamples;
};

AudioProcessor.prototype.get = function(noteVal, duration) {
	return this.cachePointers[noteVal + ":" + duration]?this.cachePointers[noteVal + ":" + duration]:-1;
};

AudioProcessor.prototype.resetCache = function() {
	this.cachePointers = [];
	this.lastIndex = 0;
}

AudioProcessor.prototype.appendNote = function(noteValue, duration, timingPointer) {

	var frequency = 440 * Math.pow(2,(noteValue - 12)/12);	

	var start = Math.ceil(this.sampleRate * timingPointer * 60 / this.tempo);
	var end = Math.floor(this.sampleRate * ((timingPointer + duration) * 60 / this.tempo));

	var pointer = this.get(noteValue, duration);

	if(pointer >= 0) {

		var sampleLength = end - start;
		for (var i = 0; i < sampleLength; i++) {
			this.samples[i+start] += this.cache[pointer+i];
		}

	} else {

		var envelope, t = 120/this.tempo;
		envelope = new ADSR(0.01*t, duration*0.05*t, 0.5, 0.44*duration*t, 0.01*t, this.sampleRate);
		// add ADSR envelope to fade in and out note
		envelope.process(this.samples,this.getNoteValue(frequency),start,end,this.cache,this.lastIndex);
		this.set(noteValue,duration,end-start);
	}

	this.size = end;
};

AudioProcessor.prototype.appendNoteBend = function(noteValue, bendPoints, duration, timingPointer) {

	var frequency = 440 * Math.pow(2,(noteValue - 12)/12);	

	var start = Math.ceil(this.sampleRate * timingPointer * 60 / this.tempo);
	var end = Math.floor(this.sampleRate * ((timingPointer + duration) * 60 / this.tempo));

	var pointer = this.get(noteValue, duration);

	if(pointer >= 0) {

		var sampleLength = end - start;
		for (var i = 0; i < sampleLength; i++) {
			this.samples[i+start] += this.cache[pointer+i];
		}

	} else {

		var envelope, t = 120/this.tempo;
		envelope = new ADSR(0.01*t, duration*0.05*t, 0.5, 0.44*duration*t, 0.01*t, this.sampleRate);
		consolewrp.log( "noteValue: " + noteValue );

		// add ADSR envelope to fade in and out note
		envelope.processBend(this.samples,

							 //audioProcessor.preProcessBendPoints(bendPoints, 2, noteValue),

							 noteValue,
							 bendPoints,
							 start,end,
							 this.cache,
							 this.lastIndex);

		//this.set(noteValue,duration,end-start);
	}

	this.size = end;
};

AudioProcessor.prototype.setBeat = function(beatValue) {
	consolewrp.log( "beatValue: " + beatValue );
	this.currOffset = Math.ceil(beatValue*60/this.tempo*this.sampleRate);
	consolewrp.log(this.tempo + " : " + this.size+  " currOffset: " + this.currOffset );
};

AudioProcessor.prototype.clearIt = function() {
	this.currentWritePosition = this.currOffset = 0;
};

AudioProcessor.prototype.stopIt = function() {
    this.stopped = !this.stopped;	
};



var audioProcessor = new AudioProcessor(44100);


function playTone() {
	audioProcessor.play();
}



AudioProcessor.prototype.preProcessBendPoints = function(p, duration, noteValue) {

	var currPoint = 440 * Math.pow(2,(noteValue - 12)/12);	
	var lastVal = 0;
	var newPoints = [];

	for( var i = 0; i < p.length; i+=2 ) {
		var pos = p[i];//-lastVal;

		var val = p[i+1];//-lastVal;

		//consolewrp.log( "pos: " + pos + ", " + val );

		if(i > 0 ) {
			//val-=p[i-1];
		}
		//consolewrp.log( "factor: " + factor );
		//consolewrp.log( "factor: " + factor );

		var changeFactor = (val==lastVal)?0:2; // bends process adds a semitone per tone bent, this compensates...
		lastVal = val;
		consolewrp.log( "changeFactor: " + changeFactor );
		
		//val = val*4+currPoint;
		val = 440 * Math.pow(2,(noteValue+val/(2+changeFactor) - 12)/12);
		consolewrp.log( "val: " + val );
		val = this.getNoteValue(val);
		//consolewrp.log( "val: " + val );

		consolewrp.log( "pos: " + duration*pos/12);
		consolewrp.log( "val: " + val );

		newPoints.push(pos);
		newPoints.push(val);
		


		//currPoint = val;
	}

	return newPoints;

};


//var points =[0,0,6,4,12,4];

//var points = [0,0,3,4,6,4,9,0,12,0];
var points = [0,0,3,4,6,4,9,0,12,0];



//function nit() {
$(document).ready(
function() {

	var val = 440 * Math.pow(2,(12 - 12)/12);
	consolewrp.log( "val: " + val );	

	if(false)
	for (var i = -2.0; i < 2; i+=0.1) {
		var testPoint = Math.sin(i);// * midPoint);
		var b = Math.asin(testPoint);// * midPoint);
		consolewrp.log( i + ": " + testPoint + " : "  + b );	
	}
	val = 440 * Math.pow(2,(10 - 12)/12);
	consolewrp.log( "val: " + val );
	audioProcessor.reinitDevice();
	audioProcessor.setTempo(60);
	audioProcessor.setLength(60);

	if(false){
		
		audioProcessor.appendNote(10, 1,0);
		audioProcessor.appendNote(12, 1,1);
		audioProcessor.appendNote(10, 1,2);
		audioProcessor.appendNote(12, 1,3);
		audioProcessor.appendNoteBend(10, points,2,4);
		audioProcessor.appendNote(12, 2,6);

	} else if(false){
		
		audioProcessor.appendNoteBend(10, points,.25,0);
		audioProcessor.appendNote(12, 1,.25);

		audioProcessor.appendNoteBend(10, points,.5,1.25);
		audioProcessor.appendNote(12, 1,1.75);
	} else {
		
		audioProcessor.appendNote(10, 1,0);
		audioProcessor.appendNoteBend(10, points,1,1);
		//audioProcessor.appendNote(10, 2,0);
		audioProcessor.appendNote(12, 2,2);
	}

	//audioProcessor.appendNote(12, 2,3);

	
});

