/* eslint-disable */
//套件方法
import mapConfig from './dataWorld.js';
import $ from "jquery";

const pin_config = {
  'default': { 'pinShadow': '#000', 'pinShadowOpacity': '50', },
  'points': []
}

function isTouchEnabled() {
  return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
}

$(() => {
  if ($('#lakes').find('path').eq(0).attr('fill') != 'undefined') {
    $('#lakes').find('path').attr({ fill: mapConfig.default.lakesColor }).css({ stroke: mapConfig.default.borderColor });
  }

  $('#map-tip').css({
    'box-shadow': `1px 2px 4px ${mapConfig.default.hoverShadow}`,
    '-moz-box-shadow': `2px 3px 6px ${mapConfig.default.hoverShadow}`,
    '-webkit-box-shadow': `2px 3px 6px ${mapConfig.default.hoverShadow}`,
  });

  if ($('#shadow').find('path').eq(0).attr('fill') != 'undefined') {
    var { shadowOpacity } = mapConfig.default;
    var shadowOpacity = parseInt(shadowOpacity);
    if (shadowOpacity >= 100) { shadowOpacity = 1; } else if (shadowOpacity <= 0) { shadowOpacity = 0; } else { shadowOpacity /= 100; }

    $('#shadow').find('path').attr({ fill: mapConfig.default.mapShadow }).css({ 'fill-opacity': shadowOpacity });
  }
});

// The pins code
$(() => {
  if ($('#pin-shadow').find('path').eq(0).attr('fill') != 'undefined') {
    var { pinShadowOpacity } = pin_config.default;
    var pinShadowOpacity = parseInt(pinShadowOpacity);
    if (pinShadowOpacity >= 100) { pinShadowOpacity = 1; } else if (pinShadowOpacity <= 0) { pinShadowOpacity = 0; } else { pinShadowOpacity /= 100; }

    $('#pin-shadow').find('path').attr({ fill: pin_config.default.pinShadow }).css({ 'fill-opacity': pinShadowOpacity });
  }

  const points_len = pin_config.points.length;
  if (points_len > 0) {
    const xmlns = 'http://www.w3.org/2000/svg';
    const tsvg_obj = document.getElementById('map_points');
    let svg_circle; let svg_rect;
    for (let i = 0; i < points_len; i++) {
      if (pin_config.points[i].shape == 'circle') {
        svg_circle = document.createElementNS(xmlns, 'circle');
        svg_circle.setAttributeNS(null, 'cx', pin_config.points[i].pos_X + 1);
        svg_circle.setAttributeNS(null, 'cy', pin_config.points[i].pos_Y + 1);
        svg_circle.setAttributeNS(null, 'r', pin_config.points[i].diameter / 2);
        svg_circle.setAttributeNS(null, 'fill', pin_config.default.pinShadow);
        svg_circle.setAttributeNS(null, 'style', `fill-opacity:${pinShadowOpacity}`);
        svg_circle.setAttributeNS(null, 'id', `map_points_shadow_${i}`);
        tsvg_obj.appendChild(svg_circle);
        svg_circle = document.createElementNS(xmlns, 'circle');
        svg_circle.setAttributeNS(null, 'cx', pin_config.points[i].pos_X);
        svg_circle.setAttributeNS(null, 'cy', pin_config.points[i].pos_Y);
        svg_circle.setAttributeNS(null, 'r', pin_config.points[i].diameter / 2);
        svg_circle.setAttributeNS(null, 'fill', pin_config.points[i].upColor);
        svg_circle.setAttributeNS(null, 'stroke', pin_config.points[i].outline);
        svg_circle.setAttributeNS(null, 'stroke-width', pin_config.points[i].thickness);
        svg_circle.setAttributeNS(null, 'id', `map_points_${i}`);
        tsvg_obj.appendChild(svg_circle);
        dynamicAddEvent(i);
      } else if (pin_config.points[i].shape == 'rectangle') {
        svg_rect = document.createElementNS(xmlns, 'rect');
        svg_rect.setAttributeNS(null, 'x', pin_config.points[i].pos_X - pin_config.points[i].width / 2 + 1);
        svg_rect.setAttributeNS(null, 'y', pin_config.points[i].pos_Y - pin_config.points[i].height / 2 + 1);
        svg_rect.setAttributeNS(null, 'width', pin_config.points[i].width);
        svg_rect.setAttributeNS(null, 'height', pin_config.points[i].height);
        svg_rect.setAttributeNS(null, 'fill', pin_config.default.pinShadow);
        svg_rect.setAttributeNS(null, 'style', `fill-opacity:${pinShadowOpacity}`);
        svg_rect.setAttributeNS(null, 'id', `map_points_shadow_${i}`);
        tsvg_obj.appendChild(svg_rect);
        svg_rect = document.createElementNS(xmlns, 'rect');
        svg_rect.setAttributeNS(null, 'x', pin_config.points[i].pos_X - pin_config.points[i].width / 2);
        svg_rect.setAttributeNS(null, 'y', pin_config.points[i].pos_Y - pin_config.points[i].height / 2);
        svg_rect.setAttributeNS(null, 'width', pin_config.points[i].width);
        svg_rect.setAttributeNS(null, 'height', pin_config.points[i].height);
        svg_rect.setAttributeNS(null, 'fill', pin_config.points[i].upColor);
        svg_rect.setAttributeNS(null, 'stroke', pin_config.points[i].outline);
        svg_rect.setAttributeNS(null, 'stroke-width', pin_config.points[i].thickness);
        svg_rect.setAttributeNS(null, 'id', `map_points_${i}`);
        tsvg_obj.appendChild(svg_rect);
        dynamicAddEvent(i);
      }
    }
  }
});

