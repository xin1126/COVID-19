import mapConfig from './data.js';
import addEvent from './mapKit.js';

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
        <li>確診總數：${data[mapItem[1].area]}</li>
        <li>確診總數：${data[mapItem[1].area]}</li>
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

const getProducts = () => {
  const url = 'https://corona.lmao.ninja/v3/covid-19/countries';
  fetch(url, {})
    .then((response) => response.json())
    .then((jsonData) => {
      jsonData.forEach((item) => {
        data[(item.country).toUpperCase()] = item.cases;
      });
      mapColor();
      monitor();
    }).catch((err) => {
      console.log('錯誤:', err);
    });
};
getProducts();
