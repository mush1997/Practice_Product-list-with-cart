let itemData;
fetch("data.json").then(response => response.json()).then(data => itemData = data);

const addToCartBtn = document.querySelectorAll(".add");
const plusBtn = document.querySelectorAll(".plus");
const minusBtn = document.querySelectorAll(".minus");
let num;

const totalItems = document.getElementById("totalItems");
const defaultCart = document.querySelector(".defaultCart");
const orderList = document.querySelector(".orderList");
const removeBtn = orderList.querySelectorAll(".item img");
const amount = orderList.querySelector(".amount");
const confirmBtn = orderList.querySelector("button");

const list = document.getElementById("list");
const confirmedList = list.querySelector(".confirmedList");
const resetBtn = list.querySelector("button");

function addToCart(event) {
  let itemName = event.currentTarget.closest("article").querySelector(".name");
  let item = itemData.find(item => item.name === itemName.textContent);
  addItemToCart(item, 1);

  event.currentTarget.style.zIndex = 0;
  event.currentTarget.parentElement.querySelector("img").classList.add("added");
  defaultCart.classList.add("hide");
  orderList.classList.remove("hide");
}

function addItemToCart(item, num) {
  let newItem = document.createElement("div");
  orderList.insertBefore(newItem, orderList.querySelector(".total"));
  newItem.classList.add("item");

  newItem.innerHTML = `<div>
  <h3>${item.name}</h3>
  <p><span class="number">${num}x</span><span class="unitPrice">@ $${(item.price.toFixed(2))}</span><span class="subtotal">$${(num * item.price).toFixed(2)}</span></p>
  </div>
  <img src="assets/images/icon-remove-item.svg" alt="remove-item">`;

  newItem.querySelector("img").addEventListener("click", removeItem);
  totalItems.textContent = Number(totalItems.textContent) + num;
  amount.textContent = "$" + (Number(amount.textContent.slice(1)) + Number(newItem.querySelector(".subtotal").textContent.slice(1))).toFixed(2);
}

function plus(event) {
  let quantity = event.target.parentElement.querySelector("span");
  let itemName = event.target.closest("article").querySelector(".name");
  let itemInCart = Array.from(orderList.querySelectorAll(".item"))
    .find(item => item.querySelector("h3").textContent === itemName.textContent);

  quantity.textContent = Number(quantity.textContent) + 1;
  num = quantity.textContent;
  updateItem(itemInCart, num);
}

function minus(event) {
  let quantity = event.target.parentElement.querySelector("span");
  let itemName = event.target.closest("article").querySelector(".name");
  let itemInCart = Array.from(orderList.querySelectorAll(".item"))
    .find(item => item.querySelector("h3").textContent === itemName.textContent);

  if (quantity.textContent === "1") {
    event.target.parentElement.previousElementSibling.style.zIndex = 1;
    event.target.closest("div").querySelector("img").classList.remove("added");
    itemInCart.remove();
    calculateTotal();

    if (!orderList.querySelector(".item")) {
      defaultCart.classList.remove("hide");
      orderList.classList.add("hide");
    }
    return;
  }

  quantity.textContent = Number(quantity.textContent) - 1;
  num = quantity.textContent;
  updateItem(itemInCart, num);
}

function updateItem(item, num) {
  let number = item.querySelector(".number");
  let unitPrice = item.querySelector(".unitPrice").textContent.slice(3);
  let subtotal = item.querySelector(".subtotal");

  number.textContent = num + "x";
  subtotal.textContent = "$" + (num * unitPrice).toFixed(2);
  calculateTotal();
}

function calculateTotal() {
  let arrNumber = Array.from(orderList.querySelectorAll(".number"));
  let arrSubtotal = Array.from(orderList.querySelectorAll(".subtotal"));

  if (arrNumber.length === 0) {
    totalItems.textContent = "0";
    amount.textContent = "$0.00";
  } else if (arrNumber.length === 1) {
    totalItems.textContent = parseInt(arrNumber[0].textContent);
    amount.textContent = arrSubtotal[0].textContent;
  } else {
    let sumOfNumber = arrNumber.map(number => parseInt(number.textContent)).reduce((pre, next) => pre + next);
    let sumOfSubtotal = arrSubtotal.map(subtotal => Number(subtotal.textContent.slice(1))).reduce((pre, next) => pre + next);
    totalItems.textContent = sumOfNumber;
    amount.textContent = "$" + sumOfSubtotal.toFixed(2);
  }
}

function removeItem(event) {
  let itemName = event.target.parentElement.querySelector("h3");
  let dessert = Array.from(document.querySelectorAll(".dessert"))
    .find(dessert => dessert.querySelector("h3").textContent === itemName.textContent);

  dessert.querySelector(".add").style.zIndex = 1;
  dessert.querySelector(".quantity span").textContent = "1";
  dessert.querySelector("img").classList.remove("added");

  event.target.parentElement.remove();
  calculateTotal();

  if (!orderList.querySelector(".item")) {
    defaultCart.classList.remove("hide");
    orderList.classList.add("hide");
  }
}

function makeList() {
  orderList.querySelectorAll(".item").forEach(dessert => {
    let dessertName = dessert.querySelector("h3").textContent;
    let dessertData = itemData.find(item => item.name === dessertName);
    let dessertNum = dessert.querySelector(".number").textContent;
    let dessertSubTotal = dessert.querySelector(".subtotal").textContent;

    let newLine = document.createElement("div");
    confirmedList.insertBefore(newLine, confirmedList.lastElementChild);
    newLine.classList.add("item");
    newLine.innerHTML = `<div class="single">
      <img src="${dessertData.image.thumbnail}" alt="${dessertData.name}">
      <div>
        <h3>${dessertName}</h3>
        <p><span class="number">${dessertNum}</span><span class="unitPrice">@ $${(dessertData.price.toFixed(2))}</span></p>
      </div>
    </div>
    <span class="subtotal">${dessertSubTotal}</span>`;
  });

  confirmedList.querySelector(".amount").textContent = amount.textContent;
  document.body.classList.add("shadow");
  list.classList.add("show");
  list.style.top = ((window.innerHeight - list.clientHeight) / 2 + window.scrollY) + "px";
}

function resetAll() {
  document.body.classList.remove("shadow");
  list.classList.remove("show");

  defaultCart.classList.remove("hide");
  orderList.classList.add("hide");
  document.querySelectorAll(".item").forEach(item => item.remove());

  addToCartBtn.forEach(btn => btn.style.zIndex = 1);
  minusBtn.forEach(btn => btn.nextElementSibling.textContent = "1");
  document.querySelectorAll(".pic").forEach(img => img.classList.remove("added"));

  totalItems.textContent = "0";
  amount.textContent = "$0.00";
}

addToCartBtn.forEach(btn => btn.addEventListener("click", addToCart));
plusBtn.forEach(btn => btn.addEventListener("click", plus));
minusBtn.forEach(btn => btn.addEventListener("click", minus));
removeBtn.forEach(btn => btn.addEventListener("click", removeItem));
confirmBtn.addEventListener("click", makeList);
resetBtn.addEventListener("click", resetAll);