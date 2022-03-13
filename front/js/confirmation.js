//insérer le numéro de commande sur la page de confirmation
const orderId = document.getElementById("orderId");
orderId.textContent = getOrderId();

//récupérer le "orderID" à partir de l'URL
function getOrderId() {
  const url = new URL(location.href);
  const orderId = url.searchParams.get("order");
  return orderId;
}
