// TOGGLING OF SIDE BAR AND CART FUNCTIONALITY
const sideBartBtn = document.getElementById("menu-btn");
const cartBtn = document.getElementById("cart-btn");
const closeBtn = document.getElementById("close-btn");

sideBartBtn.addEventListener("click", toggleSideBar);
cartBtn.addEventListener("click", toggleCartBar);
closeBtn.addEventListener("click", toggleCartBar);

function toggleSideBar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("sidebar__slide");
}

function toggleCartBar() {
  const cartContainer = document.getElementById("cart-container");
  cartContainer.classList.toggle("cart__slide");
  if (cartContainer.classList.contains("cart__slide")) {
    // document.body.style.background = 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))'
  }
}

//DISPLAY ALL PRODUCT
const search = document.getElementById("search");
search.addEventListener("keyup", get_All_product_from_api);

async function get_All_product_from_api() {
  if (!search.value) {
    document.getElementById("all-product-heading").innerHTML = "All Products";
    const res = await fetch("api.json");
    const data = await res.json();
    const allProduct = data.products;
    allProduct.map((product) => show_All_Product(product.all));
  }
}

async function get_modern_product_from_api() {
  const res = await fetch("api.json");
  const data = await res.json();
  const onlyModernProduct = data.products;
  onlyModernProduct.map((product) => modernProduct(product));
}

//Handle search input
const form = document.getElementById("search-form");
form.addEventListener("submit", handleSearchInput);

async function handleSearchInput(e) {
  e.preventDefault();

  const search = document.getElementById("search").value;
  const res = await fetch("api.json");
  const data = await res.json();
  const allProduct = data.products;

  if (search) {
    return allProduct.forEach((item) => {
      const searchResults = item.all.filter((product) => {
        return Object.values(product)
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());
      });

      if (searchResults.length <= 0) {
        document.getElementById(
          "all__products"
        ).innerHTML = `<em>Your search does not match any result!</em>`;
        document.getElementById("all-product-heading").innerHTML = "Oops?";
        return;
      }
      document.getElementById("all-product-heading").innerHTML =
        "Search Results";

      sessionStorage.setItem("SEARCH-RESULTS", JSON.stringify(searchResults));
      show_All_Product(searchResults);
    });
  }
}
//show products in product page
function show_All_Product(product) {
  console.log(product);
  const allProductContainer = document.querySelector("#all__products");
  const searchResults = JSON.parse(sessionStorage.getItem("SEARCH-RESULTS"));

  if (searchResults == []) {
    allProductContainer.innerHTML = `<b>Your search does not match any product</b>`;
  }
  if (searchResults) {
    allProductContainer.innerHTML = "";

    product.forEach((item) => {
      const div = document.createElement("div");
      div.classList.add("items");
      div.setAttribute("data-id", item.id);

      div.innerHTML = `
          <img src="${item.img}" alt="" id="img">

          <div class="items__info">
             <span class="item__price">$${item.price}</span>
             <span class="item__name">${item.title}</span>
          </div>

          <div class="overlay__container">
             <div class="center">
                <span>
                <i class="fas fa-cart-plus icon" id="add-to-cart" ></i>
                </span>
             </div>
             <div class="right">
             </div>
          </div>`;

      allProductContainer.append(div);
    });
  }
  animationOnScroll();

  const addToCartBtn = document.querySelectorAll("#add-to-cart");
  addToCartBtn.forEach((button) => {
    button.addEventListener("click", addToCart);
  });
}

//show modern product

function modernProduct(product) {
  const modernProduct = document.querySelector("#modern-product-container");
  const latestProduct = document.querySelector("#latest-product-container");

  product.modern.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("items");
    div.setAttribute("data-id", item.id);

    div.innerHTML = `
      <img src="${item.img}" alt="" id="img">

      <div class="items__info">
         <span class="item__price">$${item.price}</span>
         <span class="item__name">${item.title}</span>
      </div>
      
      <div class="overlay__container">
         <div class="center">
            <span>
            <i class="fas fa-cart-plus icon" id="add-to-cart" ></i>
            </span>
         </div>
         <div class="right">
         </div>
      </div>`;

    modernProduct.append(div);
    animationOnScroll();
    const addToCartBtn = document.querySelectorAll("#add-to-cart");
    addToCartBtn.forEach((button) => {
      button.addEventListener("click", addToCart);
    });
  });

  //latest
  product.latest.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("items");
    div.setAttribute("data-id", item.id);

    div.innerHTML = `
      <img src="${item.img}" alt="" id="img">

      <div class="items__info">
         <span class="item__price">$${item.price}</span>
         <span class="item__name">${item.title}</span>
      </div>
      
      <div class="overlay__container">
         <div class="center">
            <span>
            <i class="fas fa-cart-plus icon" id="add-to-cart" ></i>
            </span>
         </div>
         <div class="right">
         </div>
      </div>`;

    latestProduct.append(div);
    animationOnScroll();
    const addToCartBtn = document.querySelectorAll("#add-to-cart");
    addToCartBtn.forEach((button) => {
      button.addEventListener("click", addToCart);
    });
  });
}

//ADDING ITEM TO CART FUNCTIONALITY

let cart = [];
//GETTING ITEMS STORED IN CART FROM LOCALSTORAGE
function storage() {
  const cartItems = JSON.parse(localStorage.getItem("CART-ITEMS"));

  if (cartItems) {
    cart = [...cartItems];
    displayAllProduct(cart);
  }
}
storage();
totalPrice();

//ADD ITEMS TO LOCALSTROAGE

