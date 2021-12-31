"use strict";
const icon = document.querySelector(".cart-icon");
const modal = document.querySelector(".modal");
const show = document.querySelector(".show");

const modalFooter = document.querySelector(".modal-footer");
const modalBody = document.querySelector(".modal-body");

const promoButtons = document.querySelectorAll(".btn-promo");
const specialButtons = document.querySelectorAll(".btn-special");
const badge = document.querySelector(".badge");
const smallNavBadge=document.querySelector('.small-nav-badge')

icon.addEventListener("click", function (e) {
  modal.classList.add("show");
});
function createItem(img, name, price) {
  this.img = img;
  this.name = name;
  this.price = price;
}
function createEachItem(img, name, price) {
  let image = `${img}`;
  let item = new createItem(image, name, price);
  // storeItem.push(item);
  const cartItem = document.createElement("div");
  cartItem.classList.add("container", "item-container");
  cartItem.innerHTML = ` <div class='row'>
                                <div class='col-md-6'>
                                  <img src="resources/img${item.img}" class="img-fluid" id="item-img" alt="">
                                </div>
                                <div class='col-md-5'>
                                  <div class="item-text pt-4">
                                    <p id="cart-item-title" class="font-weight-bold mb-0">${item.name}</p>
                                    <span>$</span>
                                    <span id="item-price" class="item-price" class="mb-0">${item.price}</span>
                                  </div>
                                </div>
                                <div class='col-md-1 pt-4 remove-icon'>
                                  <button  class="cart-item-remove"><i class="fas fa-trash"></i></button>
                                </div>
                              </div>`;

  modalBody.appendChild(cartItem);
  return item;
}
const item = [];
promoButtons.forEach(function (btn) {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    const priceRow =
      e.target.parentElement.parentElement.previousElementSibling;
    const imgRow = priceRow.previousElementSibling;
    const [firstImg, secondImg] = imgRow.getElementsByTagName("img");
    const [firstImgName, secondImgName] = imgRow.getElementsByTagName("p");

    const firstImgFullPath = firstImg.src;
    const secondImgFullPath = secondImg.src;

    const firstImgPos = firstImgFullPath.indexOf("img") + 3;
    const secondImgPos = secondImgFullPath.indexOf("img") + 3;

    const firstImgPath = firstImgFullPath.slice(firstImgPos);
    const secondImgPath = secondImgFullPath.slice(secondImgPos);

    item.firstImage = `resources/img${firstImgPath}`;
    item.secondImage = `resources/img${secondImgPath}`;

    const firstName = firstImgName.textContent;
    const secondName = secondImgName.textContent;

    item.firstName = firstName;
    item.secondName = secondName;

    const price = priceRow
      .getElementsByTagName("div")[1]
      .getElementsByTagName("span")[0].textContent;
    item.price = price;

    const cartItem = document.createElement("div");
    cartItem.classList.add("container", "item-container");
    cartItem.innerHTML = ` <div class='row'>
                                <div class='col-md-6'>
                                  <img src='${item.firstImage}' class='first-img'>
                                  <i class="fas fa-plus plan-plus"></i>
                                  <img src='${item.secondImage}' class='second-img'>
                                </div>
                                <div class='col-md-5'>
                                  <div class="item-text">
                                    <p id="cart-item-title" class="font-weight-bold mb-0 pt-4">
                                      <span>${item.firstName}</span>&nbsp;&&nbsp<span>${item.secondName}</span>
                                    </p>
                                    <span>$</span>
                                    <span id="item-price" class="item-price" class="mb-0">${item.price}</span>
                                  </div>
                                </div> 
                                <div class='col-md-1 pt-4 remove-icon'>
                                  <button  class="cart-item-remove"><i class="fas fa-trash"></i></button>
                                </div>
                              </div>`;

    modalBody.appendChild(cartItem);
    showTotalPrice();
    displayrModalFooter();
  });
});
specialButtons.forEach(function (btn) {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    if (e.target.parentElement.classList.contains("order-btn")) {
      let img =
        e.target.parentElement.parentElement.firstElementChild.children[0];
      let fullPath = img.src;
      let pos = fullPath.indexOf("img") + 3; //3 to get pos after img
      let imgPath = fullPath.slice(pos);

      let itemName =
        e.target.parentElement.previousElementSibling.children[0].textContent;
      let price =
        e.target.parentElement.previousElementSibling.children[2].textContent;

      let item = createEachItem(imgPath, itemName, price);
      showTotalPrice();
      addLocalStorage(item);
    }
    displayrModalFooter();
  });
});
function displayrModalFooter() {
  modalFooter.style.display = "block";
  const firstText = document.getElementById("first-text");
  firstText.style.display = "none";
}
function showTotalPrice() {
  const total = [];
  const itemPrices = document.querySelectorAll(".item-price");
  itemPrices.forEach(function (price) {
    total.push(parseInt(price.textContent));
  });
  const totalPrice = total.reduce(function (total, item) {
    total += item;
    return total;
  }, 0);

  document.querySelector(".total-price").textContent = `${totalPrice}`;
  badge.style.display = "block";
  badge.textContent = `${total.length}`;
  smallNavBadge.textContent=`${total.length}`;
  badgeRemove();
}
function badgeRemove() {
  const close = document.querySelector(".btn-close");
  close.addEventListener("click", function (e) {
    badge.style.display = "none";
  });
}
//remove item
modalBody.addEventListener("click", removeItemTrash);
function removeItemTrash(e) {
  e.preventDefault();
  let itemRemove = e.target.parentElement;

  if (itemRemove.classList.contains("cart-item-remove")) {
    const itemContainer =
      e.target.parentElement.parentElement.parentElement.parentElement;
    modalBody.removeChild(itemContainer);
    //delete from local
    const itemName =
      e.target.parentElement.parentElement.previousElementSibling.children[0]
        .firstElementChild.textContent;
    deleteSingleItem(itemName);
  }
}
function addLocalStorage(item) {
  let itemRow = localStorage.getItem("itemRow")
    ? JSON.parse(localStorage.getItem("itemRow"))
    : [];
  itemRow.push(item);
  localStorage.setItem("itemRow", JSON.stringify(itemRow));
}

