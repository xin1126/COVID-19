import mapConfig from './dataWorld.js';
import renderTotalWorldData from './renderTotalData .js';
import addEvent from './mapKit.js';

const totalWorld = document.querySelector('#total-world');
const tableWorld = document.querySelector('#table-world');
const error = document.querySelector('.error');
const totalCountry = {};

const renderMapWorld = (map, content) => {
  mapConfig[map].hover = `
    <div class="text-world">
      <p style="color : ${mapConfig[map].upColor}">${content.title}</p>
      <ul>
        <li><img src="${totalCountry[content.area]?.countryInfo.flag}" alt="${content}" /></li>
        <li><span>人口總數<span>：</span></span>${totalCountry[content.area]?.population?.toLocaleString()}</li>
        <li><span>確診總數<span>：</span></span>${totalCountry[content.area]?.cases?.toLocaleString()}</li>
        <li><span>死亡總數<span>：</span></span>${totalCountry[content.area]?.deaths?.toLocaleString()}</li>
        <li><span>痊癒總數<span>：</span></span>${totalCountry[content.area]?.recovered?.toLocaleString()}</li>
      </ul>
    </div>
    `;
  if (!totalCountry[content.area]) {
    mapConfig[map].hover = `<p style="margin-bottom : 4px">${content.title}</p><p>未知</p>`;
  }
};

const renderTableWorld = (data) => {
  const newArr = data.sort((a, b) => b[1].cases - a[1].cases);
  let str = '';
  newArr.forEach((item, index) => {
    str += `<tr>
      <td>${index + 1}</td>
      <td>${item[1].title}</td>
      <td class="d-mobile-none"><img src="${item[1].countryInfo.flag}" alt="${item[1].title}" /></td>
      <td class="d-sm-none">${item[1].population.toLocaleString()}</td>
      <td>${item[1].cases.toLocaleString()}</td>
      <td>${item[1].deaths.toLocaleString()}</td>
      <td class="d-md-none">${item[1].recovered.toLocaleString()}</td>
      <td class="d-lg-none">${new Date(item[1].updated).toLocaleString().split(' ')}</td>
    </tr>`;
  });
  tableWorld.innerHTML = str;
};

const mapWorldColor = () => {
  Object.entries(mapConfig).forEach((mapItem) => {
    const data = totalCountry[mapItem[1].area]?.cases;
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
    renderMapWorld(mapItem[0], mapItem[1]);
  });
};

const monitor = () => {
  for (let i = 0; i < 180; i += 1) {
    addEvent(`map_${i + 1}`);
  }
};

const processWorldData = (data) => {
  data.forEach((item) => {
    totalCountry[(item.country).toUpperCase()] = { ...item };
  });
  Object.entries(mapConfig).forEach((item) => {
    if (totalCountry[item[1].area]) {
      totalCountry[item[1].area].title = item[1].title;
    }
  });
  const newArr = Object.entries(totalCountry).filter((item) => item[1].title !== undefined);
  mapWorldColor();
  monitor();
  renderTableWorld(newArr);
};

const getCountries = () => {
  const url = 'https://corona.lmao.ninja/v3/covid-19/countries';
  fetch(url, {})
    .then((response) => response.json())
    .then((jsonData) => processWorldData(jsonData))
    .catch(() => { error.style.display = 'flex'; });
};

const getTotalWorldData = () => {
  const url = 'https://corona.lmao.ninja/v3/covid-19/all';
  fetch(url, {})
    .then((response) => response.json())
    .then((jsonData) => renderTotalWorldData(jsonData, totalWorld))
    .catch(() => { error.style.display = 'flex'; });
};

const initWorld = () => {
  getCountries();
  getTotalWorldData();
};

if (window.location.href.indexOf('world') > 0) {
  initWorld();
}
