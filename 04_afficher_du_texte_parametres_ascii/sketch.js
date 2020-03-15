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
let params = {
    'tailleElt': 16,
    'currentFont': "Monoton",
    'message': " .:=*/$"
}

let fonts = ["Trade Winds", "Dancing Script", "Great Vibes", "Rock Salt", "Monoton"]

function setup() {
    createCanvas(1000, 1000)
    pixelDensity(1)

    menu = QuickSettings.create(0, 0, "options")
    menu.addRange("taille des éléments", 10, 25, params.tailleElt, 0.1, function (v) {
        params.tailleElt = v
    })
    menu.addDropDown("choix de la police", fonts, function (v) {
        params.currentFont = v.label
    })
    menu.addText("message à afficher", params.message, function (v) {
        params.message = v
    })
    textFont(params.currentFont)
}

function draw() {
    myDrawing()
}

function myDrawing() {
    background(255)
    textSize(params.tailleElt)
    textFont(params.currentFont)

    for (let i = 0; i < img.width; i++) {
        for (let j = 0; j < img.height; j++) {
            let col = img.get(i, j)

           
            let br = brightness(col)

            // remap the position of pixels to fill the whole canvas
            let xpos = map(i, 0, img.width, 0, width)
            let ypos = map(j, 0, img.height, 0, height)

            // map the brightness to a position index to be able to draw only one character in the message
            let characterIndex = int(map(br, 0, 100, params.message.length, 0))
            // extract the right parameter from the string
            let char  = params.message.charAt(characterIndex)

            // draw everyting 
            push()
            fill(0)
            textAlign(CENTER, CENTER)
            translate(xpos, ypos)
            text(char, 0, 0)
            pop()

        }
    }

}

function render() {

}

function timestamp() {
    return "-" + +year() + "-" + month() + "-" + day() + "-" + hour() + "h" + minute() + "m" + second() + "s"
}