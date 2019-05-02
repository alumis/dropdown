import { Component, createNode } from '@alumis/observables-dom';
import { IAlumisDropdownMenuAttributes } from './IAlumisDropdownMenuAttributes';
import { IAlumisDropdownMenuAnimator } from './IAlumisDropdownMenuAnimator';
import Popper, { Placement } from 'popper.js';
import { CancellationToken } from '@alumis/cancellationtoken';
import { observe } from '@alumis/utils';
import { DropdownMenuPlacement } from './DropdownMenuPlacement';

export abstract class AlumisDropdownMenu extends Component<HTMLDivElement> {

    constructor(attrs: IAlumisDropdownMenuAttributes, children: any[]) {

        super();
        
        let animator: IAlumisDropdownMenuAnimator;
        let placement: DropdownMenuPlacement;        

        if (attrs) {
           
            animator = attrs.animator;
            placement = attrs.placement;
            
            delete attrs.animator;
            delete attrs.placement;
        }

        this.node = createNode('div', attrs, children);
        this.node.classList.add('dropdown-menu');

        this.placement = placement || DropdownMenuPlacement.top;
        this.animator = animator;
    }

    placement: DropdownMenuPlacement;
    animator: IAlumisDropdownMenuAnimator;

    get toggleElement() {

        return this._referenceElement;
    }
    set toggleElement(value: HTMLElement) {

        this._referenceElement = value;

        this._popper = new Popper(value, this.node, {

            placement: this.placement
        });
    }

    get isVisible() { return this._isVisible };
    
    private _referenceElement: HTMLElement;
    private _isVisible: boolean;
    private _cancellationToken: CancellationToken;
    private _popper: Popper;

    async showAsync() {

        if (!this.animator) {

            this.toggleElement.appendChild(this.node);
            this._popper.update();

        } else {

            if (this._cancellationToken) 
                this._cancellationToken.cancel();

            this._cancellationToken = new CancellationToken();

            if (!this.node.parentElement) {

                this.node.style.opacity = '0';
                this.toggleElement.parentElement.appendChild(this.node);
                observe(this.node);
            }

            this._popper.update();                

            await this.animator.showAsync(this.node, this._cancellationToken);

            delete this._cancellationToken;
        }
    }

    async hideAsync() {

        if (!this.animator) {

            this.node.remove();

        } else {
            
            if (this._cancellationToken) 
                this._cancellationToken.cancel();

            this._cancellationToken = new CancellationToken();

            if (!this.node.parentElement)
                return;

            await this.animator.hideAsync(this.node, this._cancellationToken);

            this.node.remove();

            delete this._cancellationToken;
        }
    }
}

