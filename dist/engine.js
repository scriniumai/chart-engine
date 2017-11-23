(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Engine = factory());
}(this, (function () { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var renderium = createCommonjsModule(function (module, exports) {
(function (global, factory) {
  module.exports = factory();
})(commonjsGlobal, function () {
  'use strict';

  /* This program is free software. It comes without any warranty, to
       * the extent permitted by applicable law. You can redistribute it
       * and/or modify it under the terms of the Do What The Fuck You Want
       * To Public License, Version 2, as published by Sam Hocevar. See
       * http://www.wtfpl.net/ for more details. */

  var index = leftPad;

  var cache = ['', ' ', '  ', '   ', '    ', '     ', '      ', '       ', '        ', '         '];

  function leftPad(str, len, ch) {
    // convert `str` to `string`
    str = str + '';
    // `len` is the `pad`'s length now
    len = len - str.length;
    // doesn't need to pad
    if (len <= 0) return str;
    // `ch` defaults to `' '`
    if (!ch && ch !== 0) ch = ' ';
    // convert `ch` to `string`
    ch = ch + '';
    // cache common use cases
    if (ch === ' ' && len < 10) return cache[len] + str;
    // `pad` starts with an empty string
    var pad = '';
    // loop
    while (true) {
      // add `ch` to `pad` if `len` is odd
      if (len & 1) pad += ch;
      // divide `len` by 2, ditch the remainder
      len >>= 1;
      // "double" the `ch` so this operation count grows logarithmically on `len`
      // each time `ch` is "doubled", the `len` would need to be "doubled" too
      // similar to finding a value in binary search tree, hence O(log(n))
      if (len) ch += ch;
      // `len` is 0, exit the loop
      else break;
    }
    // pad `str`!
    return pad + str;
  }

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  var imageStatuses = {};
  var images = {};

  var ImageLoader = function () {
    function ImageLoader() {
      classCallCheck(this, ImageLoader);
    }

    ImageLoader.prototype.onload = function onload() {};

    ImageLoader.prototype.getImage = function getImage(url) {
      return images[url];
    };

    ImageLoader.prototype.getStatus = function getStatus(url) {
      return imageStatuses[url];
    };

    ImageLoader.prototype.load = function load(url) {
      var status = this.getStatus(url);
      var _this = this;
      if (status !== ImageLoader.IMAGE_STATUS_LOADING && status !== ImageLoader.IMAGE_STATUS_LOADED) {
        imageStatuses[url] = ImageLoader.IMAGE_STATUS_LOADING;
        var image = new window.Image();
        image.onload = function onload() {
          imageStatuses[url] = ImageLoader.IMAGE_STATUS_LOADED;
          images[url] = this;
          _this.onload();
        };
        image.src = url;
      }
    };

    return ImageLoader;
  }();

  ImageLoader.prototype.IMAGE_STATUS_LOADING = ImageLoader.IMAGE_STATUS_LOADING = 1;
  ImageLoader.prototype.IMAGE_STATUS_LOADED = ImageLoader.IMAGE_STATUS_LOADED = 2;

  var Component = function () {
    function Component() {
      classCallCheck(this, Component);
    }

    Component.isComponent = function isComponent(component) {
      return typeof component.plot === 'function' && typeof component.draw === 'function' && typeof component.shouldRedraw === 'function' && typeof component.onadd === 'function' && typeof component.onremove === 'function';
    };

    Component.prototype.onadd = function onadd(layer) {};

    Component.prototype.onremove = function onremove(layer) {};

    Component.prototype.plot = function plot(layer) {};

    Component.prototype.draw = function draw(layer) {};

    Component.prototype.shouldRedraw = function shouldRedraw() {
      return true;
    };

    return Component;
  }();

  function throwError(message) {
    throw new Error("\r\nRenderium: " + message);
  }

  var utils = Object.freeze({
    throwError: throwError
  });

  var BaseLayer = function () {
    function BaseLayer(_ref) {
      var Vector = _ref.Vector,
          stats = _ref.stats,
          width = _ref.width,
          height = _ref.height;
      classCallCheck(this, BaseLayer);

      this.Vector = Vector || window.Vector;
      this.width = Number(width) || BaseLayer.DEFAULT_WIDTH;
      this.height = Number(height) || BaseLayer.DEFAULT_HEIGHT;
      this.logStats = Boolean(stats);

      this.canvas = document.createElement('canvas');

      this.imageLoader = new ImageLoader();

      this.components = [];
      this.stats = {};
      this._shouldRedraw = false;
      this._renderCycleStarted = false;
    }

    BaseLayer.prototype.scale = function scale(_ref2) {
      var width = _ref2.width,
          height = _ref2.height;

      if (this.renderCycleStarted()) {
        throwError('Layer#scale() during render cycle is forbidden');
      }

      this.width = Number(width) || BaseLayer.DEFAULT_WIDTH;
      this.height = Number(height) || BaseLayer.DEFAULT_HEIGHT;

      this.canvas.width = this.width;
      this.canvas.height = this.height;

      this.applyStyles();

      this.forceRedraw();
    };

    BaseLayer.prototype.applyStyles = function applyStyles() {
      if (this.renderCycleStarted()) {
        throwError('Layer#applyStyles() during render cycle is forbidden');
      }

      this.canvas.style.width = this.width + 'px';
      this.canvas.style.height = this.height + 'px';
      this.canvas.style.position = 'absolute';
      this.canvas.style.top = 0;
      this.canvas.style.left = 0;
      this.canvas.style.right = 0;
      this.canvas.style.bottom = 0;
    };

    BaseLayer.prototype.clear = function clear() {
      if (this.renderCycleStarted()) {
        throwError('Layer#clear() during render cycle is forbidden');
      }

      this.clearStats();
    };

    BaseLayer.prototype.redraw = function redraw(time) {
      if (this.renderCycleStarted()) {
        throwError('Layer#redraw() during render cycle is forbidden');
      }

      this.startRenderCycle();
      for (var i = 0; i < this.components.length; i++) {
        var component = this.components[i];
        if (component.shouldRedraw() || this._shouldRedraw) {
          component.plot(this, time);
        }
        component.draw(this, time);
      }
      this.completeRenderCycle();
      this._shouldRedraw = false;
    };

    BaseLayer.prototype.forceRedraw = function forceRedraw() {
      this._shouldRedraw = true;
    };

    BaseLayer.prototype.shouldRedraw = function shouldRedraw() {
      for (var i = 0; i < this.components.length; i++) {
        var component = this.components[i];
        if (component.shouldRedraw()) {
          return true;
        }
      }
      return this._shouldRedraw;
    };

    BaseLayer.prototype.startRenderCycle = function startRenderCycle() {
      this._renderCycleStarted = true;
    };

    BaseLayer.prototype.completeRenderCycle = function completeRenderCycle() {
      this._renderCycleStarted = false;
    };

    BaseLayer.prototype.renderCycleStarted = function renderCycleStarted() {
      return this._renderCycleStarted;
    };

    BaseLayer.prototype.addComponent = function addComponent(component) {
      if (this.renderCycleStarted()) {
        throwError('Layer#addComponent() during render cycle is forbidden');
      }

      var idx = this.components.indexOf(component);
      if (idx !== -1) {
        throwError('Component ' + component.constructor.name + ' has already been added to layer');
      }
      if (!Component.isComponent(component)) {
        throwError('Component ' + component.constructor.name + ' has not implemented Component interface');
      }
      this.components.push(component);
      this.forceRedraw();
      component.onadd(this);
    };

    BaseLayer.prototype.addComponents = function addComponents(components) {
      components.forEach(this.addComponent, this);
    };

    BaseLayer.prototype.removeComponent = function removeComponent(component) {
      if (this.renderCycleStarted()) {
        throwError('Layer#removeComponent() during render cycle is forbidden');
      }

      var idx = this.components.indexOf(component);
      if (idx !== -1) {
        this.components.splice(idx, 1);
        this.forceRedraw();
      }
      component.onremove(this);
    };

    BaseLayer.prototype.removeComponents = function removeComponents(components) {
      components.forEach(this.removeComponent, this);
    };

    BaseLayer.prototype.clearComponents = function clearComponents() {
      if (this.renderCycleStarted()) {
        throwError('Layer#clearComponents() during render cycle is forbidden');
      }

      this.components = [];
      this.forceRedraw();
    };

    BaseLayer.prototype.clearStats = function clearStats() {
      if (this.renderCycleStarted()) {
        throwError('Layer#clearStats() during render cycle is forbidden');
      }

      for (var methodName in this.stats) {
        this.stats[methodName] = 0;
      }
    };

    BaseLayer.prototype.collectStats = function collectStats(methodName) {
      this.stats[methodName]++;
    };

    BaseLayer.prototype.formatStats = function formatStats() {
      var result = [];
      var maxStringLength = 20;

      for (var methodName in this.stats) {
        result.push(methodName + index(this.stats[methodName], maxStringLength - methodName.length));
      }

      return result;
    };

    return BaseLayer;
  }();

  BaseLayer.DEFAULT_WIDTH = 100;
  BaseLayer.DEFAULT_HEIGHT = 100;

  var Gradient = function () {
    Gradient.isGradient = function isGradient(color) {
      return color && color._isGradient;
    };

    function Gradient(_ref) {
      var start = _ref.start,
          end = _ref.end,
          from = _ref.from,
          to = _ref.to;
      classCallCheck(this, Gradient);

      this.start = start;
      this.end = end;
      this.from = from;
      this.to = to;

      this._isGradient = true;
      this._gradient = null;
    }

    Gradient.prototype.createGradient = function createGradient(layer) {
      layer.collectStats('createGradient');

      this._gradient = layer.ctx.createLinearGradient(this.start.x, this.start.y, this.end.x, this.end.y);
      this._gradient.addColorStop(0, this.from);
      this._gradient.addColorStop(1, this.to);
      return this._gradient;
    };

    Gradient.prototype.valueOf = function valueOf() {
      return this._gradient;
    };

    return Gradient;
  }();

  // -------------------------------------
  // CanvasLayer
  // -------------------------------------

  var PIXEL_RATIO = window.devicePixelRatio || 1;

  var CanvasLayer = function (_BaseLayer) {
    inherits(CanvasLayer, _BaseLayer);

    function CanvasLayer(_ref) {
      var Vector = _ref.Vector,
          stats = _ref.stats,
          antialiasing = _ref.antialiasing,
          width = _ref.width,
          height = _ref.height;
      classCallCheck(this, CanvasLayer);

      var _this = possibleConstructorReturn(this, _BaseLayer.call(this, { Vector: Vector, stats: stats, width: width, height: height }));

      _this.antialiasing = Boolean(antialiasing);
      _this.ctx = _this.canvas.getContext('2d');

      _this.scale({ width: width, height: height });

      _this.imageLoader.onload = _this.forceRedraw.bind(_this);

      _this.stats = {
        createGradient: 0,
        drawArc: 0,
        drawCircle: 0,
        drawImage: 0,
        drawPolygon: 0,
        drawPolyline: 0,
        drawRect: 0,
        drawText: 0,
        measureText: 0,
        stroke: 0,
        fill: 0
      };
      return _this;
    }

    CanvasLayer.prototype.scale = function scale(_ref2) {
      var width = _ref2.width,
          height = _ref2.height;

      _BaseLayer.prototype.scale.call(this, { width: width, height: height });

      if (window.devicePixelRatio) {
        this.canvas.width = this.width * PIXEL_RATIO;
        this.canvas.height = this.height * PIXEL_RATIO;
        this.ctx.scale(PIXEL_RATIO, PIXEL_RATIO);
      }

      if (!this.antialiasing) {
        this.ctx.translate(0.5, 0.5);
      }
    };

    CanvasLayer.prototype.clear = function clear() {
      _BaseLayer.prototype.clear.call(this);
      this.ctx.save();
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.ctx.restore();
    };

    CanvasLayer.prototype.redraw = function redraw(time) {
      _BaseLayer.prototype.redraw.call(this, time);
      if (this.logStats) {
        this.drawStats();
      }
    };

    CanvasLayer.prototype.createGradient = function createGradient(_ref3) {
      var start = _ref3.start,
          end = _ref3.end,
          from = _ref3.from,
          to = _ref3.to;

      return new Gradient({ start: start, end: end, from: from, to: to });
    };

    CanvasLayer.prototype.getColor = function getColor(color) {
      return Gradient.isGradient(color) ? color.createGradient(this) : color;
    };

    CanvasLayer.prototype.drawArc = function drawArc(_ref4) {
      var position = _ref4.position,
          radius = _ref4.radius,
          startAngle = _ref4.startAngle,
          endAngle = _ref4.endAngle,
          color = _ref4.color,
          _ref4$width = _ref4.width,
          width = _ref4$width === undefined ? 1 : _ref4$width;

      this.collectStats('drawArc');

      this.ctx.strokeStyle = this.getColor(color);
      this.ctx.lineWidth = width;

      this.ctx.beginPath();
      this.ctx.arc(position.x, position.y, radius, startAngle, endAngle);

      if (color) {
        this.collectStats('stroke');
        this.ctx.stroke();
      }
    };

    CanvasLayer.prototype.drawCircle = function drawCircle(_ref5) {
      var position = _ref5.position,
          radius = _ref5.radius,
          color = _ref5.color,
          fillColor = _ref5.fillColor,
          _ref5$width = _ref5.width,
          width = _ref5$width === undefined ? 1 : _ref5$width;

      this.collectStats('drawCircle');

      this.drawArc({
        position: position,
        radius: radius,
        startAngle: 0,
        endAngle: 2 * Math.PI,
        color: color,
        width: width
      });

      if (fillColor) {
        this.collectStats('fill');
        this.ctx.fillStyle = this.getColor(fillColor);
        this.ctx.fill();
      }
    };

    CanvasLayer.prototype.drawImage = function drawImage(_ref6) {
      var position = _ref6.position,
          image = _ref6.image,
          _ref6$width = _ref6.width,
          width = _ref6$width === undefined ? image.width : _ref6$width,
          _ref6$height = _ref6.height,
          height = _ref6$height === undefined ? image.height : _ref6$height,
          _ref6$opacity = _ref6.opacity,
          opacity = _ref6$opacity === undefined ? 1 : _ref6$opacity;

      this.collectStats('drawImage');

      if (typeof image === 'string') {
        if (this.imageLoader.getStatus(image) === this.imageLoader.IMAGE_STATUS_LOADED) {
          image = this.imageLoader.getImage(image);
          width = width || image.width;
          height = height || image.height;
        } else if (this.imageLoader.getStatus(image) !== this.imageLoader.IMAGE_STATUS_LOADING) {
          this.imageLoader.load(image);
          return;
        } else {
          return;
        }
      }

      var defaultAlpha = this.ctx.globalAlpha;
      this.ctx.globalAlpha = opacity;
      if (this.antialiasing) {
        this.ctx.drawImage(image, position.x, position.y, width, height);
      } else {
        this.ctx.drawImage(image, position.x - 0.5, position.y - 0.5, width, height);
      }
      this.ctx.globalAlpha = defaultAlpha;
    };

    CanvasLayer.prototype.drawPolygon = function drawPolygon(_ref7) {
      var points = _ref7.points,
          color = _ref7.color,
          fillColor = _ref7.fillColor,
          _ref7$width = _ref7.width,
          width = _ref7$width === undefined ? 1 : _ref7$width;

      this.collectStats('drawPolygon');

      this.drawPolyline({
        points: points.concat(points[0]),
        color: color,
        width: width
      });

      if (fillColor) {
        this.collectStats('fill');
        this.ctx.fillStyle = this.getColor(fillColor);
        this.ctx.fill();
      }
    };

    CanvasLayer.prototype.drawPolyline = function drawPolyline(_ref8) {
      var points = _ref8.points,
          color = _ref8.color,
          _ref8$lineDash = _ref8.lineDash,
          lineDash = _ref8$lineDash === undefined ? [] : _ref8$lineDash,
          _ref8$width = _ref8.width,
          width = _ref8$width === undefined ? 1 : _ref8$width;

      this.collectStats('drawPolyline');

      this.ctx.lineWidth = width;

      this.ctx.beginPath();
      this.ctx.moveTo(points[0].x, points[0].y);

      for (var i = 1, point; i < points.length; i++) {
        point = points[i];
        this.ctx.lineTo(point.x, point.y);
      }

      this.ctx.setLineDash(lineDash);

      if (points[0].equals(points[points.length - 1])) {
        this.ctx.closePath();
      }

      if (color) {
        this.collectStats('stroke');
        this.ctx.strokeStyle = this.getColor(color);
        this.ctx.stroke();
      }
    };

    CanvasLayer.prototype.drawRect = function drawRect(_ref9) {
      var position = _ref9.position,
          width = _ref9.width,
          height = _ref9.height,
          color = _ref9.color,
          fillColor = _ref9.fillColor,
          _ref9$strokeWidth = _ref9.strokeWidth,
          strokeWidth = _ref9$strokeWidth === undefined ? 1 : _ref9$strokeWidth;

      this.collectStats('drawRect');

      this.ctx.lineWidth = strokeWidth;

      this.ctx.beginPath();
      if (this.antialiasing) {
        this.ctx.rect(position.x, position.y, width, height);
      } else {
        this.ctx.rect(position.x - 0.5, position.y - 0.5, width, height);
      }
      this.ctx.closePath();

      if (color) {
        this.collectStats('stroke');
        this.ctx.strokeStyle = this.getColor(color);
        this.ctx.stroke();
      }

      if (fillColor) {
        this.collectStats('fill');
        this.ctx.fillStyle = this.getColor(fillColor);
        this.ctx.fill();
      }
    };

    CanvasLayer.prototype.drawText = function drawText(_ref10) {
      var position = _ref10.position,
          text = _ref10.text,
          color = _ref10.color,
          font = _ref10.font,
          size = _ref10.size,
          _ref10$align = _ref10.align,
          align = _ref10$align === undefined ? 'center' : _ref10$align,
          _ref10$baseline = _ref10.baseline,
          baseline = _ref10$baseline === undefined ? 'middle' : _ref10$baseline;

      this.collectStats('drawText');

      this.ctx.fillStyle = this.getColor(color);
      this.ctx.font = size + 'px ' + font;
      this.ctx.textAlign = align;
      this.ctx.textBaseline = baseline;

      this.ctx.fillText(text, position.x, position.y);
    };

    CanvasLayer.prototype.measureText = function measureText(_ref11) {
      var text = _ref11.text,
          font = _ref11.font,
          size = _ref11.size;

      this.collectStats('measureText');

      var width;
      if (font && size) {
        var defaultFont = this.ctx.font;
        this.ctx.font = size + 'px ' + font;
        width = this.ctx.measureText(text).width;
        this.ctx.font = defaultFont;
      } else {
        width = this.ctx.measureText(text).width;
      }
      return width;
    };

    CanvasLayer.prototype.drawStats = function drawStats() {
      var stats = this.formatStats();

      for (var i = stats.length; i--;) {
        this.drawText({
          position: new this.Vector(this.width - 10, this.height - 14 * (stats.length - i)),
          text: stats[i],
          color: '#fff',
          font: 'Courier, monospace',
          size: 14,
          align: 'right',
          baleline: 'bottom'
        });
      }
    };

    return CanvasLayer;
  }(BaseLayer);

  var colors = {
    RED: '#f44336',
    PINK: '#e91e63',
    PURPLE: '#9c27b0',
    DEEP_PURPLE: '#673ab7',
    INDIGO: '#3f51b5',
    BLUE: '#2196f3',
    LIGHT_BLUE: '#03a9f4',
    CYAN: '#00bcd4',
    TEAL: '#009688',
    GREEN: '#4caf50',
    LIGHT_GREEN: '#8bc34a',
    LIME: '#cddc39',
    YELLOW: '#ffeb3b',
    AMBER: '#ffc107',
    ORANGE: '#ff9800',
    DEEP_ORANGE: '#ff5722',
    BROWN: '#795548',
    GREY: '#9e9e9e',
    BLUE_GREY: '#607d8b'
  };

  var Renderium = function () {
    Renderium.spawn = function spawn(renderer) {
      var idx = Renderium.instances.indexOf(renderer);
      if (idx !== -1) {
        throwError('Renderer has already been spawned');
      }
      Renderium.instances.push(renderer);
    };

    Renderium.kill = function kill(renderer) {
      var idx = Renderium.instances.indexOf(renderer);
      if (idx !== -1) {
        Renderium.instances.splice(idx, 1);
      }
    };

    Renderium.digest = function digest(time) {
      for (var i = 0; i < Renderium.instances.length; i++) {
        var renderer = Renderium.instances[i];
        renderer.scale();
        renderer.clear();
        renderer.redraw(time);
      }
    };

    function Renderium(_ref) {
      var el = _ref.el;
      classCallCheck(this, Renderium);

      this.el = el;
      this.applyStyles();
      this.width = this.el.clientWidth;
      this.height = this.el.clientHeight;
      this.layers = [];
    }

    Renderium.prototype.applyStyles = function applyStyles() {
      this.el.style.position = 'relative';
      this.el.style.width = '100%';
      this.el.style.height = '100%';
    };

    Renderium.prototype.addLayer = function addLayer(layer) {
      var idx = this.layers.indexOf(layer);
      if (idx !== -1) {
        throwError('Layer has already been added to renderer');
      }
      this.layers.push(layer);
      this.el.appendChild(layer.canvas);
      layer.scale({ width: this.width, height: this.height });
    };

    Renderium.prototype.removeLayer = function removeLayer(layer) {
      var idx = this.layers.indexOf(layer);
      if (idx !== -1) {
        this.layers.splice(idx, 1);
        this.el.removeChild(layer.canvas);
      }
    };

    Renderium.prototype.scale = function scale() {
      var width = this.el.clientWidth;
      var height = this.el.clientHeight;

      if (width !== this.width || height !== this.height) {
        for (var i = 0; i < this.layers.length; i++) {
          var layer = this.layers[i];
          layer.scale({ width: width, height: height });
        }
        this.width = width;
        this.height = height;
      }
    };

    Renderium.prototype.clear = function clear() {
      for (var i = 0; i < this.layers.length; i++) {
        var layer = this.layers[i];
        if (layer.shouldRedraw()) {
          layer.clear();
        }
      }
    };

    Renderium.prototype.redraw = function redraw(time) {
      for (var i = 0; i < this.layers.length; i++) {
        var layer = this.layers[i];
        if (layer.shouldRedraw()) {
          layer.redraw(time);
        }
      }
    };

    return Renderium;
  }();

  Renderium.instances = [];

  Renderium.BaseLayer = BaseLayer;
  Renderium.CanvasLayer = CanvasLayer;
  Renderium.Component = Component;
  Renderium.colors = colors;
  Renderium.utils = utils;

  return Renderium;
});
});

var vectory = createCommonjsModule(function (module, exports) {
(function (global, factory) {
  module.exports = factory();
})(commonjsGlobal, function () {
  'use strict';

  function Vector(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  Vector.displayName = 'Vector';

  Vector.from = function (data) {
    return new Vector(data[0], data[1]);
  };

  Vector.fromAngle = function (angle, magnitude) {
    return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
  };

  Vector.parse = function (string) {
    return Vector.from(string.trim().replace(',', ' ').split(/\s+/).map(parseFloat));
  };

  Vector.add = function (one, another) {
    return another.add(one);
  };

  Vector.prototype.add = function (vector) {
    return new Vector(this.x + vector.x, this.y + vector.y);
  };

  Vector.iadd = function (one, another) {
    return another.iadd(one);
  };

  Vector.prototype.iadd = function (vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  };

  Vector.sub = function (one, another) {
    return another.sub(one);
  };

  Vector.prototype.sub = function (vector) {
    return new Vector(this.x - vector.x, this.y - vector.y);
  };

  Vector.isub = function (one, another) {
    return another.isub(one);
  };

  Vector.prototype.isub = function (vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  };

  Vector.mul = function (scalar, vector) {
    return vector.mul(scalar);
  };

  Vector.prototype.mul = function (scalar) {
    return new Vector(this.x * scalar, this.y * scalar);
  };

  Vector.imul = function (scalar, vector) {
    return vector.imul(scalar);
  };

  Vector.prototype.imul = function (scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  };

  Vector.div = function (scalar, vector) {
    return vector.div(scalar);
  };

  Vector.prototype.div = function (scalar) {
    return new Vector(this.x / scalar, this.y / scalar);
  };

  Vector.idiv = function (scalar, vector) {
    return vector.idiv(scalar);
  };

  Vector.prototype.idiv = function (scalar) {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  };

  Vector.lerp = function (one, another, t) {
    return one.lerp(another, t);
  };

  Vector.prototype.lerp = function (vector, t) {
    var x = (1 - t) * this.x + t * vector.x;
    var y = (1 - t) * this.y + t * vector.y;
    return new Vector(x, y);
  };

  Vector.normalized = function (vector) {
    return vector.normalized();
  };

  Vector.prototype.normalized = function () {
    var x = this.x;
    var y = this.y;
    var length = Math.sqrt(x * x + y * y);
    if (length > 0) {
      return new Vector(x / length, y / length);
    } else {
      return new Vector(0, 0);
    }
  };

  Vector.normalize = function (vector) {
    return vector.normalize();
  };

  Vector.prototype.normalize = function () {
    var x = this.x;
    var y = this.y;
    var length = Math.sqrt(x * x + y * y);
    if (length > 0) {
      this.x = x / length;
      this.y = y / length;
    }
    return this;
  };

  Vector.magnitude = function (vector) {
    return vector.magnitude();
  };

  Vector.prototype.magnitude = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };

  Vector.dot = function (one, another) {
    return another.dot(one);
  };

  Vector.prototype.dot = function (vector) {
    return this.x * vector.x + this.y * vector.y;
  };

  Vector.distance = function (one, another) {
    return another.distance(one);
  };

  Vector.prototype.distance = function (vector) {
    var x = this.x - vector.x;
    var y = this.y - vector.y;
    return Math.sqrt(x * x + y * y);
  };

  Vector.angleOf = function (vector) {
    return vector.angleOf();
  };

  Vector.prototype.angleOf = function () {
    return Math.atan2(this.y, this.x);
  };

  Vector.angleTo = function (one, another) {
    return another.angleTo(one);
  };

  Vector.prototype.angleTo = function (vector) {
    return Math.acos(this.dot(vector) / this.magnitude() * vector.magnitude());
  };

  Vector.reset = function (one, another) {
    return another.reset(one);
  };

  Vector.prototype.reset = function (vector) {
    this.x = vector.x;
    this.y = vector.y;
    return this;
  };

  Vector.zero = function (vector) {
    return vector.zero();
  };

  Vector.prototype.zero = function () {
    this.x = 0;
    this.y = 0;
    return this;
  };

  Vector.set = function (x, y, vector) {
    return vector.set(x, y);
  };

  Vector.prototype.set = function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
    return this;
  };

  Vector.copy = function (vector) {
    return vector.copy();
  };

  Vector.prototype.copy = function () {
    return new Vector(this.x, this.y);
  };

  Vector.toJSON = function (vector) {
    return vector.toJSON();
  };

  Vector.prototype.toJSON = function () {
    return [this.x, this.y];
  };

  Vector.toString = function (vector) {
    return vector ? vector.toString() : Function.prototype.toString.call(this);
  };

  Vector.prototype.toString = function () {
    return this.x.toFixed(3) + ' ' + this.y.toFixed(3);
  };

  /* istanbul ignore else */
  if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
    Vector.prototype[Symbol.toStringTag] = 'Vector';
  }

  Vector.toArray = function (vector) {
    return vector.toArray();
  };

  Vector.prototype.toArray = function () {
    return [this.x, this.y];
  };

  Vector.equals = function (one, another) {
    return one.equals(another);
  };

  Vector.prototype.equals = function (vector) {
    return this.x === vector.x && this.y === vector.y;
  };

  Vector.compare = function (one, another) {
    return one.compare(another);
  };

  Vector.prototype.compare = function (vector) {
    var thisMagnitude = this.magnitude();
    var vectorMagnitude = vector.magnitude();
    return (thisMagnitude > vectorMagnitude) - (vectorMagnitude > thisMagnitude);
  };

  Object.defineProperties(Vector.prototype, {
    xx: {
      configurable: true,
      get: function () {
        return new Vector(this.x, this.x);
      },
      set: function (vector) {
        this.x = vector.x;
        this.y = vector.x;
      }
    },
    xy: {
      configurable: true,
      get: function () {
        return new Vector(this.x, this.y);
      },
      set: function (vector) {
        this.x = vector.x;
        this.y = vector.y;
      }
    },
    yx: {
      configurable: true,
      get: function () {
        return new Vector(this.y, this.x);
      },
      set: function (vector) {
        this.x = vector.y;
        this.y = vector.x;
      }
    },
    yy: {
      configurable: true,
      get: function () {
        return new Vector(this.y, this.y);
      },
      set: function (vector) {
        this.x = vector.y;
        this.y = vector.y;
      }
    }
  });

  function VectorIterator(vector) {
    this.vector = vector;
    this.__idx = 0;
  }

  VectorIterator.prototype.next = function () {
    if (this.__idx === 0) {
      this.__idx++;
      return {
        done: false,
        value: this.vector.x
      };
    } else if (this.__idx === 1) {
      this.__idx++;
      return {
        done: false,
        value: this.vector.y
      };
    } else {
      return {
        done: true,
        value: void 0
      };
    }
  };

  /* istanbul ignore else */
  if (typeof Symbol !== 'undefined' && Symbol.iterator) {
    Vector.prototype[Symbol.iterator] = function iterator() {
      return new VectorIterator(this);
    };
  }

  return Vector;
});
});

var dynamica = createCommonjsModule(function (module, exports) {
(function (global, factory) {
  module.exports = factory();
})(commonjsGlobal, function () {
  'use strict';

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  function noop() {}

  function id(value) {
    return value;
  }

  function indexOf(array, item) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] === item) {
        return i;
      }
    }
    return -1;
  }

  var Animation = function () {
    Animation.add = function add(animation) {
      Animation.instances.push(animation);
    };

    Animation.remove = function remove(animation) {
      var idx = indexOf(Animation.instances, animation);
      if (idx !== -1) {
        Animation.instances.splice(idx, 1);
      }
    };

    Animation.animate = function animate(time) {
      var animations = Animation.instances.concat();
      for (var i = 0, animation; i < animations.length; i++) {
        animation = animations[i];
        animation.animate(time);
      }
    };

    function Animation(options) {
      classCallCheck(this, Animation);

      var _ref = options || {};

      var duration = _ref.duration;
      var handler = _ref.handler;
      var ease = _ref.ease;
      var onstart = _ref.onstart;
      var oncancel = _ref.oncancel;
      var oncomplete = _ref.oncomplete;

      if (isNaN(duration)) {
        throw Error('`duration` should be defined, check https://github.com/broadsw0rd/dynamica#api');
      }

      this.startTime = 0;

      this.duration = Number(duration);
      this.handler = handler || noop;
      this.ease = ease || id;

      this.onstart = onstart || noop;
      this.oncancel = oncancel || noop;
      this.oncomplete = oncomplete || noop;

      this.next = [];
      this._started = false;
    }

    Animation.prototype.start = function start() {
      Animation.add(this);
      this._started = true;
      this.onstart && this.onstart();
    };

    Animation.prototype.animate = function animate(time) {
      this.startTime = this.startTime || time;
      time = (time - this.startTime) / this.duration;
      if (time < 1) {
        this.handler(this.ease(time));
      } else {
        this.complete();
      }
    };

    Animation.prototype.complete = function complete() {
      this.remove();
      this.handler(1);
      this.oncomplete && this.oncomplete();
      for (var i = 0, next; i < this.next.length; i++) {
        next = this.next[i];
        next.start();
      }
    };

    Animation.prototype.remove = function remove() {
      this.startTime = 0;
      Animation.remove(this);
      this._started = false;
    };

    Animation.prototype.cancel = function cancel() {
      this.remove();
      this.oncancel && this.oncancel();
    };

    Animation.prototype.queue = function queue(animation) {
      this.next.push(animation);
    };

    Animation.prototype.dequeue = function dequeue(animation) {
      var idx = indexOf(this.next, animation);
      if (idx !== -1) {
        this.next.splice(idx, 1);
      }
    };

    Animation.prototype.started = function started() {
      return this._started;
    };

    return Animation;
  }();

  Animation.instances = [];

  return Animation;
});
});

