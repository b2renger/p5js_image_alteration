let img
let menu 

// create a param object to store every parameter for our drawing
let params = {
    "length" : 10,
    "grayscale" : false,
    "alpha" : 255
}

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

    // create an option menu with the Quicksettings library
    // https://github.com/bit101/quicksettings#quicksettings
    menu = QuickSettings.create(0, 0, 'Options')
    // add a range slider (title, min, max, value, step, callback)
    menu.addRange('longueur des lignes', 1 , 100, 10, 1, 
        // pass a callback function to actualize the value when the user interacts
        // with the slider - the new value will be called 'v'
        function(v){
            // we replace the length value stored in ou params object by 'v' - the new value 
            // defined by the user
            params.length = v 
         })
    // add a boolean switch to turn on grayscale or color
    menu.addBoolean('niveaux de gris', params.grayscale, function(v){
        params.grayscale = v
    })
    // add another range to change the opacity of lines
    menu.addRange('opacité des lignes', 1 , 255, 255, 1, function(v){
        params.alpha = v
    })



}

function draw() {
    myDrawing()
}

function myDrawing() {

    background(255)


    for (let i = 0 ; i < img.width ; i++){
        for (let j = 0 ; j < img.height ; j++){

            let col = img.get(i,j)
            
            // extract the brightness to change strokeweight according to it
            let sw = map(brightness(col), 0, 100, 5, 0.1)
            strokeWeight(sw)

            // check the parameter grayscale
            if (params.grayscale == true){ // if true
                // calculate the mean of rgb components
                let gray = (red(col)+green(col)+ blue(col))/3.
                stroke(gray, params.alpha) // apply the alpha paramater
            }
            else{
                // recombine the rgb component with the alpha parameter
                stroke(red(col), green(col), blue(col), params.alpha)
            }

            // remap the position of pixels to fill the whole canvas
            let xpos = map(i, 0, img.width, 0, width)
            let ypos = map(j, 0, img.height, 0, height)

            // use the length define by ou parameters
            let len = params.length
            
            let sat = saturation(col) // extract the saturation of the pixel
            // transform it in a value we can use as an angle
            let angle = map(sat, 0, 100, 0, PI)
            
            // apply polar coordinates
            // https://www.openprocessing.org/sketch/151087
            let x = len * cos(angle)
            let y = len * sin(angle)

            // draw !
            push()
            translate(xpos, ypos)
            line(0, 0, x, y)
            pop()
        }
    }
}

function render() {

}

function timestamp() {
    return nf(year(),4,0) + "-" +nf(month(),2,0) + "-" + nf(day(),2,0) + "-" 
            + nf(hour(),2,0) + "h" + nf(minute(),2,0) + "m" + nf(second(),2,0) + "s"
}