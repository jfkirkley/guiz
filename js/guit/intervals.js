var NUM_STRINGS=6;

var E_STRING = 0;
var A_STRING = 1;
var D_STRING = 2;
var e = 101; 
var G_STRING = 3;
var B_STRING = 4;
var e_STRING = 5;

var MUTE = -1;

var ROOT = 0;
var MINOR_SECOND = 1;
var a = 51;
var SECOND = 2;
var MINOR_THIRD = 3;
var THIRD = 4;
var FOURTH = 5;
var FLAT_FIFTH = 6;
var FIFTH = 7;
var MINOR_SIXTH = 8;
var SIXTH = 9;
var DOM_SEVENTH = 10;
var SEVENTH = 11;
var OCTAVE = 12;
var FLAT_NINTH = 13;
var NINTH = 14;
var TENTH = 16;
var SHARP_NINTH = 15;
var FLAT_ELEVENTH = 16;
var ELEVENTH = 17;
var va = 109; 
var SHARP_ELEVENTH = 18;
var TWELFTH = 19;
var FLAT_THIRTEENTH = 20;
var THIRTEENTH = 21;
var SHARP_THIRTEENTH = 22;
var FOURTEENTH = 23;
var eng = 50; 
var FIFTEENTH = 24;
var SIXTEENTH = 26;


var LOWER_OCTAVE = -OCTAVE;

var NUM_INTERVALS = SHARP_THIRTEENTH + 1;

var intervalColors	= new Array(NUM_INTERVALS);

var num2intervalMap = {1: ROOT,
					   2: SECOND, 
					   b2: MINOR_SECOND,
					   bb2: ROOT,
					   s2: MINOR_THIRD,
					   ss2: THIRD,

					   3: THIRD,
					   b3: MINOR_THIRD,
					   bb3: SECOND,
					   s3: FOURTH,
					   ss3: FLAT_FIFTH,

					   4: FOURTH,
					   b4: THIRD,
					   bb4: MINOR_THIRD,
					   s4: FLAT_FIFTH,
					   ss4: FIFTH,

					   5: FIFTH,
					   b5: FLAT_FIFTH,
					   bb5: FOURTH,
					   s5: MINOR_SIXTH,
					   ss5: SIXTH,

					   6: SIXTH,
					   b6: MINOR_SIXTH,
					   bb6: FIFTH,
					   s6: DOM_SEVENTH,
					   ss6: SEVENTH,

					   7: SEVENTH,
					   b7: DOM_SEVENTH,
					   bb7: SIXTH,
					   s7: OCTAVE,
					   ss7: FLAT_NINTH,

					   8: OCTAVE,

					   9: NINTH,
					   b9: FLAT_NINTH,
					   bb9: OCTAVE,
					   s9: SHARP_NINTH,
					   ss9: FLAT_ELEVENTH,

					   b10: TENTH-1,
					   10: TENTH,

					   11: ELEVENTH,
					   b11: FLAT_ELEVENTH,
					   bb11: SHARP_NINTH,
					   s11: SHARP_ELEVENTH,
					   ss11: SHARP_ELEVENTH+1,

					   12: TWELFTH,

					   13: THIRTEENTH,
					   b13: FLAT_THIRTEENTH,
					   bb13: SHARP_ELEVENTH+1,
					   s13: SHARP_THIRTEENTH,
					   ss2: SHARP_THIRTEENTH+1,

					   b14: FOURTEENTH-1,
					   14: FOURTEENTH,
					   
					   15: FIFTEENTH,

					   b16: SIXTEENTH-1,
					   16: SIXTEENTH,
					   s16: SIXTEENTH+1,

					   b17: 27,
					   17: 28,
					   s17: 29,

					   b18: 28,
					   18: 29,
					   s18: 30,

					   b19: 30,
					   19: 31,
					   s19: 32,

					   b20: 32,
					   20: 33,
					   s20: 34,

					   b21: 34,
					   21: 35,
					   s21: 36,

					   22: 36,

					   b23: 37,
					   23: 38,
					   s23: 39,

					   b24: 39,
					   24: 40,
					   s24: 41,

					   b25: 40,
					   25: 41,
					   s25: 42,

					   b26: 42,
					   26: 43,
					   s26: 44,

					   b27: 44,
					   27: 45,
					   s27: 46,

					   b28: 46,
					   28: 47,
					   s28: 48,

					   29: 48
					  };


