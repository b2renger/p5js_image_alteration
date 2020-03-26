let img;

let params = {
    'mult': 5,
    'opacity': 128,
    'strokeW': 0.5,
    'fill': true,
    'curves': true,
    'curveTightness': 1, 
    'nS' : 5364
}



function preload() {
    // we load the image in the preload function - be sure to use a server of some kind
    img = loadImage("../assets/StyleGAN2_portrait.jpeg",
        // success callback passed to load image
        function () {
            console.log("image loaded")
            img.resize(100, 100) // resize the image to 100px * 100px
        },
        // error callback passed to load image
        function () {
            console.log("failed to load image - try checking the path")
        }
    )
}

function setup() {
    createCanvas(1000, 1000)
    pixelDensity(1)
    background(255)

    menu = QuickSettings.create(0, 0, "options");
    // parameter to change the deformation scale
    menu.addRange("item multiplier", 1, 20, params.mult, .1, function (v) {
        params.mult = v
    })
    menu.addRange("opacity", 0, 255, params.opacity, 1, function (v) {
        params.opacity = v
    })
    menu.addRange("stroke weight", 0, 10, params.strokeW, 0.1, function (v) {
        params.strokeW = v
    })
    menu.addBoolean("curves", params.curves, function (v) {
        params.curves = !params.curves
    });
    menu.addBoolean("fill", params.fill, function (v) {
        params.fill = !params.fill
    });
    menu.addRange("curves tightness", -10, 10, params.curveTightness, 0.1, function (v) {
        params.curveTightness = v
    })
    menu.addRange("noise seed", 0, 10000, params.nS, 1, function (v) {
        params.nS = v
        noiseSeed(params.nS)
    })

    noiseSeed(params.nS)
}

function draw() {
    myDrawing()
}

function myDrawing() {

    
    background(255)

    // check the fill parameter and choose filling accordingly
    if (params.fill == true) {
        fill(0, params.opacity) // apply the opacity parameter
    } else {
        noFill()
    }

    // apply a few more paramaters
    strokeWeight(params.strokeW)
    stroke(0, params.opacity)
    curveTightness(params.curveTightness)

    // we want to draw vertical lines, so we start by going through a horizontal line
    for (let i = 0; i < img.width; i++) {
        // for the vertical lining we will create a shape to link points togeteher vertically
        beginShape()
        for (let j = 0; j < img.height; j++) {
            // get image color
            let col = img.get(i, j)
            let gray = (red(col) + green(col) + blue(col)) * 0.33

            // remap the position of pixels to fill the whole canvas
            let xpos = map(i, 0, img.width, 0, width)
            let ypos = map(j, 0, img.height, 0, height)

            // get the grasp of the space between to pixels in the real canvas
            let tileSize = width / img.width

            // calculate the horizontal displacement
            let xOffset = map(noise(gray / 255), 0, 1, -tileSize * params.mult, tileSize * params.mult)

            // draw a curve or a line according to a parameter
            if (params.curves) {
                curveVertex(xpos + xOffset, ypos)
            } else {
                vertex(xpos + xOffset, ypos)
            }
        }
        endShape(CLOSE) // close our shape to get a filling
        // notice this gets closed for each vertical line - there is one bracket below
        // that corresponds to our first for loop
    }

}

function timestamp() {
    return year() + "-" + month() + "-" + day() + "-" + hour() + "h" + minute() + "m" + second() + "s"
}