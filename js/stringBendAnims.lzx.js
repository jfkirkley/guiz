function doBend(p,f,dot, isX, noteInfo, stringView) {

	var string = noteInfo.getString();
	var fret = noteInfo.getFret();

	var lf = getFretPosition(fret);
	var hf = getFretPosition(fret+1);
	var bendPoint = (lf+hf+4*guitY+fret/2)/2;
	var stringObj = stringView.getString(noteInfo);

	this.dot = dot;
	//
	var offset = dot.jqDivObj.offset();
	consolewrp.log( offset.left + ":" + offset.top);
	var paramObjs = [];

	var currPoint = isX? offset.left: offset.top;

	f = (f-f/10) / 12;//(p.length/2);
	var factor = 0;

	var lastPos = 0;
	var td = 0;
	for( var i = 0; i < p.length; i+=2 ) {
		var pos = p[i]-lastPos;

		var val = p[i+1];

		//consolewrp.log( "pos: " + pos + ", " + val );

		if(i > 0 ) {
			val-=p[i-1];
		}
		factor += val*4;
		//consolewrp.log( "factor: " + factor );
		
		val = isX? currPoint-val*4:val*4+currPoint;

		//consolewrp.log( "val: " + val );
		paramObjs.push({to: val + "px", duration: pos*f, easing: i==2? "easeInQuad": "linear", factor: factor});
		
		td+=pos*f;

		lastPos = pos;
		currPoint = val;
	}

//	consolewrp.log( "_____________________________________td: " + td );

	dot.allowBend = true;

	doAnim(dot.jqDivObj, paramObjs, isX, stringObj, bendPoint);

};


function doAnim(target, paramObjs, isX, stringObj, bendPoint){

	var paramObj = paramObjs.shift();

	//"\"" + paramObj.attr + "\":" paramObj.to}, 
	//consolewrp.log( "paramObj: " + paramObj.to + ", " + paramObj.duration + ", " + paramObj.easing );

	//if(paramObj.factor!=0)
	stringObj.bend(bendPoint, paramObj.factor, paramObj.duration, paramObj.easing);
	
	target.animate( isX? {left: paramObj.to}:{top: paramObj.to},
					{duration: paramObj.duration, 
					 easing: paramObj.easing,
					 complete: 
					 function() {
						 if(paramObjs.length) {
							 //consolewrp.log( "doNoteBend" );

							 doAnim(target, paramObjs, isX, stringObj, bendPoint);
						 } else {
							 //consolewrp.log( "UnBend" );
							 stringObj.unbend();
						 }
					 }});
}


function onstop(p,f,dot) {

	this.target.setAttribute(this.subnodes[0].attribute, this.startPoint);
	this.dot.allowBend = false;

	strings.unbend();  

};

