export const processChartData = (data, targetData) => {
  const num = [];
  const dataDate = [];
  const monthData = {};
  for (let i = 0; i < 8; i += 1) {
    const month = new Date().getMonth() + 1;
    const date = new Date(new Date().getFullYear(), month - (i + 1), 0);
    const fullYear = date.getFullYear();
    let newDate = date.toLocaleString().split(' ')[0].replace(`${fullYear}/`, '');
    dataDate.push(`${fullYear}-${newDate.replace('/', '-')}`);
    newDate = `${newDate}/${String(fullYear).replace('20', '')}`;
    if (data[targetData][newDate]) {
      num.push(data[targetData][newDate]);
    }
  }
  num.forEach((item, index) => {
    if (!(item - num[index + 1])) return;
    monthData[dataDate[index]] = item - num[index + 1];
  });
  return monthData;
};

export const newChartData = (data, index, str) => {
  const newArr = Object.entries(data);
  const newDate = newArr.map((item) => item[index]).reverse();
  newDate.unshift(str);
  return newDate;
};
