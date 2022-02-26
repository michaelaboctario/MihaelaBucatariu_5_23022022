import { host } from './config.js';

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
    let {_id, price, imageUrl, name, description, altTxt} = product; 
    let stringContent = `
    <article>
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
              <option value="vert">vert</option>
              <option value="blanc">blanc</option>
          </select>
        </div>

        <div class="item__content__settings__quantity">
          <label for="itemQuantity">Nombre d'article(s) (1-100) :</label>
          <input type="number" name="itemQuantity" min="1" max="100" value="0" id="quantity">
        </div>
      </div>

      <div class="item__content__addButton">
        <button id="addToCart">Ajouter au panier</button>
      </div>

    </div>
  </article>
    `
    let elementItem = document.getElementById("item");
    elementItem.innerHTML = stringContent;
}

function addOneProduct(productId) {
    fetch(`${host}/api/products/${productId}`)
    .then(function(response) {
        console.log(response);
        if(response.ok) {
          const res = response.json()
          console.log(res);
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
        console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message);
      });
}

window.onload = function() {
  console.log(host);
  const productId = getProductId();
  if(productId)
    addOneProduct(productId);
  else {
    console.log("Je n'ai pas trouvé l'id du produit !");
    const elem = document.getElementById('item');
    elem.innerHTML="Id du produit pas trouvé !";
  }
}

