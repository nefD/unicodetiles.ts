/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, UT) {
	    "use strict";
	    // import {Viewport} from './viewport';
	    // import {Tile} from './tile';
	    let chars = "☠☃⚙☻♞☭✈✟✂✯", term = null, eng = null, // Can't be initialized yet because DOM is not ready
	    interval1 = 0, interval2 = 0, start_time = 0, iterations = 0;
	    setTimeout(performanceTest, 100);
	    //basicTest();
	    function performanceTest() {
	        console.log('performanceTest()');
	        performanceInit();
	        performanceStart();
	    }
	    function performanceInit(w = 51, h = 25) {
	        w = w || 51;
	        h = h || 25;
	        let renderer = "auto";
	        if (location.hash.indexOf("#dom") != -1)
	            renderer = "dom";
	        else if (location.hash.indexOf("#canvas") != -1)
	            renderer = "canvas";
	        else if (location.hash.indexOf("#webgl") != -1)
	            renderer = "webgl";
	        console.log('renderer: ', renderer);
	        console.log('creating viewport');
	        term = new UT.Viewport(document.getElementById("game"), w, h, "webgl", false);
	        console.log('creating engine');
	        eng = new UT.Engine(term, randomTile, w, h);
	        let again = function () {
	            window.location.href = window.location.pathname + document.getElementById("switch-renderer").getAttribute("href");
	            window.location.reload(true);
	        };
	        document.getElementById("renderer").innerHTML = term.getRendererString();
	        let a = document.getElementById("switch-renderer");
	        a.onclick = again;
	        if (term.getRendererString() === "dom") {
	            a.innerHTML = "Switch to WebGL renderer";
	            a.href = "#webgl";
	        }
	        else if (term.getRendererString() === "canvas") {
	            a.innerHTML = "Switch to DOM renderer";
	            a.href = "#dom";
	        }
	        else if (term.getRendererString() === "webgl") {
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
	                "Average time: " + diff / iterations + " ms";
	    }
	    // Returns a random tile
	    function randomTile(x, y) {
	        var r = Math.floor(Math.random() * 255);
	        var g = Math.floor(Math.random() * 255);
	        var b = Math.floor(Math.random() * 255);
	        var c = Math.floor(Math.random() * chars.length);
	        // console.log('returning new character %s with color %d, %d, %d', chars[ c ], r, g, b );
	        return new UT.Tile(chars[c], r, g, b);
	    }
	    ;
	    function basicTest() {
	        var w = 50, h = 26;
	        var term = new UT.Viewport(document.getElementById("game"), w, h, "webgl", false);
	        term.clear();
	        for (var j = 0; j < h; ++j) {
	            for (var i = 0; i < w; ++i) {
	                var c = 161 + j * w + i;
	                var ch = String.fromCharCode(c);
	                var tile = new UT.Tile(ch, (Math.random() * 255) | 0, (Math.random() * 255) | 0, (Math.random() * 255) | 0);
	                //var tile = new UT.Tile("A", 255, 0, 0);
	                term.put(tile, i, j);
	            }
	        }
	        term.render();
	        createRendererSwitcher(false);
	    }
	    function createRendererSwitcher(doSwitch) {
	        // Determine the current renderer and the next one
	        var curR = term.getRendererString();
	        var nextR, pretty;
	        if (curR === "webgl") {
	            nextR = "canvas";
	            pretty = "&lt;canvas&gt;";
	        }
	        else if (curR === "canvas") {
	            nextR = "dom";
	            pretty = "DOM";
	        }
	        else {
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
	        var html = '<p>Renderer: <span id="renderer">' + curR + '</span> ';
	        html += '<a onclick="createRendererSwitcher(true)" href="#">Switch to ' + pretty + '</button></p>';
	        document.getElementById("renderer-switcher").innerHTML = html;
	    }
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2), __webpack_require__(3), __webpack_require__(4), __webpack_require__(8), __webpack_require__(5), __webpack_require__(6), __webpack_require__(7)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tile_1, engine_1, viewport_1, input_1, domRenderer_1, canvasRenderer_1, webglRenderer_1) {
	    "use strict";
	    function __export(m) {
	        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	    }
	    __export(tile_1);
	    __export(engine_1);
	    __export(viewport_1);
	    __export(input_1);
	    __export(domRenderer_1);
	    __export(canvasRenderer_1);
	    __export(webglRenderer_1);
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    /** Represents a unicode character tile with various attributes. */
	    class Tile {
	        /**  Constructs a new Tile object. */
	        constructor(ch = '', r = 0, g = 0, b = 0, br = 0, bg = 0, bb = 0) {
	            this.char = ch;
	            this.red = r;
	            this.blue = b;
	            this.green = g;
	            this.backgroundRed = br;
	            this.backgroundGreen = bg;
	            this.backgroundBlue = bb;
	        }
	        /** Get the red value of this tiles foreground color. */
	        get Red() { return this.red; }
	        /** Get the green value of this tiles foreground color.  */
	        get Green() { return this.green; }
	        /** Get the blue value of this tiles foreground color. */
	        get Blue() { return this.blue; }
	        /** Get the red value of this tiles background color. */
	        get BackgroundRed() { return this.backgroundRed; }
	        /** Get the green value of this tiles background color. */
	        get BackgroundGreen() { return this.backgroundGreen; }
	        /** Get the blue value of this tiles background color. */
	        get BackgroundBlue() { return this.backgroundBlue; }
	        /** Get the character of this tile. */
	        get Char() { return this.char; }
	        /** Return the static null tile object. */
	        static NullTile() {
	            return Tile._nullTile;
	        }
	        // TODO: This function is deprecated, replace calls to it with calls to the Char getter
	        /** Returns the character of this tile. */
	        getChar() {
	            return this.char;
	        }
	        /** Sets the character of this tile. */
	        setChar(ch) {
	            this.char = ch;
	        }
	        /** Sets the foreground color of this tile. */
	        setColor(r, g, b) {
	            this.red = r;
	            this.green = g;
	            this.blue = b;
	        }
	        /** Sets the foreground color to the given shade (0-255) of grey. */
	        setGrey(grey) {
	            this.red = grey;
	            this.blue = grey;
	            this.green = grey;
	        }
	        /** Sets the background color of this tile. */
	        setBackground(r, g, b) {
	            this.backgroundRed = r;
	            this.backgroundGreen = g;
	            this.backgroundBlue = b;
	        }
	        /** Clears the color of this tile / assigns default color. */
	        resetColor() {
	            this.red = this.green = this.blue = undefined;
	        }
	        /** Clears the background color of this tile. */
	        resetBackground() {
	            this.backgroundRed = this.backgroundGreen = this.backgroundBlue = undefined;
	        }
	        /** Returns the hexadecimal representation of the color. */
	        getColorHex() {
	            if (this.red !== undefined && this.green !== undefined && this.blue !== undefined) {
	                return "#" + this.red.toString(16) + this.green.toString(16) + this.blue.toString(16);
	            }
	            else {
	                return "";
	            }
	        }
	        /** Returns the hexadecimal representation of the background color. */
	        getBackgroundHex() {
	            if (this.backgroundRed !== undefined && this.backgroundGreen !== undefined && this.backgroundBlue !== undefined) {
	                return "#" + this.backgroundRed.toString(16) + this.backgroundGreen.toString(16) + this.backgroundBlue.toString(16);
	            }
	            else {
	                return "";
	            }
	        }
	        /** Returns the CSS rgb(r,g,b) representation of the color. */
	        getColorRGB() {
	            if (this.red !== undefined && this.green !== undefined && this.blue !== undefined) {
	                return 'rgb(' + this.red + ',' + this.green + ',' + this.blue + ')';
	            }
	            else {
	                return "";
	            }
	        }
	        /** Returns the CSS rgb(r,g,b) representation of the background color. */
	        getBackgroundRGB() {
	            if (this.backgroundRed !== undefined && this.backgroundGreen !== undefined && this.backgroundBlue !== undefined) {
	                return 'rgb(' + this.backgroundRed + ',' + this.backgroundGreen + ',' + this.backgroundBlue + ')';
	            }
	            else {
	                return "";
	            }
	        }
	        /** Returns the JSON representation of the color, i.e. object { r, g, b }. */
	        getColorJSON() {
	            if (this.red !== undefined && this.green !== undefined && this.blue !== undefined) {
	                return {
	                    "r": this.red,
	                    "g": this.green,
	                    "b": this.blue
	                };
	            }
	            else {
	                return {};
	            }
	        }
	        /** Returns the JSON representation of the background color, i.e. object { r, g, b }. */
	        getBackgroundJSON() {
	            if (this.backgroundRed !== undefined && this.backgroundGreen !== undefined && this.backgroundBlue !== undefined) {
	                return {
	                    "r": this.backgroundRed,
	                    "g": this.backgroundGreen,
	                    "b": this.backgroundBlue
	                };
	            }
	            else {
	                return {};
	            }
	        }
	        /** Makes this tile identical to the one supplied. Custom properties are not copied. */
	        copy(other) {
	            this.char = other.getChar();
	            this.red = other.Red;
	            this.green = other.Green;
	            this.blue = other.Blue;
	            this.backgroundRed = other.BackgroundRed;
	            this.backgroundGreen = other.BackgroundGreen;
	            this.backgroundBlue = other.BackgroundBlue;
	        }
	        /** Returns a new copy of this tile. Custom properties are not cloned. */
	        clone() {
	            return new Tile(this.char, this.red, this.green, this.blue, this.backgroundRed, this.backgroundGreen, this.backgroundBlue);
	        }
	    }
	    Tile._nullTile = new Tile();
	    exports.Tile = Tile;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tile_1) {
	    "use strict";
	    class Engine {
	        constructor(vp, func, w, h) {
	            this.width = 0;
	            this.height = 0;
	            this.maskFunction = null;
	            this.shaderFunction = null;
	            this.tileFunction = null;
	            this.viewport = null;
	            this.cacheEnabled = false;
	            this.refreshCache = true;
	            this.transitionTimer = null;
	            this.transitionDuration = 0;
	            this.transition = null;
	            this.cachex = 0;
	            this.cachey = 0;
	            this.width = w;
	            this.height = h;
	            this.viewport = vp;
	            this.tileCache = new Array(this.viewport.Height);
	            this.tileCache2 = new Array(this.viewport.Height);
	            this.tileFunction = func;
	            for (let j = 0; j < vp.Height; j++) {
	                this.tileCache[j] = new Array(vp.Width);
	                this.tileCache2[j] = new Array(vp.Width);
	            }
	        }
	        setTileFunc(func, effect, duration) {
	            if (effect) {
	                this.transition = undefined;
	                if (typeof effect === "string") {
	                    if (effect === "boxin") {
	                        this.transition = function (x, y, w, h, new_t, old_t, factor) {
	                            let halfw = w * 0.5, halfh = h * 0.5;
	                            x -= halfw;
	                            y -= halfh;
	                            if (Math.abs(x) < halfw * factor && Math.abs(y) < halfh * factor) {
	                                return new_t;
	                            }
	                            else {
	                                return old_t;
	                            }
	                        };
	                    }
	                    else if (effect === "boxout") {
	                        this.transition = function (x, y, w, h, new_t, old_t, factor) {
	                            let halfw = w * 0.5, halfh = h * 0.5;
	                            x -= halfw;
	                            y -= halfh;
	                            factor = 1.0 - factor;
	                            if (Math.abs(x) < halfw * factor && Math.abs(y) < halfh * factor) {
	                                return old_t;
	                            }
	                            else {
	                                return new_t;
	                            }
	                        };
	                    }
	                    else if (effect === "circlein") {
	                        this.transition = function (x, y, w, h, new_t, old_t, factor) {
	                            let halfw = w * 0.5, halfh = h * 0.5;
	                            x -= halfw;
	                            y -= halfh;
	                            if ((x * x) + (y * y) < ((halfw * halfw) + (halfh * halfh)) * factor) {
	                                return new_t;
	                            }
	                            else {
	                                return old_t;
	                            }
	                        };
	                    }
	                    else if (effect === "circleout") {
	                        this.transition = function (x, y, w, h, new_t, old_t, factor) {
	                            let halfw = w * 0.5, halfh = h * 0.5;
	                            x -= halfw;
	                            y -= halfh;
	                            factor = 1.0 - factor;
	                            if ((x * x) + (y * y) > ((halfw * halfw) + (halfh * halfh)) * factor) {
	                                return new_t;
	                            }
	                            else {
	                                return old_t;
	                            }
	                        };
	                    }
	                    else if (effect === "random") {
	                        this.transition = function (x, y, w, h, new_t, old_t, factor) {
	                            if (Math.random() > factor) {
	                                return old_t;
	                            }
	                            else {
	                                return new_t;
	                            }
	                        };
	                    }
	                }
	                if (this.transition) {
	                    this.transitionTimer = (new Date()).getTime();
	                    this.transitionDuration = duration || 500;
	                }
	            }
	            this.tileFunction = func;
	        }
	        /** Sets the function to be called to fetch mask information according to coordinates.
	         * If mask function returns false to some coordinates, then that tile is not rendered.
	         */
	        setMaskFunc(func) {
	            this.maskFunction = func;
	        }
	        /** Sets the function to be called to post-process / shade each visible tile.
	         * Shader function is called even if caching is enabled, see <Engine.setCacheEnabled>.
	         */
	        setShaderFunc(func) {
	            this.shaderFunction = func;
	        }
	        /** Tiles outside of the range x = [0,width]; y = [0,height] are not fetched.
	         * Set to undefined in order to make the world infinite.
	        */
	        setWorldSize(width, height) {
	            this.width = width;
	            this.height = height;
	        }
	        /** Enables or disables the usage of tile cache. This means that
	         * 	extra measures are taken to not call the tile function unnecessarily.
	         * This means that all animating must be done in a shader function,
	         * see <Engine.setShaderFunc>.
	         * Cache is off by default, but should be enabled if the tile function
	         * does more computation than a simple array look-up.
	         */
	        setCacheEnabled(mode) {
	            this.cacheEnabled = mode;
	            this.refreshCache = true;
	        }
	        /** Updates the viewport according to the given player coordinates.
	        * The algorithm goes as follows:
	        *   * Record the current time
	        *   * For each viewport tile:
	        *   * Check if the tile is visible by testing the mask
	        *   * If not visible, continue to the next tile in the viewport
	        *   * Otherwise, if cache is enabled try to fetch the tile from there
	        *   * Otherwise, call the tile function and check for shader function presence
	        *   * If there is shader function, apply it to the tile, passing the recorded time
	        *   * Put the tile to viewport
	        */
	        update(x = 0, y = 0, center = false) {
	            if (!this.viewport) {
	                console.error('this.viewport is empty!:', this.viewport);
	                return;
	            }
	            // World coords of upper left corner of the viewport
	            let xx = x; // - this.viewport.CenterX;
	            let yy = y; // - this.viewport.CenterY;
	            if (center) {
	                xx = xx - this.viewport.CenterX;
	                yy = yy - this.viewport.CenterY;
	            }
	            let timeNow = (new Date()).getTime(); // For passing to shaderFunc
	            let transTime;
	            if (this.transition) {
	                transTime = (timeNow - this.transitionTimer) / this.transitionDuration;
	            }
	            if (transTime >= 1.0) {
	                this.transition = undefined;
	            }
	            let tile;
	            // For each tile in viewport...
	            for (let j = 0; j < this.viewport.Height; ++j) {
	                for (let i = 0; i < this.viewport.Width; ++i) {
	                    let ixx = i + xx, jyy = j + yy;
	                    // Check horizontal bounds if requested
	                    if (this.width && (ixx < 0 || ixx >= this.width)) {
	                        tile = tile_1.Tile.NullTile();
	                    }
	                    else if (this.height && (jyy < 0 || jyy >= this.width)) {
	                        tile = tile_1.Tile.NullTile();
	                    }
	                    else if (this.maskFunction && !this.maskFunction(ixx, jyy)) {
	                        tile = tile_1.Tile.NullTile();
	                    }
	                    else if (this.transition && !this.refreshCache) {
	                        tile = this.transition(i, j, this.viewport.Width, this.viewport.Height, (this.tileFunction) ? this.tileFunction(ixx, jyy) : null, this.tileCache[j][i], transTime);
	                    }
	                    else if (this.cacheEnabled && !this.refreshCache) {
	                        let lookupx = ixx - this.cachex;
	                        let lookupy = jyy - this.cachey;
	                        if (lookupx >= 0 && lookupx < this.viewport.Width && lookupy >= 0 && lookupy < this.viewport.Height) {
	                            tile = this.tileCache[lookupy][lookupx];
	                            if (tile === tile_1.Tile.NullTile() && this.tileFunction) {
	                                tile = this.tileFunction(ixx, jyy);
	                            }
	                        }
	                        else {
	                            if (this.tileFunction) {
	                                tile = this.tileFunction(ixx, jyy);
	                            }
	                        }
	                    }
	                    else {
	                        if (this.tileFunction) {
	                            tile = this.tileFunction(ixx, jyy);
	                        }
	                    }
	                    // Save the tile to cache (always due to transition effects)
	                    this.tileCache2[j][i] = tile;
	                    // Apply shader function
	                    if (this.shaderFunction && tile !== tile_1.Tile.NullTile()) {
	                        tile = this.shaderFunction(tile, ixx, jyy, timeNow);
	                    }
	                    // Put shaded tile to viewport
	                    this.viewport.unsafePut(tile, i, j);
	                }
	            }
	            // Cache stuff is enabled always, because it is also required by transitions
	            // Save the new cache origin
	            this.cachex = xx;
	            this.cachey = yy;
	            // Swap cache buffers
	            var tempCache = this.tileCache;
	            this.tileCache = this.tileCache2;
	            this.tileCache2 = tempCache;
	            this.refreshCache = false;
	        }
	    }
	    exports.Engine = Engine;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2), __webpack_require__(5), __webpack_require__(6), __webpack_require__(7)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tile_1, domRenderer_1, canvasRenderer_1, webglRenderer_1) {
	    "use strict";
	    class Viewport {
	        constructor(elem, w, h, renderer, squarify = false) {
	            this.renderer = null;
	            this.elem = elem;
	            this.elem.innerHTML = "";
	            this.width = w;
	            this.height = h;
	            this.squarify = squarify;
	            this.centerX = Math.floor(this.width / 2);
	            this.centerY = Math.floor(this.height / 2);
	            // TODO: Do this.. (I guess?)
	            // Add CSS class if not added already
	            // if (elem.className.indexOf(ut.CSSCLASS) === -1) {
	            // 	if (elem.className.length === 0) elem.className = ut.CSSCLASS;
	            // 	else elem.className += " " + ut.CSSCLASS;
	            // }
	            // Create two 2-dimensional array to hold the viewport tiles
	            this.buffer = new Array(h);
	            for (let j = 0; j < h; ++j) {
	                this.buffer[j] = new Array(w);
	                for (let i = 0; i < w; ++i) {
	                    this.buffer[j][i] = new tile_1.Tile();
	                }
	            }
	            this.setRenderer(renderer || "auto");
	        }
	        get Buffer() { return this.buffer; }
	        get CenterX() { return this.centerX; }
	        get CenterY() { return this.centerY; }
	        get DefaultBackground() { return this.defaultBackground; }
	        get DefaultColor() { return this.defaultColor; }
	        get Element() { return this.elem; }
	        get Height() { return this.height; }
	        get Squarify() { return this.squarify; }
	        get Width() { return this.width; }
	        /** If the style of the parent element is modified, this needs to be called. */
	        updateStyle(updateRenderer) {
	            let s = window.getComputedStyle(this.elem, null);
	            this.defaultColor = s.color;
	            this.defaultBackground = s.backgroundColor;
	            if (updateRenderer !== false) {
	                this.renderer.updateStyle(s);
	            }
	        }
	        /** Function: setRenderer
	         * Switch renderer at runtime. All methods fallback to "dom" if unsuccesful.
	         * Possible values:
	         *  * "webgl" - Use WebGL with an HTML5 <canvas> element
	         *  * "canvas" - Use HTML5 <canvas> element
	         *  * "dom" - Use regular HTML element manipulation through DOM
	         *  * "auto" - Use best available, i.e. try the above in order, picking the first that works
	         */
	        setRenderer(newRenderer) {
	            this.elem.innerHTML = "";
	            if (newRenderer === "auto" || newRenderer === "webgl") {
	                try {
	                    this.renderer = new webglRenderer_1.WebGLRenderer(this);
	                }
	                catch (e) {
	                    console.error(e);
	                    newRenderer = "canvas";
	                    this.elem.innerHTML = "";
	                }
	            }
	            if (newRenderer === "canvas") {
	                try {
	                    this.renderer = new canvasRenderer_1.CanvasRenderer(this);
	                }
	                catch (e) {
	                    console.error(e);
	                    newRenderer = "dom";
	                    this.elem.innerHTML = "";
	                }
	            }
	            if (newRenderer === "dom") {
	                this.renderer = new domRenderer_1.DOMRenderer(this);
	            }
	            this.updateStyle(false);
	        }
	        /** Gets the currently used renderer.
	         * Returns:
	         *   One of "webgl", "canvas", "dom", "".
	         */
	        getRendererString() {
	            if (this.renderer instanceof webglRenderer_1.WebGLRenderer) {
	                return "webgl";
	            }
	            if (this.renderer instanceof canvasRenderer_1.CanvasRenderer) {
	                return "canvas";
	            }
	            if (this.renderer instanceof domRenderer_1.DOMRenderer) {
	                return "dom";
	            }
	            return "";
	        }
	        /** Puts a tile to the given coordinates.
	         * Checks bounds and does nothing if invalid coordinates are given.
	         */
	        put(tile, x, y) {
	            if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
	                return;
	            }
	            this.buffer[y][x] = tile;
	        }
	        /** Puts a tile to the given coordinates.
	         * Does *not* check bounds; throws exception if invalid coordinates are given.
	         */
	        unsafePut(tile, x, y) {
	            this.buffer[y][x] = tile;
	        }
	        /** Creates a row of tiles with the chars of the given string.
	         * Wraps to next line if it can't fit the chars on one line.
	         */
	        putString(str, x, y, r, g, b, br, bg, bb) {
	            let len = str.length;
	            let tile;
	            if (x < 0 || y < 0) {
	                return;
	            }
	            for (let i = 0; i < len; ++i) {
	                if (x >= this.width) {
	                    x = 0;
	                    ++y;
	                }
	                if (y >= this.height) {
	                    return;
	                }
	                tile = new tile_1.Tile(str[i], r, g, b, br, bg, bb);
	                this.unsafePut(tile, x, y);
	                ++x;
	            }
	        }
	        /** Returns the tile in the given coordinates.
	         * Checks bounds and returns empty tile if invalid coordinates are given.
	         */
	        get(x, y) {
	            if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
	                return tile_1.Tile.NullTile();
	            }
	            return this.buffer[y][x];
	        }
	        /** Clears the viewport buffer by assigning empty tiles. */
	        clear() {
	            for (let j = 0; j < this.height; ++j) {
	                for (let i = 0; i < this.width; ++i) {
	                    this.buffer[j][i] = tile_1.Tile.NullTile();
	                }
	            }
	            this.renderer.clear();
	        }
	        /** Renders the buffer as html to the element specified at construction. */
	        render() {
	            this.renderer.render();
	        }
	    }
	    exports.Viewport = Viewport;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    class DOMRenderer {
	        constructor(v) {
	        }
	        clear() { }
	        render() { }
	        updateStyle(s) { }
	    }
	    exports.DOMRenderer = DOMRenderer;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    /** Renders the <Viewport> into an HTML5 <canvas> element. */
	    class CanvasRenderer {
	        constructor(v) {
	            this.canvas = null;
	            this.ctx = null;
	            this.ctx2 = null;
	            this.gap = 0;
	            this.offscreen = null;
	            this.textHeight = 0;
	            this.textWidth = 0;
	            this.view = null;
	            this.view = v;
	            this.canvas = document.createElement("canvas");
	            if (!this.canvas.getContext) {
	                throw ("Canvas not supported");
	            }
	            this.ctx2 = this.canvas.getContext("2d");
	            if (!this.ctx2 || !this.ctx2.fillText) {
	                throw ("Canvas not supported");
	            }
	            this.view.Element.appendChild(this.canvas);
	            // TODO: Move this code into its own function
	            // Create an offscreen canvas for rendering
	            this.offscreen = document.createElement("canvas");
	            this.ctx = this.offscreen.getContext("2d");
	            this.updateStyle();
	            // Initialize width of canvases
	            this.canvas.width = (this.view.Squarify ? this.textHeight : this.textWidth) * this.view.Width;
	            this.canvas.height = this.textHeight * this.view.Height;
	            this.offscreen.width = this.canvas.width;
	            this.offscreen.height = this.canvas.height;
	            // Doing this again since setting canvas w/h resets the state
	            this.updateStyle();
	        }
	        clear() {
	            /* Stub */
	        }
	        /** Render the <Viewport> to the canvas context. */
	        render() {
	            let tile = null, ch = '', fg = '', bg = '', x = 0, y = 0, buffer = this.view.Buffer, w = this.view.Width, h = this.view.Height, hth = 0.5 * this.textHeight, hgap = 0.5 * this.gap; // Squarification
	            // Clearing with one big rect is much faster than with individual char rects
	            this.ctx.fillStyle = this.view.DefaultBackground;
	            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	            y = hth; // half because textBaseline is middle
	            for (let j = 0; j < h; ++j) {
	                x = 0;
	                for (let i = 0; i < w; ++i) {
	                    tile = buffer[j][i];
	                    ch = tile.Char;
	                    fg = tile.getColorRGB();
	                    bg = tile.getBackgroundRGB();
	                    // Only render background if the color is non-default
	                    if (bg.length && bg !== this.view.DefaultBackground) {
	                        this.ctx.fillStyle = bg;
	                        this.ctx.fillRect(x, y - hth, this.textWidth, this.textHeight);
	                    }
	                    // Do not attempt to render empty char
	                    if (ch.length) {
	                        if (!fg.length) {
	                            fg = this.view.DefaultColor;
	                        }
	                        this.ctx.fillStyle = fg;
	                        this.ctx.fillText(ch, x + hgap, y);
	                    }
	                    x += this.textWidth;
	                }
	                y += this.textHeight;
	            }
	            this.ctx2.drawImage(this.offscreen, 0, 0);
	        }
	        /** Recalculates internal variables according to the text styling
	         * provided, or according to the styling assigned to the canvas
	         * container if styling is not provided.
	         */
	        updateStyle(s = null) {
	            s = s || window.getComputedStyle(this.view.Element, null);
	            this.ctx.font = s.fontSize + "/" + s.lineHeight + " " + s.fontFamily;
	            this.ctx.textBaseline = "middle";
	            this.textWidth = this.ctx.measureText("M").width;
	            this.textHeight = parseInt(s.fontSize, 10);
	            this.gap = (this.view.Squarify) ? (this.textHeight - this.textWidth) : 0;
	            if (this.view.Squarify) {
	                this.textWidth = this.textHeight;
	            }
	        }
	    }
	    exports.CanvasRenderer = CanvasRenderer;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    class WebGLRenderer {
	        constructor(v) {
	            this.canvas = null;
	            this.charArray = null;
	            this.charMap = null;
	            this.ctx = null;
	            this.gap = 0;
	            this.gl = null;
	            this.offscreen = null;
	            this.pad = 0;
	            this.paddingLocation = null;
	            this.textHeight = 0;
	            this.textWidth = 0;
	            this.tileCountsLocation = null;
	            this.view = null;
	            this.defaultColors = {
	                blue: 1.0,
	                green: 1.0,
	                red: 1.0,
	                backgroundBlue: 1.0,
	                backgroundGreen: 1.0,
	                backgroundRed: 1.0
	            };
	            this.canvas = document.createElement("canvas");
	            this.charArray = new Array();
	            this.charMap = {};
	            this.view = v;
	            if (!this.canvas.getContext) {
	                throw ("Canvas not supported");
	            }
	            this.gl = this.canvas.getContext("experimental-webgl");
	            if (!this.gl) {
	                throw ("WebGL not supported");
	            }
	            this.view.Element.appendChild(this.canvas);
	            this.attribs = {
	                position: {
	                    buffer: null,
	                    data: null,
	                    hint: this.gl.STATIC_DRAW,
	                    itemSize: 2,
	                    location: null
	                },
	                texCoord: {
	                    buffer: null,
	                    data: null,
	                    hint: this.gl.STATIC_DRAW,
	                    itemSize: 2,
	                    location: null
	                },
	                color: {
	                    buffer: null,
	                    data: null,
	                    hint: this.gl.DYNAMIC_DRAW,
	                    itemSize: 3,
	                    location: null
	                },
	                bgColor: {
	                    buffer: null,
	                    data: null,
	                    hint: this.gl.DYNAMIC_DRAW,
	                    itemSize: 3,
	                    location: null
	                },
	                charIndex: {
	                    buffer: null,
	                    data: null,
	                    hint: this.gl.DYNAMIC_DRAW,
	                    itemSize: 1,
	                    location: null
	                }
	            };
	            // Create an offscreen canvas for rendering text to texture
	            if (!this.offscreen) {
	                this.offscreen = document.createElement("canvas");
	            }
	            this.offscreen.style.position = "absolute";
	            this.offscreen.style.top = "0px";
	            this.offscreen.style.left = "0px";
	            this.ctx = this.offscreen.getContext("2d");
	            if (!this.ctx) {
	                throw "Failed to acquire offscreen canvas drawing context";
	            }
	            // WebGL drawing canvas
	            this.updateStyle();
	            this.canvas.width = (this.view.Squarify ? this.textWidth : this.textHeight) * this.view.Width;
	            this.canvas.height = this.textHeight * this.view.Height;
	            this.offscreen.width = 0;
	            this.offscreen.height = 0;
	            // Doing this again since setting canvas w/h resets the state
	            this.updateStyle();
	            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
	            let vertexShader = this.compileShader(this.gl.VERTEX_SHADER, WebGLRenderer.VERTEX_SHADER), fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, WebGLRenderer.FRAGMENT_SHADER), program = this.gl.createProgram();
	            this.gl.attachShader(program, vertexShader);
	            this.gl.attachShader(program, fragmentShader);
	            this.gl.linkProgram(program);
	            this.gl.deleteShader(vertexShader);
	            this.gl.deleteShader(fragmentShader);
	            let ok = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
	            if (!ok) {
	                let msg = "Error linking program: " + this.gl.getProgramInfoLog(program);
	                this.gl.deleteProgram(program);
	                throw msg;
	            }
	            this.gl.useProgram(program);
	            // Get attribute locations
	            this.attribs.position.location = this.gl.getAttribLocation(program, "position");
	            this.attribs.texCoord.location = this.gl.getAttribLocation(program, "texCoord");
	            this.attribs.color.location = this.gl.getAttribLocation(program, "color");
	            this.attribs.bgColor.location = this.gl.getAttribLocation(program, "bgColor");
	            this.attribs.charIndex.location = this.gl.getAttribLocation(program, "charIndex");
	            // Setup buffers and uniforms
	            this.initBuffers();
	            let resolutionLocation = this.gl.getUniformLocation(program, "uResolution");
	            this.gl.uniform2f(resolutionLocation, this.canvas.width, this.canvas.height);
	            this.tileCountsLocation = this.gl.getUniformLocation(program, "uTileCounts");
	            this.gl.uniform2f(this.tileCountsLocation, this.view.Width, this.view.Height);
	            this.paddingLocation = this.gl.getUniformLocation(program, "uPadding");
	            this.gl.uniform2f(this.paddingLocation, 0.0, 0.0);
	            // Setup texture
	            //view.elem.appendChild(this.offscreen); // Debug offscreen
	            let texture = this.gl.createTexture();
	            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
	            this.cacheChars(" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~");
	            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
	            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
	            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
	            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
	            this.gl.activeTexture(this.gl.TEXTURE0);
	            let _this = this;
	            // TODO: This is gross. Is there any other way to do this?
	            setTimeout(function () {
	                _this.updateStyle();
	                _this.buildTexture();
	                _this.render();
	            }, 100);
	        }
	        clear() { }
	        render() {
	            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	            let attribs = this.attribs, defaultBgColor = this.view.DefaultBackground, defaultColor = this.view.DefaultColor, h = this.view.Height, newChars = false, tiles = this.view.Buffer, w = this.view.Width;
	            // Create new tile data
	            for (let j = 0; j < h; ++j) {
	                for (let i = 0; i < w; ++i) {
	                    let tile = tiles[j][i] || null, ch = (tile) ? this.charMap[tile.Char] : null;
	                    if (!tile) {
	                        continue;
	                    }
	                    if (ch === undefined) {
	                        this.cacheChars(tile.Char, false);
	                        newChars = true;
	                        ch = this.charMap[tile.Char];
	                    }
	                    let k = attribs.color.itemSize * 6 * (j * w + i), kk = attribs.charIndex.itemSize * 6 * (j * w + i), r = (tile.Red === undefined) ? this.defaultColors.red : tile.Red / 255, g = (tile.Green === undefined) ? this.defaultColors.green : tile.Green / 255, b = (tile.Blue === undefined) ? this.defaultColors.blue : tile.Blue / 255, br = (tile.BackgroundRed === undefined) ? this.defaultColors.backgroundRed : tile.BackgroundRed / 255, bg = (tile.BackgroundGreen === undefined) ? this.defaultColors.backgroundGreen : tile.BackgroundGreen / 255, bb = (tile.BackgroundBlue === undefined) ? this.defaultColors.backgroundBlue : tile.BackgroundBlue / 255;
	                    for (let m = 0; m < 6; ++m) {
	                        let n = k + m * attribs.color.itemSize;
	                        attribs.color.data[n + 0] = r;
	                        attribs.color.data[n + 1] = g;
	                        attribs.color.data[n + 2] = b;
	                        attribs.bgColor.data[n + 0] = br;
	                        attribs.bgColor.data[n + 1] = bg;
	                        attribs.bgColor.data[n + 2] = bb;
	                        attribs.charIndex.data[kk + m] = ch;
	                    }
	                }
	            }
	            // Upload
	            if (newChars) {
	                this.buildTexture();
	            }
	            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attribs.color.buffer);
	            this.gl.bufferData(this.gl.ARRAY_BUFFER, attribs.color.data, attribs.color.hint);
	            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attribs.bgColor.buffer);
	            this.gl.bufferData(this.gl.ARRAY_BUFFER, attribs.bgColor.data, attribs.bgColor.hint);
	            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attribs.charIndex.buffer);
	            this.gl.bufferData(this.gl.ARRAY_BUFFER, attribs.charIndex.data, attribs.charIndex.hint);
	            let attrib = this.attribs.position;
	            this.gl.drawArrays(this.gl.TRIANGLES, 0, attrib.data.length / attrib.itemSize);
	        }
	        updateStyle(s = null) {
	            s = s || window.getComputedStyle(this.view.Element, null);
	            this.ctx.font = s.fontSize + "/" + s.lineHeight + " " + s.fontFamily;
	            this.ctx.textBaseline = "middle";
	            this.ctx.fillStyle = "#ffffff";
	            this.textWidth = this.ctx.measureText("M").width;
	            this.textHeight = parseInt(s.fontSize, 10);
	            this.gap = (this.view.Squarify) ? (this.textHeight - this.textWidth) : 0;
	            if (this.view.Squarify) {
	                this.textWidth = this.textHeight;
	            }
	            let color = s.color.match(/\d+/g), bgColor = s.backgroundColor.match(/\d+/g);
	            this.pad = Math.ceil(this.textHeight * 0.2) * 2.0; // Must be even number
	            this.defaultColors.red = parseInt(color[0], 10) / 255;
	            this.defaultColors.green = parseInt(color[1], 10) / 255;
	            this.defaultColors.blue = parseInt(color[2], 10) / 255;
	            this.defaultColors.backgroundRed = parseInt(bgColor[0], 10) / 255;
	            this.defaultColors.backgroundGreen = parseInt(bgColor[1], 10) / 255;
	            this.defaultColors.backgroundBlue = parseInt(bgColor[2], 10) / 255;
	        }
	        insertQuad(arr, i, x, y, w, h) {
	            let x1 = x, y1 = y, x2 = x + w, y2 = y + h;
	            arr[i] = x1;
	            arr[++i] = y1;
	            arr[++i] = x2;
	            arr[++i] = y1;
	            arr[++i] = x1;
	            arr[++i] = y2;
	            arr[++i] = x1;
	            arr[++i] = y2;
	            arr[++i] = x2;
	            arr[++i] = y1;
	            arr[++i] = x2;
	            arr[++i] = y2;
	        }
	        initBuffers() {
	            let a = '', 
	            // TODO: Define a tyle alias encompassing all attribute interfaces
	            attrib = null, attribs = this.attribs, w = this.view.Width, h = this.view.Height;
	            // Allocate data arrays
	            for (a in this.attribs) {
	                attrib = attribs[a];
	                attrib.data = new Float32Array(attrib.itemSize * 6 * w * h);
	            }
	            // Generate static data
	            for (let j = 0; j < h; ++j) {
	                for (let i = 0; i < w; ++i) {
	                    // Position & texCoords
	                    let k = attribs.position.itemSize * 6 * (j * w + i);
	                    this.insertQuad(attribs.position.data, k, i * this.textWidth, j * this.textHeight, this.textWidth, this.textHeight);
	                    this.insertQuad(attribs.texCoord.data, k, 0.0, 0.0, 1.0, 1.0);
	                }
	            }
	            // Upload
	            for (a in this.attribs) {
	                attrib = attribs[a];
	                if (attrib.buffer) {
	                    this.gl.deleteBuffer(attrib.buffer);
	                }
	                attrib.buffer = this.gl.createBuffer();
	                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attrib.buffer);
	                this.gl.bufferData(this.gl.ARRAY_BUFFER, attrib.data, attrib.hint);
	                this.gl.enableVertexAttribArray(attrib.location);
	                this.gl.vertexAttribPointer(attrib.location, attrib.itemSize, this.gl.FLOAT, false, 0, 0);
	            }
	        }
	        compileShader(type, source) {
	            let ok = null, shader = this.gl.createShader(type);
	            this.gl.shaderSource(shader, source);
	            this.gl.compileShader(shader);
	            ok = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
	            if (!ok) {
	                var msg = "Error compiling shader: " + this.gl.getShaderInfoLog(shader);
	                this.gl.deleteShader(shader);
	                throw msg;
	            }
	            return shader;
	        }
	        buildTexture() {
	            let w = this.offscreen.width / (this.textWidth + this.pad), h = this.offscreen.height / (this.textHeight + this.pad), charCount = this.charArray.length;
	            // Check if need to resize the canvas
	            if (charCount > Math.floor(w) * Math.floor(h)) {
	                w = Math.ceil(Math.sqrt(charCount));
	                h = w + 2; // Allocate some extra space too
	                this.offscreen.width = w * (this.textWidth + this.pad);
	                this.offscreen.height = h * (this.textHeight + this.pad);
	                this.updateStyle();
	                this.gl.uniform2f(this.tileCountsLocation, w, h);
	            }
	            this.gl.uniform2f(this.paddingLocation, this.pad / this.offscreen.width, this.pad / this.offscreen.height);
	            let c = 0, ch = '', halfGap = 0.5 * this.gap; // Squarification
	            this.ctx.fillStyle = "#000000";
	            this.ctx.fillRect(0, 0, this.offscreen.width, this.offscreen.height);
	            this.ctx.fillStyle = "#ffffff";
	            let tw = this.textWidth + this.pad, th = this.textHeight + this.pad, x = 0, y = 0.5 * th; // Half because textBaseline is middle
	            for (let j = 0; j < h; ++j) {
	                x = this.pad * 0.5;
	                for (let i = 0; i < w; ++i, ++c) {
	                    ch = this.charArray[c];
	                    if (ch === undefined) {
	                        break;
	                    }
	                    this.ctx.fillText(ch, x + halfGap, y);
	                    x += tw;
	                }
	                if (!ch) {
	                    break;
	                }
	                y += th;
	            }
	            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.offscreen);
	        }
	        cacheChars(chars, build = false) {
	            if (!this.gl) {
	                return; // Nothing to do if not using WebGL renderer
	            }
	            let changed = false;
	            for (let i = 0; i < chars.length; ++i) {
	                if (this.charMap[chars[i]] === undefined) {
	                    changed = true;
	                    this.charArray.push(chars[i]);
	                    this.charMap[chars[i]] = this.charArray.length - 1;
	                }
	            }
	            if (changed && build !== false) {
	                this.buildTexture();
	            }
	        }
	    }
	    WebGLRenderer.VERTEX_SHADER = [
	        "attribute vec2 position;",
	        "attribute vec2 texCoord;",
	        "attribute vec3 color;",
	        "attribute vec3 bgColor;",
	        "attribute float charIndex;",
	        "uniform vec2 uResolution;",
	        "uniform vec2 uTileCounts;",
	        "uniform vec2 uPadding;",
	        "varying vec2 vTexCoord;",
	        "varying vec3 vColor;",
	        "varying vec3 vBgColor;",
	        "void main() {",
	        "vec2 tileCoords = floor(vec2(mod(charIndex, uTileCounts.x), charIndex / uTileCounts.x));",
	        "vTexCoord = (texCoord + tileCoords) / uTileCounts;",
	        "vTexCoord += (0.5 - texCoord) * uPadding;",
	        "vColor = color;",
	        "vBgColor = bgColor;",
	        "vec2 pos = position / uResolution * 2.0 - 1.0;",
	        "gl_Position = vec4(pos.x, -pos.y, 0.0, 1.0);",
	        "}"
	    ].join('\n');
	    WebGLRenderer.FRAGMENT_SHADER = [
	        "precision mediump float;",
	        "uniform sampler2D uFont;",
	        "varying vec2 vTexCoord;",
	        "varying vec3 vColor;",
	        "varying vec3 vBgColor;",
	        "void main() {",
	        "vec4 color = texture2D(uFont, vTexCoord);",
	        "color.rgb = mix(vBgColor, vColor, color.rgb);",
	        "gl_FragColor = color;",
	        "}"
	    ].join('\n');
	    exports.WebGLRenderer = WebGLRenderer;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    class Input {
	        /** Checks if given key is pressed down. You must call <ut.initInput> first. */
	        static isKeyPressed(key) {
	            if (Input.pressedKeys[key]) {
	                return true;
	            }
	            return false;
	        }
	        /** Sets the interval when user's onKeyDown handler is called when a key is held down.
	         * <Input.initInput> must be called with a handler for this to work.
	         */
	        static setKeyRepeatInterval(milliseconds) {
	            Input.keyRepeatDelay = milliseconds;
	        }
	        static initInput(onKeyDown, onKeyUp) {
	            Input.onKeyDown = onKeyDown;
	            Input.onKeyUp = onKeyUp;
	            // Attach default onkeydown handler that updates pressedKeys
	            document.onkeydown = function (event) {
	                var k = event.keyCode;
	                if (Input.pressedKeys[k] !== null && Input.pressedKeys[k] !== undefined) {
	                    return false;
	                }
	                Input.pressedKeys[k] = true;
	                if (Input.onKeyDown) {
	                    Input.onKeyDown(k); // User event handler
	                    // Setup keyrepeat
	                    Input.pressedKeys[k] = setInterval("Input.onKeyDown(" + k + ")", Input.keyRepeatDelay);
	                }
	                if (Input.pressedKeys[Input.KEY_CTRL] || Input.pressedKeys[Input.KEY_ALT]) {
	                    return true; // CTRL/ALT for browser hotkeys
	                }
	                else {
	                    return false;
	                }
	            };
	            // Attach default onkeyup handler that updates pressedKeys
	            document.onkeyup = function (event) {
	                let k = event.keyCode;
	                if (Input.onKeyDown && Input.pressedKeys[k] !== null && Input.pressedKeys[k] !== undefined) {
	                    clearInterval(Input.pressedKeys[k]);
	                }
	                Input.pressedKeys[k] = null;
	                if (Input.onKeyUp) {
	                    Input.onKeyUp(k); // User event handler
	                }
	                return false;
	            };
	            // Avoid keys getting stuck at down
	            window.onblur = function () {
	                for (let k in Input.pressedKeys) {
	                    if (Input.onKeyDown && Input.pressedKeys[k] !== null) {
	                        clearInterval(Input.pressedKeys[k]);
	                    }
	                }
	                Input.pressedKeys = {};
	            };
	        }
	    }
	    Input.KEY_BACKSPACE = 8;
	    Input.KEY_TAB = 9;
	    Input.KEY_ENTER = 13;
	    Input.KEY_SHIFT = 16;
	    Input.KEY_CTRL = 17;
	    Input.KEY_ALT = 18;
	    Input.KEY_ESCAPE = 27;
	    Input.KEY_SPACE = 32;
	    Input.KEY_LEFT = 37;
	    Input.KEY_UP = 38;
	    Input.KEY_RIGHT = 39;
	    Input.KEY_DOWN = 40;
	    Input.KEY_0 = 48;
	    Input.KEY_1 = 49;
	    Input.KEY_2 = 50;
	    Input.KEY_3 = 51;
	    Input.KEY_4 = 52;
	    Input.KEY_5 = 53;
	    Input.KEY_6 = 54;
	    Input.KEY_7 = 55;
	    Input.KEY_8 = 56;
	    Input.KEY_9 = 57;
	    Input.KEY_A = 65;
	    Input.KEY_B = 66;
	    Input.KEY_C = 67;
	    Input.KEY_D = 68;
	    Input.KEY_E = 69;
	    Input.KEY_F = 70;
	    Input.KEY_G = 71;
	    Input.KEY_H = 72;
	    Input.KEY_I = 73;
	    Input.KEY_J = 74;
	    Input.KEY_K = 75;
	    Input.KEY_L = 76;
	    Input.KEY_M = 77;
	    Input.KEY_N = 78;
	    Input.KEY_O = 79;
	    Input.KEY_P = 80;
	    Input.KEY_Q = 81;
	    Input.KEY_R = 82;
	    Input.KEY_S = 83;
	    Input.KEY_T = 84;
	    Input.KEY_U = 85;
	    Input.KEY_V = 86;
	    Input.KEY_W = 87;
	    Input.KEY_X = 88;
	    Input.KEY_Y = 89;
	    Input.KEY_Z = 90;
	    Input.KEY_NUMPAD0 = 96;
	    Input.KEY_NUMPAD1 = 97;
	    Input.KEY_NUMPAD2 = 98;
	    Input.KEY_NUMPAD3 = 99;
	    Input.KEY_NUMPAD4 = 100;
	    Input.KEY_NUMPAD5 = 101;
	    Input.KEY_NUMPAD6 = 102;
	    Input.KEY_NUMPAD7 = 103;
	    Input.KEY_NUMPAD8 = 104;
	    Input.KEY_NUMPAD9 = 105;
	    Input.KEY_F1 = 112;
	    Input.KEY_F2 = 113;
	    Input.KEY_F3 = 114;
	    Input.KEY_F4 = 115;
	    Input.KEY_F5 = 116;
	    Input.KEY_F6 = 117;
	    Input.KEY_F7 = 118;
	    Input.KEY_F8 = 119;
	    Input.KEY_F9 = 120;
	    Input.KEY_F10 = 121;
	    Input.KEY_F11 = 122;
	    Input.KEY_F12 = 123;
	    Input.KEY_COMMA = 188;
	    Input.KEY_DASH = 189;
	    Input.KEY_PERIOD = 190;
	    Input.pressedKeys = {};
	    Input.keyRepeatDelay = 150;
	    exports.Input = Input;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }
/******/ ]);