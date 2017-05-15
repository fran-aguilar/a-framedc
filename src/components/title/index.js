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
