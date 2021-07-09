import { CountUp } from 'countup.js';
import mapConfig from './data.js';
import addEvent from './mapKit.js';

const totalData = document.querySelector('#total-data');
const error = document.querySelector('.error');

const countryTotal = {};

const mapColor = () => {
  Object.entries(mapConfig).forEach((mapItem) => {
    const data = countryTotal[mapItem[1].area]?.cases;
    if (data > 10000000) {
      mapConfig[mapItem[0]].upColor = '#2F0000';
    } else if (data > 1000000 && data <= 10000000) {
      mapConfig[mapItem[0]].upColor = '#AE0000';
    } else if (data > 100000 && data <= 1000000) {
      mapConfig[mapItem[0]].upColor = '#FF2D2D';
    } else if (data > 10000 && data <= 100000) {
      mapConfig[mapItem[0]].upColor = '#D26900';
    } else if (data > 1000 && data <= 10000) {
      mapConfig[mapItem[0]].upColor = '#FFBB77';
    } else if (data <= 1000) {
      mapConfig[mapItem[0]].upColor = '#FFE153';
    }
    mapConfig[mapItem[0]].hover = `
    <div class="map-text">
      <p style="color : ${mapConfig[mapItem[0]].upColor}">${mapItem[1].title}</p>
      <ul>
        <li><img src="${countryTotal[mapItem[1].area]?.countryInfo.flag}" alt="${mapItem[1].title}" /></li>
        <li>該國家人口：${countryTotal[mapItem[1].area]?.population?.toLocaleString()}</li>
        <li>確診總數：${countryTotal[mapItem[1].area]?.cases?.toLocaleString()}</li>
        <li>死亡總數：${countryTotal[mapItem[1].area]?.deaths?.toLocaleString()}</li>
        <li>痊癒總數：${countryTotal[mapItem[1].area]?.recovered?.toLocaleString()}</li>
      </ul>
    </div>
    `;
    if (!countryTotal[mapItem[1].area]) {
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
        countryTotal[(item.country).toUpperCase()] = { ...item };
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
