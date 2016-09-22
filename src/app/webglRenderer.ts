import {IRenderer} from './Renderer';
import {Tile} from './Tile';
import {Viewport} from './Viewport';

interface ICharMapString {

    [ idx: string]: string;

}

interface ICharMapNumber {

    [ idx: string]: number;

}

interface IAttribute {

	//data: Float32Array | string | number | string[] | number[] | ArrayBufferView | ArrayBuffer;
	buffer:   WebGLBuffer;
	data:     Float32Array;
	hint:     number;
	itemSize: number;
	location: number;

}

interface IPositionAttribute {

	buffer:   WebGLBuffer;
	data:     [number];
	hint:     number;	
	itemSize: number;
	location: number;

}

interface ITexCoordAttribute {

	buffer:   WebGLBuffer;
	data:     [number];
	hint:     number;	
	itemSize: number;
	location: number;

}

interface IColorAttribute {

	buffer:   WebGLBuffer;
	data:     [number] | ArrayBuffer;
	hint:     number;	
	itemSize: number;
	location: number;

}

interface ICharIndexData {

	[ idx: number ]: string;

}

interface ICharIndexAttribute {

	buffer:   WebGLBuffer;
	data:     [ICharIndexData] | ArrayBuffer;
	hint:     number;	
	itemSize: number;
	location: number;

}

interface IAttributes {

	[ idx: string ]: IAttribute | IPositionAttribute | ITexCoordAttribute | IColorAttribute | ICharIndexAttribute;

	bgColor:   IColorAttribute;
	charIndex: ICharIndexAttribute;
	color:     IColorAttribute;
	position:  IPositionAttribute;
	texCoord:  ITexCoordAttribute;

}

interface IDefaultColors {

	blue:            number;
	green:           number;
	red:             number;
	backgroundBlue:  number;
	backgroundGreen: number;
	backgroundRed:   number;

}

export class WebGLRenderer implements IRenderer {

	private canvas: HTMLCanvasElement                = null;
	private charArray: string[]                      = null;
	private charMap: ICharMapString | ICharMapNumber = null;
	private ctx: CanvasRenderingContext2D            = null;
	private gap: number                              = 0;
	private gl: WebGLRenderingContext                = null;
	private offscreen: HTMLCanvasElement             = null;
	private pad: number                              = 0;
	private paddingLocation: WebGLUniformLocation    = null;
	private textHeight: number                       = 0;
	private textWidth: number                        = 0;
	private tileCountsLocation: WebGLUniformLocation = null;
	private view: Viewport                           = null;

	private defaultColors: IDefaultColors = {
		blue:            1.0,
		green:           1.0,
		red:             1.0,
		backgroundBlue:  1.0,
		backgroundGreen: 1.0,
		backgroundRed:   1.0
	};

	private attribs: IAttributes;	

	private static VERTEX_SHADER: string = [
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
	].join( '\n' );

	private static FRAGMENT_SHADER: string = [
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
	].join( '\n' );