var kinetic = createCommonjsModule(function (module, exports) {
(function (global, factory) {
  module.exports = factory();
})(commonjsGlobal, function () {
  'use strict';

  var commonjsGlobal$$1 = typeof window !== 'undefined' ? window : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule$$1(fn, module) {
    return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var vectory = createCommonjsModule$$1(function (module, exports) {
    (function (global, factory) {
      typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof undefined === 'function' && undefined.amd ? undefined(factory) : global.Vector = factory();
    })(commonjsGlobal$$1, function () {
      'use strict';

      function Vector(x, y) {
        this.x = x || 0;
        this.y = y || 0;
      }

      Vector.displayName = 'Vector';

      Vector.from = function (data) {
        return new Vector(data[0], data[1]);
      };

      Vector.fromAngle = function (angle, magnitude) {
        return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
      };

      Vector.parse = function (string) {
        return Vector.from(string.trim().replace(',', ' ').split(/\s+/).map(parseFloat));
      };

      Vector.add = function (one, another) {
        return another.add(one);
      };

      Vector.prototype.add = function (vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
      };

      Vector.iadd = function (one, another) {
        return another.iadd(one);
      };

      Vector.prototype.iadd = function (vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
      };

      Vector.sub = function (one, another) {
        return another.sub(one);
      };

      Vector.prototype.sub = function (vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
      };

      Vector.isub = function (one, another) {
        return another.isub(one);
      };

      Vector.prototype.isub = function (vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
      };

      Vector.mul = function (scalar, vector) {
        return vector.mul(scalar);
      };

      Vector.prototype.mul = function (scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
      };

      Vector.imul = function (scalar, vector) {
        return vector.imul(scalar);
      };

      Vector.prototype.imul = function (scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
      };

      Vector.div = function (scalar, vector) {
        return vector.div(scalar);
      };

      Vector.prototype.div = function (scalar) {
        return new Vector(this.x / scalar, this.y / scalar);
      };

      Vector.idiv = function (scalar, vector) {
        return vector.idiv(scalar);
      };

      Vector.prototype.idiv = function (scalar) {
        this.x /= scalar;
        this.y /= scalar;
        return this;
      };

      Vector.lerp = function (one, another, t) {
        return one.lerp(another, t);
      };

      Vector.prototype.lerp = function (vector, t) {
        var x = (1 - t) * this.x + t * vector.x;
        var y = (1 - t) * this.y + t * vector.y;
        return new Vector(x, y);
      };

      Vector.normalized = function (vector) {
        return vector.normalized();
      };

      Vector.prototype.normalized = function () {
        var x = this.x;
        var y = this.y;
        var length = Math.sqrt(x * x + y * y);
        if (length > 0) {
          return new Vector(x / length, y / length);
        } else {
          return new Vector(0, 0);
        }
      };

      Vector.normalize = function (vector) {
        return vector.normalize();
      };

      Vector.prototype.normalize = function () {
        var x = this.x;
        var y = this.y;
        var length = Math.sqrt(x * x + y * y);
        if (length > 0) {
          this.x = x / length;
          this.y = y / length;
        }
        return this;
      };

      Vector.magnitude = function (vector) {
        return vector.magnitude();
      };

      Vector.prototype.magnitude = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
      };

      Vector.dot = function (one, another) {
        return another.dot(one);
      };

      Vector.prototype.dot = function (vector) {
        return this.x * vector.x + this.y * vector.y;
      };

      Vector.distance = function (one, another) {
        return another.distance(one);
      };

      Vector.prototype.distance = function (vector) {
        var x = this.x - vector.x;
        var y = this.y - vector.y;
        return Math.sqrt(x * x + y * y);
      };

      Vector.angleOf = function (vector) {
        return vector.angleOf();
      };

      Vector.prototype.angleOf = function () {
        return Math.atan2(this.y, this.x);
      };

      Vector.angleTo = function (one, another) {
        return another.angleTo(one);
      };

      Vector.prototype.angleTo = function (vector) {
        return Math.acos(this.dot(vector) / this.magnitude() * vector.magnitude());
      };

      Vector.reset = function (one, another) {
        return another.reset(one);
      };

      Vector.prototype.reset = function (vector) {
        this.x = vector.x;
        this.y = vector.y;
        return this;
      };

      Vector.zero = function (vector) {
        return vector.zero();
      };

      Vector.prototype.zero = function () {
        this.x = 0;
        this.y = 0;
        return this;
      };

      Vector.set = function (x, y, vector) {
        return vector.set(x, y);
      };

      Vector.prototype.set = function (x, y) {
        this.x = x || 0;
        this.y = y || 0;
        return this;
      };

      Vector.copy = function (vector) {
        return vector.copy();
      };

      Vector.prototype.copy = function () {
        return new Vector(this.x, this.y);
      };

      Vector.toJSON = function (vector) {
        return vector.toJSON();
      };

      Vector.prototype.toJSON = function () {
        return [this.x, this.y];
      };

      Vector.toString = function (vector) {
        return vector ? vector.toString() : Function.prototype.toString.call(this);
      };

      Vector.prototype.toString = function () {
        return this.x.toFixed(3) + ' ' + this.y.toFixed(3);
      };

      /* istanbul ignore else */
      if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        Vector.prototype[Symbol.toStringTag] = 'Vector';
      }

      Vector.toArray = function (vector) {
        return vector.toArray();
      };

      Vector.prototype.toArray = function () {
        return [this.x, this.y];
      };

      Vector.equals = function (one, another) {
        return one.equals(another);
      };

      Vector.prototype.equals = function (vector) {
        return this.x === vector.x && this.y === vector.y;
      };

      Vector.compare = function (one, another) {
        return one.compare(another);
      };

      Vector.prototype.compare = function (vector) {
        var thisMagnitude = this.magnitude();
        var vectorMagnitude = vector.magnitude();
        return (thisMagnitude > vectorMagnitude) - (vectorMagnitude > thisMagnitude);
      };

      Object.defineProperties(Vector.prototype, {
        xx: {
          configurable: true,
          get: function () {
            return new Vector(this.x, this.x);
          },
          set: function (vector) {
            this.x = vector.x;
            this.y = vector.x;
          }
        },
        xy: {
          configurable: true,
          get: function () {
            return new Vector(this.x, this.y);
          },
          set: function (vector) {
            this.x = vector.x;
            this.y = vector.y;
          }
        },
        yx: {
          configurable: true,
          get: function () {
            return new Vector(this.y, this.x);
          },
          set: function (vector) {
            this.x = vector.y;
            this.y = vector.x;
          }
        },
        yy: {
          configurable: true,
          get: function () {
            return new Vector(this.y, this.y);
          },
          set: function (vector) {
            this.x = vector.y;
            this.y = vector.y;
          }
        }
      });

      function VectorIterator(vector) {
        this.vector = vector;
        this.__idx = 0;
      }

      VectorIterator.prototype.next = function () {
        if (this.__idx === 0) {
          this.__idx++;
          return {
            done: false,
            value: this.vector.x
          };
        } else if (this.__idx === 1) {
          this.__idx++;
          return {
            done: false,
            value: this.vector.y
          };
        } else {
          return {
            done: true,
            value: void 0
          };
        }
      };

      /* istanbul ignore else */
      if (typeof Symbol !== 'undefined' && Symbol.iterator) {
        Vector.prototype[Symbol.iterator] = function iterator() {
          return new VectorIterator(this);
        };
      }

      return Vector;
    });
  });

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var TRACK_THRESHOLD = 100;

  var Pointer = function () {
    function Pointer(_ref) {
      var id = _ref.id;
      classCallCheck(this, Pointer);

      this.id = id;
      this.position = new vectory(0, 0);
      this.delta = new vectory(0, 0);
      this.velocity = new vectory(0, 0);
      this.amplitude = new vectory(0, 0);
      this._startPosition = new vectory(0, 0);
      this._pressed = false;
      this._activated = false;
      this._swiped = false;
      this._timestamp = 0;
      this._trackTime = 0;
      this._elapsed = 0;
    }

    Pointer.prototype.tap = function tap(position) {
      this.velocity = new vectory(0, 0);
      this.amplitude = new vectory(0, 0);
      this._startPosition = position;
      this._timestamp = 0;
      this._trackTime = 0;
      this._elapsed = 0;
      this._pressed = true;
    };

    Pointer.prototype.drag = function drag(position) {
      this.position = position;
      this.delta.iadd(this.position.sub(this._startPosition));
      this._startPosition = this.position;
      this._activated = true;
    };

    Pointer.prototype.launch = function launch(velocityThreshold, amplitudeFactor) {
      if (this.velocity.magnitude() > velocityThreshold) {
        this.amplitude = this.velocity.imul(amplitudeFactor);
        this._swiped = true;
      }
      this._pressed = false;
      this._trackTime = 0;
    };

    Pointer.prototype.track = function track(time, movingAvarageFilter) {
      this._timestamp = this._timestamp || time;
      this._trackTime = this._trackTime || time;
      if (time - this._trackTime >= TRACK_THRESHOLD) {
        this._elapsed = time - this._timestamp;
        this._timestamp = time;
        this._trackTime = 0;

        var v = this.delta.mul(movingAvarageFilter).idiv(1 + this._elapsed);
        this.velocity = v.lerp(this.velocity, 0.2);
      }
    };

    Pointer.prototype.swipe = function swipe(time, decelerationRate, deltaThreshold) {
      this._elapsed = time - this._timestamp;
      this.delta = this.amplitude.mul(Math.exp(-this._elapsed / decelerationRate));
      if (this.delta.magnitude() > deltaThreshold) {
        this._activated = true;
      } else {
        this._swiped = false;
      }
    };

    Pointer.prototype.deactivate = function deactivate() {
      this.delta.zero();
      this._activated = false;
    };

    Pointer.prototype.activated = function activated() {
      return this._activated;
    };

    Pointer.prototype.pressed = function pressed() {
      return this._pressed;
    };

    Pointer.prototype.swiped = function swiped() {
      return this._swiped;
    };

    return Pointer;
  }();

  // iOS decelerationRate = normal
  var DECELERATION_RATE = 325;

  function noop() {}

  function activated(pointer) {
    return pointer.activated();
  }

  function pressed(pointer) {
    return pointer.pressed();
  }

  function alive(pointer) {
    return pointer.activated() || pointer.pressed();
  }

  function swiped(pointer) {
    return pointer.swiped();
  }

  var mouseEventId = -1;

  var Kinetic = function () {
    Kinetic.spawn = function spawn(kinetic) {
      Kinetic.instances.push(kinetic);
      kinetic.handleEvents();
    };

    Kinetic.kill = function kill(kinetic) {
      var idx = Kinetic.instances.indexOf(kinetic);
      if (idx !== -1) {
        Kinetic.instances.splice(idx, 1);
        kinetic.unhandleEvents();
      }
    };

    Kinetic.notify = function notify(time) {
      for (var i = 0, kinetic; i < Kinetic.instances.length; i++) {
        kinetic = Kinetic.instances[i];
        kinetic.track(time);
        kinetic.notify();
        kinetic.deactivate();
        kinetic.swipe(time);
        kinetic.collect();
        kinetic.check();
      }
    };

    Kinetic.position = function position(e) {
      return new vectory(Kinetic.clientX(e), Kinetic.clientY(e));
    };

    Kinetic.clientX = function clientX(e) {
      return e.clientX;
    };

    Kinetic.clientY = function clientY(e) {
      return e.clientY;
    };

    function Kinetic(_ref) {
      var el = _ref.el;
      var velocityThreshold = _ref.velocityThreshold;
      var amplitudeFactor = _ref.amplitudeFactor;
      var deltaThreshold = _ref.deltaThreshold;
      var movingAvarageFilter = _ref.movingAvarageFilter;
      var ondragstart = _ref.ondragstart;
      var ondragmove = _ref.ondragmove;
      var ondragend = _ref.ondragend;
      var onswipestart = _ref.onswipestart;
      var onswipeend = _ref.onswipeend;
      classCallCheck(this, Kinetic);

      this.el = el;
      this.velocityThreshold = velocityThreshold || Kinetic.VELOCITY_THRESHOLD;
      this.amplitudeFactor = amplitudeFactor || Kinetic.AMPLITUDE_FACTOR;
      this.deltaThreshold = deltaThreshold || Kinetic.DELTA_THRESHOLD;
      this.movingAvarageFilter = movingAvarageFilter || Kinetic.MOVING_AVARAGE_FILTER;

      this.ondragstart = ondragstart || noop;
      this.ondragmove = ondragmove || noop;
      this.ondragend = ondragend || noop;
      this.onswipestart = onswipestart || noop;
      this.onswipeend = onswipeend || noop;

      this.pointers = [];
      this.events = [];

      this._swiped = false;
      this._offset = new vectory(0, 0);
    }

    Kinetic.prototype.subscribe = function subscribe(handler) {
      this.events.push(handler);
    };

    Kinetic.prototype.unsubscribe = function unsubscribe(handler) {
      var idx = this.events.indexOf(handler);
      if (idx !== -1) {
        this.events.splice(idx, 1);
      }
    };

    Kinetic.prototype.track = function track(time) {
      for (var i = 0; i < this.pointers.length; i++) {
        var pointer = this.pointers[i];
        if (pointer.pressed()) {
          pointer.track(time, this.movingAvarageFilter);
        }
      }
    };

    Kinetic.prototype.notify = function notify() {
      for (var i = 0; i < this.events.length; i++) {
        var pointers = this.pointers.filter(activated);
        if (pointers.length) {
          this.events[i](pointers);
        }
      }
    };

    Kinetic.prototype.deactivate = function deactivate() {
      for (var i = 0; i < this.pointers.length; i++) {
        this.pointers[i].deactivate();
      }
    };

    Kinetic.prototype.swipe = function swipe(time) {
      for (var i = 0; i < this.pointers.length; i++) {
        var pointer = this.pointers[i];
        if (pointer.swiped()) {
          pointer.swipe(time, DECELERATION_RATE, this.deltaThreshold);
        }
      }
    };

    Kinetic.prototype.collect = function collect() {
      this.pointers = this.pointers.filter(alive);
    };

    Kinetic.prototype.check = function check() {
      if (!this._swiped) {
        if (this.pointers.filter(swiped).length) {
          this._swiped = true;
          this.onswipestart();
        }
      } else {
        if (!this.pointers.filter(swiped).length) {
          this._swiped = false;
          this.onswipeend();
        }
      }
    };

    Kinetic.prototype.find = function find(id) {
      var result = null;
      for (var i = 0; i < this.pointers.length; i++) {
        var pointer = this.pointers[i];
        if (pointer.id === id) {
          result = pointer;
        }
      }
      if (!result) {
        if (this.pointers.length === 1 && this.pointers[0].swiped()) {
          result = this.pointers[0];
          result.id = id;
        }
      }
      return result;
    };

    Kinetic.prototype.add = function add(pointer) {
      this.pointers.push(pointer);
    };

    Kinetic.prototype.handleEvents = function handleEvents() {
      if (window.PointerEvent) {
        this.el.addEventListener('pointerdown', this, true);
        this.el.addEventListener('pointermove', this, true);
        this.el.addEventListener('pointerup', this, true);
        this.el.addEventListener('pointercancel', this, true);
      } else {
        this.el.addEventListener('mousedown', this, true);
        this.el.addEventListener('touchstart', this, true);
        this.el.addEventListener('touchmove', this, true);
        this.el.addEventListener('touchend', this, true);
        this.el.addEventListener('touchcancel', this, true);
      }
    };

    Kinetic.prototype.unhandleEvents = function unhandleEvents() {
      if (window.PointerEvent) {
        this.el.removeEventListener('pointerdown', this, true);
        this.el.removeEventListener('pointermove', this, true);
        this.el.removeEventListener('pointerup', this, true);
        this.el.removeEventListener('pointercancel', this, true);
      } else {
        this.el.removeEventListener('mousedown', this, true);
        this.el.removeEventListener('touchstart', this, true);
        this.el.removeEventListener('touchmove', this, true);
        this.el.removeEventListener('touchend', this, true);
        this.el.removeEventListener('touchcancel', this, true);
      }
    };

    Kinetic.prototype.handleEvent = function handleEvent(e) {
      e.preventDefault();
      switch (e.type) {
        case 'pointerdown':
        case 'mousedown':
          {
            this._mousedownHandler(e);
            break;
          }
        case 'mousemove':
        case 'pointermove':
          {
            this._mousemoveHandler(e);
            break;
          }
        case 'mouseup':
        case 'pointerup':
        case 'pointercancel':
          {
            this._mouseupHandler(e);
            break;
          }
        case 'touchstart':
          {
            this._touchstartHandler(e);
            break;
          }
        case 'touchmove':
          {
            this._touchmoveHandler(e);
            break;
          }
        case 'touchend':
        case 'touchcancel':
          {
            this._touchendHandler(e);
            break;
          }
      }
    };

    Kinetic.prototype.getId = function getId(e) {
      if (e.pointerId != null) {
        return e.pointerId;
      } else if (e.identifier) {
        return e.identifier;
      } else {
        return mouseEventId;
      }
    };

    Kinetic.prototype.tap = function tap(e) {
      var clientRect = this.el.getBoundingClientRect();
      this._offset = new vectory(clientRect.left, clientRect.top);

      var id = this.getId(e);
      var pointer = this.find(id);
      if (!pointer) {
        pointer = new Pointer({ id: id });
        this.add(pointer);
      }
      pointer.tap(Kinetic.position(e).isub(this._offset));

      this.ondragstart();
    };

    Kinetic.prototype.drag = function drag(e) {
      var position = Kinetic.position(e).isub(this._offset);
      var id = this.getId(e);
      var pointer = this.find(id);
      pointer.drag(position);

      this.ondragmove();
    };

    Kinetic.prototype.release = function release(e) {
      var id = this.getId(e);
      var pointer = this.find(id);
      pointer.launch(this.velocityThreshold, this.amplitudeFactor);

      this.ondragend();
    };

    Kinetic.prototype._mousedownHandler = function _mousedownHandler(e) {
      if (window.PointerEvent) {
        e.target.setPointerCapture(e.pointerId);
      } else {
        document.addEventListener('mousemove', this, true);
        document.addEventListener('mouseup', this, true);
      }

      this.tap(e);
    };

    Kinetic.prototype._mousemoveHandler = function _mousemoveHandler(e) {
      if (e.type === 'mousemove' || this.pointers.filter(pressed).length) {
        this.drag(e);
      }
    };

    Kinetic.prototype._mouseupHandler = function _mouseupHandler(e) {
      if (window.PointerEvent) {
        e.target.releasePointerCapture(e.pointerId);
      } else {
        document.removeEventListener('mousemove', this, true);
        document.removeEventListener('mouseup', this, true);
      }

      this.release(e);
    };

    Kinetic.prototype._touchstartHandler = function _touchstartHandler(e) {
      for (var i = 0; i < e.changedTouches.length; i++) {
        this.tap(e.changedTouches[i]);
      }
    };

    Kinetic.prototype._touchmoveHandler = function _touchmoveHandler(e) {
      for (var i = 0; i < e.targetTouches.length; i++) {
        this.drag(e.targetTouches[i]);
      }
    };

    Kinetic.prototype._touchendHandler = function _touchendHandler(e) {
      for (var i = 0; i < e.changedTouches.length; i++) {
        this.release(e.changedTouches[i]);
      }
    };

    return Kinetic;
  }();

  Kinetic.Vector = vectory;

  Kinetic.VELOCITY_THRESHOLD = 10;
  Kinetic.AMPLITUDE_FACTOR = 0.8;
  Kinetic.DELTA_THRESHOLD = 0.5;
  Kinetic.MOVING_AVARAGE_FILTER = 200;

  Kinetic.instances = [];

  return Kinetic;
});
});

