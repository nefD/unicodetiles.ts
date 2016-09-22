import {IRenderer} from './renderer';
import {Tile} from './tile';
import {DOMRenderer} from './domRenderer';
import {CanvasRenderer} from './canvasRenderer';
import {WebGLRenderer} from './webglRenderer';

export class Viewport {

	private elem: HTMLElement;
	private width: number;
	private height: number;
	private renderer: IRenderer = null;
	private squarify: boolean;
	private centerX: number;
	private centerY: number;
	private buffer: Tile[][];
	private defaultColor: string;
	private defaultBackground: string;

	constructor ( elem: HTMLElement, w: number, h: number, renderer: string, squarify: boolean = false) {

		this.elem = elem;
		this.elem.innerHTML = "";
		this.width = w;
		this.height = h;
		this.squarify = squarify;
		this.centerX = Math.floor( this.width / 2 );
		this.centerY = Math.floor( this.height / 2 );

		// TODO: Do this.. (I guess?)
		// Add CSS class if not added already
		// if (elem.className.indexOf(ut.CSSCLASS) === -1) {
		// 	if (elem.className.length === 0) elem.className = ut.CSSCLASS;
		// 	else elem.className += " " + ut.CSSCLASS;
		// }

		// Create two 2-dimensional array to hold the viewport tiles
		this.buffer = new Array(h);

		for ( let j = 0; j < h; ++j ) {

			this.buffer[ j ] = new Array( w );

			for ( let i = 0; i < w; ++i ) {

				this.buffer[ j ][ i ] = new Tile();

			}

		}

		this.setRenderer( renderer || "auto" );

	}

	get Buffer (): Tile[][] { return this.buffer; }
	get CenterX (): number { return this.centerX; }
	get CenterY (): number { return this.centerY; }
	get DefaultBackground (): string { return this.defaultBackground; }
	get DefaultColor (): string { return this.defaultColor; }
	get Element (): HTMLElement { return this.elem; }
	get Height (): number { return this.height; }
	get Squarify (): boolean { return this.squarify; }
	get Width (): number { return this.width; }

	/** If the style of the parent element is modified, this needs to be called. */
	public updateStyle ( updateRenderer: boolean): void {

		let s = window.getComputedStyle( this.elem, null );
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
	public setRenderer ( newRenderer: string ): void {

		this.elem.innerHTML = "";

		if ( newRenderer === "auto" || newRenderer === "webgl" ) {

			try {

				this.renderer = new WebGLRenderer( this );

			} catch (e) {

				console.error(e);
				newRenderer = "canvas";
				this.elem.innerHTML = "";

			}

		}

		if (newRenderer === "canvas") {

			try {

				this.renderer = new CanvasRenderer(this);

			} catch (e) {

				console.error(e);
				newRenderer = "dom";
				this.elem.innerHTML = "";

			}

		}

		if (newRenderer === "dom") {

			this.renderer = new DOMRenderer(this);

		}

		this.updateStyle(false);

	}

	/** Gets the currently used renderer.
	 * Returns:
	 *   One of "webgl", "canvas", "dom", "".
	 */
	public getRendererString (): string {

		if ( this.renderer instanceof WebGLRenderer ) {

			return "webgl";

		}

		if ( this.renderer instanceof CanvasRenderer ) {
			
			return "canvas";

		}
		
		if ( this.renderer instanceof DOMRenderer ) {
			
			return "dom";

		}

		return "";

	}

	/** Puts a tile to the given coordinates.
	 * Checks bounds and does nothing if invalid coordinates are given.
	 */
	public put ( tile: Tile, x: number, y: number ): void {

		if ( x < 0 || y < 0 || x >= this.width || y >= this.height ) {
			
			return;

		}

		this.buffer[y][x] = tile;

	}

	/** Puts a tile to the given coordinates.
	 * Does *not* check bounds; throws exception if invalid coordinates are given.
	 */
	public unsafePut ( tile: Tile, x: number, y: number ): void {

		this.buffer[ y ][ x ] = tile;

	}

	/** Creates a row of tiles with the chars of the given string.
	 * Wraps to next line if it can't fit the chars on one line.
	 */
	public putString ( str: string, x: number, y: number, r: number, g: number, b: number, br: number, bg: number, bb: number ): void {

		let len: number = str.length;
		let tile: Tile;

		if ( x < 0 || y < 0 ) {
			
			return;

		}

		for ( let i = 0; i < len; ++i ) {

			if ( x >= this.width ) {

				x = 0;
				++y;

			}

			if ( y >= this.height ) {

				return;

			}

			tile = new Tile( str[i], r, g, b, br, bg, bb );
			this.unsafePut( tile, x, y );
			++x;

		}

	}

	/** Returns the tile in the given coordinates.
	 * Checks bounds and returns empty tile if invalid coordinates are given.
	 */
	public get ( x: number, y: number ): Tile {

		if ( x < 0 || y < 0 || x >= this.width || y >= this.height ) {

			return Tile.NullTile();

		}

		return this.buffer[y][x];

	}

	/** Clears the viewport buffer by assigning empty tiles. */
	public clear (): void {

		for ( let j = 0; j < this.height; ++j ) {

			for ( let i = 0; i < this.width; ++i ) {

				this.buffer[ j ][ i ] = Tile.NullTile();

			}

		}

		this.renderer.clear();

	}

	/** Renders the buffer as html to the element specified at construction. */
	public render (): void {

		this.renderer.render();

	}

}
	