import { onLoadFunction } from "../lib/types";
import { IExampleState } from "./types";

const mockFetchWithDelay = (data: any) =>
  new Promise<{}>((res) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      return res(data);
    }, 1000);
  });

const onLoad: onLoadFunction = async (actions) => {
  try {
    // fetch some data here
    const data = await mockFetchWithDelay({
      user: {
        name: "Example User Name",
      },
    });

    actions.changeValue({ imBusy: false, ...data });
  } catch (error) {
    actions.changeValue({
      imBusy: false,
      error: {
        message: error.message,
      },
    });
    throw new Error("onLoad - appStoreCtx " + error.message);
  }
};

// your state
const initialState: IExampleState = {
  imBusy: true,
  user: {
    name: "",
  },
};

export { initialState, onLoad };
