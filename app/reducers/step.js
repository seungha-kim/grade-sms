// @flow
export const NEXT_STEP = 'NEXT_STEP';
export const PREVIOUS_STEP = 'PREVIOUS_STEP';

export type stepStateType = {
  step: number
};

type actionType = {
  type: string
};

export default function step(state: number = 0, action: actionType) {
  switch (action.type) {
    case NEXT_STEP:
      return state + 1;
    case PREVIOUS_STEP:
      return state - 1;
    default:
      return state;
  }
}
