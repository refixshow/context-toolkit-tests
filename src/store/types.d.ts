export interface IExampleState extends GenericState {
    imBusy: boolean
    user: {
        name:string
    }
}
export interface IExampleContextStore {
    state: IExampleState,
    actions: GenericActionsBindedPattern
  } 