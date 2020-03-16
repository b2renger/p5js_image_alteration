let img;
// two variables to hold two variant of the fonteawesome font
let faReg // one regular
let faBold // one bold


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

    // load the regular font - with a callback function
    faReg = loadFont("../assets/Font Awesome 5 Free-Regular-400.otf",
        function () {
            console.log("font awesome reg loaded")
        }
    )
    // load the bold font - with a callback function
    faBold = loadFont("../assets/Font Awesome 5 Free-Solid-900.otf",
        function () {
            console.log("font awesome bold loaded")
        })
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
            let br = brightness(col)

            // calculate a value that will be used as the size of our text 
            // we map the red component from 20 to 5 (no red == no text)
            let txtSiz = map(sa, 0, 100, 20, 5)

           // remap the position of pixels to fill the whole canvas
            let xpos = map(i, 0, img.width, 0, width)
            let ypos = map(j, 0, img.height, 0, height)
          
            // draw everything
            push()
            textSize(txtSiz)
            translate(xpos, ypos)
            if (br > 60){
                fill(255,200,120) // orange
                textFont(faBold) // bold font
                text('\uf0e7', 0, 0) // bolt icon => https://fontawesome.com/icons/bolt?style=solid
            }
            else if (br > 30 && br < 60) { 
                fill(0, 100, 255) // light blue
                textFont(faReg) // regulat font
                text('\uf556', 0, 0) // angry smiley => https://fontawesome.com/icons/angry?style=regular
            } else  {
                fill(255,100,255) // purple
                textFont(faBold) // bold font
                text('\uf1e2', 0, 0) // bomb icon => https://fontawesome.com/icons/bomb?style=solid
            }

            pop()


        }
    }

}

function render() {

}

function timestamp() {
    return "-" + +year() + "-" + month() + "-" + day() + "-" + hour() + "h" + minute() + "m" + second() + "s"
}