var interval2symMap = {
	ROOT: "1",
	MINOR_SECOND: "b2",
	SECOND: "2", 
	MINOR_THIRD: "b3",
	THIRD: "3",
	FOURTH: "4",
	FLAT_FIFTH: "b5",
	FIFTH: "5",
	MINOR_SIXTH: "b6",
	SIXTH: "6",
	DOM_SEVENTH: "b7",
	SEVENTH: "7",
	FLAT_NINTH: "b9",
	NINTH: "9",
	SHARP_NINTH: "#9",
	FLAT_ELEVENTH: "b11",
	ELEVENTH: "11",
	SHARP_ELEVENTH: "#11",
	FLAT_THIRTEENTH: "b13",
	THIRTEENTH: "13",
	SHARP_THIRTEENTH: "#13"}

var symbols = [ 
	"1",
	"b2",
	"2", 
	"b3",
	"3",
	"4",
	"b5",
	"5",
	"#5",
	"6",
	"b7",
	"7",
	"1",
	"b9",
	"9",
	"#9",
	"b11",
	"11",
	"#11",
	"5",
	"b13",
	"13",
	"#13"];


function getSymbol(interval) {

	//consolewrp.log(interval);
	if(interval < 0 ) return "";
	var sym = symbols[interval];
	if(sym==null) {
		return "";
	}
	return sym;

	//  for(sym in num2intervalMap) {
	//	if( interval == num2intervalMap[sym]) {
	//		var symbol = "";
	//		for(var j = 0; j < sym.length; ++j ) {
	//			if(sym.charAt(j) == "s") {
	//				symbol+="#";
	//			} else {
	//				symbol+=sym.charAt(j);
	//			}
	//		}
	//		return symbol;
	//	}
	//  }
	//  return "1";
}


//	static {
//		intervalColors[ROOT] = Color.BLACK;
//		intervalColors[MINOR_SECOND] = Color.PINK.darker().darker();
//		intervalColors[SECOND] = Color.PINK;
//		intervalColors[MINOR_THIRD] = Color.GREEN.darker().darker();
//		intervalColors[THIRD] = Color.GREEN;
//		intervalColors[FOURTH] = Color.YELLOW;
//		intervalColors[FLAT_FIFTH] = Color.CYAN;
//		intervalColors[FIFTH] = Color.ORANGE;
//		intervalColors[MINOR_SIXTH] = Color.BLUE.darker().darker();
//		intervalColors[SIXTH] = Color.BLUE;
//		intervalColors[DOM_SEVENTH] = Color.MAGENTA;
//		intervalColors[SEVENTH] = Color.MAGENTA.darker().darker();
//		intervalColors[OCTAVE] = Color.BLACK;
//		intervalColors[FLAT_NINTH] = intervalColors[FLAT_NINTH - OCTAVE];
//		intervalColors[NINTH] = intervalColors[NINTH - OCTAVE];
//		intervalColors[SHARP_NINTH] = intervalColors[SHARP_NINTH - OCTAVE];
//		intervalColors[FLAT_ELEVENTH] = intervalColors[FLAT_ELEVENTH - OCTAVE];
//		intervalColors[ELEVENTH] = intervalColors[ELEVENTH - OCTAVE];
//		intervalColors[SHARP_ELEVENTH] = intervalColors[SHARP_ELEVENTH - OCTAVE];
//		intervalColors[FLAT_THIRTEENTH - 1] = intervalColors[FLAT_THIRTEENTH - 1 - OCTAVE];
//		intervalColors[FLAT_THIRTEENTH] = intervalColors[FLAT_THIRTEENTH - OCTAVE];
//		intervalColors[THIRTEENTH] = intervalColors[THIRTEENTH - OCTAVE];
//		intervalColors[SHARP_THIRTEENTH] = intervalColors[SHARP_THIRTEENTH - OCTAVE];
//	}
