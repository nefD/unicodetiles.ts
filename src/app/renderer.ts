
import {Viewport} from './viewport';

export interface IRenderer {

	clear(): void;
	render(): void;
	updateStyle( s: CSSStyleDeclaration ): void;

}
