import dataTw from './dataTw.js';

// const path = document.querySelectorAll('path');
const error = document.querySelector('.error');

const totalTownship = {};

// path.forEach((item) => {
//   item.addEventListener('mouseenter', (e) => {
//     if (e.target.getAttribute('data-name') === 'taipei_city') {
//       item.setAttribute('fill', '#2F0000');
//     }
//   });
// });

const mapTwColor = () => {
  const tempData = {};
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
        tempData[dataItem.tag] = { ...dataItem };
      }
    });
  });
  if (Object.keys(tempData).indexOf('kinmen_country') < 0) {
    tempData.kinmen_country = { case: 0, color: 'green' };
  }
  Object.entries(tempData).forEach((dataItem) => {
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
};

const getTotalTwData = () => {
  const url = 'https://kiang.github.io/od.cdc.gov.tw/data/od/confirmed/2021.json';
  fetch(`${url}`, {})
    .then((response) => response.json())
    .then((jsonData) => {
      processTwData(jsonData);
    })
    .catch(() => { error.style.display = 'flex'; });
};

if (window.location.href.indexOf('taiwan') > 0) {
  getTotalTwData();
}
