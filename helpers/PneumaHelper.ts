import {PneumaRestriction} from '@/types/Types';

export default class PneumaHelper {
    static RestrictionToFreeze(type: PneumaRestriction | null): number | null {
        switch (type) {
            case PneumaRestriction.L20:
                return 0;
            case PneumaRestriction.L40:
                return 1;
            case PneumaRestriction.L80:
                return 5;
            case PneumaRestriction.L120:
                return 10;
            case PneumaRestriction.L160:
                return 20;
            case PneumaRestriction.Infinity:
                return 2147483647;
            default:
                return null;
        }
    }
}