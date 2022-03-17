import { host } from './config.js';

//construit le DOM de la page d'accueil, a partir des produits déjà existent en format json récupères précédemment 
function showAllProducts(products) {
  const itemsElement = document.getElementById("items");
  for(let product of products) {
      //console.log(product);
      const {_id, imageUrl, name, description, altTxt} = product; 
      
      const productElement = document.createElement("a");
      productElement.setAttribute("href", `./product.html?id=${_id}`);
      const articleElement = document.createElement("article");
      productElement.appendChild(articleElement);
      const imgElement = document.createElement("img");
      imgElement.setAttribute("src", imageUrl);
      imgElement.setAttribute("alt", altTxt);
      articleElement.appendChild(imgElement);
      const h3Element = document.createElement("h3");
      h3Element.className = "productName";
      h3Element.textContent = name;
      articleElement.appendChild(h3Element);
      const pElement = document.createElement("p");
      pElement.className = "productDescription";
      pElement.textContent = description;
      articleElement.appendChild(pElement);

      itemsElement.appendChild(productElement);
  }
}

// récupère tous les produits depuis le backend avec une requête Get
function addProductsList() {
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
         showAllProducts(response);
      })
      .catch(function(error) {
        console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message);
      });
}

window.onload = addProductsList();
