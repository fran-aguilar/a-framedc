# a-framedc
3D charts built with A-frame. A-framedc ships with a set of A-Frame components and a library to use them in easier way.It provides the following features:

- Create 3D chart visualizations of data.
- No additional software must we installed for executing our software thanks to A-Frame.
- Similar functionality as [dc.js](https://github.com/dc-js/dc.js) library with filter possibilities and different types of charts.
- A fast filter response thanks to crossfilter.
- The ability to change between a 3D scene and a Virtual reality scenario.
- Render our charts on a existing scenario, or create a scene from scratch.

Our library exports a single global object (a-framedc) on which we have the following methods:
- __addDashBoard(AFrameScene):__ Allows us to associate a dashboard with an existing A-Frame scene. To do this, we must pass through this scene. Returns the dashboard object.
- **Dashboard(containerdiv):** Allows us to create a new scene from scratch. It initialize a default configuration by creating the scene and a default camera. Returns the dashboard object.
- **Panel** creates a new [panel](https://github.com/fran-aguilar/a-framedc/tree/master/src/components/panel/) to add charts to it.
- [**barChart:**](https://github.com/fran-aguilar/a-framedc/tree/master/src/components/piechart) Creates an A-Frame entity associated with the barchart component.This is a chart which visualizes the evolution of a value or attribute along an axis, commonly time, with bars of different heights.													
- [**pieChart:**](https://github.com/fran-aguilar/a-framedc/tree/master/src/components/piechart) Creates an A-Frame entity associated with the piechart component.This is a chart which composes a circle that represents the different parts of a whole in a set of segments of  that circle until completing it.
- [**bubbleChart:**](https://github.com/fran-aguilar/a-framedc/tree/master/src/components/bubblechart) Creates an A-Frame entity associated with the bubblechart component.This is a chart that represents different spheres of different position and size depending on different categories. In the context of our library we play with the following parameters: width, height, depth and radius of the sphere.					
- [**barChart3d:**](https://github.com/fran-aguilar/a-framedc/tree/master/src/components/barchart3d) Creates an A-Frame entity associated with the barChart3d component. It is a chart which has bars of different heights like barchart, but the height of each bar is determined by two values of two different categories. These bars are drawn along two axis.																	  </li>
- [**barChartstack:**](https://github.com/fran-aguilar/a-framedc/tree/master/src/components/barchartstack) Creates an A-Frame entity associated with the barchartstack component.This is also a bar chart, in this case each bar is composed of parts of different size that make up the total of the bar in that specific value.																										
- [**smoothCurveChart:**](https://github.com/fran-aguilar/a-framedc/tree/master/src/components/smoothcurvechart) Creates an A-Frame entity associated with the smoothcurvechart component.This is a graph with a line representing the evolution of a value or attribute along an axis. This graph does not respond directly to user actions, mouse events etc. Your data is updated if your group / dimension of crossfilter is affected. </li>

#### Browser Installation

Install and use by directly including the [browser files](dist):


```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.5.0/aframe.min.js"></script>
  <script src="https://unpkg.com/a-framedc@1.0.7/dist/aframedc.min.js"></script>
</head>

<body>
	<a-scene>
	<a-assets>
		<a-asset-item id="barsdata" src="http://path/to/your/file.json"></a-asset-item>
	</a-assets>
	<a-entity id="bars" barchart="width:14;gridson:true;title:example barchart;src:#barsdata"></a-entity>
	</a-scene>
</body>
```

#### NPM Installation

Install via NPM:

```bash
npm install a-framedc
```

Then register and use.

```js
require('aframe');
var aframedc = require('a-framedc');
```
#### Contact
This project is under active development if you have any issue please let me know. Every help is much appreciated.
