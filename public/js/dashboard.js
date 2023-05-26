const yourProduct = document.querySelector(".your-products");
let searchValue;
const token = JSON.parse(localStorage.getItem("token"));
const dashboard = document.querySelector(".dashboard");
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

const showProducts = async () => {
  const { data } = await axios.get("http://localhost:3000/api/v1/products");

  const products = data.products.map((product) => {
    return `
    <div class="products" data-id="${product._id}">
       <a href="./single-product.html?id=${product._id}"> 
       <img
          src="${product.img[0].url}"
          alt=""
          class="product-img" height="150" width="150"
        /></a>
        <p class="product-name">${product.p_name}</p>
        <p class="product-price">Rs.${product.price}</p>
        <a href="./edit-product.html?id=${product._id}" class="edit">Edit</a>
        <a href="" class="delete">Delete</a>
      </div>
    `;
  });

  yourProduct.innerHTML = products.join(" ");

  const deleteBtn = document.querySelectorAll(".delete");

  deleteBtn.forEach((del) => {
    del.addEventListener("click", deleteProduct);
  });
};

const deleteProduct = async (e) => {
  e.preventDefault();
  const id = e.currentTarget.parentElement.dataset.id;
  const token = JSON.parse(localStorage.getItem("token"));
  try {
    const { data } = await axios.delete(
      `http://localhost:3000/api/v1/products/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      }
    );
    alert("Product deleted successfully!");
    window.location.href = "http://localhost:3000/dashboard.html";
  } catch (err) {
    console.log(err);
  }
};

window.addEventListener("DOMContentLoaded", showProducts);
