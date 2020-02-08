import {Component, mixins, State} from 'nuxt-property-decorator';
import HubBase from '@/components/scaffolding/HubBase';

@Component({components: {HubBase}})
export default class ModalBase extends mixins(HubBase) {
    @State dark!: boolean;

    get modalMask(): string {
        return this.dark ? 'modal-mask-dark' : 'modal-mask-light';
    }

    get modalContainerMask(): string {
        return this.dark ? 'modal-container-dark' : 'modal-container-light';
    }

    close(e: MouseEvent) {
        let container = document.querySelector('.modal-container') as HTMLElement;
        if (container !== null && !container.contains(e.target as Node)) {
            this.$emit('close');
        }
    }
}
