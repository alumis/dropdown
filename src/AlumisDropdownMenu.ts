import { Component, createNode, appendDispose } from '@alumis/observables-dom';
import { IAlumisDropdownAttributes } from './IAlumisDropdownMenuAttributes';
import { Observable, o, co } from '@alumis/observables';
import { IAlumisDropdownMenuAnimator } from './IAlumisDropdownMenuAnimator';
import Popper, { Placement } from 'popper.js';
import { CancellationToken, OperationCancelledError } from '@alumis/cancellationtoken';

import { observe } from '@alumis/utils';

export abstract class AlumisDropdownMenu extends Component<HTMLDivElement> {

    constructor(tagName: string, attrs: IAlumisDropdownAttributes, children: any[]) {

        super();

        this.toggleAction = this.toggleAction.bind(this);
        
        let show: boolean | Observable<boolean> | (() => boolean);
        let animator: IAlumisDropdownMenuAnimator;
        let placement: Placement;        

        if (attrs) {
           
            show = attrs.show;
            animator = attrs.animator;
            placement = attrs.placement;
            
            delete attrs.show;
            delete attrs.animator;
            delete attrs.placement;
        }

        this.node = createNode(tagName, attrs, children);
        this.node.classList.add('dropdown-menu');

        this.placement = placement || 'top';
        this.animator = animator;
        this._show = show;
    }

    showAsObservable: Observable<boolean>;
    placement: Placement;
    animator: IAlumisDropdownMenuAnimator;
    referenceElement: HTMLElement;
    isLoaded = false;
    isInitializing = false;

    private _cancellationToken: CancellationToken;
    private _popper: Popper;
    private _show: boolean | Observable<boolean> | (() => boolean);

    initialize() {

        if (this.isLoaded || this.isInitializing) 
            return;

        this.isInitializing = true;

        try {            

            this._popper = new Popper(this.referenceElement, this.node, { placement: this.placement });

            let show = this._show;
            delete this._show;
    
            if (show instanceof Observable) {
    
                appendDispose(this.node, show.subscribeInvoke(this.toggleAction).dispose);
                this.showAsObservable = show;
            }
    
            else if (typeof show === 'function') {
    
                let computedObservable = co(show);
    
                computedObservable.subscribeInvoke(this.toggleAction);
                appendDispose(this.node, computedObservable.dispose);
    
                this.showAsObservable = computedObservable;
            } else {
    
                let observable = o(show);
    
                observable.subscribeInvoke(this.toggleAction);
                appendDispose(this.node, observable.dispose);
    
                this.showAsObservable = observable;
            }

            this.isLoaded = true;
        }
        finally {

            this.isInitializing = false;
        }
    }

    async toggleAction(show: boolean) {

        if (!this.animator || !this.isLoaded) {

            if (show) {
                this.referenceElement.appendChild(this.node);
                this._popper.update();
            } else {

                this.node.remove();
            }
        }
        else {

            if (this._cancellationToken) 
                this._cancellationToken.cancel();

            this._cancellationToken = new CancellationToken();

            if (show) {

                if (!this.node.parentElement) {

                    this.node.style.opacity = '0';

                    this.referenceElement.parentElement.appendChild(this.node);
        
                    observe(this.node);
                }

                this._popper.update();                
    
                try {
                    await this.animator.showAsync(this.node, this._cancellationToken);
                }
                catch(error) {

                    if (error instanceof OperationCancelledError)
                        return;
    
                    throw error;
                }

            } else {

                if (!this.node.parentElement)
                    return;

                try {
                    await this.animator.hideAsync(this.node, this._cancellationToken);
                }
                catch(error) {

                    if (error instanceof OperationCancelledError)
                        return;

                    throw error;
                }

                this.node.remove();
            }

            delete this._cancellationToken;
        }
    }
}