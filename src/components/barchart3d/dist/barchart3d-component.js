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
	__webpack_require__(3)
	__webpack_require__(4)
	var utils = __webpack_require__(5)
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
	        if (!eElem._zAxis) return;
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
	        BAR_DEPTH = componentData.depth / eElem._zAxis.length;
	        MAX_HEIGHT = componentData.height;
	        //using value and height accessor to retrieve max's
	        var arrays = _data.map(function (p) {
	            var myp = p;
	            return eElem._arrAccesor(p).map(function (o) {
	                return eElem._heightAccesor(o, myp);
	            });
	        });
	        var MAX_VALUE = Math.max.apply(null, ([].concat.apply([], arrays)));
	        var entityEl = document.createElement('a-entity');
	        var yMaxPoint = 0;

	        var relativeX, relativeY;
	        relativeX = BAR_WIDTH / 2;
	        relativeY = 0;

	        for (var i = 0; i < _data.length; i++) {
	            var dataValue = _data[i].value;
	            for (var j = 0 ; j < dataValue.length; j++) {
	                //we need to scale every item.

	                var myHeight = (eElem._heightAccesor(dataValue[j], dataValue) / MAX_VALUE) * MAX_HEIGHT;
	                var myYPosition = __calculateY(relativeY, myHeight);
	                var el = document.createElement('a-box');
	                var actualColor = eElem._colors.find(function (a) { return a.key === dataValue[j].key }).value;
	                var index = eElem._zAxis.findIndex(function (a) { return a.key === dataValue[j].key });
	                //-bardepth *i - bardepth/2
	                var zpos = -(BAR_DEPTH) * (index + 0.5);
	                var elPos = { x: relativeX, y: myYPosition, z: zpos };

	                el.setAttribute('width', BAR_WIDTH);
	                el.setAttribute('height', myHeight);
	                el.setAttribute('depth', BAR_DEPTH);
	                el.setAttribute('color', actualColor);
	                el.setAttribute('position', elPos);


	                var valuePart = _data[i].value;
	                if (eElem._valueHandler)
	                    valuePart = eElem._valueHandler(dataValue[j], dataValue);
	                var keyPart = _data[i].key;
	                if (eElem._keyHandler) {
	                    keyPart = eElem._keyHandler(_data[i]);
	                }
	                //storing parts info..
	                var barPart = {
	                    name: "key:" + keyPart + " value:" + valuePart,
	                    data: {
	                        key: _data[i].key,
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
	        //using value and height accessor to retrieve max's
	        var arrays = _data.map(function (p) {
	            var myp = p;
	            return eElem._arrAccesor(p).map(function (o) {
	                return eElem._heightAccesor(o, myp);
	            });
	        });
	        topYValue = Math.max.apply(null, ([].concat.apply([], arrays)));
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
	    addZLabels: function () {
	        if (!this.el._zAxis) return;
	        var getZLabel = function (component, step, labelkv) {
	            var curveSeg = 3;
	            var texto = document.createElement("a-entity");
	            TEXT_WIDTH = 6;
	            //FIXME: depende del tama�o de letra...
	            var xPos = -1 * ((TEXT_WIDTH / 2) + 0.7);
	            var zPos = -step;
	            var actualColor = component.el._colors.find(function (d) { return d.key === labelkv.key; }).value;
	            texto.setAttribute("text", {
	                color: actualColor,
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
	 * Aframe Gridxz component for A-Frame.
	 */
	AFRAME.registerComponent('aframe-gridxz', {
	  schema: {},

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
	  update: function (oldData) { },

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

	/* global AFRAME */

	if (typeof AFRAME === 'undefined') {
	  throw new Error('Component attempted to register before AFRAME was available.');
	}

	/**
	 * Aframe Gridyz component for A-Frame.
	 */
	AFRAME.registerComponent('aframe-gridyz', {
	  schema: {},

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
	  update: function (oldData) { },

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
/* 4 */
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
/* 5 */
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