import { useReducer } from "react";
import { renderHook } from "@testing-library/react-hooks";
import { render, fireEvent, waitFor } from "@testing-library/react";

import {
  makeContextStore,
  createReducerForActions,
  prepareActionsToBinding,
  bindActionsToDispatch,
  getInitialState,
} from "../lib/creator";
import actions from "../store/actions";
import { initialState } from "../store/state";

import App from "../App";

describe("int testing", () => {
  describe("testing mounted provider", () => {
    const onLoad = jest.fn();
    const mockedName = "mockedName";
    const { Provider, useCtx } = makeContextStore(
      mockedName,
      initialState,
      actions,
      onLoad
    );

    test("should check onLoad function", () => {
      render(<Provider />);

      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    describe("testing actions", () => {
      beforeEach(() => {
        jest.spyOn(global.Math, "random").mockReturnValue(5);
      });

      afterEach(() => {
        jest.spyOn(global.Math, "random").mockRestore();
      });
      test("checks if actions are provided on mount", () => {
        const preparedActionsToBind = prepareActionsToBinding(actions);
        const preparedReducer = createReducerForActions(actions);

        // result.current
        // [0] ---->  store;
        // [1] ---->  dispatch;
        const { result } = renderHook(() =>
          useReducer(preparedReducer, initialState)
        );

        const mockedBindedActions = bindActionsToDispatch(
          preparedActionsToBind,
          result.current[1]
        );

        const MockedReactFunction = () => {
          const { actions } = useCtx();

          // TO DO
          // refactor
          expect(Object.keys(actions)).toStrictEqual(
            Object.keys(mockedBindedActions)
          );

          return <div>test</div>;
        };

        render(
          <Provider>
            <MockedReactFunction />
          </Provider>
        );

        expect(onLoad).toHaveBeenCalledTimes(1);
      });

      test("should check if actions update the store", async () => {
        const wrapper = render(<App />);

        await waitFor(() => wrapper.getByText(/{"name":"Example User Name"}/));

        const btn = wrapper.getByText(/changeState/);

        fireEvent.click(btn);

        wrapper.getByText(/{"name":"5"}/);
      });
    });

    describe("checks optional functions", () => {
      beforeEach(() => {
        jest.spyOn(global.Math, "random").mockReturnValue(5);
      });

      afterEach(() => {
        jest.spyOn(global.Math, "random").mockRestore();
      });
      test("should check logger", async () => {
        const consoleSpy = jest.spyOn(console, "log");
        const initialLogs = 2;
        const changeStateRenders = 2;
        const expectedlogs = initialLogs + changeStateRenders;

        const wrapper = render(<App />);

        await waitFor(() => wrapper.getByText(/{"name":"Example User Name"}/));

        const btn = wrapper.getByText(/changeState/);

        fireEvent.click(btn);

        wrapper.getByText(/{"name":"5"}/);

        expect(consoleSpy).toHaveBeenCalledTimes(expectedlogs);
      });

      // test("should check persistant store", async () => {
      //   const wrapper = render(<App />);

      //   expect(getInitialState(initialState, mockedName, true)).toStrictEqual(
      //     initialState
      //   );

      //   await waitFor(() => wrapper.getByText(/{"name":"Example User Name"}/));

      //   expect(
      //     getInitialState(initialState, mockedName, true)
      //   ).not.toStrictEqual(initialState);
      // });
    });
  });
});

export {};
