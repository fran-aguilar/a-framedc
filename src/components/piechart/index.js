/* global AFRAME */
require("../title/index.js")

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

var utils = require("../../basefunctions.js")
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
