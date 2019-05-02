import { Component, IAttributes, createNode } from '@alumis/observables-dom';

export abstract class AlumisDropdownItem<TElement extends HTMLElement> extends Component<TElement> {

    constructor(tagName: string, attrs: IAttributes, children: any[]) {

        super();

        this.node = createNode(tagName, attrs, children);
        this.node.classList.add('dropdown-item');
    }
}