
let img // create a variable to hold our image

function preload() {
    // we load the image in the preload function - be sure to use a server of some kind
    img = loadImage("../assets/StyleGAN2_portrait.jpeg",
            // success callback passed to load image
            function(){
                console.log("image loaded")
                img.resize(100,100) // resize the image to 100px * 100px
            },
            // error callback passed to load image
            function(){
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
    // we want the anchor point of our image to be its center
    imageMode(CENTER) 
    // we draw the image in the center of our screen
    image(img, width*0.5, height*0.5)
   
}

function timestamp() {
    return nf(year(),4,0) + "-" +nf(month(),2,0) + "-" + nf(day(),2,0) + "-" 
            + nf(hour(),2,0) + "h" + nf(minute(),2,0) + "m" + nf(second(),2,0) + "s"
}