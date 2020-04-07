let img;

let menu
let numPoints = 150;

// a boolean to test that an image is effectively loaded 
let imageLoaded = false


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

    menu = QuickSettings.create(0, 0, "options")
    menu.addRange("number of points", 10, 1000, numPoints, 1, function (v) {
        numPoints = v
        initPoints()
    })
    initPoints()

    // register a drop event  ie when a user drop an image on the canvas
    // when a drop event is registered => execute the function gotImage
    c.drop(gotImage);


}

// code to run when an image is dropped
function gotImage(file) {
    imageLoaded = false // pass the boolean to false to avoid crashing the program

    // load the new image and pass a succss callback function
    img = loadImage(file.data, function(){
        console.log("new image dropped loeded")
        imageLoaded = true // pass the boolean to true as the image IS loaded
        initPoints() // re-init points
    })
}

function initPoints() {

    points = []
    coordinates = []

    for (let i = 0; i < numPoints; i++) {
        let px = random(img.width)
        let py = random(img.height)
        points.push([px, py])
    }

    //console.log(points)
    const delaunay = Delaunator.from(points);

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
    // we execute the code only if we have an image to work with
    if (imageLoaded) {
        myDrawing()
    }
}

function myDrawing() {
    background(0)
    noFill()
    noStroke()
    // stroke(255)

    
        coordinates = []

        for (let i = 0; i < numPoints; i++) {
            points[i][0] = points[i][0] + map(noise(i, frameCount / 100.), 0, 1, -0.1, 0.1)
            points[i][1] = points[i][1] + map(noise(i, frameCount / 150.), 0, 1, -0.1, 0.1)

            points[i][0] = constrain(points[i][0], 0, img.width)
            points[i][1] = constrain(points[i][1], 0, img.height)
        }

        let delaunay = Delaunator.from(points);

        for (let i = 0; i < delaunay.triangles.length; i += 3) {
            coordinates.push([
                points[delaunay.triangles[i]],
                points[delaunay.triangles[i + 1]],
                points[delaunay.triangles[i + 2]]
            ]);
        }


        for (let i = 0; i < coordinates.length; i++) {

            let centerX = (coordinates[i][0][0] + coordinates[i][1][0] + coordinates[i][2][0]) * 0.333
            let centerY = (coordinates[i][0][1] + coordinates[i][1][1] + coordinates[i][2][1]) * 0.333

            let col = img.get(centerX, centerY)

            let x1 = map(coordinates[i][0][0], 0, img.width, 0, width)
            let y1 = map(coordinates[i][0][1], 0, img.height, 0, height)

            let x2 = map(coordinates[i][1][0], 0, img.width, 0, width)
            let y2 = map(coordinates[i][1][1], 0, img.height, 0, height)

            let x3 = map(coordinates[i][2][0], 0, img.width, 0, width)
            let y3 = map(coordinates[i][2][1], 0, img.height, 0, height)

            fill(col)
            stroke(col)
            triangle(x1, y1, x2, y2, x3, y3)

        }

}



function timestamp() {
    return nf(year(), 4, 0) + "-" + nf(month(), 2, 0) + "-" + nf(day(), 2, 0) + "-" +
        nf(hour(), 2, 0) + "h" + nf(minute(), 2, 0) + "m" + nf(second(), 2, 0) + "s"
}