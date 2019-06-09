import { Component, createNode } from '@alumis/observables-dom';
import { IAlumisDropdownMenuAttributes } from './IAlumisDropdownMenuAttributes';
import { IAlumisDropdownMenuAnimator } from './IAlumisDropdownMenuAnimator';
import Popper from 'popper.js';
import { CancellationToken } from '@alumis/cancellationtoken';
import { observe } from '@alumis/utils';
import { DropdownMenuPlacement } from './DropdownMenuPlacement';
import { IAlumisDropdownMenuCssClasses } from './IAlumisDropdownMenuCssClasses';



export abstract class AlumisDropdownMenu extends Component<HTMLDivElement> {

    constructor(attrs: IAlumisDropdownMenuAttributes, children: any[], cssClasses: IAlumisDropdownMenuCssClasses) {

        super();

        this.clickEventHandler = this.clickEventHandler.bind(this);
        
        let animator: IAlumisDropdownMenuAnimator;
        let placement: DropdownMenuPlacement;        

        if (attrs) {
           
            animator = attrs.animator;
            placement = attrs.placement;
            
            delete attrs.animator;
            delete attrs.placement;
        }

        this.node = createNode('div', attrs, children);
        this.node.addEventListener('click', this.clickEventHandler);
        this.node.classList.add(cssClasses["dropdown-menu"]);

        this.placement = placement || DropdownMenuPlacement.bottom;
        this.animator = animator;
    }

    placement: DropdownMenuPlacement;
    animator: IAlumisDropdownMenuAnimator;

    get toggleElement() {

        return this._toggleElement;
    }
    set toggleElement(value: HTMLElement) {

        this._toggleElement = value;
        this._popper = new Popper(this._toggleElement, this.node, {
            placement: this.placement
        });
    }

    get isVisible() { return this._isVisible };
    
    private _toggleElement: HTMLElement;
    private _isVisible: boolean;
    private _cancellationToken: CancellationToken;
    private _popper: Popper;

    async showAsync() {

        if (this._isVisible) 
            return;

        this._isVisible = true;

        if (!this.animator) {

            this.toggleElement.appendChild(this.node);
            observe(this.node);

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

        if (!this._isVisible)
            return;

        this._isVisible = false;

        if (!this.animator) {

            this.node.remove();

        } else {

            if (!this.node.parentElement)
                return;
            
            if (this._cancellationToken) 
                this._cancellationToken.cancel();

            this._cancellationToken = new CancellationToken();

            await this.animator.hideAsync(this.node, this._cancellationToken);
            this.node.remove();

            delete this._cancellationToken;
        }
    }

    private clickEventHandler(event: Event) {

        event.stopPropagation();
    }
}

