let img
let menu

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

// the list of the fonts name we want to use in our sketch - thoses where added to the index.html file aswell
let fonts = ["Trade Winds", "Dancing Script","Great Vibes", "Rock Salt", "Monoton" ]

// parameter object : size / font chosen / message to display
let params = {
    'tailleElt' : 1.5,
    'currentFont' : "Great Vibes",
    'message' : "//////"
}


function setup() {
    createCanvas(1000, 1000)
    pixelDensity(1)

    // quicksettings menu
    menu = QuickSettings.create(0,0,"options")
    // a slider for the text
    menu.addRange("taille des éléments", 0, 2 , params.tailleElt , 0.1, function(v){
        params.tailleElt = v
    })
    // a menu to choose the font
    menu.addDropDown("choix de la police", fonts, function(v){
        params.currentFont = v.label
    })
    // a text field to change the message
    menu.addText("message à afficher", params.message, function(v){
        params.message = v
    })
    //
    textFont(params.currentFont)
}

function draw() {
    myDrawing()
}

function myDrawing() {
    background(255)
    // apply the font chosen 
    textFont(params.currentFont)

    for (let i = 0; i < img.width; i++) {
        for (let j = 0; j < img.height; j++) {
            let col = img.get(i, j)
            let r = red(col)
            let br = brightness(col)
            let s = saturation(col)

            // remap the position of pixels to fill the whole canvas
            let xpos = map(i, 0, img.width, 0, width)
            let ypos = map(j, 0, img.height, 0, height)
            
            // map the red component to a variable that will be used as the size of the text
            let textS = map(r, 0, 255, 5, 15)
            // map the saturation to a variable that will be used as the orientation of the text
            let angle = map(s, 0, 100, 0, PI)

            // draw !
            if (br < 75) {
                push()
                fill(col)
                stroke(col)
                textAlign(CENTER, CENTER)
                translate(xpos, ypos)
                rotate(angle)
                textSize(textS * params.tailleElt) 
                text(params.message, 0, 0)
                pop()
            }
        }
    }

}

function render() {

}

function timestamp() {
    return nf(year(),4,0) + "-" +nf(month(),2,0) + "-" + nf(day(),2,0) + "-" 
            + nf(hour(),2,0) + "h" + nf(minute(),2,0) + "m" + nf(second(),2,0) + "s"
}