function addToCart() {
  const productParentContainer =
    this.parentElement.parentElement.parentElement.parentElement;
  const productId = productParentContainer.getAttribute("data-id");
  const productImg = productParentContainer.querySelector("#img").src;
  const productPrice = productParentContainer
    .querySelector(".item__price")
    .innerHTML.replace("$", "");
  const productTitle =
    productParentContainer.querySelector(".item__name").innerHTML;

  const newItem = {
    id: productId,
    title: productTitle,
    img: productImg,
    price: productPrice,
  };

  const isInCart = cart.find((product) => product.id === productId);

  if (isInCart) {
    alert("product has already been added to cart");
    return;
  }
  cart.push(newItem);
  localStorage.setItem("CART-ITEMS", JSON.stringify(cart));

  storage();
  totalPrice();
  check_How_Many_Items_In_Cart_And_Display_It_In_The_notification();
}

//DISPLAY ALL STORES PRODUCT FROM SESSION STORAGE
function displayAllProduct(item) {
  const cartContainer = document.getElementById("product-container");

  cartContainer.innerHTML = "";

  item.forEach((product) => {
    let div = document.createElement("div");
    div.classList.add("cart__product__container");

    div.innerHTML = `
            <div class="cart__left">
               <span class="cart__item__title">${product.title}</span><br/>
               <img src="${product.img}"" alt="">
            </div>
            <div class="cart__right">
               <h5 class="cart__item__price" id="price">$${product.price}</h5>
               <p class="cart__remove__btn">
                  <i class="fas fa-trash" id="removeBtn"></i>
               </p>
               <div class="flex__end">
                  <p class="add__btn" id="">+</p>
                  <input type="number" value="1" class="cart__quantity" id="input">
                  <p class="sum__btn">-</p>
               </div>
            </div>
      `;
    cartContainer.append(div);
  });

  const removeBtn = document.querySelectorAll("#removeBtn");
  removeBtn.forEach((btn) => {
    btn.addEventListener("click", handleDelete);
  });

  const inputValue = document.querySelectorAll("#input");
  inputValue.forEach((btn) => {
    btn.addEventListener("change", ifQuantityChanges);
  });
}

//Delete items from cart
function handleDelete() {
  const img =
    this.parentElement.parentElement.previousElementSibling.firstElementChild
      .nextElementSibling.src;
  const parentElement = this.parentElement.parentElement.parentElement;
  const filteredItems = cart.filter((product) => {
    return product.img !== img;
  });

  parentElement.remove();

  cart = filteredItems;
  localStorage.setItem("CART-ITEMS", JSON.stringify(filteredItems));

  totalPrice();
  const cartContainer = document.querySelector("#product-container");

  alert("Thanks for shopping with us hope to see you some other time");

  if (!cartContainer.childElementCount <= 0) {
    cart = [];
    localStorage.setItem("CART-ITEMS", null);
  }
  check_How_Many_Items_In_Cart_And_Display_It_In_The_notification();
}

//CALCULATE EACH PRICE
function ifQuantityChanges() {
  if (this.value < 1) {
    return (this.value = 1);
  }

  totalPrice();
}

//CALCULATE TOTAL PRICE
function totalPrice() {
  const cartContainer = document.querySelector("#product-container").children;
  let total = 0;

  product = [...cartContainer];
  product.forEach((item) => {
    const price = item.querySelector("#price").innerHTML.replace("$", "");

    const inputValue = item.querySelector("#input").value;

    total += parseFloat(price * inputValue);
  });

  document.querySelector("#total").innerHTML = `$${total.toFixed(2)}`;
}

function check_How_Many_Items_In_Cart_And_Display_It_In_The_notification() {
  const cartContainer = document.querySelector("#product-container");
  const badgeNotification = document.getElementById("badge");
  const purchaseBtn = document.getElementById("purchase-btn");

  if (cartContainer.childElementCount <= 0) {
    badgeNotification.style.display = "none";
    purchaseBtn.setAttribute("disabled", "true");
  } else {
    badgeNotification.style.display = "initial";
    purchaseBtn.removeAttribute("disabled");
  }
  badgeNotification.innerHTML = cartContainer.childElementCount;
}
check_How_Many_Items_In_Cart_And_Display_It_In_The_notification();

//PURCHASE ITEMS
const purchaseBtn = document.getElementById("purchase-btn");

purchaseBtn.addEventListener("click", purchaseItems);

function purchaseItems() {
  localStorage.setItem("CART-ITEMS", null);
  cart = [];
  const cartContainer = document.querySelector("#product-container");

  alert("Thanks for shopping with us hope to see you some other time");

  if (cartContainer.hasChildNodes) {
    const cartChildren = cartContainer.children;

    const cartItems = [...cartChildren];

    cartItems.forEach((item) => {
      item.remove();
    });

    totalPrice();
    check_How_Many_Items_In_Cart_And_Display_It_In_The_notification();
  }
}

//SOME ANIMATION ON SCROLL USING INTERSECTION OBSERVER

function animationOnScroll() {
  const faders = document.querySelectorAll(".items");

  const options = {
    root: null,
    threshold: 0.5,
    rootMargin: "0px",
  };

  const appearOnscroll = new IntersectionObserver(function (
    entries,
    appearOnscroll
  ) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        entry.target.classList.remove("fade-in");
        return;
      }
      entry.target.classList.add("fade-in");
      // appearOnscroll.unobserve(entry.target)
    });
  },
  options);

  faders.forEach((fader) => {
    appearOnscroll.observe(fader);
  });
}
