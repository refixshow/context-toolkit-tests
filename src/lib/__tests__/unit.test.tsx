// index inport
// import {} from "..";
// import {} from "../../store";

// utils import
import { act } from "react-test-renderer";
import { renderHook } from "@testing-library/react-hooks";

import {
  prepareActionsToBinding,
  bindActionsToDispatch,
  createReducerForActions,
} from "../creator";
import { initialState } from "../../store/state";
import actions from "../../store/actions";

// types inport
import { GenericPayload, GenericAction, GenericState } from "../types";
import { useReducer } from "react";

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
      const preparedActionsToBind = prepareActionsToBinding(mockedActions);
      const preparedReducer = mockedFc(mockedActions);

      const { result } = renderHook(() =>
        useReducer(preparedReducer, mockedInitialState)
      );

      const [store, dispatch] = result.current;

      const mockedBindedActions = bindActionsToDispatch(
        preparedActionsToBind,
        dispatch
      );

      act(() => {
        mockedBindedActions[mockedActionName](mockedPayload);
        expect(store.user).toStrictEqual(mockedPayload);
      });
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
