const boxContainer = document.querySelector(".product-box-container");
const categoryBoxContainer = document.querySelector(".box-container");
let searchValue;

const itemCount = document.querySelector(".item-count");
const loginBtn = document.querySelector("#login-btn");
const usesrDetails = document.querySelector(".user-details");
const dashboard = document.querySelector(".dashboard");

const token = JSON.parse(localStorage.getItem("token"));

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
// displaying prodcuts
const products = async () => {
  const token = JSON.parse(localStorage.getItem("token"));

  try {
    const { data } = await axios.get(
      `http://localhost:3000/api/v1/products?${searchValue}`
    );
    showProducts(data.products);
  } catch (err) {
    console.log(err);
  }
};
// displaying products from api
const showProducts = (data) => {
  const products = data.map((product) => {
    return `
    <div class="box" data-id="${product._id}">
    <a href="../singleProduct.html?id=${product._id}"><img src="${product.img[0].url}" alt="">
   </a>
    
    <p class="product-name">${product.p_name}</p>
    <p class="product-price">Rs.${product.price}</p>
    <button href="" class="btn">add to cart</button>
</div>

      `;
  });

  boxContainer.innerHTML = products.join(" ");

  const cartBtns = document.querySelectorAll(".btn");
  cartBtns.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const productId = e.currentTarget.parentElement.dataset.id;
      const token = JSON.parse(localStorage.getItem("token"));
      let amount;
      if (token) {
        try {
          const { data } = await axios.get(
            `http://localhost:3000/api/v1/cart/${productId}`,

            {
              headers: {
                Authorization: `Bearer ${token.token}`,
              },
            }
          );

          //console.log(amount);
          if (!data.cart) {
            const addItem = await axios.post(
              `http://localhost:3000/api/v1/cart`,
              { productId: productId },
              {
                headers: {
                  Authorization: `Bearer ${token.token}`,
                },
              }
            );
            window.location.href = "./cart.html";
          } else {
            amount = data.cart.quantity;
            const updateItem = await axios.patch(
              `http://localhost:3000/api/v1/cart/${productId}`,
              { amount: amount },
              {
                headers: {
                  Authorization: `Bearer ${token.token}`,
                },
              }
            );
            window.location.href = "./cart.html";
          }
        } catch (err) {
          alert(err.response.data.msg);
          window.location.href = "./index.html";
        }
      } else {
        alert("You must login to add products to cart!!");
      }
    });
  });
};

const showCategories = async () => {
  try {
    const { data } = await axios.get("http://localhost:3000/api/v1/category");

    const categories = data.categories.map((cat) => {
      return `
      <div class="box">
      <h3>${cat.name}</h3>
      <a href="./categoryList.html?name=${cat.name}" class="cat-btn">shop now</a>
  </div>
      `;
    });
    categoryBoxContainer.innerHTML = categories.join(" ");
  } catch (err) {
    console.log(err);
  }
};

window.addEventListener("DOMContentLoaded", () => {
  products();
  showCategories();
});
