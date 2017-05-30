var waveLength = 30;
var distanceBetweenSlits = 210;
var stippling = false;
var pixelSize = 1;

// generate gray gradient hex values
var hexValues = ['f','e','d','c','b','a','9','8','7','6','5','4','3','2','1','0'];
var colors = [];
for (var i = 0; i < hexValues.length; i++) {
  var hexValue1 = hexValues[i];
  for (var j = 0; j < hexValues.length; j++) {
    var hexValue2 = hexValues[j];
    var color = '#' + hexValue1 + hexValue2 + hexValue1 + hexValue2 + hexValue1 + hexValue2;
    colors.push(color);
  }
}

var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
var height = canvas.height;
var width = canvas.width;
var leftSlitCenter = [ (width - distanceBetweenSlits) / 2, height];
var rightSlitCenter = [ (width - distanceBetweenSlits) / 2 + distanceBetweenSlits, height ];

function drawPattern () {
  for (var x = 0; x <= width; x+=pixelSize) {
    for (var y = 0; y <= height; y+=pixelSize) {
      context.beginPath();
      context.fillStyle = getColor(x,y);
      context.rect(x,y,pixelSize,pixelSize);
      context.fill();
    }
  }
}

function getColor (x,y) {
  var leftColorLevel = getSlitColorLevel(x,y,leftSlitCenter);
  var rightColorLevel = getSlitColorLevel(x,y,rightSlitCenter);
  var colorLevel = (leftColorLevel + rightColorLevel) / 2;
  var color = getGradientColor(colorLevel);
  if (stippling) {
    color = getStipplingColor(colorLevel);
  }
  return color;
}

function getGradientColor (colorLevel) {
  return colors[Math.floor(colorLevel * colors.length)];
}

function getStipplingColor (colorLevel) {
  var random = Math.random();
  var color = '#fff';
  if (random < colorLevel) {
    color = '#000';
  }
  return color;
}

function getSlitColorLevel (x,y,slitCenter) {
  var slitX = slitCenter[0];
  var slitY = slitCenter[1];
  var r = getDistance(x,y,slitX,slitY);
  var theta = getTheta(x,y,slitX,slitY);
  var waveLevel = (Math.cos(Math.PI * r / waveLength) + 1) / 2; // factors wave pattern, scale of 0 to 1
  var arcLevel = Math.sin(theta); // greatest intensity in front of slit
  var distanceLevel = Math.sqrt(Math.max(0,height - r)/ height); // intensity dies off 1/r^2
  var colorLevel = Math.abs(waveLevel * arcLevel * distanceLevel);
  return colorLevel;
}

function getDistance (x1,y1,x2,y2) {
  xDist = x1 - x2;
  yDist = y1 - y2;
  return Math.sqrt(Math.pow(xDist,2) + Math.pow(yDist,2));
}

function getTheta (x,y,cx,cy) {
  xDist = x - cx;
  var r = getDistance(x,y,cx,cy);
  return Math.abs(Math.acos(xDist/r));
}

drawPattern();
