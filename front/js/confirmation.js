// insére le numéro de commande sur la page de confirmation
const orderId = document.getElementById("orderId");
orderId.textContent = getOrderId();

// récupére le "orderID" (le numéro de la commande ) à partir de l'URL
function getOrderId() {
  const url = new URL(location.href);
  const orderId = url.searchParams.get("order");
  return orderId;
}
