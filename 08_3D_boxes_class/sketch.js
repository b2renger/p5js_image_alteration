let img;
let dataImage = [] // an array to store all our pixelData

// a class to hold all the pixels informations
class pixelData {
    constructor(x, y, col, gray, r, g, b, hu, sa, br) {
        this.x = x
        this.y = y
        this.col = col
        this.gray = gray
        this.r = r
        this.g = g
        this.b = b
        this.hu = hu
        this.sa = sa
        this.br = br
    }
}


function preload() {
    // we load the image in the preload function - be sure to use a server of some kind
    img = loadImage("../assets/StyleGAN2_portrait.jpeg",
        // success callback passed to load image
        function () {
            console.log("image loaded")
            img.resize(50, 50) // resize the image to 100px * 100px
            // go through all pixels
            for (let i = 0; i < img.width; i++) {
                for (let j = 0; j < img.height; j++) {
                    // extract all components
                    let col = img.get(i, j)
                    let r = red(col)
                    let g = green(col)
                    let b = blue(col)
                    let gray = (r + g + b) * 0.33
                    let hu = hue(col)
                    let sa = saturation(col)
                    let br = brightness(col)
                    // create a new pixel data object with all the values in the right order
                    let px = new pixelData(i, j, col, gray, r, g, b, hu, sa, br)
                    dataImage.push(px) // add this new pixel to our array
                }
            }
            console.log(dataImage)
        },
        // error callback passed to load image
        function () {
            console.log("failed to load image - try checking the path")
        }
    )
}


function setup() {
    createCanvas(1000, 1000, WEBGL)
    pixelDensity(1)
    background(255)
}



function draw() {
    myDrawing()
}

function myDrawing() {
    background(0)
    noFill()
    noStroke()

    shininess(20);
    ambientLight(50);
    specularColor(255, 255, 255);
    pointLight(255, 255, 255, width * 0.5, height * 0.00, 500);
    specularMaterial(255);

    orbitControl()

    translate(-width * 0.5, -height * 0.5, -100)



    for (let i = 0; i < dataImage.length; i++) {
        let px = dataImage[i]

        // remap the position of pixels to fill the whole canvas
        let xpos = map(px.x, 0, img.width, 50, width - 50)
        let ypos = map(px.y, 0, img.height, 50, height - 50)
        
        let rX = map(px.gray, 0, 255, 0, PI)
        let rY = map(px.gray, 0, 255, 0, PI / 4)

        push()
        fill(px.col)
        translate(xpos, ypos, 0)
        rotateX(rX + frameCount / 15.)
        rotateY(rY + frameCount / 10.)
        box(15)
        pop()
    }


}



function timestamp() {
    return nf(year(), 4, 0) + "-" + nf(month(), 2, 0) + "-" + nf(day(), 2, 0) + "-" +
        nf(hour(), 2, 0) + "h" + nf(minute(), 2, 0) + "m" + nf(second(), 2, 0) + "s"
}