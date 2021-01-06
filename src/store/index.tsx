import makeContextStore from '../lib'

import actions from "./actions"
import { initialState, onLoad } from './state'


// generate Provider and hook
const {
    Provider, useCtx
} = makeContextStore('Example', initialState, actions, onLoad)

const ExampleProvider = Provider
const useExampleCtx = useCtx
// generate Provider and hook


export {
    ExampleProvider, useExampleCtx
}