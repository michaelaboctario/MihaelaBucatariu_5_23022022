//import { host } from './config.js';
const host = "http://localhost:3000";
const cart=[];

function getProductId()
{
  let productId;
  const url = new URL(window.location.href);
  const search_params = new URLSearchParams(url.search); 
  if(search_params.has('id')) {
    productId = search_params.get('id');
    //console.log(productId);
  } 
  return productId;
}

function showOneProduct(product) {     
    console.log(product);
    const {_id, price, colors, imageUrl, name, description, altTxt} = product; 
    const stringContent = `<article>
      <div class="item__img">
        <img src=${imageUrl} alt=${altTxt}
      </div>
      <div class="item__content">
        <div class="item__content__titlePrice">
          <h1 id="title">${name}</h1>
          <p>Prix : <span id="price">${price}</span>€</p>
        </div>

        <div class="item__content__description">
          <p class="item__content__description__title">Description :</p>
          <p id="description">${description}</p>
        </div>

        <div class="item__content__settings">
          <div class="item__content__settings__color">
            <label for="color-select">Choisir une couleur :</label>
            <select name="color-select" id="colors">
              <option value="">--SVP, choisissez une couleur --</option>            
            </select>
          </div>

          <div class="item__content__settings__quantity">
            <label for="itemQuantity">Nombre d'article(s) (1-100) :</label>
            <input type="number" name="itemQuantity" min="1" max="100" value="1" id="quantity">
          </div>
        </div>
        </div>
        <div class="item__content__addButton">
            <button id="addToCart">Ajouter au panier</button>
        </div>
    </article>`;
  
    let stringColor = "";
    for(let color of colors) {
      stringColor += `<option value="${color}">${color}</option>`;
    }

    let elementItem = document.getElementById("item");
    elementItem.innerHTML = stringContent;
    let elementItemColors = document.getElementById("colors");
    elementItemColors.innerHTML = stringColor;

    const button = document.getElementById("addToCart")
    
    button.onclick = function() {
      //console.log("click addToCart but");
      addToCart();
    }; 
  }

function addToCart() {
    const productId = getProductId();
    const quantity = Number(document.getElementById("quantity").value);
    const color = document.getElementById("colors").value;
    const itemToAdd = { productId,
                      quantity,
                      color
                    }
    const oldCart = JSON.parse(localStorage.getItem("Kanap-OC"))||[];
    const indexProduct = oldCart.findIndex(value => value.productId === productId && value.color === color);
    if ( indexProduct >= 0)
      oldCart[indexProduct].quantity = Number(oldCart[indexProduct].quantity)+Number(quantity);
    else
      oldCart.push(itemToAdd);
    localStorage.setItem("Kanap-OC", JSON.stringify(oldCart));
}

function addOneProduct(productId) {
    fetch(`${host}/api/products/${productId}`)
    .then(function(response) {
        console.log(response);
        if(response.ok) {
          const res = response.json()
          //console.log(res);
          return res;
        } else {
          console.log('Mauvaise réponse du réseau');
        }
      })
      .then( function(response) {
         console.log(response);
         showOneProduct(response);
      })
      .catch(function(error) {
        console.log("Il y a eu un problème avec l\'opération fetch: " + error.message);
      });
}

window.onload = function() {
  console.log(host);
  const productId = getProductId();
  if(productId)
    addOneProduct(productId);
  else {
    console.log("Je n'ai pas trouvé l'id du produit !");
    const elem = document.getElementById("item");
    elem.innerHTML="Id du produit pas trouvé !";
  }
}
