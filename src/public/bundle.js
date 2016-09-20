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
	            this.cacheEnabled = false;
	            this.refreshCache = true;
	            this.transitionTimer = null;
	            this.transitionDuration = 0;
	            this.transition = null;
	            this.cachex = 0;
	            this.cachey = 0;
	            this.tileCache = new Array(vp.Height);
	            this.tileCache2 = new Array(vp.Height);
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
	        update(x, y) {
	            x = x || 0;
	            y = y || 0;
	            // World coords of upper left corner of the viewport
	            let xx = x - this.viewport.CenterX;
	            let yy = y - this.viewport.CenterY;
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
	                        tile = this.transition(i, j, this.viewport.Width, this.viewport.Height, this.tileFunction(ixx, jyy), this.tileCache[j][i], transTime);
	                    }
	                    else if (this.cacheEnabled && !this.refreshCache) {
	                        let lookupx = ixx - this.cachex;
	                        let lookupy = jyy - this.cachey;
	                        if (lookupx >= 0 && lookupx < this.viewport.Width && lookupy >= 0 && lookupy < this.viewport.Height) {
	                            tile = this.tileCache[lookupy][lookupx];
	                            if (tile === tile_1.Tile.NullTile()) {
	                                tile = this.tileFunction(ixx, jyy);
	                            }
	                        }
	                        else {
	                            tile = this.tileFunction(ixx, jyy);
	                        }
	                    }
	                    else {
	                        tile = this.tileFunction(ixx, jyy);
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
	        constructor(elem, w, h, renderer, squarify) {
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
	        get CenterX() { return this.centerX; }
	        get CenterY() { return this.centerY; }
	        get Height() { return this.height; }
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
	    class CanvasRenderer {
	        constructor(v) {
	        }
	        clear() { }
	        render() { }
	        updateStyle(s) { }
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
	        }
	        clear() { }
	        render() { }
	        updateStyle(s) { }
	    }
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