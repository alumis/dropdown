import { Component, createNode, appendDispose } from '@alumis/observables-dom';
import { IAlumisDropdownAttributes } from './IAlumisDropdownAttributes';
import { Observable, o, co } from '@alumis/observables';
import { IAlumisDropdownAnimator } from './IAlumisDropdownAnimator';
import Popper, { Placement } from 'popper.js';
import { CancellationToken, OperationCancelledError } from '@alumis/cancellationtoken';

import { observe } from '@alumis/utils';

type HTMLListElement = HTMLUListElement | HTMLOListElement;

export abstract class AlumisDropdown<TElement extends HTMLElement > extends Component<TElement> {

    constructor(tagName: string, attrs: IAlumisDropdownAttributes, children: any[]) {

        super();

        this.showAction = this.showAction.bind(this);
        
        let show: boolean | Observable<boolean> | (() => boolean);
        let animator: IAlumisDropdownAnimator;
        let animate: boolean;
        let placement: Placement;        

        if (attrs) {
           
            show = attrs.show;
            animator = attrs.animator;
            placement = attrs.placement;
            animate = attrs.animate;
            
            delete attrs.show;
            delete attrs.animator;
            delete attrs.animate;
            delete attrs.placement;
        }

        this.node = createNode(tagName, attrs, children);
        this.node.remove();

        this.placement = placement;
        this.animator = animator;
        this.animate = animate;
        this._show = show;
    }

    showAsObservable: Observable<boolean>;
    placement: Placement;
    animator: IAlumisDropdownAnimator;
    animate: boolean;
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
    
                appendDispose(this.node, show.subscribeInvoke(this.showAction).dispose);
                this.showAsObservable = show;
            }
    
            else if (typeof show === 'function') {
    
                let computedObservable = co(show);
    
                computedObservable.subscribeInvoke(this.showAction);
                appendDispose(this.node, computedObservable.dispose);
    
                this.showAsObservable = computedObservable;
            } else {
    
                let observable = o(show);
    
                observable.subscribeInvoke(this.showAction);
                appendDispose(this.node, observable.dispose);
    
                this.showAsObservable = observable;
            }

            this.isLoaded = true;
        }
        finally {

            this.isInitializing = false;
        }
    }

    async showAction(show: boolean) {

        debugger;

        if (!this.animate || !this.isLoaded)
            show ? this.referenceElement.appendChild(this.node) : this.node.remove();

        else {

            if (this._cancellationToken) 
                this._cancellationToken.cancel();

            if (show) {

                if (!this.node.parentElement) {

                    this.node.style.opacity = '0';

                    this.referenceElement.parentElement.appendChild(this.node);
        
                    observe(this.node);
                }

                this._popper.update();

                this._cancellationToken = new CancellationToken();
    
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

                delete this._cancellationToken;

                this.node.remove();
            }
        }
    }
}