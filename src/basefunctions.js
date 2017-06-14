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
        if ((this.el._data && this.el._data.length > 0) || this.el._group || this.data.src) {
            //we set data if not fullfilled
            if (!(this.el._data && this.el._data.length > 0) && !this.el._group) {
                var that = this;
                if (that.data.src) {
                    //taking from json data.
                    if (that.data.src.constructor === String) {
                        $.getJSON(that.data.src, function (response) {
                            that.el._data = response;
                            that.initChart();
                            that.reload = false;
                            that.el.setAttribute('visible', true);
                        });
                    } else if (that.data.src.constructor === Object) {
                        // Set font if already have a typeface.json through setAttribute.
                        that.el._data = data.src;
                        that.initChart();
                        that.reload = false;
                        that.el.setAttribute('visible', true);
                    }
                }
            }

            if (this.reload) {
                var data = this.data;
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
    var COLORS = ["#33cc33",
"#00ffcc",
"#ffff00",
"#3399ff",
"#ff3300",
"#ffccff",
"#3399ff",
"#996633",
"#336600",
"#ff00ff",
"#000099",
"#008B8B",
"#B8860B",
"#A9A9A9",
"#006400",
"#BDB76B",
"#8B008B",
"#556B2F",
"#FF8C00",
"#9932CC",
"#8B0000",
"#E9967A",
"#8FBC8F",
"#483D8B",
"#2F4F4F",
"#00CED1",
"#9400D3",
"#FF1493",
"#00BFFF",
"#696969",
"#1E90FF",
"#B22222",
"#FFFAF0",
"#228B22",
"#FF00FF",
"#DCDCDC",
"#F8F8FF",
"#FFD700",
"#DAA520",
"#808080",
"#008000",
"#ADFF2F",
"#F0FFF0",
"#FF69B4",
"#CD5C5C",
"#4B0082",
"#FFFFF0",
"#F0E68C",
"#E6E6FA",
"#FFF0F5",
"#7CFC00",
"#FFFACD",
"#ADD8E6",
"#F08080",
"#E0FFFF",
"#FAFAD2",
"#D3D3D3",
"#90EE90",
"#FFB6C1",
"#FFA07A",
"#20B2AA",
"#87CEFA",
"#778899",
"#B0C4DE",
"#FFFFE0",
"#00FF00",
"#32CD32",
"#FAF0E6",
"#800000",
"#66CDAA",
"#0000CD",
"#BA55D3",
"#9370DB",
"#3CB371",
"#7B68EE",
"#00FA9A",
"#48D1CC",
"#C71585",
"#191970",
"#F5FFFA",
"#FFE4E1",
"#FFE4B5",
"#FFDEAD",
"#000080",
"#FDF5E6",
"#808000",
"#6B8E23",
"#FFA500",
"#FF4500",
"#DA70D6",
"#EEE8AA",
"#98FB98",
"#AFEEEE",
"#DB7093",
"#FFEFD5",
"#FFDAB9",
"#CD853F",
"#FFC0CB",
"#DDA0DD",
"#B0E0E6",
"#800080",
"#663399",
"#FF0000",
"#BC8F8F",
"#4169E1",
"#8B4513",
"#FA8072",
"#F4A460",
"#2E8B57",
"#FFF5EE",
"#A0522D",
"#C0C0C0",
"#87CEEB",
"#6A5ACD",
"#708090",
"#FFFAFA",
"#00FF7F",
"#4682B4",
"#D2B48C",
"#008080",
"#D8BFD8",
"#FF6347",
"#40E0D0",
"#EE82EE",
"#F5DEB3",
"#FFFFFF",
"#F5F5F5",
"#FFFF00",
"#9ACD32"];
    return {
        onDataLoaded: onDataLoaded,
        default_init: default_init,
        default_update: default_update,
        addEvents: addEvents,
        addTitle: addTitle,
        colors: COLORS
    };
};

module.exports = utils();
