import {Tile} from './tile';
import {Viewport} from './viewport';

export class Engine {

	private width: number = 0;
	private height: number = 0;
	private maskFunction: Function = null;
	private shaderFunction: Function = null;
	private tileFunction: Function = null;
	private viewport: Viewport = null;

	private cacheEnabled: boolean = false;
	private refreshCache: boolean = true;
	private transitionTimer: number = null;
	private transitionDuration: number = 0;
	private transition: Function = null;
	private cachex: number = 0;
	private cachey: number = 0;
	private tileCache: Tile[][];
	private tileCache2: Tile[][];	

	constructor ( vp: Viewport, func: Function, w: number, h: number ) {

		this.width = w;
		this.height = h;
		this.viewport = vp;
		this.tileCache = new Array( this.viewport.Height );
		this.tileCache2 = new Array( this.viewport.Height );
		this.tileFunction = func;

		for ( let j = 0; j < vp.Height; j++ ) {

			this.tileCache[ j ] = new Array( vp.Width );
			this.tileCache2[ j ] = new Array( vp.Width );

		}

	}

	public setTileFunc ( func: Function, effect: string, duration: number ): void {

		if ( effect ) {

			this.transition = undefined;

			if ( typeof effect === "string" ) {

				if ( effect === "boxin" ) {

					this.transition = function( x: number, y: number, w: number, h: number, new_t: Tile, old_t: Tile, factor: number ) {

						let halfw = w * 0.5, 
							halfh = h * 0.5;

						x -= halfw;
						y -= halfh;

						if ( Math.abs( x ) < halfw * factor && Math.abs( y ) < halfh * factor ) {
							
							return new_t;

						} else {
							
							return old_t;

						}

					};

				} else if ( effect === "boxout" ) {

					this.transition = function( x: number, y: number, w: number, h: number, new_t: Tile, old_t: Tile, factor: number ) {

						let halfw = w * 0.5, 
							halfh = h * 0.5;

						x -= halfw;
						y -= halfh;
						factor = 1.0 - factor;

						if ( Math.abs( x ) < halfw * factor && Math.abs( y ) < halfh * factor ) {

							return old_t;

						} else {

							return new_t;

						}

					};

				} else if ( effect === "circlein" ) {

					this.transition = function( x: number, y: number, w: number, h: number, new_t: Tile, old_t: Tile, factor: number ) {

						let halfw = w * 0.5,
							halfh = h * 0.5;

						x -= halfw; y -= halfh;

						if ( ( x * x ) + ( y * y ) < ( ( halfw * halfw ) + ( halfh * halfh ) ) * factor ) {

							return new_t;

						} else {
							
							return old_t;

						}

					};

				} else if ( effect === "circleout" ) {

					this.transition = function( x: number, y: number, w: number, h: number, new_t: Tile, old_t: Tile, factor: number ) {

						let halfw = w * 0.5,
							halfh = h * 0.5;

						x -= halfw;
						y -= halfh;
						factor = 1.0 - factor;

						if ( ( x * x ) + ( y * y ) > ( ( halfw * halfw ) + ( halfh * halfh ) ) * factor ) {

							return new_t;

						} else {

							return old_t;

						}

					};

				} else if (effect === "random") {

					this.transition = function( x: number, y: number, w: number, h: number, new_t: Tile, old_t: Tile, factor: number ) {

						if ( Math.random() > factor ) {

							return old_t;

						} else {

							return new_t;

						}

					};

				}
			}

			if ( this.transition ) {

				this.transitionTimer = ( new Date() ).getTime();
				this.transitionDuration = duration || 500;

			}
		}

		this.tileFunction = func;

	}

	/** Sets the function to be called to fetch mask information according to coordinates.
	 * If mask function returns false to some coordinates, then that tile is not rendered.
	 */
	public setMaskFunc ( func: Function ): void {

		this.maskFunction = func;

	}

	/** Sets the function to be called to post-process / shade each visible tile.
	 * Shader function is called even if caching is enabled, see <Engine.setCacheEnabled>.
	 */
	public setShaderFunc ( func: Function ): void {

		this.shaderFunction = func;

	}

	/** Tiles outside of the range x = [0,width]; y = [0,height] are not fetched. 
	 * Set to undefined in order to make the world infinite.
	*/
	public setWorldSize ( width: number, height: number ): void {

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
	public setCacheEnabled ( mode: boolean ): void {

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
	public update ( x: number = 0, y: number = 0, center: boolean = false ): void {

		if ( ! this.viewport ) {

			console.error( 'this.viewport is empty!:', this.viewport);
			return;

		}

		// World coords of upper left corner of the viewport
		let xx: number = x; // - this.viewport.CenterX;
		let yy: number = y; // - this.viewport.CenterY;

		if ( center ) {

			xx = xx - this.viewport.CenterX;
			yy = yy - this.viewport.CenterY;

		}

		let timeNow: number = ( new Date() ).getTime(); // For passing to shaderFunc
		let transTime: number;

		if ( this.transition ) {

			transTime = ( timeNow - this.transitionTimer ) / this.transitionDuration;

		}

		if ( transTime >= 1.0 ) {

			this.transition = undefined;

		}

		let tile: Tile;

		// For each tile in viewport...
		for ( let j = 0; j < this.viewport.Height; ++j ) {

			for ( let i = 0; i < this.viewport.Width; ++i ) {

				let ixx = i + xx,
					jyy = j + yy;

				// Check horizontal bounds if requested
				if ( this.width && ( ixx < 0 || ixx >= this.width ) ) {

					tile = Tile.NullTile();

				// Check vertical bounds if requested
				} else if ( this.height && ( jyy < 0 || jyy >= this.width ) ) {

					tile = Tile.NullTile();

				// Check mask
				} else if ( this.maskFunction && ! this.maskFunction( ixx, jyy ) ) {

					tile = Tile.NullTile();

				// Check transition effect
				} else if ( this.transition && ! this.refreshCache ) {

					tile = this.transition( 
						i, 
						j, 
						this.viewport.Width, 
						this.viewport.Height,
						( this.tileFunction ) ? this.tileFunction( ixx, jyy ) : null,
						this.tileCache[ j ][ i ],
						transTime );

				// Check cache
				} else if ( this.cacheEnabled && ! this.refreshCache ) {

					let lookupx = ixx - this.cachex;
					let lookupy = jyy - this.cachey;

					if ( lookupx >= 0 && lookupx < this.viewport.Width && lookupy >= 0 && lookupy < this.viewport.Height ) {

						tile = this.tileCache[ lookupy ][ lookupx ];

						if ( tile === Tile.NullTile() && this.tileFunction ) {
							
							tile = this.tileFunction( ixx, jyy );

						}

					} else { // Cache miss

						if ( this.tileFunction ) {

							tile = this.tileFunction( ixx, jyy );

						}

					}

				// If all else fails, call tileFunc
				} else {

					if ( this.tileFunction ) {

						tile = this.tileFunction( ixx, jyy );

					}

				}

				// Save the tile to cache (always due to transition effects)
				this.tileCache2[ j ][ i ] = tile;

				// Apply shader function
				if ( this.shaderFunction && tile !== Tile.NullTile() ) {
					tile = this.shaderFunction( tile, ixx, jyy, timeNow );
				}

				// Put shaded tile to viewport
				this.viewport.unsafePut( tile, i, j );

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
