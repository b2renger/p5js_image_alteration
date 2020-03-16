# p5js_image_alteration

This repo is a curiculum dedicated to the manipulation of images through their pixels with [p5.js](https://p5js.org/). This is a project taught at [l'école de design de Nantes](https://www.lecolededesign.com/) in graphic design. The curriculum is here detailed in french, but comments in each example are written in english.

L'objectif de ce repo est de découvrir les différentes techniques de manipulation d'images à travers l'analyse de leurs pixels avec [p5.js](https://p5js.org/). Les techniques décrites ici sont accessibles aux débutants il est cependant nécessaire de connaitre les bases de la programmation avec p5js dans un environnement de développement de votre choix c'est à dire par exemple d'avoir lu et intégrer les 3 premiers paragraphes de cette [ressource d'introduction](https://github.com/b2renger/Introduction_p5js) :

- [Comment travailler avec p5js](https://github.com/b2renger/Introduction_p5js#p5js_tools)
- [Les principes de base](https://github.com/b2renger/Introduction_p5js#bases)
- [Dessiner avec la souris](https://github.com/b2renger/Introduction_p5js#dessiner)

Les images que nous utiliserons pour ces exemples sont générés via un algorithme d'intelligence artificielle appelé **StyleGan2** disponible à travers le logiciel [runwayML](https://runwayml.com/).

<img src="assets/StyleGAN_landscape.jpeg " alt="landscape" width="200" height="whatever"> <img src="assets/StyleGAN2_portrait.jpeg " alt="landscape" width="200" height="whatever">

Exemples de rendus : 

<img src="result_images/example_02_ellipses.png " alt="portrait" width="200" height="whatever"> <img src="result_images/example_02_lines.png " alt="portrait" width="200" height="whatever"> <img src="result_images/example_02_lines_rotation.png " alt="portrait" width="200" height="whatever"> <img src="result_images/example_04_texte.png" alt="portrait" width="200" height="whatever"> <img src="result_images/example_04_texte_ascii.png" alt="portrait" width="200" height="whatever"> <img src="result_images/example_04_texte_complet.png" alt="portrait" width="200" height="whatever"> <img src="result_images/example_05_fontawesome.png" alt="portrait" width="200" height="whatever">

<img src="result_images/example_03_params.gif" alt="portrait" width="200" height="whatever"> <img src="result_images/example_03_params_multiples.gif" alt="portrait" width="200" height="whatever"> <img src="result_images/example_04_texte_parameters.gif" alt="portrait" width="200" height="whatever">



## Contenu



## Squelette de code
Vous trouverez dans le dossier nommé **00_empty** le squelette de base du programme p5js que nous allons utiliser. Notez que ce squelette comporte une fonction **timestamp()** précodée qui nous permettra de générer une chaîne de caractère représentant la date au moment de son appel :

```js
function timestamp() {
    return year() + "-" + month() + "-" + day() + "-" + hour() + "h" + minute() + "m" + second() + "s"
}
```
Cette fonction nous sera utile au moment des exports afin de nous assurer de l'unicité des noms des fichiers que nous récupérerons.

Cet exemple vide contient aussi un fichier CSS permettant de centrer notre canvas dans notre page web, puisque nous allons travailler dans un format carré.

Le fichier **index.html** contient des liens vers les bibliothèques nécessaires pour la bonne éxécution des différents exemples, ces bibliothèques sont placées dans le dossier *libraries*. Et le dossier *assets* contient images et polices qui seront utilisées.

Afin de favoriser les exports (ultérieurement) nous allons prendre l'habitude dès les premiers exemples de réaliser tous les affichage dans une fonction dédiée apellée **myDrawing()** plutôt que de dessiner directement dans la fonction **draw()**.

## Charger une image, l'afficher et la redimensionner.

Notre premier exemple va nous permettre de découvrir les mécanismes de bases nécessaire à charger et afficher une image sans aucune manipulation supplémentaire pour l'instant.

Afin de charger une image nous allons utiliser la fonction [**loadImage()**](https://p5js.org/reference/#/p5/loadImage), dans la fonction preload de notre squelette de code, en indiquant le lien vers l'image que nous souhaitons utiliser - qui est donc située dans le dossier *assets*

Il faut au préalable créer une variable que nous nommerons *img* pour pouvoir stocker le résultat de l'appel de la fonction loadImage dans la mémoire de notre ordinateur afin d'avoir la possibilité d'y accéder par ce nom ultérieurement.

```js
let img

function preload() {
    img = loadImage("../assets/StyleGAN2_portrait.jpeg")
}
```

Il nous reste maintenant à afficher nos images en appelant les fonctions dédiées [**image()**](https://p5js.org/reference/#/p5/image) et [**imageMode()**](https://p5js.org/reference/#/p5/imageMode).

```js
function myDrawing() {
    imageMode(CENTER)
    image(img, width*0.5, height*0.5)
}
```

Dans la documentation de la fonction **loadImage()** il est mentionné qu'il est possible de passer un fonction dite **callback** en paramètre. 
De manière simplifiée, une fonction callback est une série d'instructions (de lignes de code) qui pourra executée une fois que l'action demandée a été effectuée.
Dans la fonction **loadImage()** on peut passer deux fonctions : une en cas de succès du chargement de l'image, une en cas d'échec. Il est donc possible d'éxecuter des choses en fonction du succès ou de l'échec de l'opération **loadImage()**.

En javascript on va donc passer une fonction qui n'a pas de nom que l'on appelle fonction **anonyme**.
En cas de succès on va afficher un message dans la console précisant que l'image a bien été chargée et on va redimensionner notre image. En cas d'échec nous allons juste afficher un message d'erreur.

```js
function preload() {
    // we load the image in the preload function - be sure to use a server of some kind
    img = loadImage("../assets/StyleGAN2_portrait.jpeg",
            // success callback passed to load image
            function(){
                console.log("image loaded")
                img.resize(100,100)
            },
            // error callback passed to load image
            function(){
                console.log("failed to load image - try checking the path of your image")
            }
    )
}
```
Nous allons systèmatiquement redimensionner nos images à de petites tailles. Car nous allons créer des opérations sur chaque pixel de l'image, une image de 100px * 100px représente 10000 opérations à réaliser et ce à chaque affichage, cela fait déjà beaucoup ! Il est donc préférable de travailler sur des résolutions d'images plus faibles.

## Accéder aux pixels d'une image et extraire les composantes de la couleur de chaque pixel

Une fois que notre image est chargé il est possible de d'accéder à chaque pixel et notament à sa couleur.

L'idée est de parcourir les coordonnées de l'image d'une manière exhaustive en ligne et en colone à l'aide de deux boucles **for()** imbriquées.

```js
    for (let i = 0; i < img.width; i++) { // go through each pixel horizontally
        for (let j = 0; j < img.height; j++) { // for each horizontal pixel go through each row of pixel

            // for each pixel we will draw something
        }
    }

```

Il est maintenant possible d'extraire la couleur de chaque pixel à l'aide de la fonction [**get()**](https://p5js.org/reference/#/p5/get) puis d'analyser les différentes composantes de cette couleur R/G/B, et teinte, saturation, et luminosité avec les fonctions dédiées :
- [**red()**](https://p5js.org/reference/#/p5/red)
- [**green()**](https://p5js.org/reference/#/p5/green)
- [**blue()**](https://p5js.org/reference/#/p5/blue)
- [**hue()**](https://p5js.org/reference/#/p5/hue)
- [**saturation()**](https://p5js.org/reference/#/p5/saturation)
- [**brightness()**](https://p5js.org/reference/#/p5/brightness)

```js
for (let i = 0; i < img.width; i++) { // go through each pixel horizontally
    for (let j = 0; j < img.height; j++) { // for each horizontal pixel go through each row of pixel
            // get the color of the pixel located at the coordinate (i,j)
            let col = img.get(i, j)
            // get the rgb components of the color (for each pixel)
            let r = red(col) // value between 0-255
            let g = green(col) // value between 0-255
            let b = blue(col) // value between 0-255
            // get the hue, saturation and brightness of the color
            let hu = hue(col) // value between 0-360
            let sa = saturation(col) // value between 0-100
            let br = brightness(col) // value between 0-100
    }
}
```

Il nous reste maintenant à dessiner quelquechose ! 

### Première variante - utiliser des ellipses


Notre but va être de dessiner une ellipse dont la taille dépendera de la luminosité du pixel. Mais nous n'allons vouloir la dessiner que si sa saturation est supérieur à 25, et cette ellipse sera rouge mais nous n'utiliserons que la composante rouge de chaque pixel pour choisir la quantité de rouge de cette ellipse.

Pour positionner cette ellipse dans notre page web nous allons transformer les coordonnées du pixel dans l'image en coordonnées écran (notre image fait 50 pixels de côté alors que notre canvas fait 1000).

On utilisera donc la fonction [**map()**](https://p5js.org/reference/#/p5/map) qui permet de changer l'ordre de grandeur d'un nombre. Il faut fournir en premier la valeur que l'on veut transformer, puis ses valeurs potentielles minimale et maximale respectivement et en quatrième cinquième paramètres les valeurs minimale et maximale que l'on souhaite pour la nouvelle variable que nous souhaitons calculer.

```js
// calculate a variable called 's' to transform the brightness (which is between 0 and 100)
// to a value between 0 and 20 (we will use this later as the radius of an ellipse)
let s = map(br, 0, 100, 0, 20)

 // recalculate the coordinates of the pixel to fit in the whole canvas
let xpos = map(i, 0, img.width, 0, width)
let ypos = map(j, 0, img.height, 0, height)

if (sa > 25) { // if the saturation of the pixel is above 25
    ellipseMode(CORNER) // use the corner of the ellipse as anchor point to draw
    // use only the red component of the pixel to set stroke and fill color
    stroke(r, 0, 0)  
    fill(r,0,0)
    // draw an ellipse at the right place at the rigth size
    ellipse(xpos, ypos, s , s )
}
```
Ce code est bien sûr à ajouter à l'intérieur de la double boucle for afin que pour chaque pixel une ellipse soit dessinée.

<img src="result_images/example_02_ellipses.png " alt="portrait" width="400" height="whatever">

### Deuxième variante - utiliser des lignes

Comme vous l'avez déja compris dans notre process de création d'image chaque pixel devient une case et dans chaque case nous dessinerons quelquechose. Ici nous allons choisir de dessiner une ligne diagonale.

Tout d'abord il nous faut determiner la taille d'une case : nous travaillons sur des images carrés et dans une zone de dessin carrée nous n'avons donc qu'à calculer le ratio entre la taillde notre zone de dessin et la taille de notre image : 

```js
// calculate the length of a segment : this will the size of a tile
let len = width / img.width;
```

En supposant que les coordonnées du coin supérieur gauche de notre case soient 'xpos' et 'ypos'.

Si la composante verte de notre pixel est supérieure à 60 nous dessinerons une ligne du coin supérieur gauche vers le coin inférieur droit de notre case. 
```js
 // draw a line from top left corner of a tile to the bottom right corner
line(xpos, ypos, xpos + len, ypos + len)
```

Sinon nous dessinerons une ligne du coin inférieur gauche vers le coin supérieur droit !
```js
// draw a line from the bottom left corner of a tile to the top right corner
line(xpos, ypos + len, xpos + len, ypos)
```

Afin d'obtenir un résultat un peu plus contrasté nous allons aussi jouer sur l'épaisseur du trait - en faisant en sorte que si la luminosité de notre pixel est importante notre trait soit fin, sinon qu'il soit plus épais.

```js
 let sw = map(br, 0, 100, 10, 0.1)
strokeWeight(sw)
stroke(0)
noFill()
```

En récapitulant tous ces éléments à l'intérieur de notre double boucle for nous obtenons ce résultat :

<img src="result_images/example_02_lines.png " alt="portrait" width="400" height="whatever">

Pour ce code :

```js
function myDrawing() {
    background(255)

    for (let i = 0; i < img.width; i++) { // go through each pixel horizontally
        for (let j = 0; j < img.height; j++) { // for each horizontal pixel go through each row of pixel
            // get the color of the pixel located at the coordinate (i,j)
            let col = img.get(i, j)
            // get the rgb components of the color (for each pixel)
            let r = red(col) // value between 0-255
            let g = green(col) // value between 0-255
            let b = blue(col) // value between 0-255
            // get the hue, saturation and brightness of the color
            let hu = hue(col) // value between 0-360
            let sa = saturation(col) // value between 0-100
            let br = brightness(col) // value between 0-100

            // remap the position of pixels to fill the whole canvas
            let xpos = map(i, 0, img.width, 0, width)
            let ypos = map(j, 0, img.height, 0, height)
            // calculate the length of a segment : this will the size of a tile
            let len = width / img.width;
            // calculate a value depending on the brightness that we will use as the strokeweight
            let sw = map(br, 0, 100, 10, 0.1)
            strokeWeight(sw)
            stroke(0)
            noFill()

            if (g > 60) { // if the green component of the pixel is above 60
                // draw a line from top left corner of a tile to the bottom right corner
                line(xpos, ypos, xpos + len, ypos + len)
            } else {
                // draw a line from the bottom left corner of a tile to the top right corner
                line(xpos, ypos + len, xpos + len, ypos)
            }

        }
    }
}
```

### Troisième variante - utiliser des lignes et une rotation

Cette fois-ci nous allons encore utiliser des lignes, elles partiront toutes du coin supérieur gauche de chaque case, mais cette fois nous allons dessiner des lignes :

- dont la longueur dépendera de la position de la souris sur notre page web

```js
// calculate the length of a segment : this will depend on the mouse position
 let len = map(mouseX, 0, width, 0, 100)
```

- dont l'orientation dépendera de la saturation d'un pixel. Nous allons donc utiliser la valeur de saturation obtenue pour calculer une valeur que nous pourrons par la suite utiliser comme un angle (en radians)

```js
let sat = saturation(col) // extract the saturation of the pixel
// transform it in a value we can use as an angle
let angle = map(sat, 0, 100, 0, TWO_PI)
```

Il nous faudra pour cela avoir recours aux coordonnées polaires. Elles permettent d'exprimer les position d'un objet en fonction d'une distance au centre et d'un angle - autrement dit en conservant un rayon constant et en faisant varier l'angle on dessine assez facilement un cercle.
Les coordonnées polaires sont juste une autre façon de définir l'emplacement d'un point dans l'espace en deux dimensions.

Au lieu de donner une coordonnée en X (l'abscisse) et une en Y (l'ordonnée), nous allons donner un angle et un rayon. [Les coordonnées polaires](https://fr.wikipedia.org/wiki/Coordonn%C3%A9es_polaires) sur wikipédia.

Processing ou p5js ne nous donnent pas la possibilité de dessiner des points en utilisant les coordonnées polaires, nous devons donc convertir les coordonnées polaires en coordonnées cartésiennes avant de pouvoir dessiner nos lignes.

Heureusement il existe des formules mathématiques pour faire cette conversion. Ainsi un point exprimé en coordonnées polaire avec un angle 'theta' et un rayon 'r' aura pour coordoonées cartésienne dans un repère ce centre (x0, y0)

```
x = x0 + cos(theta) * r
```
et
```
y = y0 + sin(theta) * r
```
Vous pouvez aussi vous référer à [cet exemple](https://www.openprocessing.org/sketch/151087) qui détaille le cercle trigonométrique et les fonction trigonométriques de base.

Une fois que nous avons notre angle il nous suffit alors de calculer le point d'arrivée de notre ligne en appliquant nos formules. Nous n'allons cependant pas avoir besoin de recourir
au coordonnées du centre de notre repère car nous déplacerons pour chaque pixel notre position à l'endroit souhaité à l'aide de [**translate()**](https://p5js.org/reference/#/p5/translate)

```js
// apply polar coordinates
// https://www.openprocessing.org/sketch/151087
let x = len * cos(angle)
let y = len * sin(angle)
```

Il ne nous reste alors plus qu'à dessiner nos lignes entre le position du coin supérieur gauche de chaque pixel (xpos,ypos) - calculé précédement; et notre point (x,y) calculé à l'aide des coordonnées polaires.

```js
 // draw !
push()
translate(xpos, ypos)
line(0, 0, x, y)
pop()
```
Nous obtenons alors ce résultat :

<img src="result_images/example_02_lines_rotation.png " alt="portrait" width="400" height="whatever">


```js
function myDrawing() {

    background(255)

    for (let i = 0 ; i < img.width ; i++){
        for (let j = 0 ; j < img.height ; j++){

            let col = img.get(i,j)
            stroke(col)

            // remap the position of pixels to fill the whole canvas
            let xpos = map(i, 0, img.width, 0, width)
            let ypos = map(j, 0, img.height, 0, height)

            // this will depend on the mouse position
            let len = map(mouseX, 0, width, 0, 100)

            let sat = saturation(col) // extract the saturation of the pixel
            // transform it in a value we can use as an angle
            let angle = map(sat, 0, 100, 0, TWO_PI)
            
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
```

## Ajouter des contrôleurs avec quicksettings.js

Dans l'exemple précedent nous avions ajouté un peu d'interaction en permettant à l'utilisateur de modifier la longueur des traits dessinés en déplaçant la souris. Nous allons maintenant utiliser une bibliothèque externe à p5js qui s'appelle [**Quicksettings**](https://github.com/bit101/quicksettings#quicksettings) afin de pouvoir créer un menu d'options et de paramètres qui nous permettront d'explorer les possibilités graphiques de nos programmes et aussi de créer des boutons pour exporter des images.

### Ajouter un paramètre

La première chose à faire est de créer une variable tout en haut de notre programme, c'est à dire en dehors des fonctions preload(), setup(), draw() etc.

```js
let menu
```

**Dans le setup()** , nous allons maintenant appeler le [constructeur](https://github.com/bit101/quicksettings#creating-a-panel) de la bibliothèque afin de créer notre menu.

Il suffit donc de préciser la position du menu et son nom :

```js
 menu = QuickSettings.create(0, 0, 'Options')
```

Nous pouvons maintenant ajouter des éléments ! 
Nous allons commencer par ajouter un **slider** afin de controler la taille plutôt que de le faire avec la souris.

Pour cela il nous faut appeler les [**fonctions dédiées à la création de controleurs**](https://github.com/bit101/quicksettings#adding-controls). Ici nous allons utiliser la fonction **addRange**.

Avant cela il faut comprendre la logique que nous emploieront à chaque fois. Nous allons utiliser un objet javascript que nous appelerons *params*. Cet objet stockera tous les paramètres de notre image avec identifiant que nous choisirons.

Pour chaque paramètre nous :
- créerons un nouvel identifiant 
- créerons un controleur qui modifiera la valeur associée à cet identifiant
- utiliserons la valeur pour controler un paramètres de dessin.

Commençons par créer un nouvel objet paramètres, tout en haut du programme en dehors de *setup()*, de *preload()* ou de toute autre fonction.
```js
// create a param object to store every parameter for our drawing
let params = {
    "length" : 10
}
```

Ajoutons maintenant un nouveau slider à notre panneau de contrôle, en appelant la fonction **addRange()** dans le *setup()*.
Nous avons déjà évoqué le principe de des fonctions **callback** plus haut. Quicksetting utilise de nouveau ce principe, car nous pouvons pour chaque controleur passer une fonction callback afin de récupérer le nouvelle valeur : celle définie par l'utilisateur et en faire ce que nous souhaitons :

```js
// add a range slider (title, min, max, value, step, callback)
menu.addRange('longueur des lignes', 1 , 100, 10, 1, 
        // pass a callback function to actualize the value when the user interacts
        // with the slider - the new value will be called 'v'
        function(v){
            // we replace the length value stored in ou params object by 'v' - the new value 
            // defined by the user
            params.length = v 
         })
```

Finalement nous devons utiliser notre valeur dans notre algorithme de dessin. Au préalable nous avions une ligne de code permettant d'ajuster une variable appelée 'len' à la position de la souris :

```js
// calculate the length of a segment : this will depend on the mouse position
let len = map(mouseX, 0, width, 0, 100)
```
Maintenant nous pouvons tout simplement lui attribuer la valeur stockée sous l'identifiant *length* dans notre objet de paramètres :

```js
// use the length define by ou parameters
let len = params.length
```

et voilà :

<img src="result_images/example_03_params.gif" alt="portrait" width="400" height="whatever">

Voici l'intégralité du code :

```js
let img
let menu 

// create a param object to store every parameter for our drawing
let params = {
    "length" : 10
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
}

function draw() {
    myDrawing()
}

function myDrawing() {

    background(255)

    for (let i = 0 ; i < img.width ; i++){
        for (let j = 0 ; j < img.height ; j++){

            let col = img.get(i,j)
            stroke(col)

            // remap the position of pixels to fill the whole canvas
            let xpos = map(i, 0, img.width, 0, width)
            let ypos = map(j, 0, img.height, 0, height)

            // use the length define by ou parameters
            let len = params.length
            
            let sat = saturation(col) // extract the saturation of the pixel
            // transform it in a value we can use as an angle
            let angle = map(sat, 0, 100, 0, TWO_PI)
            
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


function timestamp() {
    return "-" + +year() + "-" + month() + "-" + day() + "-" + hour() + "h" + minute() + "m" + second() + "s"
}
```

### Utiliser plusieurs paramètres

#### Une option niveaux de gris

Nous allons maintenant utiliser plusieurs paramètres. Un premier paramètre nous permettra de choisir d'afficher notre image en niveau de gris ou avec les couleurs originales. Nous allons donc suivre les 3 étapes décrites plus haut.

1- Il nous faut d'abord définir un nouveau paramètre à notre objet *params* et donc ajouter un paramètre appelé *grayscale*, qui devra être donc vrai ou faux :

```js
let params = {
    "length" : 10,
    "grayscale" : false
}
```

2- Ensuite nous devons ajouter cet élément à notre menu (dans le setup donc), tout en pensant à bien définir notre fonction callback pour actualiser la valeur stockée dans notre objet *params*:
```js
// add a boolean switch to turn on grayscale or color
    menu.addBoolean('niveaux de gris', params.grayscale, function(v){
        params.grayscale = v
    })
 ```
3- Utiliser notre valeur pour manipuler la couleur avec laquelle on dessine. Nous allons utiliser un **if()** pour vérifier la valeur et changer la couleur utilisée dans **stroke()** en fonction :
```js
// check the parameter grayscale
if (params.grayscale == true){ // if true
    // calculate the mean of rgb components
    let gray = (red(col)+green(col)+ blue(col))/3.
    stroke(gray) 
else{
    // recombine the rgb component 
    stroke(red(col), green(col), blue(col))
}
```

#### une option pour gérer la transparence

1- Ajouter un nouveau paramètre *alpha* dans notre objet *params*
```js
let params = {
    "length" : 10,
    "grayscale" : false,
    "alpha" : 255
}
```
2- Ajouter un nouveau controlleur dans notre menu en pensant à utiliser la fonction callback pour actualiser la valeur concernée :
```js
// add another range to change the opacity of lines
menu.addRange('opacité des lignes', 1 , 255, 255, 1, function(v){
    params.alpha = v
})
```

3- Utiliser notre valeur *params.alpha*  
```js
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
```

Voici donc le résultat final :

<img src="result_images/example_03_params_multiples.gif" alt="portrait" width="400" height="whatever">

Et vous pouvez retrouver le code complet ici : https://github.com/b2renger/p5js_image_alteration/blob/master/03_ajouter_des_parametres_multiples/sketch.js


## Charger des polices et afficher du texte

### Exemple simple
Nous allons nous concentrer sur le fait de dessiner du texte. Notre premier exemple sera très simple et utilisera une police déjà incluse par défaut dans les sketchs p5js.

Ici nous allons extraire la composante rouge ainsi que la saturation de chaque pixel

```js
// get image color
let col = img.get(i, j)
// extract red component and saturation
let r = red(col)
let sa = saturation(col)           
```

et nous allons calculer deux variables pour définir la taille du texte ainsi que son orientation (comme précédement)
```js
 // calculate a value that will be used as the size of our text 
// we map the red component from 20 to 0 (no red == no text)
let txtSiz = map(r, 0, 255, 20, 0)
let angle = map(sa, 0, 100, 0, TWO_PI)
```

Il nous reste maintenant à dessiner :

```js
 // draw everything
push()
fill(0)
textAlign(CENTER, CENTER)
// try other alignment
// textAlign(LEFT, TOP)
// textAlign(RIGHT, BOTTOM)
// remap the position of pixels to fill the whole canvas
let xpos = map(i, 0, img.width, 0, width)
let ypos = map(j, 0, img.height, 0, height)
translate(xpos, ypos)
rotate(angle)
textSize(txtSiz)
text("Hello", 0,0)
pop()
```

Vous pouvez essayer différents types d'alignement du texte à l'aide de la fonction [**textAlign()**](https://p5js.org/reference/#/p5/textAlign)

Voici donc le résultat final :

<img src="result_images/example_04_texte.png" alt="portrait" width="400" height="whatever">

Et vous pouvez retrouver le code complet ici : https://github.com/b2renger/p5js_image_alteration/blob/master/04_afficher_du_texte/sketch.js


### Ajout de paramètres (choix de police)
Nous allons maintenant ajouter des polices.

Pour cela nous allons utiliser des polices déjà disponibles en ligne via [google fonts](https://fonts.google.com/).

Ce site nous permet de choisir via une multitude de police et nous fournit même du code pour insérer ce polices dans nos pages web.

![googlefonts](result_images/googlefonts.png)

Il suffit de clicker sur les '+' en haut à droite de chaque case pour ajouter une police à notre liste de police. Une fois notre choix fait nous pouvons cliquer sur la barre noire en bas de notre fenêtre pour consulter le code pour insérer nos polices.

![googlefonts selection](result_images/googlefonts-selection.png)

Vous remarquez une chaine de code html que nous allons utiliser. Il suffit d'ajouter le code fournit au fichier "index.html" que nous utilisons.

```html
<link href="https://fonts.googleapis.com/css?family=Dancing+Script|Great+Vibes|Monoton|Rock+Salt|Trade+Winds&display=swap" rel="stylesheet"> 
```
Pour pouvoir manipuler ces polices nous allons d'abord - tout en haut de notre programme, créer un tableau permettant de stocker les noms de chacune des polices choisies :

```js
// the list of the fonts name we want to use in our sketch - thoses where added to the index.html file aswell
let fonts = ["Trade Winds", "Dancing Script","Great Vibes", "Rock Salt", "Monoton" ]
```

Après cela nous allons créer un objet paramètres afin de pouvoir choisir notre police : nous créeons donc un identifiant *currentFont*

```js
// parameter object 
let params = {
    'currentFont' : "Great Vibes",
}
```

Ensuite dans le setup() nous allons créer notre menu et y ajouter un élément de type *dropdown*. 

```js
// quicksettings menu
menu = QuickSettings.create(0,0,"options")
// a menu to choose the font (name / list of fonts / callback)
menu.addDropDown("choix de la police", fonts, function(v){
    params.currentFont = v.label
})
```
Cet élément nous renvoi un objet javascript plus complexe que le slider ou le booléen qui eux nous renvoyaient uniquement une valeur. Ici il faudra accéder au champ 'label' de la valeur que nous renvoit notre controleur.

Il ne reste maintenant plus qu'à utiliser notre font :
```js
// apply the font chosen 
textFont(params.currentFont)
```

Dans l'exemple final, nous avons ajouté la possibilité d'influer sur la taille du texte dessiné, mais aussi de changer le message écrit en utilisant un controleur de type *textfield* grâce à la bibliothèque quicksettings.

Voici le résultat final :

<img src="result_images/example_04_texte_parameters.gif" alt="portrait" width="400" height="whatever">

Ainsi que le code :
https://github.com/b2renger/p5js_image_alteration/blob/master/04_afficher_du_texte_parametres/sketch.js

### Ascii art
Cette fois-ci nous n'allons tout simplement dessiner un charactère au lieu de dessiner tous les charactères fournis par notre utilisateur. L'idée est de choisir ce charactère en fonction de la luminosité de nos pixels.

Le but étant de prendre le premier charactère si notre pixel est très lumineux, le dernier s'il est sombre.
En choisisant un chaine de charactère dont les charactère sont de plus en plus dense nous obtiendrons un rendu similaire à l'image originale. Par exemple : " .:=*/$"

```js
// map the brightness to a position index to be able to draw only one character in the message
let characterIndex = int(map(br, 0, 100, params.message.length, 0))
```

Ensuite nous allons extraire le charactère qui nous intéresse :
```js
// extract the right parameter from the string
let char  = params.message.charAt(characterIndex)
```
Il ne nous reste plus qu'à tout dessiner :
```js
// draw everyting 
push()
fill(0)
textAlign(CENTER, CENTER)
translate(xpos, ypos)
text(char, 0, 0)
pop()
```

Voici le résultat final :

<img src="result_images/example_04_texte_ascii.png" alt="portrait" width="400" height="whatever">

Ainsi que le code :
https://github.com/b2renger/p5js_image_alteration/blob/master/04_afficher_du_texte_parametres_ascii/sketch.js

### Texte complet

Dans ce dernier exemple avec du texte nous allons nous attacher à afficher un texte complet sur toute l'image. L'utilisateur pourra alors lire le texte, mais la couleur des lettres correspondra à la couleur du pixel original et chaque pixel correspondra à une lettre du texte dans son ordre original :

```js
let index = ( i + j * img.width ) % txt.length
```
On conserve la coordonnée en abscisse du pixel à laquelle on ajoute la coordonnée en ordonnée multiplié par le nombre de pixels sur une ligne. Si jamais notre texte comprends moins de charactères que le nombre de pixels de notre image, on s'assure de boucler en utilisant l'opérateur modulo.

Il suffit ensuite d'extraire le charactère de notre texte.

```js
// extract the right parameter from the string
let char  = txt.charAt(characterIndex)
```

Voici le résultat final :

<img src="result_images/example_04_texte_complet.png" alt="portrait" width="400" height="whatever">

Ainsi que le code :
https://github.com/b2renger/p5js_image_alteration/blob/master/04_afficher_du_texte_parametres_complet/sketch.js


## Utiliser fontawesome
Nous venons d'utiliser des fonts provenant de google fonts, nous allons maintenant utiliser [fontawesome](https://fontawesome.com/icons?d=gallery&m=free). Fontawesome est une police de charactère composée d'icones, il existe des versions gratuites et des versions payantes. 

Vous pourrez trouver les 3 polices gratuites dans le dossier assets au format ".otf".

La première étape va être de charger nos fonts afin de pouvoir les utiliser. Comme pour les images cela se fait en deux étapes :

1- créer des variables avant le setup() et le preload()
```js
// two variables to hold two variant of the fonteawesome font
let faReg // one regular
let faBold // one bold
```

2- charger les polices dans ces variables à l'aide de la fonction [**loadFont()**](https://p5js.org/reference/#/p5/loadFont)
```js
 // load the regular font - with a callback function
    faReg = loadFont("../assets/Font Awesome 5 Free-Regular-400.otf",
        function () {
            console.log("font awesome reg loaded")
        }
    )
    // load the bold font - with a callback function
    faBold = loadFont("../assets/Font Awesome 5 Free-Solid-900.otf",
        function () {
            console.log("font awesome bold loaded")
        })

```

Après, il n'y a rien de vraiement nouveau : il faut parcourir tous les pixels, extraire les composantes de la couleur et choisir ce que l'on dessine avec des conditions.

Par exemple nous allons faire une condition sur la luminosité des pixels. Si la luminosité est supérieur à 50 nous afficherons cette icone :
https://fontawesome.com/icons/angry?style=regular
sinon, celle ci :
https://fontawesome.com/icons/bomb?style=solid

Le principe est d'afficher du texte à l'aide d'un code [unicode](https://fr.wikipedia.org/wiki/Unicode). Vous pourrez donc trouver ce code sur le site de fontawesome sur la page de chaque icone.

<img src="result_images/fontawesome.png" alt="portrait" width="400" height="whatever">

Le code qui nous intéresse est 'f1e2'. Pour l'insérer nous allons utiliser la fonction **text()** en passant en paramètre une chaine de charactère composé de ce code en le préfixant de '\u' pour préciser à notre programme qu'il s'agit bien là d'unicode et pas d'une chaine de caractères classique.

Tout en s'assurant de bien utiliser la bonne police et en choisissant aussi une couleur !

```js
fill(255,100,255) // purple
textFont(faBold) // bold font
text('\uf1e2', 0, 0) // bomb icon => https://fontawesome.com/icons/bomb?style=solid
```

En manipulant des conditions et en essayant d'afficher plusieurs icones vous devriez pouvoir arriver assez vite à ce genre de résultats :

<img src="result_images/example_05_fontawesome.png" alt="portrait" width="400" height="whatever">

Vous pourrez trouver le code complet de cet exemple en suivant ce lien : https://github.com/b2renger/p5js_image_alteration/blob/master/05_utiliser_fontawesome/sketch.js



## Exporter en PNG

## Exporter en SVG avec p5.svg

## Exporter plusieures "couches" svg



## Créer des animations

## Utiliser de la 3D

## Optimiser les performances en utilisant une classe


## Exemples supplémentaires

https://github.com/mikewesthad/lafayette-creative-coding-p5-workshop/blob/master/gifs/04-image.gif

http://www.generative-gestaltung.de/2/sketches/?01_P/P_4_3_1_01

http://www.generative-gestaltung.de/2/sketches/?01_P/P_4_3_1_02

http://www.generative-gestaltung.de/2/sketches/?01_P/P_4_3_2_01

http://www.generative-gestaltung.de/2/sketches/?01_P/P_4_1_2_01

http://www.generative-gestaltung.de/2/sketches/?01_P/P_4_1_2_02

https://www.openprocessing.org/sketch/826880

https://www.openprocessing.org/sketch/826860

https://www.openprocessing.org/sketch/824405

https://www.openprocessing.org/sketch/840117

https://www.openprocessing.org/sketch/624879

https://www.openprocessing.org/sketch/842664

https://www.openprocessing.org/sketch/743017

https://www.openprocessing.org/sketch/736422



// Créer et rappeler des presets (utilisation des cookies)

// 3D + noise ?

// Shaders ?

// Shaders et webcam ?


