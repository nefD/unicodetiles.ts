
import * as UT from './main';
// import {Viewport} from './viewport';
// import {Tile} from './tile';

console.log('I am being executed..');
console.log(UT);
var w = 50, h = 26;
var term = new UT.Viewport(document.getElementById("game"), w, h, "webgl", false);
term.clear();
for (var j = 0; j < h; ++j) {
	for (var i = 0; i < w; ++i) {
		var c = 161 + j * w + i;
		var ch = String.fromCharCode(c);
		//var tile = new UT.Tile(ch, (Math.random()*255)|0, (Math.random()*255)|0, (Math.random()*255)|0);
		var tile = new UT.Tile("A", 255, 0, 0);
		term.put(tile, i, j);
	}
}
term.render();

createRendererSwitcher(false);

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