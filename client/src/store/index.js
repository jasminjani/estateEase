import { createStore } from "vuex";
import isAuthModule from "./isAuthModule";

export const store = createStore({
  modules : {
    isAuthModule
  }
})