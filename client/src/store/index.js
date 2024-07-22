import { createStore } from "vuex";
import isAuthModule from "./isAuthModule";
import reviewWorkModule from "./reviewWorkModule";

export const store = createStore({
  modules: {
    isAuthModule,
    reviewWorkModule,
  },
});
