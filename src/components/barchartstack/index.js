/* global AFRAME */
require("../aframe-grid/index.js")
require("../title/index.js")
var utils = require("../../basefunctions.js")
if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Barchartstack component for A-Frame.
 */
AFRAME.registerComponent('barchartstack', {
    schema: {
        gridson: { default: true },
        xsteps: { default: 5 },
        ysteps: { default: 5 },
        width: { default: 10 },
        height: { default: 10 },
        depth: { default: 0.5 },
        color: { default: '#00FF00' },
        title: { default: "" }
    },

  /**
   * Set if component needs multiple instancing.
   */
  multiple: false,
  onDataLoaded: utils.onDataLoaded,
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
      if ((!eElem._data || eElem._data.length === 0) &&
         !eElem._group) return;
      var __calculateY = function (initialY, height) {
          var returnedY = height / 2 + initialY;
          return returnedY;
      };


      var _data;
      if (eElem._data && eElem._data.length > 0) {
          _data = eElem._data;
      } else if (eElem._group) {
          _data = eElem._group.all();
      }

      BAR_WIDTH = componentData.width / _data.length;;
      BAR_DEPTH = componentData.depth;
      MAX_HEIGHT = componentData.height;
      MAX_VALUE = eElem._maxfunc(eElem._group.order(eElem._maxfunc).top(1)[0].value);
      var entityEl = document.createElement('a-entity');
      var yMaxPoint = 0;

      var relativeX, relativeY, relativeZ;
      relativeX = BAR_WIDTH / 2;
      relativeY = 0;
      relativeZ = componentData.depth / 2;

      for (var i = 0; i < _data.length; i++) {
          var sortedValues = _data[i].value.slice();
          sortedValues.sort(function (a, b) {
              if (a.value < b.value) {
                  return 1;
              }
              if (a.value > b.value) {
                  return -1;
              }
              // a must be equal to b
              return 0;
          });
          for (var j = 0 ; j < sortedValues.length; j++) {
              //we need to scale every item.
              var myHeight = (sortedValues[j].value / MAX_VALUE) * MAX_HEIGHT;

              var myYPosition = __calculateY(relativeY, myHeight);
              var el = document.createElement('a-box');
              var actualColor = eElem._colors.find(function (a) { return a.key === sortedValues[j].key }).value;
              var elPos = { x: relativeX, y: myYPosition, z: 0 };

              el.setAttribute('width', BAR_WIDTH);
              el.setAttribute('height', myHeight);
              el.setAttribute('depth', BAR_DEPTH);
              el.setAttribute('color', actualColor);
              el.setAttribute('position', elPos);


              var valuePart = _data[i].value;
              if (eElem._valueHandler)
                  valuePart = eElem._valueHandler(_data[i]);
              var keyPart = _data[i].key;
              if (eElem._keyHandler) {
                  keyPart = eElem._keyHandler(_data[i]);
              }
              //storing parts info..
              var barPart = {
                  name: "key:" + keyPart + " org:" + sortedValues[j].key + " value: " + sortedValues[j].value,
                  data: {
                      key: _data[i].key,
                      value: valuePart
                  },
                  position: { x: elPos.x, y: MAX_HEIGHT + 0.25, z: elPos.z + relativeZ },
                  origin_color: actualColor
              };
              el._partData = barPart;
              //getting max.
              eElem.appendChild(el);
              var myFunc = function (chart, element) {

                  if (chart.el._dimension) {
                      var myDim = chart.el._dimension;
                      myDim.filterAll(null);
                      myDim = myDim.filter(element.data.key);
                      //llamada a redibujado de todo..
                      var dashboard;
                      if (chart.el._dashboard)
                          dashboard = chart.el._dashboard;
                      else if (chart.el._panel)
                          dashboard = chart.el._panel._dashboard;

                      if (dashboard) {
                          //getting all charts
                          var charts = dashboard.allCharts();
                          for (var ch = 0 ; ch < charts.length; ch++) {
                              if (charts[ch] !== chart.el && charts[ch]._group) {
                                  charts[ch].emit("data-loaded");
                              }
                          }

                      } else {
                          var childs = chart.el.parentElement.children;
                          for (var ch = 0 ; ch < childs.length ; ch++) {
                              if (childs[ch] !== chart.el && childs[ch]._group) {
                                  childs[ch].emit("data-loaded");
                              }
                          }
                      }
                      //exp.
                      chart.el.emit("filtered", { element: element });
                  }
              };
              var myBindFunc = myFunc.bind(null, this, el._partData);
              el.addEventListener("click", myBindFunc);
              relativeY = relativeY + myHeight;
          }
          relativeY = 0;
          relativeX += BAR_WIDTH;

      }
      this.addEvents();
      if (eElem._colors) {
          this.addleyenda();
      }
      var entLabels = this.addYLabels();
      for (var lb = 0 ; lb < entLabels.length; lb++) {
          eElem.appendChild(entLabels[lb]);
      }
      if (componentData.gridson) {
          this.addGrid();
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

      topYValue = eElem._maxfunc(eElem._group.order(eElem._maxfunc).top(1)[0].value);
      numberOfValues = _data.length;
      //Y AXIS
      //var numerOfYLabels=Math.round(_chart._height/20);
      var stepYValue = topYValue / this.data.ysteps;
      var stepY = this.data.height / this.data.ysteps;
      var labels = [];
      for (var i = 0; i < this.data.ysteps + 1; i++) {
          labels.push(getYLabel(this, i * stepY, i * stepYValue));
      };

      return labels;
  },
  addleyenda: function () {
      var leyendaEntity = document.createElement("a-entity");
      leyendaEntity.id = "barchart3dleyend";
      var topValue= this.el._group.top(1)[0];
      var xPos = this.data.width +0.25 +1;
      var ystep = this.data.height -0.25;
      for (var i = 0; i < topValue.value.length; i++) {
          var actualColor = this.el._colors.find(function (a) { return a.key === topValue.value[i].key }).value;
          var colorbox = document.createElement("a-box");
          colorbox.setAttribute("color", actualColor);
          colorbox.setAttribute("width", 0.5);
          colorbox.setAttribute("height", 0.5);
          colorbox.setAttribute("depth", 0.5);
          colorbox.setAttribute('position', { x: xPos, y: ystep, z: 0 });
          var curveSeg = 3;
          var texto = document.createElement("a-entity");
          TEXT_WIDTH = 6;
          var txt = topValue.value[i].key;
          texto.setAttribute("text", {
              color: "#000000",
              side: "double",
              value: txt,
              width: TEXT_WIDTH,
              wrapCount: 30,
              align: "left"
          });
          //texto.setAttribute('geometry', { primitive: 'plane', width: 'auto', height: 'auto' });
          // Positions the text and adds it to the THREEDC.scene
          texto.setAttribute('position', { x: xPos + 1 + TEXT_WIDTH / 2, y: ystep, z: 0 });
          leyendaEntity.appendChild(texto);
          leyendaEntity.appendChild(colorbox);
          ystep -= 0.62;
      }
      this.el.appendChild(leyendaEntity);
  },
  remove: function () {
      while (this.el.firstChild) {
          this.el.removeChild(this.el.firstChild);
      }
      this.el.innerHTML = "";
      this.el.removeEventListener('data-loaded', this.onDataLoaded.bind(this));

  },
  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */

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
