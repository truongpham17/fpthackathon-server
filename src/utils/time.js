import moment from 'moment';

export const getMonthsInRange = (start, end) => {
  const result = [];
  let curr = moment(start);
  while (moment(curr).isSameOrBefore(moment(end))) {
    result.push(moment(curr).format('MM/YYYY'));
    curr.add(1, 'month');
  }
  return result;
}

export const getDaysInRange = (start, end) => {
  const result = [];
  let curr = moment(start);
  while (moment(curr).isSameOrBefore(moment(end))) {
    result.push(moment(curr).format('DD/MM/YYYY'));
    curr.add(1, 'day');
  }
  return result;
}
