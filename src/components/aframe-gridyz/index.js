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