	constructor ( v: Viewport ) {

		this.canvas    = document.createElement( "canvas" );	
		this.charArray = new Array<string>();
		this.charMap   = {};
		this.view      = v;

		if ( ! this.canvas.getContext ) {

			throw( "Canvas not supported" );

		}

		this.gl = this.canvas.getContext( "experimental-webgl" );

		if ( ! this.gl ) {

			throw( "WebGL not supported" );

		}

		this.view.Element.appendChild( this.canvas );

		this.attribs = {

			position: {

				buffer:   null, 
				data:     null, 
				hint:     this.gl.STATIC_DRAW,
				itemSize: 2, 
				location: null

			},
			texCoord: {

				buffer:   null, 
				data:     null, 
				hint:     this.gl.STATIC_DRAW,
				itemSize: 2, 
				location: null

			},
			color: {

				buffer:   null,
				data:     null, 
				hint:     this.gl.DYNAMIC_DRAW,
				itemSize: 3, 
				location: null

			},
			bgColor: { 

				buffer:   null, 
				data:     null, 
				hint:     this.gl.DYNAMIC_DRAW,
				itemSize: 3, 
				location: null

			},
			charIndex: {

				buffer:     null, 
				data:       null, 
				hint:       this.gl.DYNAMIC_DRAW,
				itemSize:   1, 
				location:   null

			}

		};

		// Create an offscreen canvas for rendering text to texture
		if ( ! this.offscreen ) {

			this.offscreen = document.createElement( "canvas" );

		}

		this.offscreen.style.position = "absolute";
		this.offscreen.style.top      = "0px";
		this.offscreen.style.left     = "0px";
		this.ctx = this.offscreen.getContext( "2d" );

		if ( ! this.ctx ) {

			throw "Failed to acquire offscreen canvas drawing context";

		}

		// WebGL drawing canvas
		this.updateStyle();
		this.canvas.width     = ( this.view.Squarify ? this.textWidth : this.textHeight ) * this.view.Width;
		this.canvas.height    = this.textHeight * this.view.Height;
		this.offscreen.width  = 0;
		this.offscreen.height = 0;
		
		// Doing this again since setting canvas w/h resets the state
		this.updateStyle();

		this.gl.viewport( 0, 0, this.canvas.width, this.canvas.height );		

		let vertexShader: WebGLShader   = this.compileShader( this.gl.VERTEX_SHADER, WebGLRenderer.VERTEX_SHADER ),
			fragmentShader: WebGLShader = this.compileShader( this.gl.FRAGMENT_SHADER, WebGLRenderer.FRAGMENT_SHADER ),
			program: WebGLProgram       = this.gl.createProgram();

		this.gl.attachShader( program, vertexShader );
		this.gl.attachShader( program, fragmentShader );
		this.gl.linkProgram( program );
		this.gl.deleteShader( vertexShader );
		this.gl.deleteShader( fragmentShader );

		let ok = this.gl.getProgramParameter( program, this.gl.LINK_STATUS );

		if ( ! ok ) {

			let msg: string = "Error linking program: " + this.gl.getProgramInfoLog( program );
			this.gl.deleteProgram( program );
			throw msg;

		}

		this.gl.useProgram( program );

		// Get attribute locations
		this.attribs.position.location  = this.gl.getAttribLocation( program, "position" );
		this.attribs.texCoord.location  = this.gl.getAttribLocation( program, "texCoord" );
		this.attribs.color.location     = this.gl.getAttribLocation( program, "color" );
		this.attribs.bgColor.location   = this.gl.getAttribLocation( program, "bgColor" );
		this.attribs.charIndex.location = this.gl.getAttribLocation( program, "charIndex" );

		// Setup buffers and uniforms
		this.initBuffers();

		let resolutionLocation: WebGLUniformLocation = this.gl.getUniformLocation( program, "uResolution" );

		this.gl.uniform2f( resolutionLocation, this.canvas.width, this.canvas.height );
		this.tileCountsLocation = this.gl.getUniformLocation( program, "uTileCounts" );
		this.gl.uniform2f( this.tileCountsLocation, this.view.Width, this.view.Height );
		this.paddingLocation = this.gl.getUniformLocation( program, "uPadding" );
		this.gl.uniform2f( this.paddingLocation, 0.0, 0.0 );

		// Setup texture
		//view.elem.appendChild(this.offscreen); // Debug offscreen
		let texture: WebGLTexture = this.gl.createTexture();
		this.gl.bindTexture( this.gl.TEXTURE_2D, texture );
		this.cacheChars( " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~" );
		this.gl.texParameteri( this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST );
		this.gl.texParameteri( this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST );
		this.gl.texParameteri( this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE );
		this.gl.texParameteri( this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE );
		this.gl.activeTexture( this.gl.TEXTURE0 );
	
		let _this = this;
		// TODO: This is gross. Is there any other way to do this?
		setTimeout( function() {

			_this.updateStyle(); 
			_this.buildTexture(); 
			_this.render();

		}, 100);

	}

	clear (): void {}

