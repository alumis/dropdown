import { CancellationToken } from "@alumis/cancellationtoken";

export interface IAlumisDropdownAnimator {

    showAsync(node: HTMLElement, cancellationToken: CancellationToken): Promise<void>;
    hideAsync(node: HTMLElement, cancellationToken: CancellationToken): Promise<void>;
}