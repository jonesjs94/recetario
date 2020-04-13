const btnDescubrir = document.getElementById("descubrir");

window.addEventListener("keydown", (e) => {
  const enter = e.keyCode || e.which;
  if (enter === 13) {
    event.preventDefault();
    btnDescubrir.click();
  }
})


/**
 * Envía un request a la API de Spoontacular: "https://spoonacular.com/food-api".
 * Obtiene 5 recetas en formato JSON. 
 * Con la ayuda de la función "crearTarjeta" crea contenedores con la info de las recetas y las adjunta
 * al contenedor de "resultados"
 * 
 */
async function encontrarRecetas() {
  
    const apiKey = "03d842cc1cbc4535bf140ca81c4578ac";
    const valor = document.getElementById("input").value;
    const tipoDeComida = document.getElementById("comidas").value;
    
    const respuesta = await fetch(`https://api.spoonacular.com/recipes/random?number=4&tags=${valor},${tipoDeComida}&apiKey=${apiKey}`);
    const resultado = await respuesta.json();
    
   if (respuesta.status !== 200 || resultado.recipes == undefined) {
      const error = document.getElementById("contenedor-error");
      error.style.display = "block";
      throw Error("No hay recetas de esa comida");
   }

   // Guardo objeto en localStorage
   localStorage.setItem("recetas", JSON.stringify(resultado))
   console.log(resultado);
   
   // Vacío contenedor antes de crear los resultados
   vaciarElementosHijo("resultados");

   const recetas = resultado["recipes"];
   
   console.log(recetas);
   
  recetas.forEach((receta, index) => {
    crearReceta(receta, index);
  });

}


/**
 * Crea un objeto HTML en forma de tarjeta con la información de la receta
 * 
 * @param {object} receta - Objeto con la receta
 * @param {number} index  - Número de la receta actual 
 */
function crearReceta(receta, index) {

  const resultados = document.getElementById("resultados");
  const contenedorReceta = document.createElement("div");

  contenedorReceta.id = receta.id
  contenedorReceta.classList.add("resultado");
  contenedorReceta.innerHTML = `
    <div class="row">
    <div class="col-md-4">
        <img class="img-fluid" src=${receta.image} alt="foto de la receta">
    </div>
    <div class="col-md-6 p-3">
        <h4>${receta.title}</h4>
        <div class="info-resultado">
          <div>
            <i class="far fa-clock"></i>
            <p>Listo en ${receta.readyInMinutes} Minutos</p>
          </div>
          <div>
            <i class="fas fa-check"></i>
            <p>${receta.servings} servidas</p>
          </div>
        </div>
        <button class="btn btn-block btn-rosado" onclick="abrirReceta(${receta.id})">Abrir receta</button>
    </div>
    <div class="col-md-2 p-3">
      <i class="fas fa-star"></i>
      <p>${receta.spoonacularScore}.0</p>
    </div>
  </div>
  `;

  resultados.appendChild(contenedorReceta);

  anime({ targets: contenedorReceta, opacity: "1", duration: 500, easing: "easeOutExpo" });
}


/**
 * Crea la receta y la adjunta en el HTML
 * 
 * @param {string} id - id expresado en número de la receta en el objeto.
 */
