let img;
let menu

let params = {
    "layer1": true,
    "layer2": true,
    "layer3": false
}

function preload() {
    // we load the image in the preload function - be sure to use a server of some kind
    img = loadImage("../assets/StyleGAN2_portrait.jpeg",
        // success callback passed to load image
        function () {
            console.log("image loaded")
            img.resize(100, 100) // resize the image to 100px * 100px
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
    menu.addBoolean("layer1", params.layer1, function (v) {
        params.layer1 = v
    })
    menu.addBoolean("layer2", params.layer2, function (v) {
        params.layer2 = v
    })
    menu.addBoolean("layer3", params.layer3, function (v) {
        params.layer3 = v
    })

    menu.addButton("render to svg", function () {
        createCanvas(width, height, SVG);
        myDrawing();
        save(timestamp()); // give file name
        window.location.reload(0)
    });
}





function draw() {
    myDrawing()
}

function myDrawing() {
    background(255)
    noFill()
    stroke(0)


    for (let i = 0; i < img.width; i++) {
        for (let j = 0; j < img.height; j++) {
            // get image color
            let col = img.get(i, j)
            // get gray component by averaging red / green  and blue components
            let gray = (red(col) + green(col) + blue(col)) * 0.33

            // remap the position of pixels to fill the whole canvas
            let xpos = map(i, 0, img.width, 50, width - 50)
            let ypos = map(j, 0, img.height, 50, height - 50)

            // calculate the size of a for accoring to the gray value
            let tileSize = map(gray, 0, 255, width / img.width, 0)

            rectMode(CENTER)

            if (gray > 0 && gray < 75) { // if dark draw a rectangle
                if (params.layer1 == true) {
                    stroke(255, 0, 0)
                    rect(xpos, ypos, tileSize, tileSize)
                }
            }
            if (gray > 50 && gray < 125) { // if medium draw an ellipse
                if (params.layer2 == true) {
                    stroke(0, 0, 255)
                    ellipse(xpos, ypos, tileSize, tileSize)
                }
            }
            if (gray > 100 && gray < 175) { // if light draw a cross
                if (params.layer3 == true) {
                    stroke(0,255,0)
                    line(xpos - tileSize / 2, ypos - tileSize / 2, xpos + tileSize / 2, ypos + tileSize / 2)
                    line(xpos - tileSize / 2, ypos + tileSize / 2, xpos + tileSize / 2, ypos - tileSize / 2)
                }
            }
            // if lighter do nothing => keep white
        }
    }


}



function timestamp() {
    return nf(year(), 4, 0) + "-" + nf(month(), 2, 0) + "-" + nf(day(), 2, 0) + "-" +
        nf(hour(), 2, 0) + "h" + nf(minute(), 2, 0) + "m" + nf(second(), 2, 0) + "s"
}