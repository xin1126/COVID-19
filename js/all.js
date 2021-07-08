import mapConfig from './data.js';
import addEvent from './mapKit.js';
import { CountUp } from '../node_modules/countup.js/dist/countUp.min.js';

const totalData = document.querySelector('#total-data');
const error = document.querySelector('.error');

const data = {};

const mapColor = () => {
  Object.entries(mapConfig).forEach((mapItem) => {
    if (data[mapItem[1].area] > 10000000) {
      mapConfig[mapItem[0]].upColor = '#2F0000';
    } else if (data[mapItem[1].area] > 1000000 && data[mapItem[1].area] <= 10000000) {
      mapConfig[mapItem[0]].upColor = '#AE0000';
    } else if (data[mapItem[1].area] > 100000 && data[mapItem[1].area] <= 1000000) {
      mapConfig[mapItem[0]].upColor = '#FF2D2D';
    } else if (data[mapItem[1].area] > 10000 && data[mapItem[1].area] <= 100000) {
      mapConfig[mapItem[0]].upColor = '#D26900';
    } else if (data[mapItem[1].area] > 1000 && data[mapItem[1].area] <= 10000) {
      mapConfig[mapItem[0]].upColor = '#FFBB77';
    } else if (data[mapItem[1].area] <= 1000) {
      mapConfig[mapItem[0]].upColor = '#FFE153';
    }
    mapConfig[mapItem[0]].hover = `
    <div class="map-text">
    <p style="color : ${mapConfig[mapItem[0]].upColor}">${mapItem[1].title}</p>
    <ul>
    <li>確診總數：${data[mapItem[1].area]?.toLocaleString()}</li>
    <li>確診總數：${data[mapItem[1].area]}</li>
    </ul>
    </div>
    `;
    if (!data[mapItem[1].area]) {
      mapConfig[mapItem[0]].hover = `<p style="margin-bottom : 4px">${mapItem[1].title}</p><p>未知</p>`;
    }
  });
};

const monitor = () => {
  for (let i = 0; i < 180; i += 1) {
    addEvent(`map_${i + 1}`);
  }
};

const getCountries = () => {
  const url = 'https://corona.lmao.ninja/v3/covid-19/countries';
  fetch(url, {})
    .then((response) => response.json())
    .then((jsonData) => {
      jsonData.forEach((item) => {
        data[(item.country).toUpperCase()] = item.cases;
      });
      mapColor();
      monitor();
    }).catch(() => {
      error.style.display = 'flex';
    });
};

const getTotalData = () => {
  const url = 'https://corona.lmao.ninja/v3/covid-19/all';
  fetch(url, {})
    .then((response) => response.json())
    .then((jsonData) => {
      totalData.innerHTML = `
    <ul class="total-data">
    <li><p>總人口數</p><span id="population"></span></li>
    <li><p>總確診數</p><span id="cases"></span></li>
    <li><p>總死亡數</p><span id="deaths"></span></li>
    </ul>`;
      const countOptions = {
        useEasing: true,
        separator: '',
      };
      const population = new CountUp('population', jsonData.population, 0, 5, countOptions);
      const cases = new CountUp('cases', jsonData.cases, 0, 5, countOptions);
      const deaths = new CountUp('deaths', jsonData.deaths, 0, 5, countOptions);
      population.start();
      cases.start();
      deaths.start();
    }).catch(() => {
      error.style.display = 'flex';
    });
};

const init = () => {
  getCountries();
  getTotalData();
};

init();
