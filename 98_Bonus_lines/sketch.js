let img;
let menu

let rad1 = 1


// a boolean to test that an image is effectively loaded 
let imageLoaded = false

let params = {
    sw: 0.2,
    alpha: 50,
    dens: 5,
    minLength : 1,
    maxLength : 50,
    minAngle: 0,
    maxAngle: 6.28
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
    fill(0)
    ellipse(width * 0.5, height * 0.5, width, height)
    noFill()

    menu = QuickSettings.create(0, 0, "options")
    menu.addRange("stroke weight", 0.1, 40, params.sw, 0.05, function (v) {
        params.sw = v
    })
    menu.addRange("opacity", 1, 255, params.alpha, 1, function (v) {
        params.alpha = v
    })
    menu.addRange("density", 1, 20, params.dens, 1, function (v) {
        params.dens = v
    })
    menu.addRange("minimum stroke length", 1, 100, params.minLength, 1, function (v) {
        params.minLength = v
    })
    menu.addRange("maximum stroke length", 10, 150, params.maxLength, 1, function (v) {
        params.maxLength = v
    })
    menu.addRange("minimum angle", 0, 6.28, params.minAngle, 0.1, function (v) {
        params.minAngle = v
    })
    menu.addRange("maximum angle", 0, 6.28, params.maxAngle, 0.1, function (v) {
        params.maxAngle = v
    })




    menu.addButton("redraw", function () {
        rad1 = 1
        background(255)
        fill(0)
        ellipse(width * 0.5, height * 0.5, width, height)
        noFill()

        redraw()
    })


    // register a drop event  ie when a user drop an image on the canvas
    // when a drop event is registered => execute the function gotImage
    c.drop(gotImage);


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
    if (rad1 < width * 0.5) {
        noFill()
       strokeCap(ROUND)

        strokeWeight(params.sw)
        colorMode(HSB, 255, 255, 255, 255)


        for (let i = 0; i < TWO_PI; i += params.dens * 0.005) {


            let xsample = img.width / 2 + rad1 * cos(i)
            let ysample = img.height / 2 + rad1 * sin(i)


            let c = img.get(xsample, ysample)

            let gray = red(c) * 0.33 + green(c) * 0.33 + blue(c) * 0.33
            let r = red(c)
            let g = green(c)
            let b = blue(c)
            let h = hue(c)
            let s = saturation(c)
            let br = brightness(c)


            let xpos2 = map(xsample, 0, img.width, 0, width)
            let ypos2 = map(ysample, 0, img.height, 0, height)

            let rad = map(br, 0, 255, params.maxLength, params.minLength)
            let angle = map(h, 0, 255, params.minAngle, params.maxAngle)

            let xpos1 = xpos2 + rad * cos(angle)
            let ypos1 = ypos2 + rad * sin(angle)

            stroke(255, params.alpha)
            line(xpos1, ypos1, xpos2, ypos2)


        }
        rad1+=1


    }

}





function timestamp() {
    return nf(year(), 4, 0) + "-" + nf(month(), 2, 0) + "-" + nf(day(), 2, 0) + "-" +
        nf(hour(), 2, 0) + "h" + nf(minute(), 2, 0) + "m" + nf(second(), 2, 0) + "s"
}