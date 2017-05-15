/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/* global AFRAME */
	__webpack_require__(1)
	__webpack_require__(2)
	var utils = __webpack_require__(3)
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
/* 3 */
/***/ (function(module, exports) {

	function utils() {
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

/***/ })
/******/ ]);