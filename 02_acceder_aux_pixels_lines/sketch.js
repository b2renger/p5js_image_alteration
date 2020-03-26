let img // create a variable to hold our image

function preload() {
    // we load the image in the preload function - be sure to use a server of some kind
    img = loadImage("../assets/StyleGAN2_portrait.jpeg",
        // success callback passed to load image
        function () {
            console.log("image loaded")
            img.resize(50, 50) // resize the image to 100px * 100px
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
}

function draw() {
    myDrawing()
}


function myDrawing() {
    background(255)

    for (let i = 0; i < img.width; i++) { // go through each pixel horizontally
        for (let j = 0; j < img.height; j++) { // for each horizontal pixel go through each row of pixel
            // get the color of the pixel located at the coordinate (i,j)
            let col = img.get(i, j)
            // get the rgb components of the color (for each pixel)
            let r = red(col) // value between 0-255
            let g = green(col) // value between 0-255
            let b = blue(col) // value between 0-255
            // get the hue, saturation and brightness of the color
            let hu = hue(col) // value between 0-360
            let sa = saturation(col) // value between 0-100
            let br = brightness(col) // value between 0-100

            // remap the position of pixels to fill the whole canvas
            let xpos = map(i, 0, img.width, 0, width)
            let ypos = map(j, 0, img.height, 0, height)
            // calculate the length of a segment : this will the size of a tile
            let len = width / img.width;
            // calculate a value depending on the brightness that we will use as the strokeweight
            let sw = map(br, 0, 100, 10, 0.1)
            strokeWeight(sw)
            stroke(0)
            noFill()

            if (g > 60) { // if the green component of the pixel is above 60
                // draw a line from top left corner of a tile to the bottom right corner
                line(xpos, ypos, xpos + len, ypos + len)
            } else {
                // draw a line from the bottom left corner of a tile to the top right corner
                line(xpos, ypos + len, xpos + len, ypos)
            }

        }
    }
}

function timestamp() {
    return nf(year(),4,0) + "-" +nf(month(),2,0) + "-" + nf(day(),2,0) + "-" 
            + nf(hour(),2,0) + "h" + nf(minute(),2,0) + "m" + nf(second(),2,0) + "s"
}