	render (): void {

		this.gl.clear( this.gl.COLOR_BUFFER_BIT );

		let attribs: IAttributes = this.attribs,
			defaultBgColor: string = this.view.DefaultBackground,
			defaultColor: string   = this.view.DefaultColor,
			h: number              = this.view.Height,
			newChars: boolean      = false,
			tiles: Tile[][]        = this.view.Buffer,
			w: number              = this.view.Width; 

			// Create new tile data
		for ( let j: number = 0; j < h; ++j ) {

			for ( let i: number = 0; i < w; ++i ) {

				let tile: Tile = tiles[ j ][ i ] || null,
					ch: string = ( tile ) ? <string>this.charMap[ tile.Char ] : null;

				if ( ! tile ) {

					continue;

				}

				if ( ch === undefined ) { // Auto-cache new characters

					this.cacheChars( tile.Char, false );
					newChars = true;
					ch = <string>this.charMap[ tile.Char ];

				}

				let k: number  = attribs.color.itemSize * 6 * ( j * w + i ),
					kk: number = attribs.charIndex.itemSize * 6 * ( j * w + i ),
					r: number  = ( tile.Red === undefined )             ? this.defaultColors.red : tile.Red / 255,
					g: number  = ( tile.Green === undefined )           ? this.defaultColors.green : tile.Green / 255,
					b: number  = ( tile.Blue === undefined )            ? this.defaultColors.blue : tile.Blue / 255,
					br: number = ( tile.BackgroundRed === undefined )   ? this.defaultColors.backgroundRed: tile.BackgroundRed / 255,
					bg: number = ( tile.BackgroundGreen === undefined ) ? this.defaultColors.backgroundGreen: tile.BackgroundGreen / 255,
					bb: number = ( tile.BackgroundBlue === undefined )  ? this.defaultColors.backgroundBlue: tile.BackgroundBlue / 255;

				for ( let m: number = 0; m < 6; ++m ) {

					let n: number = k + m * attribs.color.itemSize;
					attribs.color.data[ n + 0 ] = r;
					attribs.color.data[ n + 1 ] = g;
					attribs.color.data[ n + 2 ] = b;
					attribs.bgColor.data[ n + 0 ] = br;
					attribs.bgColor.data[ n + 1 ] = bg;
					attribs.bgColor.data[ n + 2 ] = bb;
					attribs.charIndex.data[ kk + m ] = ch;
					

				}

			}

		}

		// Upload
		if ( newChars ) {
			
			this.buildTexture();

		}

		this.gl.bindBuffer( this.gl.ARRAY_BUFFER, attribs.color.buffer );
		this.gl.bufferData( this.gl.ARRAY_BUFFER, <ArrayBuffer>attribs.color.data, attribs.color.hint );
		this.gl.bindBuffer( this.gl.ARRAY_BUFFER, attribs.bgColor.buffer );
		this.gl.bufferData( this.gl.ARRAY_BUFFER, <ArrayBuffer>attribs.bgColor.data, attribs.bgColor.hint );
		this.gl.bindBuffer( this.gl.ARRAY_BUFFER, attribs.charIndex.buffer );
		this.gl.bufferData( this.gl.ARRAY_BUFFER, <ArrayBuffer>attribs.charIndex.data, attribs.charIndex.hint );

		let attrib: IPositionAttribute = this.attribs.position;
		this.gl.drawArrays( this.gl.TRIANGLES, 0, attrib.data.length / attrib.itemSize);

	}

	updateStyle ( s: CSSStyleDeclaration = null ): void {

		s = s || window.getComputedStyle( this.view.Element, null );

		this.ctx.font         = s.fontSize + "/" + s.lineHeight + " " + s.fontFamily;
		this.ctx.textBaseline = "middle";
		this.ctx.fillStyle    = "#ffffff";
		this.textWidth        = this.ctx.measureText( "M" ).width;
		this.textHeight       = parseInt( s.fontSize, 10 );
		this.gap              = ( this.view.Squarify ) ? ( this.textHeight - this.textWidth ) : 0;

		if ( this.view.Squarify) {
			
			this.textWidth = this.textHeight;

		}

		let color = s.color.match( /\d+/g ),
			bgColor = s.backgroundColor.match( /\d+/g );

		this.pad                           = Math.ceil( this.textHeight * 0.2 ) * 2.0; // Must be even number
		this.defaultColors.red             = parseInt( color[ 0 ], 10 ) / 255;
		this.defaultColors.green           = parseInt( color[ 1 ], 10 ) / 255;
		this.defaultColors.blue            = parseInt( color[ 2 ], 10 ) / 255;
		this.defaultColors.backgroundRed   = parseInt( bgColor[ 0 ], 10 ) / 255;
		this.defaultColors.backgroundGreen = parseInt( bgColor[ 1 ], 10 ) / 255;
		this.defaultColors.backgroundBlue  = parseInt( bgColor[ 2 ], 10 ) / 255;

	}

	insertQuad ( arr: [ number ], i: number, x: number, y: number, w: number, h: number ): void {

		let x1: number = x, 
			y1: number = y, 
			x2: number = x + w, 
			y2: number = y + h;

		arr[   i ] = x1; 
		arr[ ++i ] = y1;
		arr[ ++i ] = x2; 
		arr[ ++i ] = y1;
		arr[ ++i ] = x1; 
		arr[ ++i ] = y2;
		arr[ ++i ] = x1; 
		arr[ ++i ] = y2;
		arr[ ++i ] = x2; 
		arr[ ++i ] = y1;
		arr[ ++i ] = x2; 
		arr[ ++i ] = y2;

	}

