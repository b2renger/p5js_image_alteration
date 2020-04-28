
/*
sites are the points for calculation of a voronoi diagram

rhil.voronoi.js (https://github.com/gorhill/Javascript-Voronoi) calculates voronoi diagrams
from a list of points.

bounding box and sites can be generated via initVoronoi()
updateVoronoi recomputes the voronoi diagram when sites are manipulated

a simple animation of sites is made with some oimple noise
*/


let img;
let menu


let sites = []
let diagram
let voronoi
let bbox

let params = {
    "number": 500,
    "rate": 1,
    "animated": true,
    "stroke": true,
    "strokeWeight": 1,
    "fill": true,
}


function preload() {
    // we load the image in the preload function - be sure to use a server of some kind
    img = loadImage("../assets/StyleGAN2_portrait.jpeg",
        // success callback passed to load image
        function () {
            console.log("image loaded")
            imageLoaded = true // pass the boolean at true to display the image
        }

    )
}


function setup() {

    // the canvas now needs to created with a variable
    // this will allow us to register some events : like when a user drops a file
    let c = createCanvas(1000, 1000)
    pixelDensity(1)
    background(255)


    // register a drop event  ie when a user drop an image on the canvas
    // when a drop event is registered => execute the function gotImage
    c.drop(gotImage);

    menu = QuickSettings.create(0, 0, "options")

    menu.addBoolean("animated", params.animated, function (v) {
        params.animated = v
    })

    menu.addRange("animation rate", 0.5, 20, params.rate, 0.1, function (v) {
        params.rate = v
    })

    menu.addRange("number", 10, 3000, params.number, 1, function (v) {
        params.number = v
        initVoronoi()
    })

    menu.addBoolean("colorized stroke", params.stroke, function (v) {
        params.stroke = v
    })

    menu.addBoolean("colorized fill", params.fill, function (v) {
        params.fill = v
    })

    menu.addRange("stroke weight", 0.1, 25, params.strokeWeight, 1, function (v) {
        params.strokeWeight = v
    })

    menu.addButton("redraw", function () {
        initVoronoi()
    })

    initVoronoi()


}

function initVoronoi() {
    voronoi = new Voronoi();
    bbox = {
        xl: 0,
        xr: width,
        yt: 0,
        yb: height
    }; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom

    sites = []
    for (let i = 0; i < params.number; i++) {
        sites.push({
            x: random(width),
            y: random(height)
        })
    }


}

function updateVoronoi() {
    diagram = voronoi.compute(sites, bbox);
}

// code to run when an image is dropped
function gotImage(file) {
    imageLoaded = false // pass the boolean to false to avoid crashing the program

    // load the new image and pass a succss callback function
    img = loadImage(file.data, function () {
        console.log("new image dropped loeded")
        imageLoaded = true // pass the boolean to true as the image IS loaded

    })
}

function draw() {
    // we execute the code only if we have an image to work with
    if (imageLoaded) {
        myDrawing()
    }
}

function myDrawing() {

    background(0)
    strokeWeight(params.strokeWeight)

    if (params.animated) {
        for (let i = 0; i < sites.length; i++) {
            sites[i].x += map(noise(frameCount / 100., i, 12), 0, 1, -params.rate, params.rate)
            sites[i].y += map(noise(frameCount / 100., i, 43), 0, 1, -params.rate, params.rate)
        }
    }


    updateVoronoi()

    for (let i = 0; i < diagram.cells.length; i++) {
        let c = diagram.cells[i]

        let x = int(map(c.site.x, 0, width, 0, img.width))
        let y = int(map(c.site.y, 0, height, 0, img.height))
        let col = img.get(x, y)


        if (params.stroke) {
            stroke(col)
        } else {
            stroke(0)
        }
        if (params.fill){
            fill(col)
        }
        else {
            noFill()
        }
        
        beginShape()
        for (let j = 0; j < c.halfedges.length; j++) {
            let he = c.halfedges[j]
            vertex(he.getEndpoint().x, he.getEndpoint().y)

        }
        endShape()


    }
}



function timestamp() {
    return nf(year(), 4, 0) + "-" + nf(month(), 2, 0) + "-" + nf(day(), 2, 0) + "-" +
        nf(hour(), 2, 0) + "h" + nf(minute(), 2, 0) + "m" + nf(second(), 2, 0) + "s"
}