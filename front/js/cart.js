import { host } from './config.js';

let allProducts=[];
let cartProducts=[];
let totalPrice=0;
let totalQuantity=0;

function getProductsList() {
    fetch(`${host}/api/products`)
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
         //console.log(response);
         allProducts = response.slice();
         showCart();
      })
      .catch(function(error) {
        console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message);
      });
}

function showCart() {
    cartProducts = [];
    totalPrice=0;
    totalQuantity=0;

    const storedCart = JSON.parse(localStorage.getItem("Kanap-OC"))||[];
    //console.log(storedCart);
    //console.log(allProducts);
    let cartContent = "";
    storedCart.forEach((product) => {
        //console.log(product);
        const {productId, color, quantity} = product;
        const item = allProducts.find(product => product._id === productId);
        console.log(item);
        const {name, price, imageUrl, altTxt} = item;
        const cartItem = {productId, color, quantity, name, price, imageUrl, altTxt};
        totalQuantity += Number(quantity);
        totalPrice += Number(quantity)*Number(price);

        const itemContent =
        `<article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
        <div class="cart__item__img">
          <img src=${imageUrl} alt=${altTxt}>
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${name}</h2>
            <p>${color}</p>
            <p>${price} €</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${quantity}>
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`
        cartContent += itemContent;
    });
    document.getElementById("cart__items").innerHTML = cartContent;
    document.getElementById("totalQuantity").innerHTML = totalQuantity;
    document.getElementById("totalPrice").innerHTML = totalPrice;
}

window.onload = getProductsList();