function abrirReceta(id) {
  const recetas = JSON.parse(localStorage.getItem("recetas")).recipes;

  // Crea elementos con las intrucciones y los adjunta a la receta
  const instrucciones = (instrucciones) => {
    console.log(instrucciones);

    instrucciones.forEach((instruccion, index) => {
      let ul = document.querySelector(".instrucciones ul");
      
      // Crea instrucción
      let li = document.createElement("li");
      li.classList.add("list-group-item");
      li.textContent = `${index + 1}) ${instruccion.step}` // Texto de la instrucción
      
      // Adjunta instrucción a la lista de instrucciones
      ul.appendChild(li)
    })
  }

  // Crea elementos con los ingredientes y los adjunta a la receta
  const ingredientes = (ingredientes) => {
    console.log(ingredientes);

    ingredientes.forEach(ingrediente => {
      let divIngredientes = document.querySelector(".ingredientes > .row");
      
      let div = document.createElement("div");
      div.classList.add("col-xl-2", "col-md-3", "col-4");

      // Medida del ingredientes
      let p_1 = document.createElement("p");
      p_1.textContent = `${ingrediente.measures.metric.amount} ${ingrediente.measures.metric.unitShort}`;
      div.appendChild(p_1);

      // Imagen del ingrediente
      let img = document.createElement("img");
      img.setAttribute("src", `https://spoonacular.com/cdn/ingredients_100x100/${ingrediente.image}`)
      div.appendChild(img)
      
      // Nombre del ingrediente
      let p_2 = document.createElement("p");
      p_2.textContent = ingrediente.name;
      div.appendChild(p_2);

      // Adjunta el elemento completo a la lista de ingredientes
      divIngredientes.appendChild(div)
    })
  }
  
  // Loopea el objeto con las recetas.
  // Al encontrar la receta solicitada la crea como objeto html y finaliza el loop
  for (let i = 0; i < recetas.length; i++) {
    const receta = recetas[i];
    
    // Si el id es el mismo al de la receta actual prosigue
    if (receta.id === id) {
      const divReceta = document.getElementById("receta");

      // Crea receta
      divReceta.innerHTML = `
      <div class="row">
        <button id="btn-cerrar" class="btn btn-rosado rounded-circle" onclick="cerrarReceta()">
          <i class="fas fa-times"></i>
        </button>

        <div class="resumen col-xl-4 col-lg-5 col-md-12">
            <h3>${receta.title}</h3>
            <img class="img-comida img-fluid" src=${receta.image} alt="foto de la comida">
            <div>
                <div class="row text-center">
                  <div class="col-md-4">
                    <p><i class="far fa-clock"></i> Ready in ${receta.readyInMinutes} minutes</p>
                  </div>
                  <div class="col-md-4">
                    <p><i class="fas fa-check"></i> ${receta.servings} Servings</p>
                  </div>
                  <div class="col-md-4">
                    <p><i class="fas fa-star"></i> ${receta.spoonacularScore}.0</p>
                  </div>
                </div> 
                <p class="resumen">${receta.summary}</p>
            </div>
        </div>

        <div class="detalles col-xl-8 col-lg-7 col-md-12">

          <div class="ingredientes">
            <h3>Ingredientes</h3>
            <div class="row"></div>                                                           
          </div>

          <div class="instrucciones">
            <h3>Instrucciones</h3>
            <ul class="list-group list-group-flush"></ul>
          </div> 
        </div>

      </div>
      `;

      // Llamo a la función para crear instrucciones
      instrucciones(receta.analyzedInstructions[0].steps);

      // Llamo a la función para crear recetas
      ingredientes(receta.extendedIngredients);

      // Hace visible el elemento HTML de la receta
      
      anime({ 
        targets: divReceta, 
        opacity: "1",
        duration: 500, 
        easing: "easeInOutQuart", 
        begin: function() {
          divReceta.style.display = "block";
        } 
      });

      

      // Remueve el scroll en el contenedor de resultados
      document.querySelector(".container").style.overflowY = "hidden";
      
      // Detiene loop
      return false;
    } 
  }
}


/**
 * Vacía contenedor de sus elementos hijo
 * 
 * @param {string} id - id del contenedor a vaciar 
 */
function vaciarElementosHijo(id) {
    const contenedor = document.getElementById(id);
    while(contenedor.firstChild) {
        contenedor.removeChild(contenedor.lastChild);
    }
}


/**
 * Cierra la receta
 */
