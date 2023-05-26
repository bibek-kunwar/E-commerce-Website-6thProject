// login process
const loginForm = document.querySelector(".login-form");
const loginEmail = document.querySelector(".email");
const loginPassword = document.querySelector(".password");
const error = document.querySelector(".error-class");
const confirmPassword = document.querySelector(".confirm");
const userName = document.querySelector(".name");
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

const loginUser = async (e) => {
  // using api to login
  try {
    e.preventDefault();
    if (loginPassword.value != confirmPassword.value) {
      error.innerText = "Password do not match";
      error.classList.add("error");
      return;
    }

    const { data } = await axios.post(
      "http://localhost:3000/api/v1/auth/register",
      {
        name: userName.value,
        email: loginEmail.value,
        password: loginPassword.value,
      }
    );

    error.innerText = "";
    error.innerText = "User created successfully";
    error.classList.remove("error");
    error.classList.add("success");
    console.log(data);
    localStorage.setItem(
      "token",
      JSON.stringify({
        token: data.token,
        name: data.users.name,
        id: data.users.id,
        email: data.users.email,
      })
    );
  } catch (err) {
    error.innerText = "";
    error.innerText = err.response.data.msg;
    error.classList.remove("success");
    error.classList.add("error");
    localStorage.removeItem("token");
  }
  setTimeout(() => {
    error.innerText = "";
    error.classList.remove("error");
    error.classList.remove("success");
  }, 2000);
};

loginForm.addEventListener("submit", (e) => {
  loginUser(e);
});
