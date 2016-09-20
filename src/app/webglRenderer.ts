import {IRenderer} from './Renderer';
import {Viewport} from './Viewport';

interface ICharMap {

    [ idx: string ]: any;

}

interface IAttributes {

	[ idx: string ]: IAttribute;

	position: any;
	texCoord: any;
	color: any;
	bgColor: any;
	charIndex: any;

}

interface IAttribute {

	data: Float32Array;
	buffer: any;
	itemSize: any;
	location: any;
	hint: any;

}

export class WebGLRenderer implements IRenderer {

	private view: Viewport;
	private canvas: HTMLCanvasElement;
	private gl: WebGLRenderingContext;
	private charMap: ICharMap;
	private charArray: [ string ];
	private textWidth: number = 0;
	private textHeight: number = 0;
	private gap: number = 0;
	private pad: number = 0;
	private offscreen: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private tileCountsLocation: WebGLUniformLocation;
	private paddingLocation: WebGLUniformLocation;

	private defaultColors: Object = {
		red: 1.0,
		blue: 1.0,
		green: 1.0,
		backgroundRed: 1.0,
		backgroundGreen: 1.0,
		backgroundBlue: 1.0
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
	].join('\n');

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
	].join('\n');

	constructor ( v: Viewport ) {

		this.view = v;
		this.canvas = document.createElement( "canvas" );		

		if ( ! this.canvas.getContext ) {

			throw( "Canvas not supported" );

		}

		this.gl = this.canvas.getContext( "experimental-webgl" );

		if ( ! this.gl ) {

			throw( "WebGL not supported" );

		}

		this.view.Element.appendChild( this.canvas );

		this.attribs = {
			position:  { buffer: null, data: null, itemSize: 2, location: null, hint: this.gl.STATIC_DRAW },
			texCoord:  { buffer: null, data: null, itemSize: 2, location: null, hint: this.gl.STATIC_DRAW },
			color:     { buffer: null, data: null, itemSize: 3, location: null, hint: this.gl.DYNAMIC_DRAW },
			bgColor:   { buffer: null, data: null, itemSize: 3, location: null, hint: this.gl.DYNAMIC_DRAW },
			charIndex: { buffer: null, data: null, itemSize: 1, location: null, hint: this.gl.DYNAMIC_DRAW }
		};

		// Create an offscreen canvas for rendering text to texture
		if ( ! this.offscreen ) {

			this.offscreen = document.createElement( "canvas" );

		}

		this.offscreen.style.position = "absolute";
		this.offscreen.style.top = "0px";
		this.offscreen.style.left = "0px";
		this.ctx = this.offscreen.getContext( "2d" );

		if ( ! this.ctx ) {

			throw "Failed to acquire offscreen canvas drawing context";

		}

		// WebGL drawing canvas
		this.updateStyle();
		this.canvas.width = ( this.view.Squarify ? this.textWidth : this.textHeight ) * this.view.Width;
		this.canvas.height = this.textHeight * this.view.Height;
		this.offscreen.width = 0;
		this.offscreen.height = 0;
		
		// Doing this again since setting canvas w/h resets the state
		this.updateStyle();

		this.gl.viewport( 0, 0, this.canvas.width, this.canvas.height );		

		let vertexShader: WebGLShader = this.compileShader( this.gl.VERTEX_SHADER, WebGLRenderer.VERTEX_SHADER );
		let fragmentShader: WebGLShader = this.compileShader( this.gl.FRAGMENT_SHADER, WebGLRenderer.FRAGMENT_SHADER );
		let program: WebGLProgram = this.gl.createProgram();
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

	}

	clear (): void {}

	render (): void {}

	updateStyle ( s: CSSStyleDeclaration = null ): void {}

	insertQuad ( arr: [ number ], i: number, x: number, y: number, w: number, h: number ): void {

		let x1: number = x, 
			y1: number = y, 
			x2: number = x + w, 
			y2: number = y + h;

		arr[   i ] = x1; arr[ ++i ] = y1;
		arr[ ++i ] = x2; arr[ ++i ] = y1;
		arr[ ++i ] = x1; arr[ ++i ] = y2;
		arr[ ++i ] = x1; arr[ ++i ] = y2;
		arr[ ++i ] = x2; arr[ ++i ] = y1;
		arr[ ++i ] = x2; arr[ ++i ] = y2;

	}

	initBuffers (): void {

		let a: string, 
			attrib: IAttribute, 
			attribs: IAttributes = this.attribs,
			w: number = this.view.Width, 
			h: number = this.view.Height;

		// Allocate data arrays
		for ( a in this.attribs ) {

			attrib = attribs[ a ];
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
			this.gl.bufferData( this.gl.ARRAY_BUFFER, attrib.data, attrib.hint );
			this.gl.enableVertexAttribArray( attrib.location );
			this.gl.vertexAttribPointer( attrib.location, attrib.itemSize, this.gl.FLOAT, false, 0, 0 );

		}

	}

	compileShader ( type: any, source: any ): WebGLShader {

		let ok: string = null, 
			shader = this.gl.createShader( type );

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

	buildTexture (): void {}

	cacheChars ( chars: string, build: boolean ): void {}

}
