// index inport
// import {} from "..";
// import {} from "../../store";

// utils import
import {
  prepareActionsToBinding,
  bindActionsToDispatch,
  createReducerForActions,
} from "../creator";
import { initialState } from "../../store/state";
import actions from "../../store/actions";

// types inport
import { GenericPayload, GenericAction, GenericState } from "../types";

// TO DO
// test names

describe("unit testing", () => {
  const mockedActions = actions;
  let mockedInitialState = initialState;
  const mockedActionName = "changeValue";
  const mockedPayload = {
    name: "testName",
  };

  describe("testing prepareActionsToBinding", () => {
    test("should prepare actions to be bainded", () => {
      const mockedFc = prepareActionsToBinding;
      const preparedActions = mockedFc(mockedActions);

      let mockedOutput: GenericPayload = {};
      const mockedReducer = (action: GenericAction) => (mockedOutput = action);
      const mockedDispatch = (action: GenericAction) => mockedReducer(action);

      const preparedAction = preparedActions[mockedActionName](mockedDispatch);

      preparedAction(mockedPayload);

      const expected = { type: mockedActionName, payload: mockedPayload };

      expect(expected).toStrictEqual(mockedOutput);
    });
  });

  describe("testing bindActionsToDispatch", () => {
    test("should bind actions to dispatch", () => {
      const preparedActions = prepareActionsToBinding(mockedActions);
      const mockedFc = bindActionsToDispatch;

      let output: GenericPayload = {};
      const mockedReducer = (action: GenericAction) => (output = action);
      const mockedDispatch = (action: GenericAction) => mockedReducer(action);

      const baindedActions = mockedFc(preparedActions, mockedDispatch);

      baindedActions[mockedActionName](mockedPayload);

      const expected = { type: mockedActionName, payload: mockedPayload };

      expect(expected).toStrictEqual(output);
    });
  });

  describe("testing createReducerForActions", () => {
    test("should create reducer for actions", () => {
      const mockedFc = createReducerForActions;
      const mockedTestActionName = "mockedAction";

      const mockedTestAction = (
        state: GenericState,
        { payload }: GenericPayload
      ) => {
        mockedInitialState = {
          imBusy: state.imBusy,
          user: {
            ...state.user,
            ...payload,
          },
        };

        // just to match types
        return {
          ...state,
          ...payload,
        };
      };

      const mockedTestActions = { [mockedTestActionName]: mockedTestAction };
      const preparedActionsToBind = prepareActionsToBinding(mockedTestActions);

      const preparedReducer = mockedFc(mockedTestActions);

      const dispatch = (action: GenericAction) => {
        preparedReducer(mockedInitialState, action);
      };

      const mockedBindedActions = bindActionsToDispatch(
        preparedActionsToBind,
        dispatch
      );

      mockedBindedActions[mockedTestActionName](mockedPayload);

      expect(mockedInitialState.user).toStrictEqual(mockedPayload);
    });

    // TO DO
    // title
    test("should throw when action.type doesn't exist", () => {
      const mockedFc = createReducerForActions;
      const mockedBadActions = {};

      const preparedReducer = mockedFc(mockedBadActions);

      expect(preparedReducer).toThrowError();
    });
  });

  describe("testing makeContextStore", () => {
    test("should work", () => {
      expect(true).toBeTruthy();

      // input <---    string, State, GenericActionsPattern<State>, onLoad
      // LoadFunction, boolean;
      // output --->   useCtx, Provider
      // act, render hook --> useCtx
      // Store -> Provider
    });
  });
});

export {};
