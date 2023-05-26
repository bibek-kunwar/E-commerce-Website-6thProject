const productContainer = document.querySelector(".product-box-container");
const queryObject = window.location.search;
const urlParams = new URLSearchParams(queryObject);
const catName = urlParams.get("name");

const showFilteredProducts = async () => {
  try {
    const { data } = await axios.get(
      `http://localhost:3000/api/v1/products/category/${catName}`
    );
  } catch (err) {
    console.log(err.response.data);
    if (err.response.data.length == 0) {
      productContainer.innerHTML = `<h1 style="font-size:35px; text-align:center;">Products not found!!</h1>`;
    } else {
      const productsList = err.response.data.map((product) => {
        return `<div class="box" data-id="${product._id}">
              <a href="../singleProduct.html?id=${product._id}"><img src="${product.img[0].url}" alt="">
             </a>
              
              <p class="product-name">${product.p_name}</p>
              <p class="product-price">Rs.${product.price}</p>
              <button href="" class="btn">add to cart</button>
          </div>`;
      });
      productContainer.innerHTML = productsList.join(" ");
    }
  }

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
        }
      } else {
        alert("You must login to add products to cart!!");
      }
    });
  });
};

window.addEventListener("DOMContentLoaded", showFilteredProducts);