	initBuffers (): void {

		let a: string = '',
			// TODO: Define a tyle alias encompassing all attribute interfaces
			attrib: IAttribute | IPositionAttribute | ITexCoordAttribute | IColorAttribute | ICharIndexAttribute = null, 
			attribs: IAttributes = this.attribs,
			w: number            = this.view.Width, 
			h: number            = this.view.Height;

		// Allocate data arrays
		for ( a in this.attribs ) {

			attrib 		= attribs[ a ];
			attrib.data = new Float32Array( attrib.itemSize * 6 * w * h );

		}

		// Generate static data
		for ( let j = 0; j < h; ++j ) {

			for ( let i = 0; i < w; ++i ) {

				// Position & texCoords
				let k: number = attribs.position.itemSize * 6 * ( j * w + i );

				this.insertQuad( attribs.position.data, 
								 k, 
								 i * this.textWidth, 
								 j * this.textHeight, 
								 this.textWidth, 
								 this.textHeight );

				this.insertQuad( attribs.texCoord.data, 
								 k, 
								 0.0, 
								 0.0, 
								 1.0, 
								 1.0 );

			}

		}

		// Upload
		for ( a in this.attribs ) {

			attrib = attribs[a];

			if ( attrib.buffer ) {
				
				this.gl.deleteBuffer( attrib.buffer );

			}

			attrib.buffer = this.gl.createBuffer();

			this.gl.bindBuffer( this.gl.ARRAY_BUFFER, attrib.buffer );
			this.gl.bufferData( this.gl.ARRAY_BUFFER, <ArrayBuffer>attrib.data, attrib.hint );
			this.gl.enableVertexAttribArray( attrib.location );
			this.gl.vertexAttribPointer( attrib.location, attrib.itemSize, this.gl.FLOAT, false, 0, 0 );

		}

	}

	compileShader ( type: number, source: string ): WebGLShader {

		let ok: string          = null, 
			shader: WebGLShader = this.gl.createShader( type );

		this.gl.shaderSource( shader, source );
		this.gl.compileShader( shader );

		ok = this.gl.getShaderParameter( shader, this.gl.COMPILE_STATUS );

		if ( ! ok ) {

			var msg = "Error compiling shader: " + this.gl.getShaderInfoLog( shader );
			this.gl.deleteShader( shader );
			throw msg;

		}

		return shader;

	}

	buildTexture (): void {

		let w: number         = this.offscreen.width / ( this.textWidth + this.pad),
			h: number         = this.offscreen.height / ( this.textHeight + this.pad ),
			charCount: number = this.charArray.length;

		// Check if need to resize the canvas
		if ( charCount > Math.floor( w ) * Math.floor( h ) ) {

			w                     = Math.ceil( Math.sqrt( charCount ) );
			h                     = w + 2; // Allocate some extra space too
			this.offscreen.width  = w * ( this.textWidth + this.pad );
			this.offscreen.height = h * ( this.textHeight + this.pad );

			this.updateStyle();
			this.gl.uniform2f( this.tileCountsLocation, w, h );

		}

		this.gl.uniform2f( this.paddingLocation, this.pad / this.offscreen.width, this.pad / this.offscreen.height );

		let c: number       = 0,
			ch: string      = '',
			halfGap: number = 0.5 * this.gap; // Squarification

		this.ctx.fillStyle = "#000000";
		this.ctx.fillRect( 0, 0, this.offscreen.width, this.offscreen.height );
		this.ctx.fillStyle = "#ffffff";

		let tw: number = this.textWidth + this.pad,
			th: number = this.textHeight + this.pad,
			x: number  = 0,
			y: number  = 0.5 * th; // Half because textBaseline is middle

		for ( let j: number = 0; j < h; ++j ) {

			x = this.pad * 0.5;

			for ( let i: number = 0; i < w; ++i, ++c ) {

				ch = this.charArray[ c ];

				if ( ch === undefined ) {
					
					break;

				}

				this.ctx.fillText( ch, x + halfGap, y );
				x += tw;

			}

			if ( ! ch ) {

				break;

			}

			y += th;

		}

		this.gl.texImage2D( this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.offscreen );		

	}

	cacheChars ( chars: string, build: boolean = false ): void {

		if ( ! this.gl ) {
			
			return; // Nothing to do if not using WebGL renderer

		}

		let changed: boolean = false;

		for ( let i: number = 0; i < chars.length; ++i ) {

			if ( this.charMap[ chars[ i ] ] === undefined ) {

				changed = true;
				this.charArray.push( chars[ i ] );
				this.charMap[ chars[ i ] ] = this.charArray.length - 1;

			}

		}

		if ( changed && build !== false ) {
			
			this.buildTexture();

		}

	}

}
