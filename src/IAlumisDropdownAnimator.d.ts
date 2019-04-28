import { CancellationToken } from "@alumis/cancellationtoken";

export interface IAlumisDropdownAnimator {

    showAsync(node: HTMLUListElement | HTMLOListElement, cancellationToken: CancellationToken): Promise<void>;
    hideAsync(node: HTMLUListElement | HTMLOListElement, cancellationToken: CancellationToken): Promise<void>;
}