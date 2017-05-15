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
