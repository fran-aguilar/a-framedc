window["aframedc"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Title component for A-Frame.
 */
AFRAME.registerComponent('title', {
    schema: {
        caption: { default: "", type: "string" },
        width: { default: 7, type: "number" },
    },

  /**
   * Set if component needs multiple instancing.
   */
  multiple: false,

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function (oldData) {
      var data = this.data;
      var texto;

      texto = this.el;

      var TEXT_WIDTH = data.width;
      texto.setAttribute("text", {
          color: "#000000",
          side: "double",
          value: data.caption,
          align: "center",
          width: TEXT_WIDTH,
          wrapCount: 30
      });
      //var labelpos = { x: 0, y:  1, z: 0 };
      ////texto.setAttribute('geometry',{primitive: 'plane', width: 'auto', height: 'auto'});
      //texto.setAttribute('position', labelpos);
  },
  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () { },

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


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Aframe Grid component for A-Frame.
 */
AFRAME.registerComponent('aframe-grid', {
    schema: {
        height: { default: 1 },
        width: { default: 1 },
        ysteps: { default: 4 },
        xsteps: { default: 4 }
    },

  /**
   * Set if component needs multiple instancing.
   */
  multiple: false,

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function () { },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function (oldData) {
      var data = this.data;
      var material = new THREE.LineBasicMaterial({
          color: 0x000000,
          linewidth: 1
      });

      var stepY = data.height / data.ysteps;

      var grids = new THREE.Object3D();
      for (var i = 0; i < data.ysteps + 1; i++) {
          grids.add(putYGrid(i * stepY));
      };


      var stepX = data.width / data.xsteps;


      for (var i = 0; i < data.xsteps + 1; i++) {
          grids.add(putXGrid(i * stepX));
      };


      function putXGrid(step) {

          var verticalGeometry = new THREE.Geometry();

          verticalGeometry.vertices.push(
              new THREE.Vector3(0, -0.2, 0),
              new THREE.Vector3(0, data.height, 0)
          );
          var verticalLine = new THREE.Line(verticalGeometry, material);

          verticalLine.position.set(step, 0, 0);
          return verticalLine;

      };

      function putYGrid(step) {

          var horizontalGeometry = new THREE.Geometry();

          horizontalGeometry.vertices.push(
              new THREE.Vector3(-0.2, 0, 0),
              new THREE.Vector3(data.width, 0, 0)
          );
          var horizontalLine = new THREE.Line(horizontalGeometry, material);

          horizontalLine.position.set(0, step, 0);
          return horizontalLine;

      };
      this.el.setObject3D('group', grids);
  },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () {
      this.el.removeObject3D('group');
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


/***/ }),
/* 2 */
/***/ (function(module, exports) {

﻿function utils() {
    var onDataLoaded = function (evt) {
        console.log(this.name + ": Data Loaded!");
        this.reload = true;
        evt.target.components[this.name].update(this.data);
    };
    var default_init = function (evt) {
        var cName = this.name;
        var that = this;
        this.loaded = false;
        //called at render. take care
        this.el.addEventListener('data-loaded', this.onDataLoaded.bind(this))
    };

    var default_update = function (oldData) {
        if ((this.el._data && this.el._data.length > 0) || this.el._group) {
            if (this.reload) {
                //rebuild the chart.
                while (this.el.firstChild) {
                    this.el.firstChild.parentNode.removeChild(this.el.firstChild);
                }
                //this.el.innerHTML = "";
                this.initChart();
                this.reload = false;
                this.el.setAttribute('visible', true);
            } else {
                //updating single elements. 
                var diff = AFRAME.utils.diff(oldData, this.data);
                if (diff.title !== "") {
                    var titleEntity = this.el.querySelector("[title]");
                    if (titleEntity) {
                        titleEntity.setAttribute("title", "caption", diff.title);
                    }
                }
            }
        }
    };
    var addEvents = function () {
        var addEvent = function (basicChart, partElement) {
            partElement.addEventListener('mouseenter', partEventsEnter.bind(basicChart, partElement));
            partElement.addEventListener('mouseleave', partEventsLeave.bind(basicChart, partElement));
        };
        var partEventsEnter = function (el) {
            showInfo(this, el);
            changeMeshColor(el);
        }
        var partEventsLeave = function (el) {
            returnMeshColor(el);
            detachInfo(el);
        };
        var returnMeshColor = function (el) {
            var partelement = el;
            //modo THREEDC
            //var meshEl = partelement.DOMElement.getObject3D('mesh');
            //meshEl.material.emissive.setHex(partelement.currentHex);
            //partelement.DOMElement.setObject3D('mesh', meshEl);
            partelement.setAttribute('color', el._partData.origin_color);
        };
        var detachInfo = function (el) {
            var chartelement = el.parentElement;
            var texttodelete = chartelement.querySelector("#tooltip");
            if (texttodelete) {
                chartelement.removeChild(texttodelete);
            }
        };
        var showInfo = function (basicChart, el) {
            var texto;
            texto = document.createElement("a-entity");
            var dark = 0x0A0A0A * 0x02;
            var darkercolor = Number.parseInt(el._partData.origin_color.replace("#", "0x")) - (0xA0A0A * 0x02);
            darkercolor = "#" + ("000000" + darkercolor.toString(16)).slice(-6)
            var TEXT_WIDTH = 6;
            texto.setAttribute("text", {
                color: "#000000",
                side: "double",
                value: basicChart._tooltip ? basicChart._tooltip(el.data) : el._partData.name,
                width: TEXT_WIDTH,
                wrapCount: 30
            });

            var labelpos = { x: el._partData.position.x + TEXT_WIDTH / 2, y: el._partData.position.y, z: el._partData.position.z };
            texto.id = "tooltip";
            texto.setAttribute('position', labelpos);
            //texto.setAttribute('geometry',{primitive: 'plane', width: 'auto', height: 'auto'});
            //basicChart.getEscene().appendChild(texto);
            el.parentElement.appendChild(texto);
        }
        var changeMeshColor = function (el) {
            var partelement = el;
            var originColor = partelement.getObject3D('mesh').material.color.getHex();
            //modo THREEDC
            //partelement.currentHex = meshEl.material.emissive.getHex();
            //meshEl.material.emissive.setHex(threeCol.getHex());
            //partelement.DOMElement.setObject3D('mesh', meshEl);
            var myColor = 0xFFFFFF ^ originColor;
            partelement.setAttribute('color', "#" + ("000000" + myColor.toString(16)).slice(-6));
        }
        //events by default
        for (var i = 0; i < this.el.children.length; i++) {
            addEvent(this.el, this.el.children[i]);
        };

    };
    var addTitle = function () {
        var titleEntity = document.createElement("a-entity");
        titleEntity.setAttribute("title", { caption: this.data.title, width: Math.max(this.data.width / 2, 6) });
        titleEntity.setAttribute("position", { x: this.data.width / 2, y: this.data.height + 1, z: 0 });
        this.el.appendChild(titleEntity);
    };
    return {
        onDataLoaded: onDataLoaded,
        default_init: default_init,
        default_update: default_update,
        addEvents: addEvents,
        addTitle: addTitle
    };
};

module.exports = utils();

/***/ }),
/* 3 */
/***/ (function(module, exports) {

/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Aframe Gridxz component for A-Frame.
 */
AFRAME.registerComponent("aframe-gridxz", {
    schema: {
        width: { default: 1 },
        depth: { default: 1 },
        xsteps: { default: 4 },
        zsteps: { default: 4 }
    },

    update: function () {
        var data = this.data;
        var material = new THREE.LineBasicMaterial({
            color: 0x000000,
            linewidth: 1
        });

        var grids = new THREE.Object3D();

        var stepX = data.width / data.xsteps;
        for (var i = 0; i < data.xsteps + 1; i++) {
            grids.add(putXGrid(i * stepX));
        };

        var stepZ = data.depth / data.zsteps;

        for (var i = 0; i < data.zsteps + 1; i++) {
            grids.add(putZGrid(i * stepZ));
        };






        function putZGrid(step) {

            var verticalGeometry = new THREE.Geometry();

            verticalGeometry.vertices.push(
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(data.width, 0, 0)
            );
            var verticalLine = new THREE.Line(verticalGeometry, material);

            verticalLine.position.set(0, 0, -step);
            return verticalLine;

        };

        function putXGrid(step) {

            var horizontalGeometry = new THREE.Geometry();

            horizontalGeometry.vertices.push(
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 0, -data.depth)
            );
            var horizontalLine = new THREE.Line(horizontalGeometry, material);

            horizontalLine.position.set(step, 0, 0);
            return horizontalLine;

        };
        this.el.setObject3D('group', grids);
    },

    remove: function () {
        this.el.removeObject3D('group');
    }
});


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Aframe Gridyz component for A-Frame.
 */

AFRAME.registerComponent("aframe-gridyz", {
    schema: {
        height: { default: 1 },
        depth: { default: 1 },
        zsteps: { default: 4 },
        ysteps: { default: 4 }
    },

    update: function () {
        var data = this.data;
        var material = new THREE.LineBasicMaterial({
            color: 0x000000,
            linewidth: 1
        });


        var grids = new THREE.Object3D();

        var stepY = data.depth / data.zsteps;
        for (var i = 0; i < data.zsteps + 1; i++) {
            grids.add(putYGrid(i * stepY));
        };
        var stepZ = data.height / data.ysteps;

        for (var i = 0; i < data.ysteps + 1; i++) {
            grids.add(putZGrid(i * stepZ));
        };






        function putYGrid(step) {

            var verticalGeometry = new THREE.Geometry();

            verticalGeometry.vertices.push(
                new THREE.Vector3(0, -0.2, 0),
                new THREE.Vector3(0, data.height, 0)
            );
            var verticalLine = new THREE.Line(verticalGeometry, material);

            verticalLine.position.set(0, 0, -step);
            return verticalLine;

        };

        function putZGrid(step) {

            var horizontalGeometry = new THREE.Geometry();

            horizontalGeometry.vertices.push(
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 0, -data.depth)
            );
            var horizontalLine = new THREE.Line(horizontalGeometry, material);

            horizontalLine.position.set(0, step, 0);
            return horizontalLine;

        };
        this.el.setObject3D('group', grids);
    },

    remove: function () {
        this.el.removeObject3D('group');
    }
});


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/* global AFRAME */
__webpack_require__(1)
__webpack_require__(3)
__webpack_require__(4)
__webpack_require__(0)
var utils = __webpack_require__(2)
if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Barchart3d component for A-Frame.
 */
AFRAME.registerComponent('barchart3d', {
    schema: {
        gridson: { default: true },
        xsteps: { default: 5 },
        ysteps: { default: 5 },
        zsteps: { default: 5 },
        width: { default: 10 },
        height: { default: 10 },
        depth: { default: 0.5 },
        color: { default: '#00FF00' },
        title: { default: "" }
    },
    onDataLoaded: utils.onDataLoaded,

    update: utils.default_update,
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

    /**
     * Called when a component is removed (e.g., via removeAttribute).
     * Generally undoes all modifications to the entity.
     */
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
        BAR_WIDTH = componentData.width / dataKeys.keysOne.length;
        BAR_DEPTH = componentData.depth / dataKeys.keysTwo.length;
        MAX_HEIGHT = componentData.height;

        var MAX_VALUE = Math.max.apply(null, _data.map(function (d) { return d.value }));
        var entityEl = document.createElement('a-entity');
        var yMaxPoint = 0;

        var relativeX, relativeY;
        relativeX = BAR_WIDTH / 2;
        relativeY = 0;
        var indexOfData = 0;
        for (var i = 0; i < dataKeys.keysOne.length; i++) {
            var indexOfZ= 0;
            for (var j = 0 ; j < dataKeys.keysTwo.length; j++) {
                //skip to draw if 0
                if (_data[indexOfData].value !== 0) {
                    //we need to scale every item.

                    var myHeight = (_data[indexOfData].value / MAX_VALUE) * MAX_HEIGHT;
                    var myYPosition = __calculateY(relativeY, myHeight);
                    var el = document.createElement('a-box');
                    //TODO: optional in a future
                    var actualColor = eElem._colors.find(function (a) { return a.key === _data[indexOfData].key2 }).value;

                    //-bardepth *i - bardepth/2
                    var zpos = -(BAR_DEPTH) * (indexOfZ + 0.5);
                    var elPos = { x: relativeX, y: myYPosition, z: zpos };

                    el.setAttribute('width', BAR_WIDTH);
                    el.setAttribute('height', myHeight);
                    el.setAttribute('depth', BAR_DEPTH);
                    el.setAttribute('color', actualColor);
                    el.setAttribute('position', elPos);


                    var valuePart = _data[i].value;
                    if (eElem._valueHandler)
                        valuePart = eElem._valueHandler(_data[indexOfData]);
                    var keyPart = _data[i].key1;
                    if (eElem._keyHandler) {
                        keyPart = eElem._keyHandler(_data[indexOfData]);
                    }
                    //storing parts info..
                    var barPart = {
                        name: "key:" + keyPart + " value:" + valuePart,
                        data: {
                            key1: _data[i].key1,
                            key2: _data[i].key2,
                            value: _data[i].value
                        },
                        position: { x: elPos.x, y: MAX_HEIGHT + 0.25, z: elPos.z },
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
                }
                //global index
                indexOfData++;
                //index to calculate depth
                indexOfZ++;
            }
            relativeX += BAR_WIDTH;

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
            //FIXME: depende del tama�o de letra...
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

        topYValue = Math.max.apply(null, _data.map(function(d) { return d.value})  );
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
            //FIXME: depende del tama�o de letra...
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


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1)
__webpack_require__(0)
var utils = __webpack_require__(2)
/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Barchart component for A-Frame.
 */     
AFRAME.registerComponent('barchart', {
    schema: {
        gridson: { default: true },
        xsteps: { default: 5 },
        ysteps: { default: 5 },
        width: { default: 10 },
        height: { default: 10 },
        depth: { default: 0.5 },
        color: { default: '#00FF00' },
        title: {default: ""}
    },
    onDataLoaded: utils.onDataLoaded,
    init: utils.default_init,
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
            _data = eElem._group.all();
        }
        var dataValues = _data.map(function (a) {
            if (eElem._valueHandler) {
                return eElem._valueHandler(a);
            }
            return a.value;
        });;
        dataValues = scale.apply(null, dataValues);
        BAR_WIDTH = componentData.width / dataValues.length;;
        BAR_DEPTH = componentData.depth;
        MAX_HEIGHT = componentData.height;
        COLORS = ['#2338D9', '#23A2D9', '#23D978', '#BAD923', '#D923D3'];
        var entityEl = document.createElement('a-entity');
        var yMaxPoint = 0;

        var relativeX, relativeY, relativeZ;
        relativeX = BAR_WIDTH / 2;
        relativeY = 0;
        relativeZ = componentData.depth / 2;

        for (var i = 0; i < dataValues.length; i++) {
            var myHeight = dataValues[i] * MAX_HEIGHT;
            var myYPosition = __calculateY(relativeY, myHeight);
            var el = document.createElement('a-box');
            var actualColor = componentData.color || COLORS[i % COLORS.length];
            var elPos = { x: relativeX, y: myYPosition, z: 0 };

            el.setAttribute('width', BAR_WIDTH);
            el.setAttribute('height', myHeight);
            el.setAttribute('depth', BAR_DEPTH);
            el.setAttribute('color', actualColor);
            el.setAttribute('position', elPos);
            relativeX += BAR_WIDTH;

            var valuePart = _data[i].value;
            if(eElem._valueHandler)
                valuePart = eElem._valueHandler(_data[i]);
            var keyPart = _data[i].key;
            if (eElem._keyHandler) {
                keyPart = eElem._keyHandler(_data[i]);
            }
            //storing parts info..
            var barPart = {
                name: "key:" + keyPart + " value:" + valuePart,
                data: {
                    key: _data[i].key,
                    value: valuePart
                },
                position: { x: elPos.x, y: relativeY + MAX_HEIGHT + 0.25, z: elPos.z + relativeZ },
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
        }
        this.addEvents();
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
    addYLabels : function () {
        var numberOfValues;
        var topYValue;
        var getYLabel = function(component, step, value) {

            var txt = value;
            var curveSeg = 3;
            var texto = document.createElement("a-entity");
            TEXT_WIDTH = 6;
            //FIXME: depende del tamaño de letra...
            var xPos =     -0.7;
            //var yPos = BasicChart._coords.y + step +  0.36778332145402703 / 2;
            var yPos =   step;
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
        });;
        topYValue = Math.max.apply(null, dataValues);
        numberOfValues = dataValues.length;
        //Y AXIS
        //var numerOfYLabels=Math.round(_chart._height/20);
        var stepYValue= topYValue/this.data.ysteps;
        var stepY=this.data.height/this.data.ysteps;
        var labels = [];
        for (var i = 0; i <this.data.ysteps +1; i++) {
            labels.push(getYLabel(this, i * stepY, i * stepYValue));
        };
        
        return labels;
    },
    remove: function () {
        while (this.el.firstChild) {
            this.el.removeChild(this.el.firstChild);
        }
        this.el.innerHTML = "";
        this.el.removeEventListener('data-loaded', this.onDataLoaded.bind(this));

    }
});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/* global AFRAME */
__webpack_require__(1)
__webpack_require__(0)
var utils = __webpack_require__(2)
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
          //FIXME: depende del tama�o de letra...
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


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/* global AFRAME */
__webpack_require__(1)
__webpack_require__(3)
__webpack_require__(4)
__webpack_require__(0)
var utils = __webpack_require__(2)
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
          //FIXME: depende del tama�o de letra...
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
          //FIXME: depende del tama�o de letra...
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


/***/ }),
/* 9 */
/***/ (function(module, exports) {

/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerComponent("envmap", {
    schema: {
        imgprefix: { default: "img/dawnmountain-" },
        extension: { default: "png" },
        width: { default: 500 },
        height: { default: 500 },
        depth: { default: 500 }
    },
    update: function () {

        var imagePrefix = this.data.imgprefix;
        var directions = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
        var imageSuffix = "." + this.data.extension;
        var skyGeometry = new THREE.CubeGeometry(this.data.width, this.data.height, this.data.depth);

        var materialArray = [];
        for (var i = 0; i < 6; i++)
            materialArray.push(new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture(imagePrefix + directions[i] + imageSuffix),
                side: THREE.BackSide
            }));
        var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
        var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
        this.mesh = skyBox;
        this.el.setObject3D('mesh', this.mesh);
    }
});


/***/ }),
/* 10 */
/***/ (function(module, exports) {

/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Panel component for A-Frame.
 */
AFRAME.registerComponent('panel', {
    schema: {
        ncolumns: { default: 2, },
        nrows: { default: 1 },
        margin: { default: 6 },
        title: { default: "" }
    },
    onDataLoaded: function (evt) {
        console.log(this.name + ":Data Loaded!");
        this.reload = true;
        this.update(this.data);
    },
    init: function () {
        var self = this;
        var el = this.el;
        this.initialPositions = [];
        var items = el.getChildEntities();
        this.childrenItems = [];
        //passing it to an array
        for (var j = 0 ; j < items.length; j++) {
            this.childrenItems.push(items[j]);
        }
        for (var i = 0; i < this.childrenItems.length; i++) {
            var childEl = this.childrenItems[i];
            var _getPositions = function (childElem) {
                var position = childElem.getAttribute('position');
                self.initialPositions.push([position.x, position.y, position.z]);
            };
            if (childEl.hasLoaded) { return _getPositions(childEl); }
            childEl.addEventListener('loaded', _getPositions.bind(null, childEl));
        };

        //set callbacks
        el.addEventListener('child-attached', this.__childAttachedCallback);
        el.addEventListener('child-detached', this.__childdetachedCallback);
        //called at render. take care
        el.addEventListener('data-loaded', this.onDataLoaded.bind(this));
    },
    //private
    __childAttachedCallback: function (evt) {
        if (evt.detail.el.parentNode !== this || evt.detail.el.id === "injectedTitle") { return; }
        this.components.panel.childrenItems.push(evt.detail.el);
        this.emit("data-loaded");
    },
    __childdetachedCallback: function (evt) {
        if (this.components.panel.childrenItems.indexOf(evt.detail.el) === -1) { return; }
        //delete the element in children and inipos variables.
        var index = this.components.panel.childrenItems.indexOf(evt.detail.el);
        this.components.panel.childrenItems.splice(index, 1);
        this.components.panel.initialPositions.splice(index, 1);
        this.emit("data-loaded");
    },
    update: function (oldData) {
        if (this.reload) {
            this.reload = false;
            var children = this.childrenItems;
            var data = this.data;
            var el = this.el;
            var numChildren = children.length;
            //test
            var defMargin = data.margin;
            var initX = 0;
            function searchdimensions(childEl) {
                if (!childEl.hasLoaded) return 1;
                var knownCharts = ["piechart", "barchart", "smoothcurvechart", "geometry"];
                var found = false;
                var i = 0;
                var retDim = {};
                while (!found && i < knownCharts.length) {
                    var compObj = childEl.components[knownCharts[i]];
                    if (compObj && compObj.data.depth) {
                        retDim.z = compObj.data.depth;
                        if (knownCharts[i] === "piechart") {
                            retDim.x = compObj.data.radius * 2;
                            retDim.y = compObj.data.radius * 2;
                        } else {
                            retDim.x = compObj.data.width;
                            retDim.y = compObj.data.height;
                        }
                        found = true;
                    }
                    i++;

                }
                return retDim;
            }
            var i = 0;
            var rowStep = this.el.components["geometry"].data.height / this.data.nrows;
            var colStep = this.el.components["geometry"].data.width / this.data.ncolumns;
            var nextColStep = 0, customcolstep = false;
            for (var r = 0 ; r < this.data.nrows ; r++) {
                var rowpoint = (-this.el.components["geometry"].data.height / 2) + ((r) * rowStep);
                for (c = 0; c < this.data.ncolumns; c++) {
                    var posPoint = { x: 0, y: rowpoint, z: 0 };
                    var rowpoint_mod = rowpoint;
                    if (!this.childrenItems[i]) break;
                    var child = this.childrenItems[i];
                    var childdim = searchdimensions(child);
                    var colpoint = (-this.el.components["geometry"].data.width / 2) + ((c) * colStep);
                    colpoint = customcolstep ? nextColStep : colpoint;
                    customcolstep = false;
                    if (childdim.x) {
                        //todo: delete that offset.
                        nextColStep = colpoint + childdim.x + 1.3;
                        customcolstep = true;
                    }
                    //en el caso de nuestras graficas seria correcto as�
                    colpoint = colpoint;
                    rowpoint_mod = rowpoint;
                    posPoint.x = colpoint;
                    posPoint.y = rowpoint_mod;
                    var depth = childdim.z / 2 + 0.05; //def depth panel + depth /2
                    posPoint.z = depth;
                    child.setAttribute("position", posPoint);
                    i++;
                }
                if (!this.childrenItems[i]) break;
            }
            //for (var i = 0 ; i < numChildren; i++) {

            //    var posPoint = { x: initX, y: 0, z: 0 };
            //    var child = children[i];
            //    var depth = searchDepth(child) / 2 + 0.05; //def depth panel + depth /2
            //    posPoint.z = depth;
            //    child.setAttribute("position", posPoint);
            //    initX = initX + defMargin;
            //}
        }
        if (this.data.title !== "") {
            this.addTitle();
        }
    },
    addTitle: function () {
        var titleEntity = document.querySelector("#injectedTitle");
        var geomData = this.el.components["geometry"].data;
        if (titleEntity) {
            titleEntity.setAttribute("title", { caption: this.data.title, width: geomData ? geomData.width : 6 });
            titleEntity.setAttribute("position", { x: 0, y: (geomData ? geomData.height / 2 : 5) + 2, z: 0 });
            return;
        }
        titleEntity = document.createElement("a-entity");
        titleEntity.id = "injectedTitle";
        titleEntity.setAttribute("title", { caption: this.data.title, width: geomData ? geomData.width : 6 });
        titleEntity.setAttribute("position", { x: 0, y: (geomData ? geomData.height / 2 : 5) + 2, z: 0 });
        this.el.appendChild(titleEntity);
    },
    /**
     * Reset positions.
     */
    remove: function () {
        this.el.removeEventListener('child-attached', this.__childAttachedCallback);
        this.el.removeEventListener('child-detached', this.__childdetachedCallback);
        this.el.removeEventListener('data-loaded', this.onDataLoaded.bind(this));
        //it doesn't works properly.
        //this.__setPositions(this.childrenItems, this.initialPositions);
    }
});
//registering panel primitive
AFRAME.registerPrimitive('a-panel', AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
    defaultComponents: {
        panel: { ncolumns: 2, nrows: 1 },
        geometry: {
            primitive: "box",
            width: 20,
            height: 20,
            depth: 0.1
        },
        material: {
            color: "gray",
            opacity: 0.3,
            transparent: true,
            flatShading: false
        }
    },
    mappings: {
        width: "geometry.width",
        depth: "geometry.depth",
        nrows: "panel.nrows",
        ncolumns: "panel.ncolumns"

    }
}));

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

/* global AFRAME */
__webpack_require__(0)

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

var utils = __webpack_require__(2)
/**
 * Piechart component for A-Frame.
 */
AFRAME.registerComponent('piechart', {
 schema: {
        radius: {default: 2.5 },
        depth: { default: 0.5 },
        color: { default: "#fff" },
        title: {default: ""}
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
        var component = this.data;
        var entityEl = this.el;
        var aframedcEl = this.el;
        if ((!entityEl._data || entityEl._data.length === 0) &&
        !entityEl._group) return;
        var relativeX, relativeY, relativeZ;
        var thethainit = 0;
        var COLORS = ['#2338D9', '#23A2D9', '#23D978', '#BAD923', '#D923D3', '#23D7D7', '#D72323', '#262C07'];
        var radius = component.radius;
        relativeX = radius;
        relativeY = radius;
        var _data;
        if (entityEl._data) {
            _data = entityEl._data;
        } else {
            _data = entityEl._group.top(Infinity);
        }
        relativeZ = component.depth / 2;
        var suma = function (acc, val) {
            return acc + val;
        }
        var dataValues = _data.map(function (b) { return b.value; });
        var dataSum = dataValues.reduce(suma, 0);
        var dataValues = dataValues.map(function (b) { return (b / dataSum); });

 
        for (var j = 0; j < dataValues.length; j++) {
            var myThethaLength = (360 * dataValues[j]);
            var el = document.createElement("a-cylinder");
            //var geomcil = { primitive: "cylinder", thetaStart: thethainit, thetaLength: myThethaLength, radius: radius };
            //el.setAttribute("geometry", geomcil);
            el.setAttribute("theta-start", thethainit);
            el.setAttribute("theta-length", myThethaLength);
            el.setAttribute("radius", radius);
            var angleLabel = (thethainit + (myThethaLength / 2));
            //to rads
            angleLabel = (angleLabel * 2 * Math.PI) / 360;
            //min distance.
            var actualColor =COLORS[j % COLORS.length];;
            if (entityEl._colors)
            {
                actualColor = entityEl._colors.find(function (a) { return a.key === _data[j].key }).value;
            }
            el.setAttribute("color", actualColor);
            //el.setAttribute("material", { color: actualColor });
            el.setAttribute("scale", { x: 1, y: component.depth, z: 1 });
            el.setAttribute("position", { x: relativeX, y: relativeY, z: 0 });
            el.setAttribute("rotation", { x: -90, y: 0, z: 0 });

            thethainit = thethainit + myThethaLength;
            //storing parts info..
            var piePart = {
                name: "key:" + _data[j].key + " value:" + (dataValues[j] * 100).toFixed(3),
                data: {
                    key: _data[j].key,
                    value: _data[j].value
                },
                position: { x: relativeX, y: relativeY + radius + 0.25, z:  component.depth /2 },
                origin_color: actualColor
            };
            el._partData = piePart;
            entityEl.appendChild(el);
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
        }
        this.addEvents();
        if (component.title !== "") {
            this.addTitle();
        }
    },

    addTitle: function () {
        var titleEntity = document.createElement("a-entity");
        titleEntity.setAttribute("title", { caption: this.data.title, width: Math.max(this.data.radius,6) });
        titleEntity.setAttribute("position", { x: this.data.radius, y: (this.data.radius * 2) + 1, z: this.data.depth / 2 });
        this.el.appendChild(titleEntity);
    },
    addEvents: utils.addEvents,
  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () {    
        this.el.removeEventListener('data-loaded', this.onDataLoaded.bind(this));
        while (this.el.firstChild) {
            this.el.removeChild(this.el.firstChild);
        }
        this.el.innerHTML = "";
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


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/* global AFRAME */
__webpack_require__(1)
__webpack_require__(0)
var utils = __webpack_require__(2)
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
        color: { default: '#00FF00' }
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
          eElem.appendChild(point);
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
  addYLabels : function () {
      var numberOfValues;
      var topYValue;
      var getYLabel = function(component, step, value) {

          var txt = value;
          var curveSeg = 3;
          var texto = document.createElement("a-entity");
          TEXT_WIDTH = 6;
          //FIXME: depende del tama�o de letra...
          var xPos =     -0.7;
          //var yPos = BasicChart._coords.y + step +  0.36778332145402703 / 2;
          var yPos =   step;
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
      });;
      topYValue = Math.max.apply(null, dataValues);
      numberOfValues = dataValues.length;
      //Y AXIS
      //var numerOfYLabels=Math.round(_chart._height/20);
      var stepYValue= topYValue/this.data.ysteps;
      var stepY=this.data.height/this.data.ysteps;
      var labels = [];
      for (var i = 0; i <this.data.ysteps +1; i++) {
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


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

﻿var extendDeep = AFRAME.utils.extendDeep;
__webpack_require__(1);
__webpack_require__(3);
__webpack_require__(4);
__webpack_require__(6);
__webpack_require__(5);
__webpack_require__(7);
__webpack_require__(8);
__webpack_require__(9);
__webpack_require__(10);
__webpack_require__(12);
__webpack_require__(11);
__webpack_require__(0);
//findindex polyfill
if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function (predicate) {
        if (this === null) {
            throw new TypeError('Array.prototype.findIndex called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return i;
            }
        }
        return -1;
    };
}
//find polyfill
if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
        'use strict';
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}
function aframedc() {
    var aframedc = {
        version: '0.1.0',
        DEFAULT_CHART_GROUP: "__defaultgroup__"
    };

    aframedc.addDashBoard = function (AFRAMEscene) {
        //ensuring camera has mouse-cursor.
        var canvas = AFRAMEscene.canvas;
        var _ensuremousecursor = function (scene) {
            var camera = scene.querySelector("[camera]");
            if (!camera) {
                camera = createcamera();
                scene.appendChild(camera);
            } else if (!camera.getAttribute("mouse-cursor")) {
                var _setcursor = function () { camera.setAttribute("mouse-cursor", "") };
                if (camera.hasLoaded) {
                    _setcursor();
                } else {
                    //camera object 3d has to be loaded.
                    camera.addEventListener("loaded", _setcursor());
                }
            }
        }
        if (!canvas) {
            AFRAMEscene.addEventListener('render-target-loaded', _ensuremousecursor.bind(null, AFRAMEscene));
        }
        return dashBoard(AFRAMEscene);
    }
    var dashBoard = function (scene) {
        var dashEntity = document.createElement("a-entity");
        dashEntity.id = "aframedc";
        scene.appendChild(dashEntity);
        var odashboard = dashEntity;
        odashboard.chartRegistry = (function () {
            var _chartMap = {};
            function initializeChartGroup(group) {
                if (!group) {
                    group = aframedc.DEFAULT_CHART_GROUP;
                }

                if (!_chartMap[group]) {
                    _chartMap[group] = [];
                }

                return group;
            }

            return {
                register: function (chart, group) {
                    group = initializeChartGroup(group);
                    _chartMap[group].push(chart);
                },
                list: function (group) {
                    group = initializeChartGroup(group);
                    return _chartMap[group];
                }
            };
        })();
        odashboard.addPanel = function (panel) {
            this.chartRegistry.register(panel);
            panel._dashboard = this;
            this.appendChild(panel);
            var listOfCharts = panel.chartRegistry.list();
            for (var i = 0; i < listOfCharts.length; i++) {
                panel.appendChild(listOfCharts[i]);
            }
            panel.render();
            return this;
        };
        odashboard.addChart = function (chart, coords) {
            this.chartRegistry.register(chart);
            this.appendChild(chart);
            chart._dashboard = this;
            if (coords) {
                chart.setAttribute("position", coords);
            }
            chart.render();
            return this;
        };
        odashboard.allCharts = function () {
            var aux_list = [];
            var dashlist = this.chartRegistry.list();
            for (var i = 0; i < dashlist.length; i++) {
                if (!dashlist[i].addChart) {
                    //not a panel..
                    aux_list.push(dashlist[i]);
                } else {
                    var panelcharts = dashlist[i].chartRegistry.list();
                    for (var j = 0 ; j < panelcharts.length ; j++) {
                        aux_list.push(panelcharts[j]);
                    }
                }
            }
            return aux_list;
        };
        return odashboard;
    };
    var createcamera = function () {
        //taking existing camera.Adding my custom components.
        var camera = document.createElement("a-entity");
        camera.setAttribute("camera", {});
        camera.setAttribute("look-controls", {});
        camera.setAttribute("wasd-controls", {});
        //camera object 3d has to be loaded.
        camera.addEventListener("loaded", function () { camera.setAttribute("mouse-cursor", "") });
        return camera;
    }
    aframedc.dashboard = function (containerdiv) {
        var scene = document.createElement("a-scene");
        scene.setAttribute('embedded', {});
        //creating camera 
        var camera = createcamera();

        scene.appendChild(camera);
        containerdiv.appendChild(scene);
        return dashBoard(scene);
    }
    var baseMixin = {
        componentName: "", //filled on every chart
        render: function () {
            var thatel = this;
            function __emitrender() {
                thatel.emit('data-loaded');
            };
            if (this.hasLoaded) {
                __emitrender();
            } else {
                this.addEventListener('loaded', __emitrender);
            }
            return this;
        },
        data: function (newdata) {
            this._data = newdata;
            return this;
        },
        dimension: function (newdata) {
            this._dimension = newdata;
            return this;
        },
        group: function (newdata) {
            this._group = newdata;
            return this;
        },
        depth: function (newdepth) {
            this.setAttribute(this.componentName, "depth", newdepth);
            return this;

        },
        color: function (newcolor) {
            this.setAttribute(this.componentName, "color", newcolor);
            return this;
        },
        setTitle: function (newTitle) {
            this.setAttribute(this.componentName, "title", newTitle);
            return this;
        },
        valueAccessor: function (valueHandler) {
            this._valueHandler = valueHandler;
            return this;
        },
        keyAccessor: function (keyHandler) {
            this._keyHandler = keyHandler;
            return this;
        },
        setId: function (id) {
            this._id = id;
            return this;
        }

    };
    aframedc.Panel = function () {
        var compName = "panel";
        this.componentName = compName;
        var element = document.createElement('a-panel');
        var oPanel = element;
        oPanel.chartRegistry = (function () {
            var _chartMap = {};
            function initializeChartGroup(group) {
                if (!group) {
                    group = aframedc.DEFAULT_CHART_GROUP;
                }

                if (!_chartMap[group]) {
                    _chartMap[group] = [];
                }

                return group;
            }

            return {
                register: function (chart, group) {
                    group = initializeChartGroup(group);
                    _chartMap[group].push(chart);
                },
                list: function (group) {
                    group = initializeChartGroup(group);
                    return _chartMap[group];
                }
            };
        })();

        oPanel.render = function () {
            var thatel = this;
            function __emitrender() {
                thatel.emit('data-loaded');
                var listOfCharts = thatel.chartRegistry.list();
                for (var i = 0; i < listOfCharts.length; i++) {
                    listOfCharts[i].render();
                }
            };
            if (this.hasLoaded) {
                __emitrender();
            } else {
                this.addEventListener('loaded', __emitrender);
            }
            return this;
        };
        oPanel.width = function (newwidth) {
            this.setAttribute("geometry", "width", newwidth);
            return this;
        };
        oPanel.height = function (newwidth) {
            this.setAttribute("geometry", "height", newwidth);
            return this;
        };
        oPanel.nrows = function (newn) {
            this.setAttribute(this.componentName, "nrows", newn);
            return this;
        };
        oPanel.ncolumns = function (newn) {
            this.setAttribute(this.componentName, "ncolumns", newn);
            return this;
        };
        oPanel.setTitle = function (newtitle) {
            this.setAttribute(this.componentName, "title", newtitle);
            return this;
        }
        //unique properties and methods
        oPanel.componentName = compName;
        oPanel.addChart = function (chart) {
            this.chartRegistry.register(chart);
            this._panel = this;
            if (oPanel.hasLoaded && oPanel.sceneEl) {
                this.appendChild(chart);
                chart.render();
            }
        };
        return oPanel;
    };

    aframedc.pieChart = function () {
        var compName = "piechart";
        var element = document.createElement('a-entity');
        element.setAttribute(compName, {});
        var opieChart = element;
        opieChart =  extendDeep(opieChart, baseMixin);
        //unique properties and methods
        opieChart.componentName = compName;
        opieChart.radius = function (newradius) {
            this.setAttribute(this.componentName, "radius", newradius);
            return this;
        };
        opieChart.color = function (newcolordict) {
            this._colors = newcolordict;
            return this;
        };
        return opieChart;
    };
    aframedc.barChart = function () {
        var compName = "barchart";
        var element = document.createElement('a-entity');
        element.setAttribute(compName, {});
        var obarChart = element;
        obarChart = extendDeep(obarChart, baseMixin);
        //unique properties and methods
        obarChart.componentName = compName;
        obarChart.width = function (newradius) {
            this.setAttribute(this.componentName, "width", newradius);
            return this;
        };
        obarChart.height = function (newradius) {
            this.setAttribute(this.componentName, "height", newradius);
            return this;
        };
        return obarChart;
    };

    aframedc.barChartstack = function () {
        var compName = "barchartstack";
        var element = document.createElement('a-entity');
        element.setAttribute(compName, {});
        var obarChart = element;
        obarChart = extendDeep(obarChart, baseMixin);
        //unique properties and methods
        obarChart.componentName = compName;
        obarChart.width = function (newradius) {
            this.setAttribute(this.componentName, "width", newradius);
            return this;
        };
        obarChart.height = function (newradius) {
            this.setAttribute(this.componentName, "height", newradius);
            return this;
        };
        obarChart.orderFunction = function (newcallback) {
            this._maxfunc = newcallback;
            return this;
        }
        obarChart.color = function (newcolorDict) {
            this._colors = newcolorDict;
            return this;
        }
        return obarChart;
    };

    aframedc.bubbleChart = function () {
        var compName = "bubblechart";
        var element = document.createElement('a-entity');
        element.setAttribute(compName, {});
        var obubbleChart = element;
        obarChart = extendDeep(obubbleChart, baseMixin);
        //unique properties and methods
        obubbleChart.componentName = compName;
        obubbleChart.width = function (newradius) {
            this.setAttribute(this.componentName, "width", newradius);
            return this;
        };
        obubbleChart.height = function (newradius) {
            this.setAttribute(this.componentName, "height", newradius);
            return this;
        };
        obubbleChart.heightAccessor = function (heightfunc) {
            this._heightAccesor = heightfunc;
            return this;
        }
        obubbleChart.radiusAccessor = function (rfunc) {
            this._radiusAccesor = rfunc;
            return this;
        }
        obubbleChart.arrayAccessor = function (arrfunc) {
            this._arrAccesor = arrfunc;
            return this;
        }
        obubbleChart.zAxis = function (newzaxis) {
            this._zAxis = newzaxis;
            return this;
        }
        return obubbleChart;
    };
    aframedc.barChart3d = function () {
        var compName = "barchart3d";
        var element = document.createElement('a-entity');
        element.setAttribute(compName, {});
        var obarChart = element;
        obarChart = extendDeep(obarChart, baseMixin);
        //unique properties and methods
        obarChart.componentName = compName;
        obarChart.width = function (newradius) {
            this.setAttribute(this.componentName, "width", newradius);
            return this;
        };
        obarChart.height = function (newradius) {
            this.setAttribute(this.componentName, "height", newradius);
            return this;
        };
        obarChart.color = function (newcolorDict) {
            this._colors = newcolorDict;
            return this;
        }

        obarChart.zAxis = function (newcolorDict) {
            this._zAxis = newcolorDict;
            return this;
        }
        obarChart.transformMethod = function (transformCall) {
            this._transformFunc = transformCall;
            return this;
        }
        return obarChart;
    };


    aframedc.smoothCurveChart = function () {
        var compName = "smoothcurvechart";
        var element = document.createElement('a-entity');
        element.setAttribute(compName, {});
        var oCurveChart = element;
        oCurveChart = extendDeep(oCurveChart, baseMixin);
        //unique properties and methods
        oCurveChart.componentName = compName;
        oCurveChart.width = function (newradius) {
            this.setAttribute(this.componentName, "width", newradius);
            return this;
        };
        oCurveChart.height = function (newradius) {
            this.setAttribute(this.componentName, "height", newradius);
            return this;
        };
        oCurveChart.gridsOn = function (havegrid) {
            this.setAttribute(this.componentName, "gridson", havegrid);
            return this;
        };
        return oCurveChart;
    };

    return aframedc;
};

module.exports = aframedc();

/***/ })
/******/ ]);