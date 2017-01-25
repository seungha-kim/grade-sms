export const UPDATE_STAT = 'UPDATE_STAT';

type Grade = number | string;  // "신규", "결", ...
type Id = string;
type Class = string;

type State = {
  classes: Array<string>,
  individual: Array<{
    id: Id,
    name: string,
    school: string,
    phone: string
  }>,
  tests: Array<{
    individualGrade: {[id: Id]: Grade},
    individualClass: {[id: Id]: Class},
    totalRank: Array<Id>,
    totalAvg: number,
    classRank: {[class: Class]: Array<Id>},
    classAvg: {[class: Class]: number}
  }>,
  homeworks: Array<{
    individualGrade: {[id: Id]: Grade},
    totalAvg: number,
    classAvg: {[class: Class]: number}
  }>
};

type UpdateStatAction = {
  type: '',
  payload: State
};

export default function counter(state: ?State = null, action: UpdateStatAction) {
  switch (action.type) {
    case UPDATE_STAT:
      return action.payload;
    default:
      return state;
  }
}
