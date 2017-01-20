import { NEW_ERROR } from '../reducers/errorMessage';

export function newError(newErrorMessage: string) {
  return (dispatch: () => void, getState: () => counterStateType) => {
    const { errorMessage } = getState();
    if (newErrorMessage === errorMessage) {
      dispatch({ type: NEW_ERROR, payload: null });
      dispatch({ type: NEW_ERROR, payload: newErrorMessage });
    } else {
      dispatch({ type: NEW_ERROR, payload: newErrorMessage });
    }
  };
}