function displayStorage() {
  let exists = localStorage.getItem("itemRow");
  if (exists) {
    let storageItems = JSON.parse(localStorage.getItem("itemRow"));
    storageItems.forEach(function (storageItem) {
      let image = storageItem.img;
      let name = storageItem.name;
      let price = storageItem.price;
      createEachItem(image, name, price);
    });
  }
  displayrModalFooter();
}
function deleteSingleItem(itemName) {
  let itemRows = JSON.parse(localStorage.getItem("itemRow"));
  let index = itemRows.indexOf(itemName);

  console.log(itemRows.splice([index], 1));
  //first delete existing list
  localStorage.removeItem("itemRow");
  //add new updated/edited list
  localStorage.setItem("itemRow", JSON.stringify(itemRows));
}

function removeLocal() {
  localStorage.removeItem("itemRow");
}

document.addEventListener("DOMContentLoaded", displayStorage);
document.querySelector(".clear").addEventListener("click", removeLocal);

const sendOrderButton = document.querySelector(".send-order-btn");
sendOrderButton.addEventListener("click", function (e) {
  e.preventDefault();
  alert(`Successfully! We confirmed your orders`);
});
///////////cheif member section///////////////
const chiefImage = document.getElementById("customer-img");
const chiefName = document.getElementById("customer-name");
const chiefText = document.getElementById("customer-text");
const chiefButtons = document.querySelectorAll(".chief-btn");

const chiefMembers = [];
let index = 0;

createChiefMember(
  1,
  "John MERRy",
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam sit voluptatum illo? Quae fugiat aspernatur harum aperiam, quis eos officia."
);
createChiefMember(
  2,
  "Sandy",
  "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock"
);
createChiefMember(
  3,
  "Amy",
  "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour"
);
createChiefMember(
  4,
  "Tyrell",
  "If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing ."
);

function Chief(img, name, text) {
  this.img = img;
  this.name = name;
  this.text = text;
}
function createChiefMember(img, name, text) {
  let image = `resources/img/chief/member${img}.png`;
  let chief = new Chief(image, name, text);
  chiefMembers.push(chief);
}

chiefButtons.forEach(function (btn) {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    if (e.target.parentElement.classList.contains("prevBtn")) {
      if (index === 0) {
        index = chiefMembers.length;
      }
      index--;
      chiefImage.src = chiefMembers[index].img;
      chiefName.textContent = chiefMembers[index].name;
      chiefText.textContent = chiefMembers[index].text;
    } else if (e.target.parentElement.classList.contains("nextBtn")) {
      index++;
      if (index === chiefMembers.length) {
        index = 0;
      }
      chiefImage.src = chiefMembers[index].img;
      chiefName.textContent = chiefMembers[index].name;
      chiefText.textContent = chiefMembers[index].text;
    }
  });
});

//menu page
const tabs = document.querySelectorAll("[data-tab-target]");
const tabContents = document.querySelectorAll("[data-tab-content]");
const navItems = document.querySelectorAll(".nav-item");
const orderButtons = document.querySelectorAll(".btn-order");

tabs.forEach((tab) => {
  tab.addEventListener("click", (e) => {
    const target = document.querySelector(tab.dataset.tabTarget);
    tabContents.forEach((tabContent) => {
      tabContent.classList.remove("active");
    });
    target.classList.add("active");
    tab.classList.add("selected-li");
  });
});

orderButtons.forEach(function (btn) {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    let img = e.target.parentElement.parentElement.firstElementChild;
    let fullPath = img.src;
    let pos = fullPath.indexOf("img") + 3;
    let imgPath = fullPath.slice(pos);

    const namePirce =
      e.target.parentElement.previousElementSibling.firstElementChild
        .textContent;
    const itemName = namePirce.slice(0, -2);

    const price = namePirce.slice(-1);
    console.log(price);
    let item = createEachItem(imgPath, itemName, price);
    showTotalPrice();
    displayrModalFooter();
    addLocalStorage(item);
  });
});
