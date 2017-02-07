import _ from 'lodash';

export function calculateRank(arr, scoreGetter, rankSetter) {
  const [numberItems, maybeStringItems] = _.partition(
    arr,
    item => Number.isFinite(scoreGetter(item))
  );
  maybeStringItems.forEach(item => {
    rankSetter(item, '-');
  });
  const sorted = _(numberItems).sortBy(scoreGetter).reverse();
  let count = 1;
  let previousRank = null;
  let previousScore = null;
  sorted.forEach(item => {
    const score = scoreGetter(item);
    const rank = (score === previousScore ? previousRank : count);
    rankSetter(item, rank);
    count += 1;
    previousScore = score;
    previousRank = rank;
  });
}

export function test() {
  const scores = [{
    score: 90
  }, {
    score: 89
  }, {
    score: 89
  }, {
    score: 88
  }];
  calculateRank(scores, item => item.score, (itm, rank) => { itm.rank = rank; });
  console.log(JSON.stringify(scores, null, 2));
}
