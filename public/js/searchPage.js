productContainer = document.querySelector(".product-box-container");
let searchValue = document.querySelector(".search");
const searchForm = document.querySelector(".search-form");
const result = document.querySelector(".result");

const queryObject = window.location.search;

const urlParams = new URLSearchParams(queryObject);
const name = urlParams.get("name");
console.log(name);
const getSearchedProducts = async () => {
  try {
    const { data } = await axios.get(
      `http://localhost:3000/api/v1/products?name=${name}`
    );

    result.innerHTML = `${data.products.length} products found for  ${name}`;
    showProducts(data.products);
  } catch (err) {
    console.log(err);
  }
};

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  window.location.href = `../searchPage.html?name=${searchValue.value}`;
});

const showProducts = (products) => {
  const mapProducts = products.map((product) => {
    return ` <div class="box" data-id="${product._id}">
    <a href="../singleProduct.html?id=${product._id}"><img src="${product.img[0].url}" alt="">
   </a>
    
    <p class="product-name">${product.p_name}</p>
    <p class="product-price">Rs.${product.price}</p>
    <button href="" class="btn">add to cart</button>
</div>`;
  });

  productContainer.innerHTML = mapProducts.join(" ");
};
getSearchedProducts();
showProducts();
