import { CancellationToken } from '@alumis/cancellationtoken';
import { transitionAsync, easeIn } from '@alumis/transitionasync';
import { IAlumisDropdownMenuAnimator } from "./IAlumisDropdownMenuAnimator";

export class AlumisDropdownEaseInFadeAnimator implements IAlumisDropdownMenuAnimator {
    
    constructor(public duration: number = 150) {}

    async showAsync(node: HTMLElement, cancellationToken: CancellationToken): Promise<void> {
        
        let opacity = parseFloat(getComputedStyle(node).getPropertyValue('opacity'));

        if (opacity === 1)
            return;

        let remaining = 1 - opacity;

        await transitionAsync(this.duration, t => {

            node.style.opacity = opacity + easeIn(t) * remaining + '';

        }, cancellationToken);
    } 
    
    async hideAsync(node: HTMLElement, cancellationToken: CancellationToken): Promise<void> {
        
        let opacity = parseFloat(getComputedStyle(node).getPropertyValue('opacity'));

        if (opacity === 0)
            return;

        let remaining = opacity;

        await transitionAsync(this.duration, t => {

            node.style.opacity = opacity - easeIn(t) * remaining + '';

        }, cancellationToken);
    }
}