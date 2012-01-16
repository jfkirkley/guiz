WaitIcon = function(parent, options) {
	this.parent = parent? parent: null;
	if(options){
		for(option in options) {
			this[option] = options[option];
		}
	} else {
	    options = {};
	}
};

ObjectBuilder = function(parent, options) {
	this.parent = parent? parent: null;
	if(options){
		for(option in options) {
			this[option] = options[option];
		}
	} else {
	    options = {};
	}
	if(!options.hasOwnProperty('objectClassName')){			this.objectClassName = null;	}
	if(!options.hasOwnProperty('infoGenerator')){			this.infoGenerator = null;	}
	if(!options.hasOwnProperty('containerProvider')){			this.containerProvider = null;	}
};

ObjectBuilder.prototype.build = function( parentView, argHash ) {

	
    var obj = null;

	if(typeof this.objectClassName != "undefined" && this.objectClassName != null) {

		var tc = this.objectClassName;
		//consolewrp.log( "tc: " + tc );

        if (typeof(global[tc]) != "undefined") {
			obj = new lz[tc](parentView, argHash);
        }

	}
	return obj;
	
	
};

ObjectBuilder.prototype.buildTransparently = function( contextProvider ) {

	
    var obj = null;

	if( typeof this.infoGenerator     != "undefined" && this.infoGenerator     != null &&
		typeof this.containerProvider != "undefined" && this.containerProvider != null ) {

			obj = build( this.containerProvider.provide(contextProvider), 
				         this.infoGenerator.genHash(contextProvider) );
		}

	return obj;
	
	
};

miniscrollbar = function(parent, options) {
	this.parent = parent? parent: null;
	if(options){
		for(option in options) {
			this[option] = options[option];
		}
	} else {
	    options = {};
	}
};

stepper = function(parent, options) {
	this.parent = parent? parent: null;
	if(options){
		for(option in options) {
			this[option] = options[option];
		}
	} else {
	    options = {};
	}
	if(!options.hasOwnProperty('callback')){			this.callback = null;	}
	if(!options.hasOwnProperty('target')){			this.target = null;	}
	if(!options.hasOwnProperty('target_attr')){			this.target_attr = null;	}
	if(!options.hasOwnProperty('val')){			this.val = 0;	}
	if(!options.hasOwnProperty('temp')){			this.temp = 0;	}
	if(!options.hasOwnProperty('running')){			this.running = true;	}
	if(!options.hasOwnProperty('rate')){			this.rate = 1000;	}
	if(!options.hasOwnProperty('max')){			this.max = 1000;	}
};

stepper.prototype.start = function(  ) {

	
 	this.temp++;
	this.running=true;			
	setTimeout( this.callback, this.rate );

	
	
};

stepper.prototype.go = function(  ) {

	

	if(this.target!=null && this.target_attr != null ) {
		var v = this.target[this.target_attr];
		this.target[this.target_attr] =  v+1;
	}
	if(this.callback) {
		this.callback();
	}
	this.temp++;
	if(this.running) {			
		//this.stepperDelegate = new lz.Delegate( this, "go" );
		setTimeout( this.go, this.rate );
	}
	
	
};


stepper.prototype.stop = function(  ) {

	
	this.running=false;
	
	
};

stepper.prototype.started = function(  ) {

	
	return this.running;
	
	
};

stepper.prototype.pause = function(  ) {

	
	this.running=!this.running;
	if(this.running) {
		this.start();
	}
	
	
};

stepper.prototype.onval = function(  ) {

	
	if(this.temp % this.rate == 0 ) {
	}
	
	
};

requestHandler = function(parent, options) {
	this.parent = parent? parent: null;
	if(options){
		for(option in options) {
			this[option] = options[option];
		}
	} else {
	    options = {};
	}
	if(!options.hasOwnProperty('showWaitIcon')){			this.showWaitIcon = false;	}
	if(!options.hasOwnProperty('url')){			this.url = null;	}
	if(!options.hasOwnProperty('theDataSet')){			this.theDataSet = null;	}
	if(!options.hasOwnProperty('theDelegate')){			this.theDelegate = null;	}
	if(!options.hasOwnProperty('delegateObj')){			this.delegateObj = null;	}
	if(!options.hasOwnProperty('delegateMethod')){			this.delegateMethod = null;	}
	if(!options.hasOwnProperty('method')){			this.method = 'POST';	}
	if(!options.hasOwnProperty('type')){			this.type = 'http';	}
};

requestHandler.prototype.doCall = function( params, delegateObj, methodName, doDebugStart ) {

	

	if(typeof params != "undefined" && params != null) {
		var p = new lz.Param();

        if(typeof doDebugStart != "undefined" ) {
			if(doDebugStart) {
				p.addValue("XDEBUG_SESSION_START", "1");
			} else {
				p.addValue("XDEBUG_SESSION_STOP", "1");
			}
		}

		for(n in params) {
			p.addValue(n, params[n]);
		}
		this.theDataSet.setQueryString(p);
	}

	if(typeof delegateObj != "undefined" && delegateObj != null) {
		if(typeof this.theDelegate == "undefined" || this.theDelegate == null) {
			//this.theDelegate = new lz.Delegate(delegateObj, methodName, this.theDataSet, "ondata");
			this.delegateObj = delegateObj;
			this.delegateMethod = methodName;
			this.theDelegate = new lz.Delegate(this, "delegateHandler", this.theDataSet, "ondata");
		}
	}
	//consolewrp.log( "theDataSet: " + theDataSet );

	this.theDataSet.setQueryType(this.method);

	//consolewrp.log( "theDataSet.src: " + theDataSet.src );
	//consolewrp.log( "theDataSet.type: " + theDataSet.type );
	//consolewrp.log( "theDataSet: " + theDataSet );
	consolewrp.log( "rq -- url: " + url );

	if(showWaitIcon) {
		waiticon.show();
	}

	this.theDataSet.doRequest();

	
	
};

