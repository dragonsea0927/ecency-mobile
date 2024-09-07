import { PollDraft } from '../../providers/ecency/ecency.types';
import {
  REMOVE_EDITOR_CACHE,
  SET_BENEFICIARIES,
  SET_POLL_DRAFT,
  SET_ALLOW_SPK_PUBLISHING,
  REMOVE_POLL_DRAFT,
  SET_DEFAULT_REWARD_TYPE,
} from '../constants/constants';

export interface Beneficiary {
  account: string;
  weight: number;
  isValid?: boolean;
  autoPowerUp?: boolean;
}

export enum RewardTypes {
  DEAFULT = 'default',
  SP = 'sp',
  DP = 'dp',
}

interface State {
  beneficiariesMap: {
    [key: string]: Beneficiary[];
  };
  pollDraftsMap: {
    [key: string]: PollDraft;
  };
  allowSpkPublishing: boolean;
  defaultRewardType: RewardTypes | null;
}

const initialState: State = {
  beneficiariesMap: {},
  pollDraftsMap: {},
  allowSpkPublishing: false,
  defaultRewardType: RewardTypes.DEAFULT,
};

const editorReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_BENEFICIARIES:
      if (!state.beneficiariesMap) {
        state.beneficiariesMap = {};
      }

      state.beneficiariesMap = {
        ...state.beneficiariesMap,
        [payload.draftId]: payload.benficiaries,
      };

      return {
        ...state, // spread operator in requried here, otherwise persist do not register change
      };
    case SET_POLL_DRAFT:
      if (!state.pollDraftsMap) {
        state.pollDraftsMap = {};
      }

      state.pollDraftsMap = {
        ...state.pollDraftsMap,
        [payload.draftId]: payload.pollDraft,
      };

      return {
        ...state,
      };
    case REMOVE_EDITOR_CACHE:
      delete state.beneficiariesMap[payload.draftId];
      delete state.pollDraftsMap[payload.draftId];
      return {
        ...state, // spread operator in requried here, otherwise persist do not register change
      };

    case REMOVE_POLL_DRAFT:
      delete state.pollDraftsMap[payload.draftId];
      state.pollDraftsMap = {
        ...state.pollDraftsMap,
      };
      return {
        ...state,
      };

    case SET_ALLOW_SPK_PUBLISHING:
      return {
        ...state,
        allowSpkPublishing: payload,
      };
    case SET_DEFAULT_REWARD_TYPE:
      return {
        ...state,
        defaultRewardType: payload,
      };
    default:
      return state;
  }
};

export default editorReducer;
