import { host } from './config.js';

// récupère l'id du produit, à partir de l'Url du navigateur 
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

// construit le DOM d'un Produit, envoyé en paramètre, en format json 
function showOneProduct(product) {     
  //console.log(product);
  const {_id, price, colors, imageUrl, name, description, altTxt} = product; 
  
  const imageProduct = document.createElement("img");
  imageProduct.setAttribute("src", imageUrl);
  imageProduct.setAttribute("alt", altTxt);
  document.getElementsByClassName("item__img")[0].appendChild(imageProduct);
  document.getElementById("title").textContent=name;
  document.getElementById("price").textContent=price;
  document.getElementById("description").textContent=description;

  const colorsElement =  document.getElementById("colors");
  for(let color of colors) {
    const colorOption = document.createElement("option");
    colorOption.setAttribute("value", color);
    colorOption.textContent=color;
    colorsElement.appendChild(colorOption);
  }
  document.getElementById("quantity").value="1";

  const button = document.getElementById("addToCart")  
  button.onclick = clickAddToChartHandler;
}


function clickAddToChartHandler() {
  const productId = getProductId();
  const quantity = Number(document.getElementById("quantity").value);
  const color = document.getElementById("colors").value;
  const itemToAdd = {productId,
          quantity,
          color
        };
  if (color !== "" && quantity > 0 && quantity <= 100) {
    //console.log("click addToCart but");
    addToCart(itemToAdd);
    window.location.href = "cart.html";
  }
  else {
    alert("Veuillez sélectionner une couleur et indiquer la quantité souhaitée. Attention, la quantité maximale est fixée à 100 articles.");
  }
}; 

// ajout d'un Produit dans le Panier, en respectant la quantité et la couleur sélectionnées 
// si le même Produit se trouve déjà dans le Panier (même id et même couleur), calcule la nouvelle quantité, ne duplique pas le même Produit 
// sauvegarde le panier dans le localStorage 
function addToCart(itemToAdd) {
  const {productId, quantity, color} = itemToAdd;
  const oldCart = JSON.parse(localStorage.getItem("Kanap-OC"))||[];
  const indexProduct = oldCart.findIndex(value => value.productId === productId && value.color === color);
  if ( indexProduct >= 0)
    oldCart[indexProduct].quantity = Number(oldCart[indexProduct].quantity)+Number(quantity);
  else
    oldCart.push(itemToAdd);
  localStorage.setItem("Kanap-OC", JSON.stringify(oldCart));
}

// récupère le produit avec l'id passé en paramètre, et construit la DOM de la page Produit pour ce Produit 
function addOneProduct(productId) {
    fetch(`${host}/api/products/${productId}`)
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
         showOneProduct(response);
      })
      .catch(function(error) {
        console.log("Il y a eu un problème avec l\'opération fetch: " + error.message);
      });
}

// construit la page Produit
window.onload = function() {
  //console.log(host);
  const productId = getProductId();
  if(productId)
    addOneProduct(productId);
  else {
    console.log("Je n'ai pas trouvé l'id du produit !");
    const elem = document.getElementById("item");
    elem.textContent="Id du produit pas trouvé !";
  }
}
