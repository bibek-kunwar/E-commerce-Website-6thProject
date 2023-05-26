const cartInfo = document.querySelector(".cart-products");
let totalPrice = 0;
let searchValue;
const token = JSON.parse(localStorage.getItem("token"));
const dashboard = document.querySelector(".dashboard");
const process = document.querySelector(".process");
const empty = document.querySelector(".empty");

if (token.role == "admin") {
  dashboard.style.display = "block";
}

searchForm = document.querySelector(".search-form");
searchInput = document.querySelector(".search");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  searchValue = searchInput.value;
  window.location.href = `../searchPage.html?name=${searchValue}`;
});

const showCartProducts = async () => {
  const token = JSON.parse(localStorage.getItem("token"));
  try {
    const { data } = await axios.get(`http://localhost:3000/api/v1/cart`, {
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    });

    const cartItems = data.cart;

    let products = [];
    for (let i = 0; i < cartItems.length; i++) {
      const { data } = await axios.get(
        `http://localhost:3000/api/v1/products/${cartItems[i].productId}`
      );
      data.product.quantity = cartItems[i].quantity;

      data.product.cartId = cartItems[i]._id;

      products.push(data);
    }

    products.map((product) => {
      totalPrice += product.product.price * product.product.quantity;
    });
    localStorage.setItem("cart-price", JSON.stringify(totalPrice));
    cartProductsView(products);
  } catch (err) {
    console.log(err);
  }
};

const cartProductsView = (datas) => {
  const cartProducts = datas.map((data) => {
    return `
    <tr>
        
        <td>
     
          <div class="cart-info" data-id="${data.product.cartId}">
          <div data-id="${data.product._id}"></div>
            <img src="${data.product.img[0].url}" height="100" width="100" alt="" />
        </td>
        <td>
            <div>
              <p>${data.product.p_name}</p>
              <span>Price:Rs. ${data.product.price}</span> <br />
              <a href="#" class="remove">remove</a>
            </div>
          </div>
        </td>
        <td><input type="number" class="amount-btn" value=${data.product.quantity}></td>
        
      </tr>
    `;
  });
  cartInfo.innerHTML = cartProducts.join(" ");
  const removeBtn = document.querySelectorAll(".remove");
  if (datas.length > 0) {
    process.innerHTML = `<a href="./billing.html" class="checkout btn">Proceed To Checkout</a>`;
  }
  if (datas.length <= 0) {
    empty.innerHTML = `<h1 style="text-style:center">No items to show in cart</h1>`;
  }
  removeBtn.forEach((btn) => {
    btn.addEventListener("click", deleteCart);
  });

  const updateCartInput = document.querySelectorAll(".amount-btn");
  updateCartInput.forEach((cart) => {
    cart.addEventListener("change", (e) => updateCart(e));
  });
};

const updateCart = async (e) => {
  const productId =
    e.currentTarget.parentElement.parentElement.firstElementChild
      .firstElementChild.firstElementChild.dataset.id;
  const cartId =
    e.currentTarget.parentElement.parentElement.firstElementChild
      .firstElementChild.dataset.id;
  const amount = e.currentTarget.value;

  const token = JSON.parse(localStorage.getItem("token"));
  try {
    const { data } = await axios.patch(
      `http://localhost:3000/api/v1/cart`,
      {
        cartId: cartId,
        productId: productId,
        amount: amount,
      },
      { headers: { Authorization: `Bearer ${token.token}` } }
    );

    window.location.href = "./cart.html";
  } catch (err) {
    alert(err.response.data.msg);
    window.location.href = "./cart.html";
  }
};

const deleteCart = async (e) => {
  const cartId =
    e.currentTarget.parentElement.parentElement.previousElementSibling
      .firstElementChild.dataset.id;
  const token = JSON.parse(localStorage.getItem("token"));

  try {
    const { data } = await axios.delete(
      `http://localhost:3000/api/v1/cart`,

      {
        headers: { Authorization: `Bearer ${token.token}` },
        data: { id: cartId },
      }
    );

    alert("Cart item deleted successfully!!");
    window.location.href = "./cart.html";
  } catch (err) {
    console.log(err);
  }
};

window.addEventListener("DOMContentLoaded", () => {
  showCartProducts();
});
