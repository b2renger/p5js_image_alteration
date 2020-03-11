

function preload() {
    
}

function setup() {
    createCanvas(1000, 1000)
    pixelDensity(1)
}

function draw() {
    myDrawing()
}

function myDrawing() {
   
}

function timestamp() {
    return year() + "-" + month() + "-" + day() + "-" + hour() + "h" + minute() + "m" + second() + "s"
}