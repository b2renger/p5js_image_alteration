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
    // activate webgl mode !!
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

    // set up the lights
    shininess(20);
    ambientLight(50);
    specularColor(255, 255, 255 );
    pointLight(255, 255, 255, width*0.5, height*0.00, 500); // first color, then position
    specularMaterial(255);

    // allow the posibility to move around
    orbitControl()

    // re-center everything
    translate(-width * 0.5, -height * 0.5, -400)

    for (let i = 0; i < img.width; i++) {
        for (let j = 0; j < img.height; j++) {
            
            // get image color
            let col = img.get(i, j)
            // get gray component by averaging red / green  and blue components
            let gray = (red(col) + green(col) + blue(col)) * 0.33
          
            // remap the position of pixels to fill the whole canvas
            let xpos = map(i, 0, img.width, 50, width - 50)
            let ypos = map(j, 0, img.height, 50, height - 50)

            // calculate a displacement according to the gray
            let zoffset = map(gray, 0, 255, 0, 400)
            // calculate a sphere size
            let sphereSize = map(gray , 0, 255, 0, 15)

            push()
            fill(col)
            translate(xpos, ypos, zoffset)
            sphere(sphereSize, 10, 10)
            pop()
        }
    }


}



function timestamp() {
    return nf(year(), 4, 0) + "-" + nf(month(), 2, 0) + "-" + nf(day(), 2, 0) + "-" +
        nf(hour(), 2, 0) + "h" + nf(minute(), 2, 0) + "m" + nf(second(), 2, 0) + "s"
}