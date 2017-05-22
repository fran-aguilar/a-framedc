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
        depth: { default: 10 },
        color: { default: '#00FF00' },
        title: { default: "" },
        src: { type: 'asset', default: 'https://rawgit.com/fran-aguilar/a-framedc/master/examples/data/lib/scm-commits-filtered.json' }
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
        this.max_value = MAX_VALUE;
        var entityEl = document.createElement('a-entity');
        var yMaxPoint = 0;

        var relativeX, relativeY;
        relativeX = BAR_WIDTH / 2;
        relativeY = 0;
        var indexOfData = 0;

        //we define default colors if not defined.
        if (!this.el._colors) {
            this.el._colors = [];
            for (var c = 0; c < dataKeys.keysTwo.length; c++) {
                this.el._colors.push({ key: dataKeys.keysTwo[c],value: utils.colors[c % utils.colors.length]})
            }
        }
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


                    var valuePart = _data[indexOfData].value ;
                    if (eElem._valueHandler)
                        valuePart = eElem._valueHandler(_data[indexOfData]);
                    var keyPart = _data[indexOfData].key1 + " " +_data[indexOfData].key2;
                    if (eElem._keyHandler) {
                        keyPart = eElem._keyHandler(_data[indexOfData]);
                    }
                    //storing parts info..
                    var barPart = {
                        name: "key:" + keyPart + " value:" + valuePart,
                        data: {
                            key1: _data[indexOfData].key1,
                            key2: _data[indexOfData].key2,
                            value: _data[indexOfData].value
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
