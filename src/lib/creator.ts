import React, { Dispatch, useMemo, useReducer, useEffect, useContext } from 'react'

import {
    GenericActionsPattern, GenericActionsUnboundPattern, GenericActionsBindedPattern,
    GenericPayload, GenericAction, GenericState, onLoadFunction, GenericContextStore
} from './types'

const prepareActionsToBinding = <State>(actions: GenericActionsPattern<State>) => {
    const binded = Object.keys(actions).reduce((
        bindedAccumulator, actionName
    ) => {

        bindedAccumulator[actionName] = (dispatch: Dispatch<GenericAction>) => (payload?: GenericPayload) => {
            if (payload) {
                const action: GenericAction = {
                    type: actionName,
                    payload
                }
                dispatch(action)
            }
            else {
                const action: GenericAction = {
                    type: actionName
                }
                dispatch(action)
            }

        }
        return bindedAccumulator
    }, {} as GenericActionsUnboundPattern)
    return binded
}


const bindActionsToDispatch = (unboundActions: GenericActionsUnboundPattern,
    dispatch: Dispatch<GenericAction>) => {

    return Object.keys(unboundActions).reduce((bindedActions, actionName) => {
        bindedActions[actionName] = unboundActions[actionName](dispatch)
        return bindedActions
    }, {} as GenericActionsBindedPattern)
}

const createReducerForActions = <T = GenericState>(actions: GenericActionsPattern<T>) => {
    const reducer: React.Reducer<T, GenericAction> = (state, action) => {
        if (!actions[action.type]) {
            throw new Error(`reducer doesnot have action with "${action.type}" type`)
        }
        return actions[action.type](state, action)
    }
    return reducer
}

const makeContextStore = <State = GenericState>(name: string, initialState: State, allActions: GenericActionsPattern<State>, onLoad: onLoadFunction, logger = false) => {
    const reducer = createReducerForActions<State>(allActions)

    const context = React.createContext<GenericContextStore>({
        state: initialState,
        actions: {}
    })

    context.displayName = name

    const makeProvider = (): React.FC => ({ children }) => {
        const [state, dispatch] = useReducer(reducer, initialState)
        const actionsToBind = useMemo(() => prepareActionsToBinding<State>(allActions), [])
        const actions = useMemo(() => bindActionsToDispatch(actionsToBind, dispatch), [actionsToBind])

        useEffect(() => {
            console.log(`on load ${name}CtxStore`, state, actions)
            onLoad(actions)
        }, [actions])

        if (logger) {
            useEffect(() => {
                console.log(`on change ${name}CtxStore`, state, actions)
            }, [state])
        }

        const { Provider } = context

        const Comp = () => React.createElement(Provider, {
            value: {
                state, actions
            },
            children
        })

        return Comp()
    }

    const makeUseCtx = () => () => {
        const { actions, state } = useContext(context)
        return {
            actions, state
        }
    }

    const Provider = makeProvider()
    const useCtx = makeUseCtx()

    return {
        useCtx,
        Provider
    }

}


export {
    makeContextStore
}
