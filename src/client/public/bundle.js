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

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, viewport_1, tile_1) {
	    "use strict";
	    console.log('I am being executed..');
	    var w = 50, h = 26;
	    var term = new viewport_1.Viewport(document.getElementById("game"), w, h, "webgl", false);
	    term.clear();
	    for (var j = 0; j < h; ++j) {
	        for (var i = 0; i < w; ++i) {
	            var c = 161 + j * w + i;
	            var ch = String.fromCharCode(c);
	            var tile = new tile_1.Tile(ch, (Math.random() * 255) | 0, (Math.random() * 255) | 0, (Math.random() * 255) | 0);
	            term.put(tile, i, j);
	        }
	    }
	    term.render();
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2), __webpack_require__(3), __webpack_require__(4), __webpack_require__(5)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tile_1, domRenderer_1, canvasRenderer_1, webglRenderer_1) {
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
/* 4 */
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
/* 5 */
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


/***/ }
/******/ ]);