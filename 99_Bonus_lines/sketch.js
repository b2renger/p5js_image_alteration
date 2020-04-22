let img;
let menu

// a boolean to test that an image is effectively loaded 
let imageLoaded = false

// an array to store all our pixelData which is class written below
let dataImage = [] 

let params = {
    maxDistance : 500,
    sw : 0.2,
    alpha : 50,
    method : 0,
    min : 0,
    max : 50
}

let methods = ["red", "green", "blue", "gray", "hue", "saturation", "brightness"]

function preload() {
    // we load the image in the preload function - be sure to use a server of some kind
    img = loadImage("../assets/StyleGAN2_portrait.jpeg",
        // success callback passed to load image
        function () {
            console.log("image loaded")
            img.resize(100, 100)
            dataImage = []
            fillPixelArray(); // check the function below, there is a condition for a pixel to get in dataImage
            imageLoaded = true // pass the boolean at true to display the image
            console.log(dataImage)
        }

    )
}


function setup() {

    // the canvas now needs to created with a variable
    // this will allow us to register some events : like when a user drops a file
    let c = createCanvas(1000, 1000)
    pixelDensity(1)
    background(255)

    menu = QuickSettings.create(0, 0, "options")
    menu.addRange("max distance", 10, width, params.maxDistance, 1, function (v) {
        params.maxDistance = v
    })

    menu.addRange("stroke weight", 0.1, 5, params.sw, 0.05, function (v) {
        params.sw = v
    })

    menu.addRange("opacity", 1, 255, params.alpha, 1, function (v) {
        params.alpha = v
    })

    menu.addHTML("Sort pixels based on", ""); 

    menu.addDropDown("color component", methods, function(v){
        params.method = v.index
    }); 
    
    menu.addRange("minimum value", 0, 255, params.min, 1, function (v) {
        params.min = v
    })

    menu.addRange("maximum value", 0, 255, params.max, 1, function (v) {
        params.max = v
    })


    menu.addButton("redraw", function(){
        background(255)
        dataImage = []
        fillPixelArray()
        redraw()
    })

    // register a drop event  ie when a user drop an image on the canvas
    // when a drop event is registered => execute the function gotImage
    c.drop(gotImage);


}


function draw() {
    // we execute the code only if we have an image to work with
    if (imageLoaded) {
        myDrawing()
    }
}

function myDrawing() {
    //background(255)
    frameRate(2)
    noFill()
    strokeWeight(params.sw)
    stroke(0)

    for (let angle = 0 ; angle < TWO_PI ; angle += 0.1){
        let x1 = width*0.5 + width*0.5*cos(angle)
        let y1 = height*0.5 + height*0.5*sin(angle)

        for(let i = 0 ; i < dataImage.length ; i++){
            let px = dataImage[i]
            let x2 = map(px.x, 0, img.width, 0, width)
            let y2 = map(px.y, 0, img.height, 0, height)
            if (dist(x1,y1, x2,y2)< params.maxDistance){
                stroke(0,params.alpha)
                line(x1,y1, x2, y2)
            }
        }
    }
    
    noFill()
    stroke(255)
    strokeWeight(250)
    ellipse(width * 0.5, height * 0.5, width * 1.15, width * 1.15)

    noLoop()
}

function mousePressed() {
    //background(0)

    //redraw()
}





function timestamp() {
    return nf(year(), 4, 0) + "-" + nf(month(), 2, 0) + "-" + nf(day(), 2, 0) + "-" +
        nf(hour(), 2, 0) + "h" + nf(minute(), 2, 0) + "m" + nf(second(), 2, 0) + "s"
}

function fillPixelArray() {
    if (params.method > 3){
        colorMode(HSB,255,255,255)
    }
    else {
        colorMode(RGB,255,255,255)
    }
    for (let i = 0; i < img.width; i += 1) {
        for (let j = 0; j < img.height; j += 1) {

           

            let c = img.get(i, j)
            
            let gray = red(c) * 0.33 + green(c) * 0.33 + blue(c) * 0.33
            let r = red(c)
            let g = green(c)
            let b = blue(c)
            let hu = hue(c)
            let sa = saturation(c)
            let br = brightness(c)


            if ( params.method == 0 && r > params.min && r< params.max) {
                // create a new pixel data object with all the values in the right order
                let px = new pixelData(i, j, c, gray, r, g, b, hu, sa, br)
                dataImage.push(px) // add this new pixel to our array
            }
            else if ( params.method == 1 && g > params.min && g< params.max) {
                // create a new pixel data object with all the values in the right order
                let px = new pixelData(i, j, c, gray, r, g, b, hu, sa, br)
                dataImage.push(px) // add this new pixel to our array
            }
            else if ( params.method == 2 && b > params.min && b< params.max) {
                // create a new pixel data object with all the values in the right order
                let px = new pixelData(i, j, c, gray, r, g, b, hu, sa, br)
                dataImage.push(px) // add this new pixel to our array
            }
            else if ( params.method == 3 && gray > params.min && gray< params.max) {
                // create a new pixel data object with all the values in the right order
                let px = new pixelData(i, j, c, gray, r, g, b, hu, sa, br)
                dataImage.push(px) // add this new pixel to our array
            }
            else if ( params.method == 4 && hu > params.min && hu< params.max) {
                // create a new pixel data object with all the values in the right order
                let px = new pixelData(i, j, c, gray, r, g, b, hu, sa, br)
                dataImage.push(px) // add this new pixel to our array
            }
            else if ( params.method == 5 && sa > params.min && sa< params.max) {
                // create a new pixel data object with all the values in the right order
                let px = new pixelData(i, j, c, gray, r, g, b, hu, sa, br)
                dataImage.push(px) // add this new pixel to our array
            }
            else if ( params.method == 6 && br > params.min && br< params.max) {
                // create a new pixel data object with all the values in the right order
                let px = new pixelData(i, j, c, gray, r, g, b, hu, sa, br)
                dataImage.push(px) // add this new pixel to our array
            }

        }
    }

    colorMode(RGB,255,255,255)
}

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


// code to run when an image is dropped
function gotImage(file) {
    imageLoaded = false // pass the boolean to false to avoid crashing the program

    // load the new image and pass a succss callback function
    img = loadImage(file.data, function () {
        console.log("new image dropped loeded")

        img.resize(100, 100)
        dataImage = []
        fillPixelArray();
        imageLoaded = true // pass the boolean to true as the image IS loaded


    })
}