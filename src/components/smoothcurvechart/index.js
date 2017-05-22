/* global AFRAME */
require("../aframe-grid/index.js")
require("../title/index.js")
var utils = require("../../basefunctions.js")
if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Smoothcurvechart component for A-Frame.
 */
AFRAME.registerComponent('smoothcurvechart', {
    schema: {
        gridson: { default: true },
        xsteps: { default: 5 },
        ysteps: { default: 5 },
        width: { default: 10 },
        height: { default: 10 },
        depth: { default: 0.5 },
        color: { default: '#00FF00' },
        title: {default:""},
        src: { type: 'asset', default: 'https://rawgit.com/fran-aguilar/a-framedc/master/examples/data/lib/scm-commits-filtered.json' }
    },
    onDataLoaded: utils.onDataLoaded,
  

  /**
   * Set if component needs multiple instancing.
   */
  multiple: false,

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: utils.default_init,

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: utils.default_update,
  initChart: function () {
      var eElem = this.el;
      var componentData = this.data;

      var eElem = this.el;
      var componentData = this.data;
      if ((!eElem._data || eElem._data.length === 0) &&
         !eElem._group) return;
      var __calculateY = function (initialY, height) {
          var returnedY = height / 2 + initialY;
          return returnedY;
      };
      var scale = function () {
          var max;
          var p = [];
          max = Math.max.apply(null, arguments);
          for (var i = 0 ; i < arguments.length; i++) {
              p.push((arguments[i] / max));
          }
          return p;
      };
      var _data;
      if (eElem._data && eElem._data.length > 0) {
          _data = eElem._data;
      } else if (eElem._group) {
          _data = eElem.sortCFData();
      }
      var dataValues = _data.map(function (a) { return a.value; });;

      COLORS = ['#2338D9', '#23A2D9', '#23D978', '#BAD923', '#D923D3'];
      var yMaxPoint = 0;
      dataValues = scale.apply(null, dataValues);

      var step = componentData.width / dataValues.length;
      var x = 0;
      var material = new THREE.LineBasicMaterial({
          color: this.data.color
      });
      var curve, vertices = [];


      for (var i = 0; i < dataValues.length; i++) {
          var point = document.createElement('a-sphere');
          //point.setAttribute('width', 0.4);
          //point.setAttribute('height', 0.4);
          //point.setAttribute('depth', 0.4);
          point.setAttribute('radius', 0.2);
          point.setAttribute("color", componentData.color);
          vertices.push(
           new THREE.Vector3(x, (componentData.height * dataValues[i]), 0)
         );
          point.setAttribute("position", { x: x, y: (componentData.height * dataValues[i]), z: 0.2 });
          //eElem.appendChild(point);
          //storing parts info..
          var boxPart = {
              name: "key:" + _data[i].key + " value:" + _data[i].value,
              data: {
                  key: _data[i].key,
                  value: _data[i].value
              },
              position: { x: x, y: componentData.height + 0.25, z: 0 },
              origin_color: componentData.color
          };
          point._partData = boxPart;

          x += step;


      };

      curve = new THREE.CatmullRomCurve3(vertices);

      var geometry = new THREE.Geometry();
      geometry.vertices = curve.getPoints(512);
      var curveObject = new THREE.Line(geometry, material);
      eElem.setObject3D('mesh', curveObject);
      this.addEvents();
      if (componentData.gridson) {
          this.addGrid();
      }
      var entLabels = this.addYLabels();
      for (var lb = 0 ; lb < entLabels.length; lb++) {
          eElem.appendChild(entLabels[lb]);
      }
      if (componentData.title !== "") {
          this.addTitle();
      }

  },
  addGrid: function (entityEl) {
      var gridEntity = document.createElement('a-entity');
      gridEntity.setAttribute('aframe-grid', {
          height: this.data.height,
          width: this.data.width,
          ysteps: this.data.ysteps,
          xsteps: this.data.xsteps
      });
      gridEntity.setAttribute("position", { x: 0, y: 0, z: -this.data.depth / 2 });
      this.el.appendChild(gridEntity);
  },
  addTitle: utils.addTitle,
  addEvents: utils.addEvents,
  addYLabels: function () {
      var numberOfValues;
      var topYValue;
      var getYLabel = function (component, step, value) {

          var txt = value;
          var curveSeg = 3;
          var texto = document.createElement("a-entity");
          TEXT_WIDTH = 6;
          //FIXME: depende del tamaño de letra...
          var xPos = -0.7;
          //var yPos = BasicChart._coords.y + step +  0.36778332145402703 / 2;
          var yPos = step;
          texto.setAttribute("text", {
              color: "#000000",
              side: "double",
              value: value.toFixed(2),
              width: TEXT_WIDTH,
              wrapCount: 30,
              align: "center"
          });
          //texto.setAttribute('geometry', { primitive: 'plane', width: 'auto', height: 'auto' });
          // Positions the text and adds it to the THREEDC.scene
          var labelpos = { x: xPos, y: yPos, z: -component.data.depth / 2 };
          texto.setAttribute('position', labelpos);
          return texto;
      }
      var _data;
      var eElem = this.el;
      if (this.el._data) {
          _data = this.el._data;
      } else {
          _data = this.el._group.top(Infinity);
      }
      var dataValues = _data.map(function (a) {
          if (eElem._valueHandler) {
              return eElem._valueHandler(a);
          }
          return a.value;
      });
      topYValue = Math.max.apply(null, dataValues);
      numberOfValues = dataValues.length;
      //Y AXIS
      var stepYValue = topYValue / this.data.ysteps;
      var stepY = this.data.height / this.data.ysteps;
      var labels = [];
      for (var i = 0; i < this.data.ysteps + 1; i++) {
          labels.push(getYLabel(this, i * stepY, i * stepYValue));
      };

      return labels;
  },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () {
      while (this.el.firstChild) {
          this.el.removeChild(this.el.firstChild);
      }
      this.el.innerHTML = "";
      this.el.removeEventListener('data-loaded', this.onDataLoaded.bind(this));

  },

  /**
   * Called on each scene tick.
   */
  // tick: function (t) { },

  /**
   * Called when entity pauses.
   * Use to stop or remove any dynamic or background behavior such as events.
   */
  pause: function () { },

  /**
   * Called when entity resumes.
   * Use to continue or add any dynamic or background behavior such as events.
   */
  play: function () { }
});
