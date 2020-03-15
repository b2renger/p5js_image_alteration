# p5js_image_alteration

This repo is a curiculum dedicated to the manipulation of images through their pixels with [p5.js](https://p5js.org/). This is a project taught at [l'école de design de Nantes](https://www.lecolededesign.com/) in graphic design. The curriculum is here detailed in french, but comments in each example are written in english.

L'objectif de ce repo est de découvrir les différentes techniques de manipulation d'images à travers l'analyse de leurs pixels avec [p5.js](https://p5js.org/). Les techniques décrites ici sont accessibles aux débutants il est cependant nécessaire de connaitre les bases de la programmation avec p5js dans un environnement de développement de votre choix c'est à dire par exemple d'avoir lu et intégrer les 3 premiers paragraphes de cette [ressource d'introduction](https://github.com/b2renger/Introduction_p5js) :

- [Comment travailler avec p5js](https://github.com/b2renger/Introduction_p5js#p5js_tools)
- [Les principes de base](https://github.com/b2renger/Introduction_p5js#bases)
- [Dessiner avec la souris](https://github.com/b2renger/Introduction_p5js#dessiner)

Les images que nous utiliserons pour ces exemples sont générés via un algorithme d'intelligence artificielle appelé **StyleGan2** disponible à travers le logiciel [runwayML](https://runwayml.com/).

<img src="assets/StyleGAN_landscape.jpeg " alt="landscape" width="200" height="whatever">
<img src="assets/StyleGAN2_portrait.jpeg " alt="landscape" width="200" height="whatever">


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

<img src="result_images/example_02_ellipses.png " alt="portrait" width="200" height="whatever">

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

<img src="result_images/example_02_lines.png " alt="portrait" width="200" height="whatever">

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

<img src="result_images/example_02_lines_rotation.png " alt="portrait" width="200" height="whatever">


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

## Charger des polices et afficher du texte

## Utiliser fontawesome

## Utiliser de la 3D

## Créer des animations

## Exporter en PNG

## Exporter en SVG avec p5.svg

## Exporter plusieures "couches" svg

## Optimiser les performances en utilisant une classe

// Créer et rappeler des presets

// 3D + noise

// Webcam

// Shaders

// https://github.com/mikewesthad/lafayette-creative-coding-p5-workshop/blob/master/gifs/04-image.gif

