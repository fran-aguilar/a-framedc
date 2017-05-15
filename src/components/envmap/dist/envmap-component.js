/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

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


/***/ })
/******/ ]);