function cerrarReceta() {
  const receta = document.getElementById("receta");
  const contenedorPrincipal = document.querySelector(".container");

  anime({ 
    targets: "#receta", 
    opacity: "0",
    duration: 500, 
    easing: "easeInOutQuart", 
    complete: function() {
      receta.style.display = "none";
      contenedorPrincipal.style.overflowY = "initial";
    } 
  })

}

 
const json = {
    "recipes": [
        {
          "vegetarian": false,
          "vegan": false,
          "glutenFree": true,
          "dairyFree": false,
          "veryHealthy": false,
          "cheap": false,
          "veryPopular": true,
          "sustainable": false,
          "weightWatcherSmartPoints": 14,
          "gaps": "no",
          "lowFodmap": false,
          "preparationMinutes": 30,
          "cookingMinutes": 30,
          "sourceUrl": "http://www.pinkwhen.com/cheesy-chicken-and-rice-casserole-bake/#1583742126615",
          "spoonacularSourceUrl": "https://spoonacular.com/cheesy-chicken-and-rice-casserole-1269377",
          "aggregateLikes": 1416,
          "spoonacularScore": 65.0,
          "healthScore": 9.0,
          "creditsText": "Jen West",
          "license": "CC BY-SA 3.0",
          "sourceName": "Pink When",
          "pricePerServing": 175.64,
          "extendedIngredients": [
            {
              "id": 5062,
              "aisle": "Meat",
              "image": "chicken-breasts.png",
              "consistency": "solid",
              "name": "chicken breasts",
              "original": "2 grilled chicken breasts",
              "originalString": "2 grilled chicken breasts",
              "originalName": "grilled chicken breasts",
              "amount": 2.0,
              "unit": "",
              "meta": [],
              "metaInformation": [],
              "measures": {
                "us": {
                  "amount": 2.0,
                  "unitShort": "",
                  "unitLong": ""
                },
                "metric": {
                  "amount": 2.0,
                  "unitShort": "",
                  "unitLong": ""
                }
              }
            },
            {
              "id": 10220445,
              "aisle": "Pasta and Rice",
              "image": "rice-white-long-grain-or-basmatii-cooked.jpg",
              "consistency": "solid",
              "name": "cooked rice",
              "original": "2 cups rice (cooked)",
              "originalString": "2 cups rice (cooked)",
              "originalName": "rice (cooked)",
              "amount": 2.0,
              "unit": "cups",
              "meta": [
                "cooked",
                "()"
              ],
              "metaInformation": [
                "cooked",
                "()"
              ],
              "measures": {
                "us": {
                  "amount": 2.0,
                  "unitShort": "cups",
                  "unitLong": "cups"
                },
                "metric": {
                  "amount": 473.176,
                  "unitShort": "ml",
                  "unitLong": "milliliters"
                }
              }
            },
            {
              "id": 1017,
              "aisle": "Cheese",
              "image": "cream-cheese.jpg",
              "consistency": "solid",
              "name": "cream cheese",
              "original": "1 8oz package cream cheese",
              "originalString": "1 8oz package cream cheese",
              "originalName": "package cream cheese",
              "amount": 8.0,
              "unit": "oz",
              "meta": [],
              "metaInformation": [],
              "measures": {
                "us": {
                  "amount": 8.0,
                  "unitShort": "oz",
                  "unitLong": "ounces"
                },
                "metric": {
                  "amount": 226.796,
                  "unitShort": "g",
                  "unitLong": "grams"
                }
              }
            },
            {
              "id": 6147,
              "aisle": "Canned and Jarred",
              "image": "cream-of-mushroom-soup.png",
              "consistency": "liquid",
              "name": "cream of mushroom soup",
              "original": "1 10oz. can cream of mushroom soup",
              "originalString": "1 10oz. can cream of mushroom soup",
              "originalName": "cream of mushroom soup",
              "amount": 10.0,
              "unit": "oz",
              "meta": [
                "canned"
              ],
              "metaInformation": [
                "canned"
              ],
              "measures": {
                "us": {
                  "amount": 10.0,
                  "unitShort": "oz",
                  "unitLong": "ounces"
                },
                "metric": {
                  "amount": 283.495,
                  "unitShort": "g",
                  "unitLong": "grams"
                }
              }
            },
            {
              "id": 11333,
              "aisle": "Produce",
              "image": "green-pepper.jpg",
              "consistency": "solid",
              "name": "green bell pepper",
              "original": "1 medium green pepper",
              "originalString": "1 medium green pepper",
              "originalName": "green pepper",
              "amount": 1.0,
              "unit": "medium",
              "meta": [
                "green"
              ],
              "metaInformation": [
                "green"
              ],
              "measures": {
                "us": {
                  "amount": 1.0,
                  "unitShort": "medium",
                  "unitLong": "medium"
                },
                "metric": {
                  "amount": 1.0,
                  "unitShort": "medium",
                  "unitLong": "medium"
                }
              }
            },
            {
              "id": 1001025,
              "aisle": "Cheese",
              "image": "shredded-cheese-white.jpg",
              "consistency": "solid",
              "name": "jack cheese",
              "original": "1½ cup shredded Monterrey Jack cheese",
              "originalString": "1½ cup shredded Monterrey Jack cheese",
              "originalName": "shredded Monterrey Jack cheese",
              "amount": 1.5,
              "unit": "cup",
              "meta": [
                "shredded"
              ],
              "metaInformation": [
                "shredded"
              ],
              "measures": {
                "us": {
                  "amount": 1.5,
                  "unitShort": "cups",
                  "unitLong": "cups"
                },
                "metric": {
                  "amount": 354.882,
                  "unitShort": "ml",
                  "unitLong": "milliliters"
                }
              }
            },
            {
              "id": 10011282,
              "aisle": "Produce",
              "image": "red-onion.png",
              "consistency": "solid",
              "name": "red onion",
              "original": "½ red onion",
              "originalString": "½ red onion",
              "originalName": "red onion",
              "amount": 0.5,
              "unit": "",
              "meta": [
                "red"
              ],
              "metaInformation": [
                "red"
              ],
              "measures": {
                "us": {
                  "amount": 0.5,
                  "unitShort": "",
                  "unitLong": ""
                },
                "metric": {
                  "amount": 0.5,
                  "unitShort": "",
                  "unitLong": ""
                }
              }
            },
            {
              "id": 1102047,
              "aisle": "Spices and Seasonings",
              "image": "salt-and-pepper.jpg",
              "consistency": "solid",
              "name": "salt and pepper",
              "original": "Salt and pepper to taste",
              "originalString": "Salt and pepper to taste",
              "originalName": "Salt and pepper to taste",
              "amount": 6.0,
              "unit": "servings",
              "meta": [
                "to taste"
              ],
              "metaInformation": [
                "to taste"
              ],
              "measures": {
                "us": {
                  "amount": 6.0,
                  "unitShort": "servings",
                  "unitLong": "servings"
                },
                "metric": {
                  "amount": 6.0,
                  "unitShort": "servings",
                  "unitLong": "servings"
                }
              }
            },
            {
              "id": 4673,
              "aisle": "Milk, Eggs, Other Dairy",
              "image": "light-buttery-spread.png",
              "consistency": "solid",
              "name": "soy buttery spread",
              "original": "2 Tbsp Country crock buttery spread",
              "originalString": "2 Tbsp Country crock buttery spread",
              "originalName": "Country crock buttery spread",
              "amount": 2.0,
              "unit": "Tbsp",
              "meta": [],
              "metaInformation": [],
              "measures": {
                "us": {
                  "amount": 2.0,
                  "unitShort": "Tbsps",
                  "unitLong": "Tbsps"
                },
                "metric": {
                  "amount": 2.0,
                  "unitShort": "Tbsps",
                  "unitLong": "Tbsps"
                }
              }
            }
          ],
          "id": 1269377,
          "title": "Cheesy Chicken and Rice Casserole",
          "author": "activenetworkuser3779",
          "readyInMinutes": 60,
          "servings": 6,
          "image": "https://spoonacular.com/recipeImages/1269377-556x370.jpg",
          "imageType": "jpg",
          "summary": "If you want to add more <b>gluten free</b> recipes to your recipe box, Cheesy Chicken and Rice Casserole might be a recipe you should try. One portion of this dish contains roughly <b>29g of protein</b>, <b>28g of fat</b>, and a total of <b>453 calories</b>. This recipe serves 6 and costs $1.76 per serving. It will be a hit at your <b>Autumn</b> event. If you have red onion, green bell pepper, cream of mushroom soup, and a few other ingredients on hand, you can make it. Plenty of people really liked this main course. This recipe is liked by 1416 foodies and cooks. From preparation to the plate, this recipe takes approximately <b>1 hour</b>. It is brought to you by spoonacular user <a href=\"/profile/activenetworkuser3779\">activenetworkuser3779</a>. Overall, this recipe earns a <b>pretty good spoonacular score of 66%</b>. Users who liked this recipe also liked <a href=\"https://spoonacular.com/recipes/cheesy-chicken-and-rice-casserole-114311\">Cheesy Chicken and Rice Casserole</a>, <a href=\"https://spoonacular.com/recipes/cheesy-chicken-and-rice-casserole-715397\">Cheesy Chicken and Rice Casserole</a>, and <a href=\"https://spoonacular.com/recipes/cheesy-chicken-and-rice-casserole-170797\">Cheesy Chicken and Rice Casserole</a>.",
          "cuisines": [],
          "dishTypes": [
            "side dish",
            "lunch",
            "main course",
            "main dish",
            "dinner"
          ],
          "diets": [
            "gluten free"
          ],
          "occasions": [
            "fall",
            "winter"
          ],
          "winePairing": {
            "pairedWines": [],
            "pairingText": "",
            "productMatches": []
          },
          "instructions": "<p>Heat your oven to 350.Take your 2 grilled chicken breasts and allow them to slightly cool. Shred chicken breasts and place to the side in a mixing bowl.Finely chop your pepper and onion and saut in 2 Tbsp Country Crock for 5 minutes until soft.Add cream cheese into the onion and pepper and mix well.Pour into the large bowl with chicken. Mix in rice, hot sauce, cream of mushroom soup,  cup Monterrey Jack cheese, and salt and pepper. Mix well.Pour mixture in a 9 x 13 dish, and cover with remaining cheese and add salt and pepper to taste. Bake for 30 minutes. Allow to cool for 5 minutes before serving.</p>",
          "analyzedInstructions": [
            {
              "name": "",
              "steps": [
                {
                  "number": 1,
                  "step": "Heat your oven to 350.Take your 2 grilled chicken breasts and allow them to slightly cool. Shred chicken breasts and place to the side in a mixing bowl.Finely chop your pepper and onion and saut in 2 Tbsp Country Crock for 5 minutes until soft.",
                  "ingredients": [
                    {
                      "id": 5062,
                      "name": "chicken breast",
                      "image": "chicken-breasts.png"
                    },
                    {
                      "id": 11282,
                      "name": "onion",
                      "image": "brown-onion.png"
                    }
                  ],
                  "equipment": [
                    {
                      "id": 405907,
                      "name": "mixing bowl",
                      "image": "mixing-bowl.jpg"
                    },
                    {
                      "id": 404784,
                      "name": "oven",
                      "image": "oven.jpg"
                    }
                  ],
                  "length": {
                    "number": 5,
                    "unit": "minutes"
                  }
                },
                {
                  "number": 2,
                  "step": "Add cream cheese into the onion and pepper and mix well.",
                  "ingredients": [
                    {
                      "id": 1017,
                      "name": "cream cheese",
                      "image": "cream-cheese.jpg"
                    },
                    {
                      "id": 11282,
                      "name": "onion",
                      "image": "brown-onion.png"
                    }
                  ],
                  "equipment": []
                },
                {
                  "number": 3,
                  "step": "Pour into the large bowl with chicken.",
                  "ingredients": [],
                  "equipment": [
                    {
                      "id": 404783,
                      "name": "bowl",
                      "image": "bowl.jpg"
                    }
                  ]
                },
                {
                  "number": 4,
                  "step": "Mix in rice, hot sauce, cream of mushroom soup,  cup Monterrey Jack cheese, and salt and pepper.",
                  "ingredients": [
                    {
                      "id": 6147,
                      "name": "cream of mushroom soup",
                      "image": "cream-of-mushroom-soup.png"
                    },
                    {
                      "id": 1102047,
                      "name": "salt and pepper",
                      "image": "salt-and-pepper.jpg"
                    },
                    {
                      "id": 1001025,
                      "name": "monterey jack cheese",
                      "image": "shredded-cheese-white.jpg"
                    }
                  ],
                  "equipment": []
                },
                {
                  "number": 5,
                  "step": "Mix well.",
                  "ingredients": [],
                  "equipment": []
                },
                {
                  "number": 6,
                  "step": "Pour mixture in a 9 x 13 dish, and cover with remaining cheese and add salt and pepper to taste.",
                  "ingredients": [
                    {
                      "id": 1102047,
                      "name": "salt and pepper",
                      "image": "salt-and-pepper.jpg"
                    }
                  ],
                  "equipment": []
                },
                {
                  "number": 7,
                  "step": "Bake for 30 minutes. Allow to cool for 5 minutes before serving.",
                  "ingredients": [],
                  "equipment": [],
                  "length": {
                    "number": 35,
                    "unit": "minutes"
                  }
                }
              ]
            }
          ],
          "originalId": 715397
        }
    ]
}