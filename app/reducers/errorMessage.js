// @flow

export const NEW_ERROR = 'NEW_ERROR';

export type ErrorType = {
  errorMessage: string
};

type actionType = {
  type: string,
  payload: string
};

export default function counter(state: number = 0, action: actionType) {
  switch (action.type) {
    case NEW_ERROR:
      return action.payload;
    default:
      return state;
  }
}