// -------------------------------------
// Easing
// -------------------------------------

// inspired [here](https://github.com/nnnick/Chart.js/blob/master/src/Chart.Core.js#L538)

function linear(t) {
  return t;
}

function easeInQuad(t) {
  return t * t;
}

function easeOutQuad(t) {
  return -1 * t * (t - 2);
}

function easeInOutQuad(t) {
  if ((t /= 1 / 2) < 1) {
    return 1 / 2 * t * t;
  }
  return -1 / 2 * (--t * (t - 2) - 1);
}

function easeInCubic(t) {
  return t * t * t;
}

function easeOutCubic(t) {
  return 1 * ((t = t / 1 - 1) * t * t + 1);
}

function easeInOutCubic(t) {
  if ((t /= 1 / 2) < 1) {
    return 1 / 2 * t * t * t;
  }
  return 1 / 2 * ((t -= 2) * t * t + 2);
}

function easeInSine(t) {
  return -1 * Math.cos(t / 1 * (Math.PI / 2)) + 1;
}

function easeOutSine(t) {
  return 1 * Math.sin(t / 1 * (Math.PI / 2));
}

function easeInOutSine(t) {
  return -1 / 2 * (Math.cos(Math.PI * t / 1) - 1);
}

function easeInExpo(t) {
  return t === 0 ? 1 : 1 * Math.pow(2, 10 * (t / 1 - 1));
}

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 * (-Math.pow(2, -10 * t / 1) + 1);
}

