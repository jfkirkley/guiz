//var rootDir =  "/itabs/sites/newGuizzard/index/";
var rootDir =  "/";


$(document).ready(
	function(){



		var alphaButtonSize = "8px";
		$("#alphaIndex button:first")
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); })
			.parent()
			.buttonset();

		$("#alphaIndex2 button:first")

			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); })

			.parent()
			.buttonset();

		$("#alphaIndex3 button:first")

			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); }).next()
			.button().css("font-size", alphaButtonSize).click(function() { get($(this).text()); })
			.parent()
			.buttonset();
		
        $("#theme").change(
        	function(e){
                    e.preventDefault();
                    var theme = $("#theme option:selected").val();
                    //consolewrp.log( "theme: " + theme );                                                                                                                                                                                  
                    //updateCSS("/itabs/sites/jquery-ui-themes-1.8.7/themes/" + theme + "/jquery-ui.css");
                    updateCSS(rootDir + "css/jquery-ui-themes-1.8.7/themes/" + theme + "/jquery-ui.css");
            });

		var queryParams = getUrlVars();
		//consolewrp.log( "queryParams: " + queryParams );
		var depth = 1;
		if(typeof queryParams.artist != "undefined") {
			depth++;
			$("#artistName").append("<i>Tabs for </i><b>" + decodeURI(queryParams.artist) + "</b>" );
			if(typeof queryParams.song != "undefined") {
				depth++;
				setNavPath(queryParams.id, queryParams.artist, queryParams.song);
			} else {
				setNavPath(queryParams.id, queryParams.artist);
			}
		} else {
			setNavPath(queryParams.id);
		}

		var indexTab = $("#indexTab").tabs(
			{
				tabTemplate: "<li><a href='#{href}'>#{label}</a> </li>"
			});

		var tabTool = null;
		var tabCount = 0;

		indexTab.bind( "tabsadd", function(event, ui) {
						 $(ui.panel).append('  <div class="tabView">' +
											'</div>');

					 });
		
		var numRowsPerTab = 30;

		var tabCount = 0;

		if(!queryParams.id){
			//window.location = "http://guizzard.com/guiz.html?tab=pgf&type=scoreAndTab&id=l/l48&artist=Led%20Zeppelin&song=Stairway%20To%20Heaven";
			window.location = "http://guizzard.com/guiz.html?tab=lyf&type=scoreAndTab&id=p/p127&artist=Pink%20Floyd&song=Wish%20You%20Were%20Here";
		}
		var jsId = queryParams.id? queryParams.id: "front.js";
		//$.getScript(rootDir  + "js/indices/" + queryParams.id,
//		if(jsId = "xxxxxxxx")
		$.getScript(rootDir  + "index/" + jsId,
			function(){

				var theCurrentIndex = null;
				if(typeof artistIndex == "undefined") {
					theCurrentIndex = songIndex;
				} else {
					theCurrentIndex = artistIndex;
				}

				var keys = [];
				var map = {
					
				};
				for(var k in theCurrentIndex) {
					var nk = k.toLowerCase();
					if(!map[nk]) {
						keys.push(nk);
						map[nk] = [];
					}
					map[nk].push(k);
				}
				keys.sort();
				for(  var i = 0; i < keys.length; ++i) {
					var keyArray = map[keys[i]];

					for(  var j = 0; j < keyArray.length; ++j) {
						k = keyArray[j];
						var afile = queryParams.id + "/" + theCurrentIndex[k];

						if(tabCount % numRowsPerTab == 0) {
							if(queryParams.id){
								indexTab.tabs("add", "#tab" + tabCount, k.length>1 ? k.substring(0,2).toUpperCase():k.substring(0,1).toUpperCase());
							} else {
								indexTab.tabs("add", "#tab" + tabCount, "Popular Tabs");
							}
						}

						++tabCount;
						$("#indexTab div:last").append("<span class=\"ui-widget-content ui-corner-all\">" + k + "</span><br/>");

						var currLetter = k.substring(0,1).toLowerCase();

						$("#indexTab div:last span:last")
							.css("font-size", "12px")
							.css("width", "280px")
							.css("padding-left", "4px")
							.css("padding-right", "4px")
							.css("margin", "2px")
							.mouseover( 
								function(e){
									$(this).css("background", "#ccc");
								})
							.mouseout( 
								function(e){
									$(this).css("background", "#FFF");
								})
							.click( 
								function(e){
									var currText = $(this).text();
									//consolewrp.log( "afile: " + queryParams.id + "/" + theCurrentIndex[currText] );

									if(depth == 1) {
										if(queryParams.id){
											window.location = "./index.html?id=" + currLetter + "/" + theCurrentIndex[currText] + "&artist=" + encodeURI(currText);
										} else {
											window.location = "./index.html?id=" + theCurrentIndex[currText] + "&artist=" + encodeURI(currText);
										}
									} else {
										//window.location = "./index.html?id=" + currLetter + "/" + theCurrentIndex[currText] + "&artist=" + encodeURI(queryParams.artist) + "&song=" + encodeURI(currText) ;
										//window.location = "/itabs/sites/newGuizzard/guiz.html?tab=" + theCurrentIndex[currText] 
										window.location = rootDir + "guiz.html?tab=" + theCurrentIndex[currText] 
											+ "&type=scoreAndTab"  
											+ "&id=" + queryParams.id
											+ "&artist=" + queryParams.artist
											+ "&song=" + encodeURI(currText) ;
									}
								}).hover(function() {
											 $(this).css('cursor','pointer');
										 }, function() {
											 $(this).css('cursor','auto');
										 });


					}
				}
			});
		//BrowserDetect.init();

	});
//http://localhost