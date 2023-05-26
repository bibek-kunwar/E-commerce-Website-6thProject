const detailsContainer = document.querySelector(".container");
const relatedPic = document.querySelector(".related-pictures");
const queryObject = window.location.search;
const urlParams = new URLSearchParams(queryObject);
const id = urlParams.get("id");
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

const showSingleProduct = async () => {
  try {
    const { data } = await axios.get(
      `http://localhost:3000/api/v1/products/${id}`
    );

    detailsContainer.innerHTML = `<div class="left image-container">
      <div class="main">
        <img src="${data.product.img[0].url}"
          
          alt="" />
      </div>
    </div>
    <div class="right">
      <span>Best product</span>
      <h1>${data.product.p_name}</h1>
      <div class="price">Rs ${data.product.price}</div>
        <br/>
   
      <p>Stock: <span>${data.product.stock}</span></p>
        
      <h3>Product Detail</h3>
      <p>
       ${data.product.p_desc}
      </p>
      <button type="button" class="addCart">Add To Cart</button>
    
    </div>
  </div>
  </section>
  
  
  </div>
     `;
    const cartBtn = document.querySelector(".addCart");
    console.log(cartBtn);

    cartBtn.addEventListener("click", addToCart);

    relatedPic.innerHTML = data.product.img
      .map((i) => {
        return `<img  src=${i.url} height="200" width="200"/>`;
      })
      .join(" ");
  } catch (e) {
    console.log(e);
  }
};

const addToCart = async () => {
  console.log("hello");
  const token = JSON.parse(localStorage.getItem("token"));
  if (token) {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/v1/cart/${id}`,

        {
          headers: { Authorization: `Bearer ${token.token} ` },
        }
      );
      console.log(data);
      if (!data.cart) {
        try {
          const { data } = await axios.post(
            "http://localhost:3000/api/v1/cart",
            { productId: id },
            { headers: { Authorization: `Bearer ${token.token}` } }
          );
          window.location.href = "./cart.html";
        } catch (e) {
          console.log(e);
          alert(e.response.data.msg);
        }
      } else {
        try {
          const { data } = await axios.patch(
            `http://localhost:3000/api/v1/cart/${id}`,
            { amount: 1 },
            { headers: { Authorization: `Bearer ${token.token}` } }
          );
          window.location.href = "./cart.html";
        } catch (e) {
          console.log(e);
          alert(e.response.data.msg);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
};
window.addEventListener("DOMContentLoaded", showSingleProduct);
