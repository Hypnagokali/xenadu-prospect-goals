import snakeToCamelConverter from '@/helper/snakeToCamelConverter';
import decodeHtmlSpecialChars from '@/helper/decodeHtmlspecialchars';
import Week from './Week';
import WorkloadPoints from './WorkloadPoints';

export default class Goal {
  constructor(
    id,
    description = '',
    name,
    addedOn,
    isRegistered,
    week,
    workloadPoints,
    state = 'todo',
  ) {
    Object.assign(this, {
      id,
      description,
      name,
      addedOn,
      isRegistered,
      state,
    });
    this.week = week;
    this.workloadPoints = workloadPoints;
  }
}

Goal.DONE = 'done';
Goal.TODO = 'todo';
Goal.POSTPONED = 'postponed';
Goal.SCHEDULED = 'scheduled';

Goal.createGoalFromData = (responseData) => {
  const workloadPointsObject = new WorkloadPoints(
    snakeToCamelConverter(responseData.workloadPoints),
  );
  const weekObject = new Week(
    snakeToCamelConverter(responseData.week),
  );
  let description = '';
  if (responseData.description !== undefined) {
    description = responseData.description;
  }
  const goal = new Goal(
    responseData.id,
    decodeHtmlSpecialChars(description),
    decodeHtmlSpecialChars(responseData.name),
    responseData.addedOn,
    responseData.isRegistered,
    weekObject,
    workloadPointsObject,
    responseData.state,
  );
  return goal;
};
