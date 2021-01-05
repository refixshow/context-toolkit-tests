import makeContextStore from '../lib'

import actions from "./actions"
import { initialState, onLoad } from './state'

const {
    Provider, useCtx
} = makeContextStore('Example', initialState, actions, onLoad)

export {
    Provider, useCtx
}