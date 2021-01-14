export interface GenericPayload {
  [key: string]: any;
}

export interface GenericAction {
  type: string;
  payload?: GenericPayload;
}

export interface GenericState {
  [key: string]: any;
}

export interface GenericActionsPattern<
  State = GenericState,
  Action = GenericAction
> {
  [key: string]: (state: State, action: Action) => State;
}

export interface GenericActionsUnboundPattern<Action = GenericAction> {
  [key: string]: (
    dispatch: Dispatch<Action>
  ) => (payload?: GenericPayload) => void;
}

export interface GenericActionsBindedPattern {
  [key: string]: (payload?: GenericPayload) => void;
}

export type onLoadFunction = (actions: GenericActionsBindedPattern) => void;

export type Options = {
  logger: boolean;
  persist: boolean;
};

export interface GenericContextStore {
  state: GenericState;
  actions: GenericActionsBindedPattern;
}
