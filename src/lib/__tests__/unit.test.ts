import { renderHook, act } from "@testing-library/react-hooks";

import {
  prepareActionsToBinding,
  bindActionsToDispatch,
  createReducerForActions,
  makeContextStore,
} from "../creator";
import { initialState } from "../../store/state";
import actions from "../../store/actions";

import { GenericPayload, GenericAction } from "../types";
import { useReducer } from "react";

describe("unit testing", () => {
  const mockedActionName = "changeValue";
  const mockedPayload = {
    user: {
      name: "testName",
    },
  };

  describe("testing prepareActionsToBinding", () => {
    test("should prepare actions to be bainded", () => {
      const mockedFc = prepareActionsToBinding;
      const preparedActions = mockedFc(actions);

      let mockedOutput: GenericPayload = {};
      const mockedReducer = (action: GenericAction) => (mockedOutput = action);
      const mockedDispatch = (action: GenericAction) => mockedReducer(action);

      const preparedAction = preparedActions[mockedActionName](mockedDispatch);

      preparedAction(mockedPayload);

      const expected = { type: mockedActionName, payload: mockedPayload };

      expect(mockedOutput).toStrictEqual(expected);
    });
  });

  describe("testing bindActionsToDispatch", () => {
    test("should bind actions to dispatch", () => {
      const preparedActions = prepareActionsToBinding(actions);
      const mockedFc = bindActionsToDispatch;

      let output: GenericPayload = {};
      const mockedReducer = (action: GenericAction) => (output = action);
      const mockedDispatch = (action: GenericAction) => mockedReducer(action);

      const baindedActions = mockedFc(preparedActions, mockedDispatch);

      baindedActions[mockedActionName](mockedPayload);

      const expected = { type: mockedActionName, payload: mockedPayload };

      expect(output).toStrictEqual(expected);
    });
  });

  describe("testing createReducerForActions", () => {
    test("should create reducer for actions", () => {
      const mockedFc = createReducerForActions;
      const preparedActionsToBind = prepareActionsToBinding(actions);
      const preparedReducer = mockedFc(actions);

      // result.current
      // [0] ---->  state;
      // [1] ---->  dispatch;
      const { result } = renderHook(() =>
        useReducer(preparedReducer, initialState)
      );

      const mockedBindedActions = bindActionsToDispatch(
        preparedActionsToBind,
        result.current[1]
      );

      act(() => {
        // action call
        mockedBindedActions[mockedActionName](mockedPayload);
      });

      expect(result.current[0].user).toStrictEqual(mockedPayload.user);
    });

    test("should throw an error when type of action doesn't exist", () => {
      const mockedFc = createReducerForActions;
      const mockedBadActions = {};

      const preparedReducer = mockedFc(mockedBadActions);

      expect(preparedReducer).toThrowError();
    });
  });

  describe("testing getInitialState", () => {
    // test("should bind actions to dispatch", () => {
    //   const preparedActions = prepareActionsToBinding(actions);
    //   const mockedFc = bindActionsToDispatch;
    //   let output: GenericPayload = {};
    //   const mockedReducer = (action: GenericAction) => (output = action);
    //   const mockedDispatch = (action: GenericAction) => mockedReducer(action);
    //   const baindedActions = mockedFc(preparedActions, mockedDispatch);
    //   baindedActions[mockedActionName](mockedPayload);
    //   const expected = { type: mockedActionName, payload: mockedPayload };
    //   expect(output).toStrictEqual(expected);
    // });
  });

  describe("testing makeContextStore", () => {
    test("should check initial value of store on unmounted provider", () => {
      const mockedFc = makeContextStore;
      const mockedContextName = "testName";
      const onLoadSpy = jest.fn();

      const mockedResult = renderHook(() =>
        mockedFc(mockedContextName, initialState, actions, onLoadSpy)
      );

      const { result } = renderHook(() => mockedResult.result.current.useCtx());

      expect(result.current.state).toStrictEqual(initialState);
      expect(onLoadSpy).not.toBeCalled();
      expect(result.current.actions).toStrictEqual({});
    });
  });
});

export {};
