/* global AFRAME */
require("../aframe-grid/index.js")
require("../aframe-gridxz/index.js")
require("../aframe-gridyz/index.js")
require("../title/index.js")
var utils = require("../../basefunctions.js")
if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Bubblechart component for A-Frame.
 */
AFRAME.registerComponent('bubblechart', {
    schema: {
        gridson: { default: true },
        xsteps: { default: 5 },
        ysteps: { default: 5 },
        zsteps: { default: 10 },
        width: { default: 10 },
        height: { default: 10 },
        depth: { default: 20 },
        color: { default: '#00FF00' },
        title: { default: "" }
    },

  /**
   * Set if component needs multiple instancing.
   */
  multiple: false,

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  onDataLoaded: utils.onDataLoaded,
  init: utils.default_init,
  update: utils.default_update,
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
      //var __calculateY = function (initialY, height) {
      //    var returnedY = height / 2 + initialY;
      //    return returnedY;
      //};


      var _data;
      if (eElem._data && eElem._data.length > 0) {
          _data = eElem._data;
      } else if (eElem._group) {
          _data = eElem._group.all();
      }
      var relativeX, relativeY, relativeZ;
        
        
      var BAR_DEPTH = componentData.depth;
      var MAX_HEIGHT = componentData.height;
      //using value and height accessor to retrieve max's
      var arrays = _data.map(function (p) {
          var myp = p;
          return eElem._arrAccesor(p).map(function (o) {
              return eElem._heightAccesor(o, myp);
          });
      });
      var MAX_VALUE = Math.max.apply(null, ([].concat.apply([], arrays)));
      arrays = _data.map(function (p) {
          var myp = p;
          return eElem._arrAccesor(p).map(function (o) {
              return eElem._radiusAccesor(o, myp);
          });
      });
      var MAX_RADIUS_VALUE = Math.max.apply(null, ([].concat.apply([], arrays)));
      var zAxis = eElem._zAxis;
      if (!zAxis) {
          //calculate axis data.
          //TODO:
      }
      var MAX_RADIUS = Math.min(componentData.width,componentData.height ,componentData.depth)  / Math.min(_data.length, zAxis.length);
      var zStep = (componentData.depth) / zAxis.length;
      var xStep = (componentData.width )/ _data.length;
      relativeX = 0 ;
      relativeY = MAX_RADIUS;
      relativeZ = -MAX_RADIUS/2  ;
      for (var i = 0; i < _data.length; i++) {
          for (var j = 0; j < zAxis.length; j++) {
              var Axiskey = zAxis[j];
              var datavalue = _data[i];
              var findkey = function (k) {
                  if (!k.key) return;
                  return k.key === Axiskey.key;
              }
              var element = eElem._arrAccesor(datavalue).find(findkey);
              if (element) {
                  //drawing element.
                  //we need to scale every item. be careful with this.
                  var ypos = (eElem._heightAccesor(element,datavalue) / MAX_VALUE) * MAX_HEIGHT;
                  var actualColor = Axiskey.value;
                  var radius = (eElem._radiusAccesor(element, datavalue) / MAX_RADIUS_VALUE) * MAX_RADIUS;
                  var elPos = { x: relativeX, y: ypos , z: relativeZ };
                  var el = document.createElement('a-entity');

                  el.setAttribute("mixin", "sph transparente");
                  el.setAttribute("geometry",'radius', radius);
                  el.setAttribute("material",'color', actualColor);
                  el.setAttribute('position', elPos);
                  //el.setAttribute("opacity", 0.5);
                  //el.setAttribute("transparent", true);
                  eElem.appendChild(el);

                  //events.
                  var valuePart = _data[i].value;
                  if (eElem._valueHandler)
                      valuePart = eElem._valueHandler(element, datavalue);
                  var keyPart = _data[i].key;
                  if (eElem._keyHandler) {
                      keyPart = eElem._keyHandler(datavalue);
                  }
                  //storing parts info..
                  var barPart = {
                      name: "key:" + keyPart + " value:" + valuePart,
                      data: {
                          key: _data[i].key,
                          value: valuePart
                      },
                      position: { x: elPos.x, y: relativeY + MAX_HEIGHT + 0.25, z: elPos.z },
                      origin_color: actualColor
                  };
                  el._partData = barPart;
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
                      }
                      //exp.
                      chart.el.emit("filtered", { element: element });
                  };
                  var myBindFunc = myFunc.bind(null, this, el._partData);
                  el.addEventListener("click", myBindFunc);
                  //exp.
                  //chart.el.emit("filtered", { element: element });
              }
              relativeZ =relativeZ- zStep;
          }
          relativeZ = -MAX_RADIUS / 2;
          relativeX += xStep;
      }
      this.addEvents();
      var entLabels = this.addYLabels();
      for (var lb = 0 ; lb < entLabels.length; lb++) {
          eElem.appendChild(entLabels[lb]);
      }
      var zlabels = this.addZLabels();
      for (var lb = 0 ; lb < zlabels.length; lb++) {
          eElem.appendChild(zlabels[lb]);
      }
      if (componentData.gridson) {
          this.addGrid();
      }
      if (componentData.title !== "") {
          this.addTitle();
      }
  },
  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  addGrid: function () {
      var gridEntity = document.createElement('a-entity');
      gridEntity.setAttribute('aframe-grid', {
          height: this.data.height,
          width: this.data.width,
          ysteps: this.data.ysteps,
          xsteps: this.data.xsteps
      });
      gridEntity.setAttribute("position", { x: 0, y: 0, z: -this.data.depth });
      this.el.appendChild(gridEntity);

      var gridEntityZY = document.createElement('a-entity');
      gridEntityZY.setAttribute('aframe-gridyz', {
          height: this.data.height,
          depth: this.data.depth,
          ysteps: this.data.ysteps,
          zsteps: this.el._zAxis.length
      });


      var gridEntityXZ = document.createElement('a-entity');
      gridEntityXZ.setAttribute('aframe-gridxz', {
          width: this.data.width,
          depth: this.data.depth,
          xsteps: this.data.xsteps,
          zsteps: this.el._zAxis.length
      });
      this.el.appendChild(gridEntityZY);
      this.el.appendChild(gridEntityXZ);
  }, addYLabels: function () {
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
          var labelpos = { x: xPos, y: yPos, z: -component.data.depth };
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
      //using value and height accessor to retrieve max's
      var arrays = _data.map(function (p) {
          var myp = p;
          return eElem._arrAccesor(p).map(function (o) {
              return eElem._heightAccesor(o, myp);
          });
      });
      topYValue = Math.max.apply(null, ([].concat.apply([], arrays)));
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
  addZLabels: function () {
      if (!this.el._zAxis) return;
      var getZLabel = function (component, step, labelkv) {
          var curveSeg = 3;
          var texto = document.createElement("a-entity");
          TEXT_WIDTH = 6;
          //FIXME: depende del tamaño de letra...
          var xPos = -1 * ((TEXT_WIDTH / 2) + 0.7);
          //var yPos = BasicChart._coords.y + step +  0.36778332145402703 / 2;
          var zPos = -step;
          texto.setAttribute("text", {
              color: labelkv.value,
              side: "double",
              value: labelkv.key,
              width: TEXT_WIDTH,
              wrapCount: 30,
              align: "right"
          });
          //texto.setAttribute('geometry', { primitive: 'plane', width: 'auto', height: 'auto' });
          // Positions the text and adds it to the THREEDC.scene
          var labelpos = { x: xPos, y: 0, z: zPos };
          texto.setAttribute('position', labelpos);
          return texto;
      }

      var stepZ = this.data.depth / this.el._zAxis.length;
      var labels = [];
      for (var i = 0; i < this.el._zAxis.length; i++) {
          labels.push(getZLabel(this, i * stepZ + stepZ / 2, this.el._zAxis[i]));
      };

      return labels;
  },
  addTitle: utils.addTitle,
  addEvents: utils.addEvents,
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
