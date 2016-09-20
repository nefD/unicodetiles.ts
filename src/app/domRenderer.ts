import {IRenderer} from './Renderer';
import {Viewport} from './Viewport';

export class DOMRenderer implements IRenderer {

	private view: Viewport;

	constructor ( v: Viewport ) {}

	clear () {}

	render () {}

	updateStyle ( s: CSSStyleDeclaration ) {}

}
