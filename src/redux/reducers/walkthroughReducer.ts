import { REGISTER_WALKTHROUGH_ITEM } from '../constants/constants';

export interface WalkthroughItem {
  walkthroughIndex: number;
  isShown?: boolean;
}
interface State {
  walkthroughMap: Map<number, WalkthroughItem>;
}

const initialState: State = {
  walkthroughMap: new Map(),
};
const walkthroughReducer = (state = initialState, action) => {
  // console.log('action : ', action);

  const { type, payload } = action;
  switch (type) {
    case REGISTER_WALKTHROUGH_ITEM:
      if (!state.walkthroughMap) {
        state.walkthroughMap = new Map<number, WalkthroughItem>();
      }
      state.walkthroughMap.set(payload.walkthroughIndex, payload);
      return {
        ...state,
      };

    default:
      return state;
  }
};

export default walkthroughReducer;
