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
    __setPositions(childrens, positions) {
        for (var i = 0; i < childrens.length; i++) {
            var child = childrens[i];
            var position = positions[i];
            child.setAttribute("position", { x: position[0], y: position[1], z: position[2] });
        }
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
                    //en el caso de nuestras graficas seria correcto así
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
        this.__setPositions(this.childrenItems, this.initialPositions);
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