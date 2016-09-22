
import * as UT from './main';
// import {Viewport} from './viewport';
// import {Tile} from './tile';

let chars: string = "☠☃⚙☻♞☭✈✟✂✯",
	term: UT.Viewport = null, 
	eng: UT.Engine = null, // Can't be initialized yet because DOM is not ready
	interval1: number = 0, 
	interval2: number = 0,
	start_time: number = 0,
	iterations = 0;

setTimeout( performanceTest, 100 );

//basicTest();

function performanceTest() {		

	console.log('performanceTest()');
	performanceInit();
	performanceStart();

}

function performanceInit( w: number = 51, h: number = 25 ) {

	w = w || 51;
	h = h || 25;
	let renderer: string = "auto";
	if (location.hash.indexOf("#dom") != -1) renderer = "dom";
	else if (location.hash.indexOf("#canvas") != -1) renderer = "canvas";
	else if (location.hash.indexOf("#webgl") != -1) renderer = "webgl";

	console.log('renderer: ', renderer);

	console.log('creating viewport');
	term = new UT.Viewport(document.getElementById("game"), w, h, "webgl", false);

	console.log('creating engine');
	eng = new UT.Engine(term, randomTile, w, h);

	let again = function () {
		window.location.href = window.location.pathname + document.getElementById("switch-renderer").getAttribute("href");
		window.location.reload(true);
	}

	document.getElementById("renderer").innerHTML = term.getRendererString();
	let a: HTMLAnchorElement = <HTMLAnchorElement>document.getElementById("switch-renderer");
	a.onclick = again;
	if (term.getRendererString() === "dom") {
		a.innerHTML = "Switch to WebGL renderer";
		a.href = "#webgl";
	} else if (term.getRendererString() === "canvas") {
		a.innerHTML = "Switch to DOM renderer";
		a.href = "#dom";
	} else if (term.getRendererString() === "webgl") {
		a.innerHTML = "Switch to &lt;canvas&gt; renderer";
		a.href = "#canvas";
		
	}	

}

function performanceStart() {
	interval1 = window.setInterval(performanceResult, 5000);
	start_time = (new Date()).getTime();
	interval2 = window.setInterval(performanceTick, 0);
}

function performanceTick() {
	eng.update();
	term.render();
	++iterations;	
}

function performanceResult() {
	var diff = (new Date()).getTime() - start_time;
	clearInterval(interval1);
	clearInterval(interval2);
	var elem = document.getElementById("result");
	elem.innerHTML =
		"Iterations: " + iterations + " (in " + diff + " ms)<br/>" +
		"Average time: " + diff/iterations + " ms";
}

// Returns a random tile
function randomTile ( x: number, y: number ) {

	var r = Math.floor( Math.random() * 255 );
	var g = Math.floor( Math.random() * 255 );
	var b = Math.floor( Math.random() * 255 );
	var c = Math.floor( Math.random() * chars.length );
	// console.log('returning new character %s with color %d, %d, %d', chars[ c ], r, g, b );
	return new UT.Tile( chars[ c ], r, g, b );

};

function basicTest() {

	var w = 50, h = 26;
	var term = new UT.Viewport(document.getElementById("game"), w, h, "webgl", false);
	term.clear();
	for (var j = 0; j < h; ++j) {
		for (var i = 0; i < w; ++i) {
			var c = 161 + j * w + i;
			var ch = String.fromCharCode(c);
			var tile = new UT.Tile(ch, (Math.random()*255)|0, (Math.random()*255)|0, (Math.random()*255)|0);
			//var tile = new UT.Tile("A", 255, 0, 0);
			term.put(tile, i, j);
		}
	}
	term.render();
	createRendererSwitcher(false);

}

function createRendererSwitcher(doSwitch: boolean) {
	// Determine the current renderer and the next one
	var curR = term.getRendererString();
	var nextR: string, pretty: string;
	if (curR === "webgl") {
		nextR = "canvas";
		pretty = "&lt;canvas&gt;";
	} else if (curR === "canvas") {
		nextR = "dom";
		pretty = "DOM";
	} else {
		nextR = "webgl";
		pretty = "WebGL";
	}
	// Do we switch?
	if (doSwitch) {
		term.setRenderer(nextR);
		term.render();
		createRendererSwitcher(false); // Call again to update, but this time no switching
		return;
	}
	// The HTML
	var html = '<p>Renderer: <span id="renderer">'+curR+'</span> ';
	html += '<a onclick="createRendererSwitcher(true)" href="#">Switch to '+pretty+'</button></p>';
	document.getElementById("renderer-switcher").innerHTML = html;
}