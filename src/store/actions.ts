import { GenericActionsPattern } from '../lib/types'

import {
    IExampleState
} from './types'

const actions: GenericActionsPattern<IExampleState> = {
    changeValue(state, { payload }) {
        return {
            ...state,
            ...payload
        }
    },
    loaded(state) {
        // to conditionally prevent rerender if not necessary to flow
        if (!state.imBusy) {
            return state
        }

        return {
            ...state,
            imBusy: false
        }
    },

    loading(state) {
        // to conditionally prevent rerender if not necessary to flow
        if (state.imBusy) {
            return state
        }

        return {
            ...state,
            imBusy: true
        }
    },
}

export default actions