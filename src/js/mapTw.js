import dataTw from './dataTw.js';
import renderTotalTwData from './renderTotalData .js';

const path = document.querySelectorAll('path');
const error = document.querySelector('.error');
const contentTw = document.querySelector('.content-tw');
const tableTw = document.querySelector('#table-tw');
const totalTw = document.querySelector('#total-tw');

const totalTownship = {};
const newTotalTownship = {};

const renderTableTw = (date) => {
  const newArr = Object.entries(totalTownship).sort((a, b) => b[1] - a[1]);
  let str = '';
  newArr.forEach((item, index) => {
    str += `<tr>
      <td>${index + 1}</td>
      <td>${item[0]}</td>
      <td>${item[1].toLocaleString()}</td>
      <td class="d-xl-none">${date}</td>
    </tr>`;
  });
  tableTw.innerHTML = str;
};

const mapTwContent = () => {
  let tempColor;
  window.onload = () => {
    document.onmousemove = (e) => {
      const st = document.body.scrollTop || document.documentElement.scrollTop;
      const sl = document.body.scrollLeft || document.documentElement.scrollLeft;
      const left = e.clientX;
      const top = e.clientY;
      contentTw.style.left = `${left + sl}px`;
      contentTw.style.top = `${top + st + 30}px`;
    };
  };
  path.forEach((item) => {
    item.addEventListener('mouseenter', (e) => {
      const target = newTotalTownship[e.target.getAttribute('data-name')];
      contentTw.classList.remove('d-none');
      item.setAttribute('fill', '#477cb2');
      tempColor = target.color;
      contentTw.innerHTML = `
      <div class="text-tw">
        <h2 style="color : ${target.color}">${target.place}</h2>
        <p>確診總數：${target.case.toLocaleString()}</p>
      </div>
      `;
    });
    item.addEventListener('mouseout', () => {
      contentTw.classList.add('d-none');
      item.setAttribute('fill', tempColor);
    });
  });
};

const mapTwColor = () => {
  Object.entries(totalTownship).forEach((townshipItem) => {
    dataTw.forEach((dataItem, index) => {
      if (townshipItem[0] === dataItem.place) {
        if (townshipItem[1] > 1000) {
          dataTw[index].color = '#2F0000';
        } else if (townshipItem[1] > 500 && townshipItem[1] <= 1000) {
          dataTw[index].color = '#AE0000';
        } else if (townshipItem[1] > 100 && townshipItem[1] <= 500) {
          dataTw[index].color = '#FF2D2D';
        } else if (townshipItem[1] > 10 && townshipItem[1] <= 100) {
          dataTw[index].color = '#D26900';
        } else {
          dataTw[index].color = '#FFBB77';
        }
        [, dataTw[index].case] = townshipItem;
        newTotalTownship[dataItem.tag] = { ...dataItem };
      }
    });
  });
  if (Object.keys(newTotalTownship).indexOf('kinmen_country') < 0) {
    newTotalTownship.kinmen_country = { case: 0, color: 'green', place: '金門縣' };
  }
  Object.entries(newTotalTownship).forEach((dataItem) => {
    const dom = document.querySelectorAll(`path[data-name=${dataItem[0]}`);
    dom.forEach((item) => {
      item.setAttribute('fill', dataItem[1].color);
    });
  });
};

const processTwData = (data) => {
  Object.entries(data.data).forEach((item) => {
    totalTownship[item[0]] = Object.values(item[1]).reduce((a, b) => a + b);
  });
  mapTwColor();
  renderTableTw(data.meta.modified);
};

const getTownshipTwData = () => {
  const url = 'https://kiang.github.io/od.cdc.gov.tw/data/od/confirmed/2021.json';
  fetch(`${url}`, {})
    .then((response) => response.json())
    .then((jsonData) => processTwData(jsonData))
    .catch(() => { error.style.display = 'flex'; });
};

const getTotalTwData = () => {
  const url = 'https://disease.sh/v3/covid-19/countries/TW?strict=true';
  fetch(`${url}`, {})
    .then((response) => response.json())
    .then((jsonData) => renderTotalTwData(jsonData, totalTw))
    .catch(() => { error.style.display = 'flex'; });
};

if (window.location.href.indexOf('taiwan') > 0) {
  getTownshipTwData();
  getTotalTwData();
  mapTwContent();
}
