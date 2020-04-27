let img;

let params = {
    numPoints: 500
}
let points = [] // store the random points to create triangles coordinates
let coordinates = [] // store triangles coordinates

let menu

function preload() {
    // we load the image in the preload function - be sure to use a server of some kind
    img = loadImage("../assets/StyleGAN2_portrait.jpeg",
        // success callback passed to load image
        function () {
            console.log("image loaded")
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

    menu = QuickSettings.create(0, 0, "options")
    menu.addRange("number of points", 100, 5000, params.numPoints, 1, function (v) {
        params.numPoints = v
    })
    menu.addButton("regenerate", function () {
        initPoints();
    })
    // a custom function to create random points and get the triangles coordinates
    initPoints()


}

function initPoints() {

    // reset array of points and coordinates
    points = []
    coordinates = []

    // add a certain number of random points to the points array
    for (let i = 0; i < params.numPoints; i++) {
        let px = random(img.width)
        let py = random(img.height)
        points.push([px, py])
    }
    // do calculate the triangles
    const delaunay = Delaunator.from(points);
    // get the triangles from the library and add them to our coordinates array
    for (let i = 0; i < delaunay.triangles.length; i += 3) {
        coordinates.push([
            points[delaunay.triangles[i]],
            points[delaunay.triangles[i + 1]],
            points[delaunay.triangles[i + 2]]
        ]);
    }
    //console.log(coordinates);
}



function draw() {
    myDrawing()
}

function myDrawing() {
    background(0)
    noFill()
    noStroke()

    // go through all the coordinates we calculated
    for (let i = 0; i < coordinates.length; i++) {

        // fin de the center of the current triangle
        let centerX = (coordinates[i][0][0] + coordinates[i][1][0] + coordinates[i][2][0]) * 0.333
        let centerY = (coordinates[i][0][1] + coordinates[i][1][1] + coordinates[i][2][1]) * 0.333

        // get the pixel color of the center
        let col = img.get(centerX, centerY)

        let gray = (red(col) + green(col) + blue(col)) * 0.33

        // remap the position from images coordinates to fullscreen
        let x1 = map(coordinates[i][0][0], 0, img.width, 0, width)
        let y1 = map(coordinates[i][0][1], 0, img.height, 0, height)

        let x2 = map(coordinates[i][1][0], 0, img.width, 0, width)
        let y2 = map(coordinates[i][1][1], 0, img.height, 0, height)

        let x3 = map(coordinates[i][2][0], 0, img.width, 0, width)
        let y3 = map(coordinates[i][2][1], 0, img.height, 0, height)


        if (gray < 60) {
            // draw the triangle with the right colors and the right positions
            stroke(255, 0, 0)
            //stroke(0)
            noFill()
            triangle(x1, y1, x2, y2, x3, y3)
        }

        if (gray > 60 && gray < 140) {
            // draw the triangle with the right colors and the right positions
            stroke(0, 255, 0)
          //  stroke(0)
          noFill()
            triangle(x1, y1, x2, y2, x3, y3)


        }
        if (gray > 140 && gray < 255) {
            // draw the triangle with the right colors and the right positions
            //fill(0, 0, 0)
            noFill()
            stroke(0, 255, 255)
            triangle(x1, y1, x2, y2, x3, y3)


        }
    }

}



function timestamp() {
    return nf(year(), 4, 0) + "-" + nf(month(), 2, 0) + "-" + nf(day(), 2, 0) + "-" +
        nf(hour(), 2, 0) + "h" + nf(minute(), 2, 0) + "m" + nf(second(), 2, 0) + "s"
}