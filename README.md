# a-framedc
charts built with A-frame

#### Browser Installation

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.5.0/aframe.min.js"></script>
  <script src="https://unpkg.com/a-framedc@1.0.0/dist/aframedc.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity barchart="width:10;height:10;" />
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
require('a-framedc');
```