function easeInOutExpo(t) {
  if (t === 0) {
    return 0;
  }
  if (t === 1) {
    return 1;
  }
  if ((t /= 1 / 2) < 1) {
    return 1 / 2 * Math.pow(2, 10 * (t - 1));
  }
  return 1 / 2 * (-Math.pow(2, -10 * --t) + 2);
}

function easeInCirc(t) {
  if (t >= 1) {
    return t;
  }
  return -1 * (Math.sqrt(1 - (t /= 1) * t) - 1);
}

function easeOutCirc(t) {
  return 1 * Math.sqrt(1 - (t = t / 1 - 1) * t);
}

function easeInOutCirc(t) {
  if ((t /= 1 / 2) < 1) {
    return -1 / 2 * (Math.sqrt(1 - t * t) - 1);
  }
  return 1 / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1);
}

function easeInElastic(t) {
  var s = 1.70158;
  var p = 0;
  var a = 1;
  if (t === 0) {
    return 0;
  }
  if ((t /= 1) === 1) {
    return 1;
  }
  if (!p) {
    p = 1 * 0.3;
  }
  if (a < Math.abs(1)) {
    a = 1;
    s = p / 4;
  } else {
    s = p / (2 * Math.PI) * Math.asin(1 / a);
  }
  return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));
}

