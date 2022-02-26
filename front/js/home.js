import { host } from './config.js';

function showAllProducts(products) {
    let stringContent="";
    for(let product of products) {
        console.log(product);
        let {_id, imageUrl, name, description, altTxt} = product; 
        stringContent += `<a href="./product.html?id=${_id}">
            <article>
            <img src="${imageUrl}" alt=${altTxt}>
            <h3 class="productName">${name}</h3>
            <p class="productDescription">${description}</p>
            </article>
        </a>`
    }
    let elementItems = document.getElementById("items");
    elementItems.innerHTML += stringContent;
}

function addProductsList() {
    fetch(`${host}/api/products`)
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
         showAllProducts(response);
      })
      .catch(function(error) {
        console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message);
      });
}

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    addProductsList();
});