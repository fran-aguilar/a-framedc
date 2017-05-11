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
    onDataLoaded: function (evt) {
        console.log(this.name + ":Data Loaded!");
        this.reload = true;
        evt.target.components[this.name].update(this.data);
    },
    init: function () {
        var cName = this.name;
        var that = this;
        this.loaded = false;
        //called at render. take care
        this.el.addEventListener('data-loaded', this.onDataLoaded.bind(this));

    },
    update: function (oldData) {
        if ( (this.el._data && this.el._data.length > 0) ||this.el._group ) {
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
    },
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
    addTitle: function(){
        var titleEntity = document.createElement("a-entity");
        titleEntity.setAttribute("title", { caption: this.data.title ,width: Math.max(this.data.width/2,6)});
        titleEntity.setAttribute("position", { x: this.data.width/2, y: this.data.height + 1, z: 0 });
        this.el.appendChild(titleEntity);
    },
    addEvents: function () {
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

    },
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