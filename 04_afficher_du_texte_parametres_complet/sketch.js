let img
let menu

// txt from Ionesco - Rhinocéros
let txt = "Bérenger: Si cela s'était passé ailleurs, dans un autre pays et qu'on eût appris cela par les journaux, on pourrait discuter paisiblement de la chose, étudier la question sur toutes ses faces, en tirer objectivement des conclusions. On organiserait des débats, on ferait venir des savants, des écrivains, des hommes de loi, des femmes savantes, des artistes. Des hommes de la rue aussi, ce serait intéressant, passionnant, instructif. Mais quand vous êtes pris vous-même dans l'événement, quand vous êtes mis tout à coup devant la réalité brutale des faits, on ne peut pas ne pas se sentir concerné directement, on est trop violemment surpris pour garder tout son sang- froid. Moi, je suis surpris, je suis surpris, je suis surpris! Je n'en reviens pas."


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
    'tailleElt': 1.3,
    'currentFont': "Dancing Script"
}

let fonts = ["Trade Winds", "Dancing Script", "Great Vibes", "Rock Salt", "Monoton"]

function setup() {
    createCanvas(1000, 1000)
    pixelDensity(1)

    menu = QuickSettings.create(0, 0, "options")
    menu.addRange("taille des éléments", 0, 2, params.tailleElt, 0.1, function (v) {
        params.tailleElt = v
    })
    menu.addDropDown("choix de la police", fonts, function (v) {
        params.currentFont = v.label
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
            let textS = map(br, 0, 100, 26, 10)
            textSize(params.tailleElt * textS)

            // remap the position of pixels to fill the whole canvas
            let xpos = map(i, 0, img.width, 0, width)
            let ypos = map(j, 0, img.height, 0, height)

            // caclulate which character to display according to the position of the pixel
            let characterIndex = ( i + j * img.width ) % txt.length
            // extract the right parameter from the string
            let char  = txt.charAt(characterIndex)

            // draw everyting 
            push()
            fill(col)
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
    return nf(year(),4,0) + "-" +nf(month(),2,0) + "-" + nf(day(),2,0) + "-" 
            + nf(hour(),2,0) + "h" + nf(minute(),2,0) + "m" + nf(second(),2,0) + "s"
}