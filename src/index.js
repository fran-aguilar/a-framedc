var extendDeep = AFRAME.utils.extendDeep;
require("./components/aframe-grid/index.js");
require("./components/aframe-gridxz/index.js");
require("./components/aframe-gridyz/index.js");
require("./components/barchart/index.js");
require("./components/barchart3d/index.js");
require("./components/barchartstack/index.js");
require("./components/bubblechart/index.js");
require("./components/envmap/index.js");
require("./components/panel/index.js");
require("./components/smoothcurvechart/index.js");
require("./components/piechart/index.js");
require("./components/title/index.js");
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
        obarChart.color = function (newcolorDict) {
            this._colors = newcolorDict;
            return this;
        }

        obarChart.transformMethod = function (transformCall) {
            this._transformFunc = transformCall;
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

        obubbleChart.color = function (newcolorDict) {
            this._colors = newcolorDict;
            return this;
        };

        obubbleChart.transformMethod = function (transformCall) {
            this._transformFunc = transformCall;
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