function dynamicAddEvent(id) {
  const obj = $(`#map_points_${id}`);

  if (pin_config.points[id].enable == true) {
    if (isTouchEnabled()) {
      obj.on('touchstart', (e) => {
        const touch = e.originalEvent.touches[0];
        var x = touch.pageX + 10; let
          y = touch.pageY + 15;
        const tipw = $('#map-tip').outerWidth(); const tiph = $('#map-tip').outerHeight();
        var x = (x + tipw > $(document).scrollLeft() + $(window).width()) ? x - tipw - (20 * 2) : x;
        y = (y + tiph > $(document).scrollTop() + $(window).height()) ? $(document).scrollTop() + $(window).height() - tiph - 10 : y;
        $(`#${id}`).css({ fill: pin_config.points[id].downColor });
        $('#map-tip').show().html(pin_config.points[id].hover);
        $('#map-tip').css({ left: x, top: y });
      });
      obj.on('touchend', () => {
        $(`#${id}`).css({ fill: pin_config.points[id].upColor });
        if (pin_config.points[id].target == 'new_window') {
          window.open(pin_config.points[id].url);
        } else if (pin_config.points[id].target == 'same_window') {
          window.location.href = pin_config.points[id].url;
        }
      });
    }
    obj.attr({ cursor: 'pointer' });
    obj.hover(() => {
      $('#map-tip').show().html(pin_config.points[id].hover);
      obj.css({ fill: pin_config.points[id].overColor });
    }, () => {
      $('#map-tip').hide();
      obj.css({ fill: pin_config.points[id].upColor });
    });
    // clicking effect
    obj.mousedown(() => {
      obj.css({ fill: pin_config.points[id].downColor });
    });
    obj.mouseup(() => {
      obj.css({ fill: pin_config.points[id].overColor });
      if (pin_config.points[id].target == 'new_window') {
        window.open(pin_config.points[id].url);
      } else if (pin_config.points[id].target == 'same_window') {
        window.location.href = pin_config.points[id].url;
      }
    });
    obj.mousemove((e) => {
      var x = e.pageX + 10; let
        y = e.pageY + 15;
      const tipw = $('#map-tip').outerWidth(); const tiph = $('#map-tip').outerHeight();
      var x = (x + tipw > $(document).scrollLeft() + $(window).width()) ? x - tipw - (20 * 2) : x;
      y = (y + tiph > $(document).scrollTop() + $(window).height()) ? $(document).scrollTop() + $(window).height() - tiph - 10 : y;
      $('#map-tip').css({ left: x, top: y });
    });
  }
}

export default function addEvent(id, relationId) {
  const _obj = $(`#${id}`);
  const _Textobj = $(`#${id},` + `#${mapConfig[id].namesId}`);
  // var _h = $('#map').height();
  $(`#${['text-abb']}`).attr({ fill: mapConfig.default.namesColor });

  _obj.attr({ fill: mapConfig[id].upColor, stroke: mapConfig.default.borderColor });
  _Textobj.attr({ cursor: 'default' });
  if (mapConfig[id].enable == true) {
    if (isTouchEnabled()) {
      // clicking effect
      _Textobj.on('touchstart', (e) => {
        const touch = e.originalEvent.touches[0];
        var x = touch.pageX + 10; let
          y = touch.pageY + 15;
        const tipw = $('#map-tip').outerWidth(); const tiph = $('#map-tip').outerHeight();
        var x = (x + tipw > $(document).scrollLeft() + $(window).width()) ? x - tipw - (20 * 2) : x;
        y = (y + tiph > $(document).scrollTop() + $(window).height()) ? $(document).scrollTop() + $(window).height() - tiph - 10 : y;
        $(`#${id}`).css({ fill: mapConfig[id].downColor });
        $('#map-tip').show().html(mapConfig[id].hover);
        $('#map-tip').css({ left: x, top: y });
      });
      _Textobj.on('touchend', () => {
        $(`#${id}`).css({ fill: mapConfig[id].upColor });
        if (mapConfig[id].target == 'new_window') {
          window.open(mapConfig[id].url);
        } else if (mapConfig[id].target == 'same_window') {
          window.location.href = mapConfig[id].url;
        }
      });
    }
    _Textobj.attr({ cursor: 'pointer' });
    _Textobj.hover(() => {
      // moving in/out effect
      $('#map-tip').show().html(mapConfig[id].hover);
      _obj.css({ fill: mapConfig[id].overColor });
    }, () => {
      $('#map-tip').hide();
      $(`#${id}`).css({ fill: mapConfig[id].upColor });
    });
    // clicking effect
    _Textobj.mousedown(() => {
      $(`#${id}`).css({ fill: mapConfig[id].downColor });
    });
    _Textobj.mouseup(() => {
      $(`#${id}`).css({ fill: mapConfig[id].overColor });
      if (mapConfig[id].target == 'new_window') {
        window.open(mapConfig[id].url);
      } else if (mapConfig[id].target == 'same_window') {
        window.location.href = mapConfig[id].url;
      }
    });
    _Textobj.mousemove((e) => {
      var x = e.pageX + 10; let
        y = e.pageY + 15;
      const tipw = $('#map-tip').outerWidth(); const tiph = $('#map-tip').outerHeight();
      var x = (x + tipw > $(document).scrollLeft() + $(window).width()) ? x - tipw - (20 * 2) : x;
      y = (y + tiph > $(document).scrollTop() + $(window).height()) ? $(document).scrollTop() + $(window).height() - tiph - 10 : y;
      $('#map-tip').css({ left: x, top: y });
    });
  }
}