"use strict"

//construit le DOM de la page d'accueil, a partir des produits déjà existent en format json récupères précédemment 
function showAllProducts(products) {
  const itemsElement = document.getElementById("items");
  for(let product of products) {
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
    fetch("http://localhost:3000/api/products")
    .then(function(response) {
        if(response.ok) {
          return response.json();
        } else {
          console.log('Mauvaise réponse du réseau');
        }
      })
      .then( function(response) {
         showAllProducts(response);
      })
      .catch(function(error) {
        console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message);
      });
}

window.onload = addProductsList();
