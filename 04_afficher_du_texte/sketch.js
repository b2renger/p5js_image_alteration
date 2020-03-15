let img;

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
    background(255)
}

function draw() {
    myDrawing()
}

function myDrawing() {
    background(255)
    
    for (let i = 0; i < img.width; i++) {
        for (let j = 0; j < img.height; j++) {
            // get image color
            let col = img.get(i, j)
            // extract red component and saturation
            let r = red(col)
            let sa = saturation(col)
            
            // calculate a value that will be used as the size of our text 
            // we map the red component from 20 to 0 (no red == no text)
            let txtSiz = map(r, 0, 255, 20, 0)
            let angle = map(sa, 0, 100, 0, TWO_PI)

            // draw everything
            push()
            fill(0)
            textAlign(CENTER, CENTER)
            // try other alignment
            // textAlign(LEFT, TOP)
            // textAlign(RIGHT, BOTTOM)
            // remap the position of pixels to fill the whole canvas
            let xpos = map(i, 0, img.width, 0, width)
            let ypos = map(j, 0, img.height, 0, height)
            translate(xpos, ypos)
            rotate(angle)
            textSize(txtSiz)
            text("Hello", 0,0)
            pop()


        }
    }

}

function render() {

}

function timestamp() {
    return "-" + +year() + "-" + month() + "-" + day() + "-" + hour() + "h" + minute() + "m" + second() + "s"
}