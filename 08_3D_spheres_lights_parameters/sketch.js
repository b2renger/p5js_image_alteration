let img;
let menu

let params = {
    "red" : 255, 
    "green" : 255,
    "blue" : 255,
    "lightX" : 0,
    "lightY": 0,
    "maxOffset" : 400,
    "displacementMode" : 0
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
    createCanvas(1000, 1000, WEBGL)
    pixelDensity(1)
    background(255)

    menu = QuickSettings.create(0,0,"options")

    menu.addRange("light red component", 0, 255, params.red, 1, function(v){
        params.red = v
    })
    menu.addRange("lighgreen component", 0, 255, params.green, 1, function(v){
        params.green = v
    })
    menu.addRange("light blue component", 0, 255, params.blue, 1, function(v){
        params.blue= v
    })
    menu.addRange("light horizontal position", 0, width, params.lightX, 1, function(v){
        params.lightX= v
    })
    menu.addRange("light vertical position", 0, height, params.lightY, 1, function(v){
        params.lightY= v
    })
    menu.addRange("maximum z offset", -1000, 1000, params.maxOffset, 1, function(v){
        params.maxOffset= v
    })
    menu.addDropDown("displacement mode", ["gray", "hue", "saturation", "brightness"], function(v){
        params.displacementMode= v.index
    })
   
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
    pointLight(params.red, params.green, params.blue, params.lightX,params.lightY, 500); // using params !
    specularMaterial(255);

    // move around
    orbitControl()
    // recenter everything
    translate(-width * 0.5, -height * 0.5, -400)


  
    for (let i = 0; i < img.width; i++) {
        for (let j = 0; j < img.height; j++) {
            push()
            // get image color
            let col = img.get(i, j)
            // get gray component by averaging red / green  and blue components
            let gray = (red(col) + green(col) + blue(col)) * 0.33
            // calculate other components
            colorMode(HSB, 360, 100, 100)
            let h = hue(col)
            let s = saturation(col)
            let b = brightness(col)
          

            // remap the position of pixels to fill the whole canvas
            let xpos = map(i, 0, img.width, 50, width - 50)
            let ypos = map(j, 0, img.height, 50, height - 50)

        

            // we want to calculate those two variable in several displacement modes
            let zoffset // z-position
            let sphereSize //size

            if (params.displacementMode == 0){ // map with gray component
                zoffset = map(gray, 0, 255, 0, params.maxOffset)
                sphereSize = map(gray , 0, 255, 0,  width / img.width )
            }
            else if (params.displacementMode == 1){ // map with hue
                zoffset = map(h, 0, 360, 0, params.maxOffset)
                sphereSize = map(h , 0, 360, 0,  width / img.width )
            }
            else if (params.displacementMode == 2){ // map with saturation
                zoffset = map(s, 0, 100, 0, params.maxOffset)
                sphereSize = map(s , 0, 100, 0,  width / img.width )
            }
            else if (params.displacementMode == 3){ // map with brightness
                zoffset = map(b, 0, 100, 0, params.maxOffset)
                sphereSize = map(b , 0, 100, 0,  width / img.width )
            }

            // go back to rgb mode to get the colors right 
            // (you can try to remove the line below => it's fun !)
            colorMode(RGB)
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