function easeOutElastic(t) {
  var s = 1.70158;
  var p = 0;
  var a = 1;
  if (t === 0) {
    return 0;
  }
  if ((t /= 1) === 1) {
    return 1;
  }
  if (!p) {
    p = 1 * 0.3;
  }
  if (a < Math.abs(1)) {
    a = 1;
    s = p / 4;
  } else {
    s = p / (2 * Math.PI) * Math.asin(1 / a);
  }
  return a * Math.pow(2, -10 * t) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) + 1;
}

function easeInOutElastic(t) {
  var s = 1.70158;
  var p = 0;
  var a = 1;
  if (t === 0) {
    return 0;
  }
  if ((t /= 1 / 2) === 2) {
    return 1;
  }
  if (!p) {
    p = 1 * (0.3 * 1.5);
  }
  if (a < Math.abs(1)) {
    a = 1;
    s = p / 4;
  } else {
    s = p / (2 * Math.PI) * Math.asin(1 / a);
  }
  if (t < 1) {
    return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));
  }
  return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) * 0.5 + 1;
}

function easeInBack(t) {
  var s = 1.70158;
  return 1 * (t /= 1) * t * ((s + 1) * t - s);
}

function easeOutBack(t) {
  var s = 1.70158;
  return 1 * ((t = t / 1 - 1) * t * ((s + 1) * t + s) + 1);
}

