
interface IPressedKeys {
    [ idx: string ]: any;
}

export class Input {

	public static KEY_BACKSPACE: number = 8;
	public static KEY_TAB: number = 9;
	public static KEY_ENTER: number = 13;
	public static KEY_SHIFT: number = 16;
	public static KEY_CTRL: number = 17;
	public static KEY_ALT: number = 18;
	public static KEY_ESCAPE: number = 27;
	public static KEY_SPACE: number = 32;
	public static KEY_LEFT: number = 37;
	public static KEY_UP: number = 38;
	public static KEY_RIGHT: number = 39;
	public static KEY_DOWN: number = 40;

	public static KEY_0: number = 48;
	public static KEY_1: number = 49;
	public static KEY_2: number = 50;
	public static KEY_3: number = 51;
	public static KEY_4: number = 52;
	public static KEY_5: number = 53;
	public static KEY_6: number = 54;
	public static KEY_7: number = 55;
	public static KEY_8: number = 56;
	public static KEY_9: number = 57;	

	public static KEY_A: number = 65;
	public static KEY_B: number = 66;
	public static KEY_C: number = 67;
	public static KEY_D: number = 68;
	public static KEY_E: number = 69;
	public static KEY_F: number = 70;
	public static KEY_G: number = 71;
	public static KEY_H: number = 72;
	public static KEY_I: number = 73;
	public static KEY_J: number = 74;
	public static KEY_K: number = 75;
	public static KEY_L: number = 76;
	public static KEY_M: number = 77;
	public static KEY_N: number = 78;		
	public static KEY_O: number = 79;
	public static KEY_P: number = 80;
	public static KEY_Q: number = 81;
	public static KEY_R: number = 82;
	public static KEY_S: number = 83;
	public static KEY_T: number = 84;
	public static KEY_U: number = 85;
	public static KEY_V: number = 86;
	public static KEY_W: number = 87;
	public static KEY_X: number = 88;
	public static KEY_Y: number = 89;
	public static KEY_Z: number = 90;
	public static KEY_NUMPAD0: number = 96;
	public static KEY_NUMPAD1: number = 97;
	public static KEY_NUMPAD2: number = 98;
	public static KEY_NUMPAD3: number = 99;
	public static KEY_NUMPAD4: number = 100;
	public static KEY_NUMPAD5: number = 101;
	public static KEY_NUMPAD6: number = 102;
	public static KEY_NUMPAD7: number = 103;
	public static KEY_NUMPAD8: number = 104;
	public static KEY_NUMPAD9: number = 105;
	public static KEY_F1: number = 112;
	public static KEY_F2: number = 113;
	public static KEY_F3: number = 114;
	public static KEY_F4: number = 115;
	public static KEY_F5: number = 116;
	public static KEY_F6: number = 117;
	public static KEY_F7: number = 118;
	public static KEY_F8: number = 119;
	public static KEY_F9: number = 120;
	public static KEY_F10: number = 121;
	public static KEY_F11: number = 122;
	public static KEY_F12: number = 123;	

	public static KEY_COMMA: number = 188;
	public static KEY_DASH: number = 189;
	public static KEY_PERIOD: number = 190;

	public static pressedKeys: IPressedKeys = {};
	public static keyRepeatDelay: number = 150;

	private static onKeyUp: Function;
	private static onKeyDown: Function;

	/** Checks if given key is pressed down. You must call <ut.initInput> first. */
	public static isKeyPressed ( key: number ): boolean {

		if ( Input.pressedKeys[ key ] ) {
			return true;
		}

		return false;

	}

	/** Sets the interval when user's onKeyDown handler is called when a key is held down.
	 * <Input.initInput> must be called with a handler for this to work.
	 */
	public static setKeyRepeatInterval( milliseconds: number ): void {

		Input.keyRepeatDelay = milliseconds;

	}

	public static initInput( onKeyDown: Function, onKeyUp: Function ): void {

		Input.onKeyDown = onKeyDown;
		Input.onKeyUp = onKeyUp;

		// Attach default onkeydown handler that updates pressedKeys
		document.onkeydown = function( event ) {

			var k = event.keyCode;

			if ( Input.pressedKeys[k] !== null && Input.pressedKeys[k] !== undefined ) {

				return false;

			}

			Input.pressedKeys[ k ] = true;

			if ( Input.onKeyDown ) {

				Input.onKeyDown( k ); // User event handler
				// Setup keyrepeat
				Input.pressedKeys[ k ] = setInterval( "Input.onKeyDown(" + k + ")", Input.keyRepeatDelay );

			}

			if ( Input.pressedKeys[ Input.KEY_CTRL ] || Input.pressedKeys[ Input.KEY_ALT ] ) {

				return true; // CTRL/ALT for browser hotkeys

			} else {

				return false;

			}

		};

		// Attach default onkeyup handler that updates pressedKeys
		document.onkeyup = function( event ) {

			let k = event.keyCode;

			if ( Input.onKeyDown && Input.pressedKeys[ k ] !== null && Input.pressedKeys[ k ] !== undefined ) {

				clearInterval( Input.pressedKeys[ k ] );

			}

			Input.pressedKeys[ k ] = null;

			if ( Input.onKeyUp) {

				Input.onKeyUp( k ); // User event handler

			}

			return false;
		};

		// Avoid keys getting stuck at down
		window.onblur = function() {

			for ( let k in Input.pressedKeys ) {

				if ( Input.onKeyDown && Input.pressedKeys[ k ] !== null ) {

					clearInterval( Input.pressedKeys[ k ] );

				}

			}

			Input.pressedKeys = {};

		};

	}

}
