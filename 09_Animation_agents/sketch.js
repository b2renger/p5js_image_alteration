//https://generateme.wordpress.com/2016/04/24/drawing-vector-field/

let img;
let menu


let params = {
    'mult': 0.5,
    'opacity': 3,
    'strokeW': 50,
    'mode': 0
}
// available modes for image deformation( see menu )
modes = ["hue", "saturation", "brightness", "red", "green", "blue", "gray"]


// an array to store all our agents
let agents = []

function preload() {
    // we load the image in the preload function - be sure to use a server of some kind
    img = loadImage("../assets/StyleGAN2_portrait.jpeg",
        // success callback passed to load image
        function () {
            console.log("image loaded")
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
    background(255)

    menu = QuickSettings.create(0, 0, "options")
    menu.addRange("item multiplier", 0, 10, params.mult, .1, function (v) {
        params.mult = v
    })
    menu.addRange("opacity", 2, 255, params.opacity, 1, function (v) {
        params.opacity = v
    })
    menu.addRange("épaisseur", 0.05, 50, params.opacity, 0.1, function (v) {
        params.strokeW = v
    })
    menu.addDropDown("mode de deformation", modes, function (v) {
        params.mode = v.index
        background(255)
    })

    // create a bunch of agents at random position in the image
    for (let i = 0; i < 500; i++) {
        agents.push(new Agent((random(img.width)), (random(img.height))))
    }
    console.log(agents)
}

function draw() {
    myDrawing()
}

function myDrawing() {
    //background(255)
    console.log(agents)
    // we go through all the agents available
    for (let i = 0; i < agents.length; i++) {
        // take the agent stored at the ith slot in our array
        let a = agents[i]

        // draw a point at the screen position
        stroke(red(a.col), green(a.col), blue(a.col),  params.opacity)
        noFill()
        ellipse(a.screenX, a.screenY, params.strokeW, params.strokeW)

        // create to coordinates mofifiers accordin to the color or the pixel
        let vx
        let vy

        if (params.mode == 0) {
            vx = cos(hue(a.col) * TWO_PI / 360.)
            vy = sin(hue(a.col) * TWO_PI / 360.)
        } else if (params.mode == 1) {
            vx = cos(saturation(a.col) * TWO_PI / 100.)
            vy = sin(saturation(a.col) * TWO_PI / 100.)
        } else if (params.mode == 2) {
            vx = cos(brightness(a.col) * TWO_PI / 100.)
            vy = sin(brightness(a.col) * TWO_PI / 100.)
        } else if (params.mode == 3) {
            vx = cos(red(a.col) * TWO_PI / 255.)
            vy = sin(red(a.col) * TWO_PI / 255.)
        } else if (params.mode == 4) {
            vx = cos(green(a.col) * TWO_PI / 255.)
            vy = sin(green(a.col) * TWO_PI / 255.)
        } else if (params.mode == 5) {
            vx = cos(blue(a.col) * TWO_PI / 255.)
            vy = sin(blue(a.col) * TWO_PI / 255.)
        } else if (params.mode == 6) {
            vx = cos((a.gray) * TWO_PI / 255.)
            vy = sin((a.gray) * TWO_PI / 255.)
        }

        // move the agent's screen coordinates
        a.screenX += vx * params.mult;
        a.screenY += vy * params.mult;

        // call update to update the lookup coordinates
        // aswell as lookup color for next iteration
        a.update()

        // if the agent gets out of the screen
        if (a.screenY < 0 || a.screenY > height || a.screenX < 0 || a.screenX > width) {
            agents.splice(i, 1) // remove it
            agents.push(new Agent(random(img.width), random(img.height))) // create a new one
        }

    }

}



function timestamp() {
    return nf(year(), 4, 0) + "-" + nf(month(), 2, 0) + "-" + nf(day(), 2, 0) + "-" +
        nf(hour(), 2, 0) + "h" + nf(minute(), 2, 0) + "m" + nf(second(), 2, 0) + "s"
}

// a class agents that will store a few things for us.
// an agent is a pixel moving autonomously in our image. We will use the class to
// store its position in the image and the color and gray level of this position
// we will also store the screen coordinates. The agent will modify its screen coordinates
// according to the color in the lookup image.
class Agent {

    constructor(imgX, imgY) {
        // image position
        this.imgX = imgX
        this.imgY = imgY
        // color components for the screen position
        this.col = img.get(imgX, imgY)
        this.gray = (red(this.col) + blue(this.col) + green(this.col)) * 0.33
        // screen position
        this.screenX = map(this.imgX, 0, img.width, 0, width)
        this.screenY = map(this.imgY, 0, img.height, 0, height)
    }

    update() {
        // remap screen position to image position for the next iteration
        this.imgX = (map(this.screenX, 0, width, 0, img.width))
        this.imgY = (map(this.screenY, 0, height, 0, img.height))
        // update the color and gray values according to the lookup position
        this.col = img.get(this.imgX, this.imgY)
        this.gray = (red(this.col) + blue(this.col) + green(this.col)) * 0.33
    }


}