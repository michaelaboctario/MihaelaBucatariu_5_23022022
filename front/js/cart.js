import { host} from './config.js';

let allProducts=[];
let totalPrice=0;
let totalQuantity=0;
//let cartProducts=[];

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

// create this HTML
// <div class="cart__item__content__settings">
//   <div class="cart__item__content__settings__quantity">
//     <p>Qté : </p>
//     <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${quantity}>
//   </div>
//   <div class="cart__item__content__settings__delete">
//     <p class="deleteItem">Supprimer</p>
//   </div>
// </div>
function createItemContentSettingsElement(parentElement, cartItem) {      
  const {quantity} = cartItem;
  const settingsElement = document.createElement("div");
  settingsElement.className = "cart__item__content__settings";
  parentElement.appendChild(settingsElement);
  const settingsQuantityElement = document.createElement("div");
  settingsQuantityElement.className = "cart__item__content__settings__quantity";
  settingsElement.appendChild(settingsQuantityElement);
  const pElement = document.createElement("p");
  pElement.textContent = "Qté : ";
  settingsQuantityElement.appendChild(pElement);
  const inputElement = document.createElement("input");
  inputElement.type = "number";
  inputElement.className = "itemQuantity";
  inputElement.setAttribute("name", "itemQuantity");
  inputElement.setAttribute("min", "1");
  inputElement.setAttribute("max", "100");
  inputElement.value = quantity;
  settingsQuantityElement.appendChild(inputElement);

  const settingsDeleteElement = document.createElement("div");
  settingsDeleteElement.className = "cart__item__content__settings__delete";
  settingsElement.appendChild(settingsDeleteElement);
  const pDeleteElement = document.createElement("p");
  pDeleteElement.className = "deleteItem";
  pDeleteElement.textContent = "Supprimer";
  settingsDeleteElement.appendChild(pDeleteElement);
}

// <div class="cart__item__img">
//   <img src=${imageUrl} alt=${altTxt}>
// </div>
function createItemImgElement(parentElement, cartItem) {
  const {imageUrl, altTxt} = cartItem;
  const itemImgElement = document.createElement("div");
  itemImgElement.className = "cart__item__img";
  parentElement.appendChild(itemImgElement);
  const imgElement = document.createElement("img");
  imgElement.setAttribute("src", imageUrl);
  imgElement.setAttribute("alt", altTxt);
  itemImgElement.appendChild(imgElement);
}  
 
// <div class="cart__item__content__description">
//   <h2>${name}</h2>
//   <p>${color}</p>
//   <p>${price} €</p>
// </div>
  function createItemContentDescriptionElement(parentElement, cartItem) {
    const {name, color, price} = cartItem;
    const itemContentDescriptionElement = document.createElement("div");
    itemContentDescriptionElement.className = "cart__item__content__description";
    parentElement.appendChild(itemContentDescriptionElement);
    const h2Element = document.createElement("h2");
    h2Element.textContent = name;
    itemContentDescriptionElement.appendChild(h2Element);
    const pColorElement = document.createElement("p");
    pColorElement.textContent = color;
    itemContentDescriptionElement.appendChild(pColorElement);
    const pPriceElement = document.createElement("p");
    pPriceElement.textContent = `${price} €`;
    itemContentDescriptionElement.appendChild(pPriceElement);
  }

  // <article class="cart__item" data-id="${productId}" data-color="${color}">
  // </article>
  function createArticleElement(parentElement, cartItem) {  
    const {productId, color} = cartItem;
    const articleElement = document.createElement("article");
    articleElement.className = "cart__item";
    parentElement.appendChild(articleElement);
    articleElement.setAttribute("data-id", productId);
    articleElement.setAttribute("data-color", color);
    createItemImgElement(articleElement, cartItem);
    const itemContentElement = document.createElement("div");
    itemContentElement.className = "cart__item__content";
    articleElement.appendChild(itemContentElement);
    createItemContentDescriptionElement(itemContentElement, cartItem);
    createItemContentSettingsElement(itemContentElement, cartItem);
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
        if(item)
        {
          const {name, price, imageUrl, altTxt} = item;
          const cartItem = {productId, color, quantity, name, price, imageUrl, altTxt};
          totalQuantity += Number(quantity);
          totalPrice += Number(quantity)*Number(price);
          createArticleElement(document.getElementById("cart__items"), cartItem);
        }     
    });
    document.getElementById("totalQuantity").textContent = totalQuantity;
    document.getElementById("totalPrice").textContent = totalPrice;
    document.querySelectorAll(".itemQuantity").forEach(quantityInput=>quantityInput.addEventListener("change", quantityChangeHandler));
    document.querySelectorAll(".deleteItem").forEach(deleteButton=>deleteButton.addEventListener("click", deleteProductHandler));
}

function updateProductCart(productId, color, newQuantity) {
    const oldCart = JSON.parse(localStorage.getItem("Kanap-OC"))||[];
    const indexProduct = oldCart.findIndex(value => value.productId === productId && value.color === color);
    if ( indexProduct >= 0)
      oldCart[indexProduct].quantity = Number(newQuantity);
    localStorage.setItem("Kanap-OC", JSON.stringify(oldCart));
}

