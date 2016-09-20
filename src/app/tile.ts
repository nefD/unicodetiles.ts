
/** Represents a unicode character tile with various attributes. */
export class Tile {

	private char: string;
	private red: number;
	private green: number;
	private blue: number;
	private backgroundRed: number;
	private backgroundGreen: number;
	private backgroundBlue: number;

	private static _nullTile: Tile = new Tile();

	/**  Constructs a new Tile object. */
	constructor ( ch: string = '', r: number = 0, g: number = 0, b: number = 0, br: number = 0, bg: number = 0, bb: number = 0 ) {

		this.char = ch;
		this.red = r;
		this.blue = b;
		this.green = g;
		this.backgroundRed = br;
		this.backgroundGreen = bg;
		this.backgroundBlue = bb;

	}

	/** Get the red value of this tiles foreground color. */
	get Red (): number { return this.red; }

	/** Get the green value of this tiles foreground color.  */
	get Green (): number { return this.green; }

	/** Get the blue value of this tiles foreground color. */
	get Blue (): number { return this.blue; }

	/** Get the red value of this tiles background color. */
	get BackgroundRed (): number { return this.backgroundRed; }

	/** Get the green value of this tiles background color. */
	get BackgroundGreen (): number { return this.backgroundGreen; }

	/** Get the blue value of this tiles background color. */
	get BackgroundBlue (): number { return this.backgroundBlue; }

	/** Get the character of this tile. */
	get Char (): string { return this.char; }

	/** Return the static null tile object. */
	public static NullTile (): Tile { 
		
		return Tile._nullTile; 
	
	}

	// TODO: This function is deprecated, replace calls to it with calls to the Char getter
	/** Returns the character of this tile. */
	public getChar (): string {

		return this.char;

	}

	/** Sets the character of this tile. */
	public setChar ( ch: string ): void {

		this.char = ch;

	}

	/** Sets the foreground color of this tile. */
	public setColor ( r: number, g: number, b: number ): void {

		this.red = r;
		this.green = g;
		this.blue = b;

	}

	/** Sets the foreground color to the given shade (0-255) of grey. */
	public setGrey ( grey: number ): void {

		this.red = grey;
		this.blue = grey;
		this.green = grey;

	}

	/** Sets the background color of this tile. */
	public setBackground ( r: number, g: number, b: number ): void {

		this.backgroundRed = r;
		this.backgroundGreen = g;
		this.backgroundBlue = b;

	}

	/** Clears the color of this tile / assigns default color. */
	public resetColor (): void {

		this.red = this.green = this.blue = undefined;

	}

	/** Clears the background color of this tile. */
	public resetBackground (): void {

		this.backgroundRed = this.backgroundGreen = this.backgroundBlue = undefined;

	}

	/** Returns the hexadecimal representation of the color. */
	public getColorHex (): string {

		if (this.red !== undefined && this.green !== undefined && this.blue !== undefined) {

			return "#" + this.red.toString(16) + this.green.toString(16) + this.blue.toString(16);

		} else {

			return "";

		}

	}

	/** Returns the hexadecimal representation of the background color. */
	public getBackgroundHex (): string {

		if (this.backgroundRed !== undefined && this.backgroundGreen !== undefined && this.backgroundBlue !== undefined) {

			return "#" + this.backgroundRed.toString(16) + this.backgroundGreen.toString(16) + this.backgroundBlue.toString(16);

		} else {

			return "";

		}

	}

	/** Returns the CSS rgb(r,g,b) representation of the color. */
	public getColorRGB (): string {

		if (this.red !== undefined && this.green !== undefined && this.blue !== undefined) {

			return 'rgb('+this.red+','+this.green+','+this.blue+')';

		} else {

			return "";

		}

	}

	/** Returns the CSS rgb(r,g,b) representation of the background color. */
	public getBackgroundRGB (): string {

		if (this.backgroundRed !== undefined && this.backgroundGreen !== undefined && this.backgroundBlue !== undefined) {

			return 'rgb('+this.backgroundRed+','+this.backgroundGreen+','+this.backgroundBlue+')';

		} else {

			return "";

		}

	}

	/** Returns the JSON representation of the color, i.e. object { r, g, b }. */
	public getColorJSON (): Object {

		if (this.red !== undefined && this.green !== undefined && this.blue !== undefined) {

			return {
				"r": this.red,
				"g": this.green,
				"b": this.blue
			};

		} else {

			return {};

		}

	}

	/** Returns the JSON representation of the background color, i.e. object { r, g, b }. */
	public getBackgroundJSON (): Object {

		if (this.backgroundRed !== undefined && this.backgroundGreen !== undefined && this.backgroundBlue !== undefined) {

			return {
				"r": this.backgroundRed,
				"g": this.backgroundGreen,
				"b": this.backgroundBlue
			};

		} else {

			return {};

		}

	}

	/** Makes this tile identical to the one supplied. Custom properties are not copied. */
	public copy ( other: Tile ): void {

		this.char = other.getChar();
		this.red = other.Red;
		this.green = other.Green;
		this.blue = other.Blue;
		this.backgroundRed = other.BackgroundRed;
		this.backgroundGreen = other.BackgroundGreen;
		this.backgroundBlue = other.BackgroundBlue;

	}

	/** Returns a new copy of this tile. Custom properties are not cloned. */
	public clone (): Tile {

		return new Tile( this.char, this.red, this.green, this.blue, this.backgroundRed, this.backgroundGreen, this.backgroundBlue );

	}

}