function easeInOutBack(t) {
  var s = 1.70158;
  if ((t /= 1 / 2) < 1) {
    return 1 / 2 * (t * t * (((s *= 1.525) + 1) * t - s));
  }
  return 1 / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2);
}

function easeInBounce(t) {
  return 1 - easeOutBounce(1 - t);
}

function easeOutBounce(t) {
  if ((t /= 1) < 1 / 2.75) {
    return 1 * (7.5625 * t * t);
  } else if (t < 2 / 2.75) {
    return 1 * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75);
  } else if (t < 2.5 / 2.75) {
    return 1 * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375);
  } else {
    return 1 * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375);
  }
}

function easeInOutBounce(t) {
  if (t < 1 / 2) {
    return easeInBounce(t * 2) * 0.5;
  }
  return easeOutBounce(t * 2 - 1) * 0.5 + 1 * 0.5;
}



var Easing = Object.freeze({
	linear: linear,
	easeInQuad: easeInQuad,
	easeOutQuad: easeOutQuad,
	easeInOutQuad: easeInOutQuad,
	easeInCubic: easeInCubic,
	easeOutCubic: easeOutCubic,
	easeInOutCubic: easeInOutCubic,
	easeInSine: easeInSine,
	easeOutSine: easeOutSine,
	easeInOutSine: easeInOutSine,
	easeInExpo: easeInExpo,
	easeOutExpo: easeOutExpo,
	easeInOutExpo: easeInOutExpo,
	easeInCirc: easeInCirc,
	easeOutCirc: easeOutCirc,
	easeInOutCirc: easeInOutCirc,
	easeInElastic: easeInElastic,
	easeOutElastic: easeOutElastic,
	easeInOutElastic: easeInOutElastic,
	easeInBack: easeInBack,
	easeOutBack: easeOutBack,
	easeInOutBack: easeInOutBack,
	easeInBounce: easeInBounce,
	easeOutBounce: easeOutBounce,
	easeInOutBounce: easeInOutBounce
});

