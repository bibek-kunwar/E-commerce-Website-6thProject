const editProductForm = document.querySelector(".edit-products-form");
const name = document.querySelector(".p-name");
const pImg = document.querySelector(".p-img");
const price = document.querySelector(".p-price");
const desc = document.querySelector(".p-desc");
const stock = document.querySelector(".p-stock");
const categoryValue = document.querySelector(".p-cat");
const previewImg = document.querySelector(".preview-images");
const error = document.querySelector(".error-class");
let searchValue;
let imageUrl = [];
let selectedCategory;

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

pImg.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);
  console.log(e.target.files);
  files.forEach((file) => {
    const reader = new FileReader();

    reader.onload = async () => {
      console.log("hello world");
      if (reader.readyState == 2) {
        imageUrl.push(reader.result);
        previewImg.innerHTML += `
        <p class="cancel">Cancel</p>
        <img src="${reader.result}" height="150" width="150"/>`;

        let cancel = document.querySelectorAll(".cancel");
        cancel.forEach((can) => {
          can.addEventListener("click", (e) => {
            const imageSrc = e.currentTarget.nextElementSibling.src;
            imageUrl = imageUrl.filter((img) => img != imageSrc);
            e.currentTarget.style.display = "none";
            e.currentTarget.nextElementSibling.style.display = "none";
          });
        });
      }
    };
    console.log(imageUrl);
    reader.readAsDataURL(file);
  });
});

const showCategories = async (e, value) => {
  e.preventDefault();
  console.log(imageUrl);
  try {
    const { data } = await axios.get("http://localhost:3000/api/v1/category");

    const categories = [];
    data.categories.map((cat) => {
      if (!categories.includes(cat.name)) {
        categories.push(cat.name);
      }
    });

    categoryValue.innerHTML = categories
      .map(
        (cat) => `
        <option value="${cat}" class="category" >${cat}</option>
      `
      )
      .join(" ");
  } catch (err) {
    console.log(err);
  }

  categoryValue.value = value;
};

categoryValue.addEventListener("change", () => {
  selectedCategory = categoryValue.options[categoryValue.selectedIndex].value;
});

const showForm = async (e) => {
  e.preventDefault();
  const queryString = window.location.search;
  const urlParam = new URLSearchParams(queryString);
  const id = urlParam.get("id");
  const token = JSON.parse(localStorage.getItem("token"));

  try {
    const { data } = await axios.get(
      `http://localhost:3000/api/v1/products/${id}`
    );

    name.value = data.product.p_name;
    price.value = data.product.price;
    desc.value = data.product.p_desc;
    stock.value = data.product.stock;
    showCategories(e, data.product.category);
    console.log();
    imageUrl = data.product.img.map((i) => i.url);
    previewImg.innerHTML = imageUrl
      .map(
        (img) => `
        <p class="cancel">Cancel<p>
        <img src="${img}" height="150" width="150"/>`
      )
      .join(" ");

    let cancel = document.querySelectorAll(".cancel");
    cancel.forEach((can) => {
      can.addEventListener("click", (e) => {
        const imageSrc =
          e.currentTarget.nextElementSibling.firstElementChild.src;
        console.log(e.currentTarget);
        console.log(imageSrc);
        imageUrl = imageUrl.filter((img) => img != imageSrc);
        e.currentTarget.style.display = "none";
        e.currentTarget.nextElementSibling.style.display = "none";
      });
    });
  } catch (err) {
    console.log(err);
  }

  editProductForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      error.innerText = "Loading...";
      const { data: editedData } = await axios.patch(
        `http://localhost:3000/api/v1/products/${id}`,
        {
          p_name: name.value,
          img: imageUrl,
          price: price.value,
          p_desc: desc.value,
          stock: stock.value,
          category: selectedCategory,
        },
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
          },
        }
      );

      error.innerText = " ";
      error.innerText = "Product edited successfully";
      error.classList.add("success");
      error.classList.remove("error");
    } catch (err) {
      error.innerText = " ";
      error.innerText = err.response.data.msg;
      error.classList.remove("success");
      error.classList.add("error");
    }
  });

  //   setTimeout(() => {
  //     error.classList.remove("success");
  //     error.classList.remove("error");
  //     error.innerHTML = " ";
  //   }, 2000);
};

window.addEventListener("DOMContentLoaded", showForm);
