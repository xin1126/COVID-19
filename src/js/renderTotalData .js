import { CountUp } from 'countup.js';

export default (data, document) => {
  const dom = document;
  dom.innerHTML = `
    <ul class="total-data">
      <li><p>今日新增確診數</p><span id="todayCases"></span></li>
      <li><p>今日新增死亡數</p><span id="todayDeaths"></span></li>
      <li><p>總確診數</p><span id="cases"></span></li>
      <li><p>總死亡數</p><span id="deaths"></span></li>
    </ul>
    <div class="date">更新時間：${new Date(data.updated).toLocaleString().split(' ')}</div>
    `;
  const countOptions = {
    useEasing: true,
    separator: '',
  };
  const todayCases = new CountUp('todayCases', data.todayCases, 0, 5, countOptions);
  const todayDeaths = new CountUp('todayDeaths', data.todayDeaths, 0, 5, countOptions);
  const cases = new CountUp('cases', data.cases, 0, 5, countOptions);
  const deaths = new CountUp('deaths', data.deaths, 0, 5, countOptions);
  todayCases.start();
  todayDeaths.start();
  cases.start();
  deaths.start();
};
