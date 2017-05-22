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



      var _data;
      if (eElem._data && eElem._data.length > 0) {
          _data = eElem._data;
      } else if (eElem._group) {
          //excepted to be as data directly retrieved.
          //TODO: transform
          _data = eElem._group.all();
          _data = eElem._transformFunc(_data, eElem._colors);
      }
      var getKeys = function (mydata) {
          var keysOne = [];
          var keysTwo = [];
          for (var i = 0; i < mydata.length; i++) {
              if (keysOne.indexOf(mydata[i].key1) === -1) keysOne.push(mydata[i].key1);
              if (keysTwo.indexOf(mydata[i].key2) === -1) keysTwo.push(mydata[i].key2);

          };
          return { keysOne: keysOne, keysTwo: keysTwo };
      }
      var dataKeys = getKeys(_data);
      //storing keys
      this._datakeys = dataKeys;
      var relativeX, relativeY, relativeZ;
        
        
      
      var MAX_HEIGHT = componentData.height;

      var MAX_VALUE = Math.max.apply(null, _data.map(function (d) { return d.value; }));
      this.max_value = MAX_VALUE;
      var MAX_RADIUS_VALUE = Math.max.apply(null, _data.map(function (d) { return d.value2; }));
      var MAX_RADIUS = Math.min(componentData.width, componentData.height, componentData.depth) / Math.min(dataKeys.keysOne.length, dataKeys.keysTwo.length);
      var zStep = (componentData.depth) / dataKeys.keysTwo.length;
      var xStep = (componentData.width) / dataKeys.keysOne.length;
      relativeX = 0 ;
      relativeY = MAX_RADIUS;
      relativeZ = -MAX_RADIUS / 2;
      //we define default colors if not defined.
      if (!this.el._colors) {
          this.el._colors = [];
          for (var c = 0; c < dataKeys.keysTwo.length; c++) {
              this.el._colors.push({ key: dataKeys.keysTwo[c], value: utils.colors[c % utils.colors.length] })
          }
      }
      var indexOfData = 0;
      for (var i = 0; i < dataKeys.keysOne.length; i++) {
          for (var j = 0; j < dataKeys.keysTwo.length; j++) {
              var element = _data[indexOfData];
              if (element.value !== 0 || element.value2 !== 0) {
                  //drawing element.
                  //we need to scale every item. be careful with this.
                  var ypos = (element.value / MAX_VALUE) * MAX_HEIGHT;
                  var actualColor = eElem._colors.find(function (a) { return a.key === _data[indexOfData].key2 }).value;
                  var radius = (element.value2 / MAX_RADIUS_VALUE) * MAX_RADIUS;
                  var elPos = { x: relativeX, y: ypos , z: relativeZ };
                  var el = document.createElement('a-entity');

                  el.setAttribute("geometry",{primitive:"sphere", radius: radius});
                  el.setAttribute("material", { transparent: true, opacity: 0.4, color: actualColor });
                  el.setAttribute('position', elPos);
                  eElem.appendChild(el);

                  //events.
                  var valuePart = element.value + " " + element.value2.toFixed(2) ;
                  if (eElem._valueHandler)
                      valuePart = eElem._valueHandler(element );
                  var keyPart = element.key1 + " " + element.key2;
                  if (eElem._keyHandler) {
                      keyPart = eElem._keyHandler(element);
                  }
                  //storing parts info..
                  var barPart = {
                      name: "key:" + keyPart + " value:" + valuePart,
                      data: {
                          key1: element.key1,
                          key2: element.key2,
                          value: element.value,
                          value2: element.value2
                      },
                      position: { x: elPos.x, y:  MAX_HEIGHT + 0.25, z: elPos.z },
                      origin_color: actualColor
                  };
                  el._partData = barPart;
                  var myFunc = function (chart, element) {

                      if (chart.el._dimension) {
                          var myDim = chart.el._dimension;
                          myDim.filterAll(null);
                          myDim = myDim.filter(element.data.key1);
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
              relativeZ = relativeZ - zStep;
              indexOfData++;
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
          zsteps: this._datakeys.keysTwo.length
      });


      var gridEntityXZ = document.createElement('a-entity');
      gridEntityXZ.setAttribute('aframe-gridxz', {
          width: this.data.width,
          depth: this.data.depth,
          xsteps: this.data.xsteps,
          zsteps: this._datakeys.keysTwo.length
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

      topYValue = this.max_value;
      numberOfValues = this._datakeys.keysOne.length;
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
      var getZLabel = function (component, step, labelkv) {
          var curveSeg = 3;
          var texto = document.createElement("a-entity");
          TEXT_WIDTH = 6;
          //FIXME: depende del tamaño de letra...
          var xPos = -1 * ((TEXT_WIDTH / 2) + 0.7);
          var zPos = -step;
          //todo: it must be optional
          var actualColor = component.el._colors.find(function (d) { return d.key === labelkv; }).value;
          texto.setAttribute("text", {
              color: actualColor,
              side: "double",
              value: labelkv,
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

      var stepZ = this.data.depth / this._datakeys.keysTwo.length;
      var labels = [];
      for (var i = 0; i < this._datakeys.keysTwo.length; i++) {
          labels.push(getZLabel(this, i * stepZ + stepZ / 2, this._datakeys.keysTwo[i]));
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