function deleteProductFromCart(productIdToDelete, colorToDelete) {
    const existingCart = JSON.parse(localStorage.getItem("Kanap-OC"))||[];
    const newCart = existingCart.filter(product=>{ 
        const {productId, color} = product;
        return !(productId === productIdToDelete && color === colorToDelete);
    });
   
    localStorage.setItem("Kanap-OC", JSON.stringify(newCart));
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
    document.getElementById("totalQuantity").textContent = totalQuantity;
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
    document.getElementById("totalPrice").textContent =  `${totalPrice} €`;
}

//to do : test if newValue is not the same as the old one 
function quantityChangeHandler(event) {
    const parentArticle = this.closest(".cart__item");
    //console.log(parentArticle)
    const newQuantity = event.target.value;
    updateProductCart(parentArticle.dataset.id, parentArticle.dataset.color, newQuantity);
    updateTotalQuantity();
    updateTotalPrice();
}

function deleteProductHandler() {
    //console.log("deleteProductHandler");
    const parentArticle = this.closest(".cart__item");
    //console.log(parentArticle)
    deleteProductFromCart(parentArticle.dataset.id, parentArticle.dataset.color);
    parentArticle.remove();
    updateTotalQuantity();
    updateTotalPrice();
}

const form  = document.getElementsByTagName("form")[0];
const emailInput = document.getElementById("email");
const errorEmail = document.getElementById("emailErrorMsg");
const firstNameInput = document.getElementById("firstName");
const errorFirstName = document.getElementById("firstNameErrorMsg");
const lastNameInput = document.getElementById("lastName");
const errorLastName = document.getElementById("lastNameErrorMsg");
const addressInput = document.getElementById("address");
const errorAddress = document.getElementById("addressErrorMsg");
const cityInput = document.getElementById("city");
const errorCity = document.getElementById("cityErrorMsg");

//regexp Email
//const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

function validateName(name) {
  //from https://grafikart.fr/forum/29810
  //const nameRegexp = /^[A-Z][\p{L}-]*$/;
  //Loïc, Laëtitia
  const nameRegexp = /^[A-Z][A-Za-z\é\è\ê\î\ï\ë\-]+$/;
  return nameRegexp.test(name);
}

function validateCity(city) {
  const cityRegexp = /^[A-Z][A-Za-z\é\è\ê\î\ï\ë\-]+$/;
  return cityRegexp.test(city);
}

function validateAddress(address) {
  const addressRegexp = /^[A-Z][A-Za-z\é\è\ê\î\ï\ë\-]+$/;
  return addressRegexp.test(address);
}

emailInput.addEventListener("input", function (event) {
    if (emailInput.validity.valid) {
      errorEmail.textContent = ""; 
    }
    else {
        errorEmail.textContent = "L'adresse e-mail n'est pas correcte!";
    }
  }, false);


  firstNameInput.addEventListener("input", function (event) {
    if (validateName(firstNameInput.value)) {
      errorFirstName.textContent = ""; 
    }
    else {
      errorFirstName.textContent = "Le prénom n'est pas correct!";
    }
  }, false);

  lastNameInput.addEventListener("input", function (event) {
    if (validateName(lastNameInput.value)) {
      errorLastName.textContent = ""; 
    }
    else {
      errorLastName.textContent = "Le nom n'est pas correct!";
    }
  }, false);

  cityInput.addEventListener("input", function (event) {
    if (validateCity(cityInput.value)) {
      errorCity.textContent = ""; 
    }
    else {
      errorCity.textContent = "Le nom de la ville n'est pas correct!";
    }
  }, false);

  addressInput.addEventListener("input", function (event) {
    if (validateAddress(addressInput.value)) {
      errorAddress.textContent = ""; 
    }
    else {
      errorAddress.textContent = "L'addresse n'est pas correcte!";
    }
  }, false);

function getCartProducts() {
  const existingCart = JSON.parse(localStorage.getItem("Kanap-OC"))||[];
  const idsCart = existingCart.map(product=>{ 
      const {productId} = product;
      return productId;
  });
   
  return idsCart;
}  

form.addEventListener("submit", function (event) {
    if (!emailInput.validity.valid 
      || !validateName(firstNameInput.value)
      || !validateName(lastNameInput.value)
      || !validateCity(cityInput.value)
      || !validateAddress(firstNameInput.value)) {    
    }
    else {
      const contact = {
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        address: addressInput.value,
        city: cityInput.value,
        email: emailInput.value,
      };
      const cart = {
        contact,
        products: getCartProducts()
      }
      console.log(cart);
      submitCart(cart);
    }
    event.preventDefault();
}, false);

function submitCart(cart) {
  console.log(JSON.stringify(cart));
  fetch(`${host}/api/products/order`, {
    method: "POST",
    headers: {
      'Accept': 'application/json', 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cart)
  })
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(data) {
    //console.log(data);
    window.location.replace(`confirmation.html?order=${data.orderId}`);
  });
}

window.onload = getProductsList();
