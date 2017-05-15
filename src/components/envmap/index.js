/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerComponent("envmap", {
    schema: {
        imgprefix: { default: "img/dawnmountain-" },
        extension: { default: "png" },
        width: { default: 500 },
        height: { default: 500 },
        depth: { default: 500 }
    },
    init: function () {

        var imagePrefix = this.data.imgprefix;
        var directions = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
        var imageSuffix = "." + this.data.extension;
        var skyGeometry = new THREE.CubeGeometry(this.data.width, this.data.height, this.data.depth);

        var materialArray = [];
        for (var i = 0; i < 6; i++)
            materialArray.push(new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture(imagePrefix + directions[i] + imageSuffix),
                side: THREE.BackSide
            }));
        var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
        var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
        this.mesh = skyBox;
        this.el.setObject3D('mesh', this.mesh);
    }
});
