import {Component, State, Vue} from 'nuxt-property-decorator';
import {RootStateType} from '@/types/store';

@Component
export default class HubBase extends Vue {
    @State(RootStateType.Dark) dark!: boolean;

    get hub(): string {
        return this.$route.params.hub;
    }
}