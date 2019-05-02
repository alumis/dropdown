import { Component, IAttributes, createNode } from '@alumis/observables-dom';
import { IAlumisDropdownItemCssClasses } from './IAlumisDropdownItemCssClasses';

export abstract class AlumisDropdownItem<TElement extends HTMLElement> extends Component<TElement> {

    constructor(tagName: string, attrs: IAttributes, children: any[], cssClasses: IAlumisDropdownItemCssClasses) {

        super();

        this.node = createNode(tagName, attrs, children);
        this.node.classList.add(cssClasses["dropdown-item"]);
    }
}