const orderForm = document.querySelector(".order-form");
const totalPrice = document.querySelector(".total-price");
let price = JSON.parse(localStorage.getItem("cart-price"));
const errorClass = document.querySelector("error-class");
totalPrice.innerText = "Rs" + price;
const token = JSON.parse(localStorage.getItem("token"));
const dashboard = document.querySelector(".dashboard");
var btn = document.getElementById("payment-button");

btn.disabled = true;
btn.style.cursor = "not-allowed";
btn.style.backgroundColor = "gray";

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

const showOrderedItems = async (e) => {
  console.log("Hello");
  e.preventDefault();
  const token = JSON.parse(localStorage.getItem("token"));
  const firstName = document.querySelector(".first-name").value;
  const lastName = document.querySelector(".last-name").value;
  const town = document.querySelector(".city").value;
  const state = document.querySelector(".state").value;
  const phone = document.querySelector(".phone").value;
  const email = document.querySelector(".email").value;

  if (token) {
    try {
      const { data } = await axios.get("http://localhost:3000/api/v1/cart", {
        headers: { Authorization: `Bearer ${token.token}` },
      });

      var cartItems = data.cart;
      let totalQuantity = 0;

      for (let i = 0; i < cartItems.length; i++) {
        totalQuantity += cartItems[i].quantity;

        try {
          const { data } = await axios.post(
            "http://localhost:3000/api/v1/order",
            {
              firstname: firstName,
              lastname: lastName,
              city: town,
              state: state,
              phone: phone,
              email: email,
              cartId: cartItems[i]._id,
              productId: cartItems[i].productId,
              quantity: cartItems[i].quantity,
            },
            {
              headers: { Authorization: `Bearer ${token.token}` },
            }
          );
          console.log(data);
        } catch (err) {
          console.log(err);
          alert(err.response.data.msg);
          return;
        }
      }

      alert("Your order has been successfully recorded!!");
      btn.style.backgroundColor = "purple";
      btn.style.cursor = "pointer";
      btn.disabled = false;
    } catch (err) {
      console.log(err);
    }
  }
};

// showOrderedItems();

orderForm.addEventListener("submit", showOrderedItems);
