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

            // calculate a variable called 's' to transform the brightness (which is between 0 and 100)
            // to a value between 0 and 20 (we will use this later as the radius of an ellipse)
            let s = map(br, 0, 100, 0, 20)

            if (sa > 25) { // if the saturation of the pixel is above 25
                ellipseMode(CORNER) // use the corner of the ellipse as anchor point to draw
                // use only the red component of the pixel to set stroke and fill color
                stroke(r, 0, 0)  
                fill(r,0,0)
                // recalculate the coordinates of the pixel to fit in the whole canvas
                let xpos = map(i, 0, img.width, 0, width)
                let ypos = map(j, 0, img.height, 0, height)
                // draw an ellipse at the right place at the rigth size
                ellipse(xpos, ypos, s , s )
            }
            else {
               
            }

        }
    }
}

function timestamp() {
    return year() + "-" + month() + "-" + day() + "-" + hour() + "h" + minute() + "m" + second() + "s"
}