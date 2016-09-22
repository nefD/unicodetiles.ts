import {IRenderer} from './Renderer';
import {Viewport} from './Viewport';
import {Tile} from './Tile';

/** Renders the <Viewport> into an HTML5 <canvas> element. */
export class CanvasRenderer implements IRenderer {

	private canvas: HTMLCanvasElement = null;
	private ctx: CanvasRenderingContext2D = null;
	private ctx2: CanvasRenderingContext2D = null;
	private gap: number = 0;
	private offscreen: HTMLCanvasElement = null;
	private textHeight: number = 0;
	private textWidth: number = 0;
	private view: Viewport = null;

	constructor ( v: Viewport ) {

		this.view = v;
		this.canvas = document.createElement( "canvas" );

		if ( ! this.canvas.getContext ) {

			 throw( "Canvas not supported" );

		}

		this.ctx2 = this.canvas.getContext( "2d" );

		if ( ! this.ctx2 || ! this.ctx2.fillText ) {

			throw( "Canvas not supported" );

		}

		this.view.Element.appendChild( this.canvas );

		// TODO: Move this code into its own function
		// Create an offscreen canvas for rendering
		this.offscreen = document.createElement( "canvas" );
		this.ctx = this.offscreen.getContext( "2d" );
		this.updateStyle();
		// Initialize width of canvases
		this.canvas.width = ( this.view.Squarify ? this.textHeight : this.textWidth ) * this.view.Width;
		this.canvas.height = this.textHeight * this.view.Height;
		this.offscreen.width = this.canvas.width;
		this.offscreen.height = this.canvas.height;
		// Doing this again since setting canvas w/h resets the state
		this.updateStyle();				

	}

	public clear (): void {

		/* Stub */

	}

	/** Render the <Viewport> to the canvas context. */
	public render (): void {

		let tile: Tile = null,
			ch: string = '',
			fg: string = '', 
			bg: string = '', 
			x: number = 0, 
			y: number = 0,
			buffer: Tile[][] = this.view.Buffer,
			w: number = this.view.Width,
			h: number = this.view.Height,
			hth: number = 0.5 * this.textHeight,
			hgap: number = 0.5 * this.gap; // Squarification

		// Clearing with one big rect is much faster than with individual char rects
		this.ctx.fillStyle = this.view.DefaultBackground;
		this.ctx.fillRect( 0, 0, this.canvas.width, this.canvas.height );

		y = hth; // half because textBaseline is middle

		for ( let j = 0; j < h; ++j ) {

			x = 0;

			for ( let i = 0; i < w; ++i ) {
				
				tile = buffer[ j ][ i ];
				ch = tile.Char;
				fg = tile.getColorRGB();
				bg = tile.getBackgroundRGB();

				// Only render background if the color is non-default
				if ( bg.length && bg !== this.view.DefaultBackground ) {

					this.ctx.fillStyle = bg;
					this.ctx.fillRect( x, y - hth, this.textWidth, this.textHeight );

				}

				// Do not attempt to render empty char
				if ( ch.length ) {

					if ( ! fg.length ) {

						fg = this.view.DefaultColor;

					}

					this.ctx.fillStyle = fg;
					this.ctx.fillText( ch, x + hgap, y );

				}

				x += this.textWidth;
			}

			y += this.textHeight;
		}

		this.ctx2.drawImage( this.offscreen, 0, 0 );

	}

	/** Recalculates internal variables according to the text styling
	 * provided, or according to the styling assigned to the canvas
	 * container if styling is not provided.
	 */
	public updateStyle ( s: CSSStyleDeclaration = null ): void {

		s = s || window.getComputedStyle( this.view.Element, null );
		this.ctx.font = s.fontSize + "/" + s.lineHeight + " " + s.fontFamily;
		this.ctx.textBaseline = "middle";
		this.textWidth = this.ctx.measureText( "M" ).width;
		this.textHeight = parseInt( s.fontSize, 10 );
		this.gap = ( this.view.Squarify ) ? ( this.textHeight - this.textWidth ) : 0;

		if ( this.view.Squarify ) {

			this.textWidth = this.textHeight;

		}

	}

}
