import { host } from './config.js';

let allProducts=[];
//let cartProducts=[];
let totalPrice=0;
let totalQuantity=0;

function getProductsList() {
    fetch(`${host}/api/products`)
    .then(function(response) {
        //console.log(response);
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

function getProduct(productId) {
    return allProducts.find(product => product._id === productId);
}

function showCart() {
    //cartProducts = [];
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
        //console.log(item);
        const {name, price, imageUrl, altTxt} = item;
        const cartItem = {productId, color, quantity, name, price, imageUrl, altTxt};
        totalQuantity += Number(quantity);
        totalPrice += Number(quantity)*Number(price);

        const itemContent =
        `<article class="cart__item" data-id="${productId}" data-color="${color}">
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
    document.querySelectorAll(".itemQuantity").forEach(quantityInput=>quantityInput.addEventListener("change", quantityChangeHandler));
}

function updateProductCart(productId, color, newQuantity) {
    const oldCart = JSON.parse(localStorage.getItem("Kanap-OC"))||[];
    const indexProduct = oldCart.findIndex(value => value.productId === productId && value.color === color);
    if ( indexProduct >= 0)
      oldCart[indexProduct].quantity = Number(newQuantity);
    localStorage.setItem("Kanap-OC", JSON.stringify(oldCart));
}

function updateTotalQuantity() {
    let totalQuantity = 0;
    let quantities = document.querySelectorAll(".itemQuantity");
    if(quantities.length>0) {
        console.log(quantities);
        quantities.forEach(el=>{
            totalQuantity = totalQuantity + Number(el.value);
            //console.log(totalQuantity);
        });
           
    }
    //console.log(totalQuantity);
    document.getElementById("totalQuantity").innerHTML = totalQuantity;
}

function updateTotalPrice() {
    let totalPrice = 0;
    const cartProducts = document.querySelectorAll(".cart__item");
    cartProducts.forEach(cartProduct=>{
        const product = getProduct(cartProduct.dataset.id);
        if(product) {
            const {price} = product;
            const quantity = cartProduct.querySelectorAll(".itemQuantity")[0].value;
            totalPrice = totalPrice + Number(price)*Number(quantity);
        }
    })
    document.getElementById("totalPrice").innerHTML = totalPrice;
}

//to do : test if newValue is not the same as the old one 
function quantityChangeHandler() {
    const parentArticle = this.closest(".cart__item");
    //console.log(parentArticle)
    const newQuantity = event.target.value;
    updateProductCart(parentArticle.dataset.id, parentArticle.dataset.color, newQuantity);
    updateTotalQuantity();
    updateTotalPrice();
}

window.onload = getProductsList();