requestHandler.prototype.delegateHandler = function(  ) {

	
	if(showWaitIcon) {
		waiticon.hide();
	}

	consolewrp.log( "delegateHandler calling methodName: " + this.delegateMethod );
	this.delegateObj[this.delegateMethod]();
	
	
};

requestHandler.prototype.oninit = function(  ) {

	
	if(     (typeof this.theDataSet == "undefined" || this.theDataSet == null) 
		&&  (typeof this.url != "undefined" && this.url != null) ){

        var dsName = "ds_" + (new Date()).getTime();
		this.theDataSet = new lz.dataset(canvas, {src: this.url, type: this.type, name: dsName});
	}
	
	
};

draggerWithClient = function(parent, options) {
	this.parent = parent? parent: null;
	if(options){
		for(option in options) {
			this[option] = options[option];
		}
	} else {
	    options = {};
	}
};

draggerWithClient.prototype.onapply = function(  ) {

	parent.bringToFront();
	parent.opacity =  .5
	parent.dragClient.dragStartPoint(parent.immediateparent.getMouse('x'), parent.immediateparent.getMouse('y'), parent.name, this.parent);
    
};

draggerWithClient.prototype.onremove = function(  ) {

	parent.opacity =  1
	//consolewrp.log("imm: " + parent.immediateparent.getMouse('x') + ', ' + parent.immediateparent.getMouse('y'));
	parent.dragClient.dragStopPoint(parent.immediateparent.getMouse('x'), parent.immediateparent.getMouse('y'), parent.name, this.parent);
	//parent.anim.doStart();
    
};

CenteringDragable = function(parent, options) {
	this.parent = parent? parent: null;
	if(options){
		for(option in options) {
			this[option] = options[option];
		}
	} else {
	    options = {};
	}
	if(!options.hasOwnProperty('dragClient')){			this.dragClient = null;	}
	if(!options.hasOwnProperty('xDragDiff')){			this.xDragDiff = 0;	}
	if(!options.hasOwnProperty('yDragDiff')){			this.yDragDiff = 0;	}
};

CenteringDragable.prototype.correct = function( x,y ) {

	this.xDragDiff =  x-this.x;
	this.yDragDiff =  y-this.y;
	//consolewrp.log(this.xDragDiff + ', ' + this.yDragDiff);
	this.anim.doStart();
	
};

saveHandler = function(parent, options) {
	this.parent = parent? parent: null;
	if(options){
		for(option in options) {
			this[option] = options[option];
		}
	} else {
	    options = {};
	}
	if(!options.hasOwnProperty('dataSet')){			this.dataSet = null;	}
	if(!options.hasOwnProperty('dataSource')){			this.dataSource = null;	}
	if(!options.hasOwnProperty('otherParams')){			this.otherParams = null;	}
	if(!options.hasOwnProperty('dataParamName')){			this.dataParamName = null;	}
	if(!options.hasOwnProperty('method')){			this.method = 'POST';	}
};

saveHandler.prototype.doDirectSave = function( data,otherParams ) {

	

	var params;
	if(typeof otherParams != "undefined" && otherParams != null) {
		params = otherParams;			    
	} else {
		params={};
	}
	params[this.dataParamName] = data;
	this.theHandler.doCall(params);
	
	
};

saveHandler.prototype.doSave = function(  ) {

	

	var data = this.dataSource.getData();

	if( data != null ) {
		this.doDirectSave(data, null);
	}
	
	
	
};

saveButton = function(parent, options) {
	this.parent = parent? parent: null;
	if(options){
		for(option in options) {
			this[option] = options[option];
		}
	} else {
	    options = {};
	}
	if(!options.hasOwnProperty('saveHandler')){			this.saveHandler = null;	}
	if(!options.hasOwnProperty('queryWin')){			this.queryWin = null;	}
	if(!options.hasOwnProperty('verify')){			this.verify = true;	}
};

saveButton.prototype.isOk = function(  ) {

	
	this.saveHandler.doSave();
	
	
};

saveButton.prototype.isCancel = function(  ) {

	
	
	
};

saveButton.prototype.onclick = function(  ) {

	
	
	if(verify) {
		this.queryWin.askMe("Are you sure you want to overwrite the current rhthym file?", this);
	} else {
		this.saveHandler.doSave();
	}
	
	
};

AutoScroller = function(parent, options) {
	this.parent = parent? parent: null;
	if(options){
		for(option in options) {
			this[option] = options[option];
		}
	} else {
	    options = {};
	}
	if(!options.hasOwnProperty('client')){			this.client = null;	}
	if(!options.hasOwnProperty('stepper')){			this.stepper = null;	}
	if(!options.hasOwnProperty('step')){			this.step = 0;	}
};

AutoScroller.prototype.onstep = function(  ) {

	
	this.client.doScrollStep();
	
	
};

