//https://generateme.wordpress.com/2016/04/24/drawing-vector-field/

let img;
let menu
let agents = []

let params = {
    'mult': 1,
    'opacity': 100,
    'strokeW': 1
}

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
    noFill()
    //noStroke()
    // stroke(255)
    console.log(agents.length)

   
    let time = millis() / 10000.

    for (let i = 0; i < agents.length; i++) {
        let a = agents[i]

        stroke(a.gray, 50)
        strokeWeight(0.012)
        point(a.screenX, a.screenY)

        
        let p = createVector(a.x, a.y)
        // placeholder for vector field calculations
        let v1 = swirl(p, 1);

        let b = brightness(a.col)/(noise(time)*25.) ;
        let br = kampyle(b);

        let as =  v1.angleBetween(br);

        let v = astroid(as);
       

        a.screenX += v.x * params.mult;
        a.screenY += v.y * params.mult;

        a.update()

        if (a.screenY < 0 || a.screenY > height || a.screenX < 0 || a.screenX > width) {
            agents.splice(i, 1)
            agents.push(new Agent(random(img.width), random(img.height)))
        }




    }

}


class Agent {

    constructor(imgX, imgY) {
        this.imgX = imgX
        this.imgY = imgY

        this.col = img.get(imgX, imgY)
        this.gray = (red(this.col) + blue(this.col) + green(this.col)) * 0.33

        this.screenX = map(this.imgX, 0, img.width, 0, width)
        this.screenY = map(this.imgY, 0, img.height, 0, height)

        this.x = noise(this.imgX / img.width)
        this.y = noise(this.imgY / img.height)
    }

    update() {
        this.imgX = (map(this.screenX, 0, width, 0, img.width))
        this.imgY = (map(this.screenY, 0, height, 0, img.height))

        this.col = img.get(this.imgX, this.imgY)
        this.gray = (red(this.col) + blue(this.col) + green(this.col)) * 0.33
    }


}



function timestamp() {
    return nf(year(), 4, 0) + "-" + nf(month(), 2, 0) + "-" + nf(day(), 2, 0) + "-" +
        nf(hour(), 2, 0) + "h" + nf(minute(), 2, 0) + "m" + nf(second(), 2, 0) + "s"
}