renderium.CanvasLayer.prototype.drawArea = function (_ref) {
  var points = _ref.points,
      threshold = _ref.threshold,
      color = _ref.color,
      fillColor = _ref.fillColor,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? 1 : _ref$width;

  this.ctx.lineJoin = 'round';

  this.drawPolyline({
    points: points,
    color: color,
    width: width
  });

  this.ctx.fillStyle = this.getColor(fillColor);

  this.ctx.lineTo(points[points.length - 1].x, threshold);
  this.ctx.lineTo(points[0].x, threshold);
  this.ctx.closePath();
  this.ctx.fill();

  this.ctx.lineJoin = 'miter';
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};











var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Engine = function (_Renderium) {
  inherits(Engine, _Renderium);

  Engine.spawn = function spawn(engine) {
    _Renderium.spawn.call(this, engine);
    kinetic.spawn(engine.kinetic);
  };

  Engine.kill = function kill(engine) {
    _Renderium.kill.call(this, engine);
    kinetic.kill(engine.kinetic);
  };

  Engine.digest = function digest(t) {
    dynamica.animate(t);
    kinetic.notify(t);
    _Renderium.digest.call(this, t);
  };

  function Engine(_ref) {
    var el = _ref.el;
    classCallCheck(this, Engine);

    var _this = possibleConstructorReturn(this, _Renderium.call(this, { el: el }));

    _this.kinetic = new kinetic({ el: el });
    return _this;
  }

  return Engine;
}(renderium);

Engine.Vector = window.Vector = vectory;
Engine.Animation = dynamica;
Engine.Kinetic = kinetic;
Engine.Easing = Easing;

return Engine;

})));
