const categoryValue = document.querySelector(".p-cat");
const addProducts = document.querySelector(".add-products");
const pImg = document.querySelector(".p-img");
const error = document.querySelector(".error-class");
let previewImages = document.querySelector(".preview-images");
const dashboard = document.querySelector(".dashboard");
let imageUrl = [];
let previewImg = [];
let selectedCategory;
let a;
let searchValue;
pImg.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);

  files.forEach((file) => {
    const reader = new FileReader();

    reader.onload = async () => {
      if (reader.readyState == 2) {
        imageUrl.push(reader.result);
        previewImg.push(reader.result);

        previewImages.innerHTML += `
        <p  style="cursor:pointer" class="cancel">Cancel</p>
        <img src="${reader.result}"  height="100" width="100"/>
        `;

        let cancelImg = document.querySelectorAll(".cancel");
        cancelImg.forEach((can) => {
          can.addEventListener("click", (e) => {
            console.log(e.currentTarget.nextElementSibling);
            const imageSrc = e.currentTarget.nextElementSibling.src;
            e.currentTarget.style.display = "none";
            e.currentTarget.nextElementSibling.style.display = "none";
            imageUrl = imageUrl.filter((img) => imageSrc != img);
            previewImg = previewImg.filter((img) => imageSrc != img);
          });
        });
      }
    };

    reader.readAsDataURL(file);
  });
});

const showCategories = async (e) => {
  e.preventDefault();

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

  selectedCategory = categoryValue.options[categoryValue.selectedIndex].value;
};

addProducts.addEventListener("submit", (e) => {
  addProduct(selectedCategory, e);
});

const changeCatValue = () => {
  selectedCategory = categoryValue.options[categoryValue.selectedIndex].value;
};

categoryValue.addEventListener("change", changeCatValue);

const addProduct = async (category, e) => {
  e.preventDefault();
  const name = document.querySelector(".p-name").value;
  const img = document.querySelector(".p-img").files[0].name;
  const price = document.querySelector(".p-price").value;
  const desc = document.querySelector(".p-desc").value;
  const stock = document.querySelector(".p-stock").value;

  const fileFormat = img.split(".")[1];

  if (
    fileFormat == "png" ||
    fileFormat == "jpg" ||
    fileFormat == "jpeg" ||
    fileFormat == "gif"
  ) {
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      if (imageUrl.length == 0) {
        error.innerText = "";
        error.innerText = "Please provide an img";
        error.classList.remove("success");
        error.classList.add("error");
        return;
      }
      error.innerText = "Loading";
      const data = await axios.post(
        "http://localhost:3000/api/v1/products",
        {
          p_name: name,
          img: imageUrl,
          price: price,
          p_desc: desc,
          stock: stock,
          category: category,
        },
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
          },
        }
      );

      error.innerText = "";
      error.innerText = "Product added successfully";
      error.classList.add("success");
      error.classList.remove("error");
    } catch (err) {
      error.innerText = "";
      error.innerText = err.response.data.msg;
      error.classList.remove("success");
      error.classList.add("error");
    }
  } else {
    error.innerText = "";
    error.innerText = "Only jpeg,mpeg and gif files are allowed";
    error.classList.remove("success");
    error.classList.add("error");
  }
};

window.addEventListener("DOMContentLoaded", showCategories);
