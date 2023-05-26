// login process
const signUpForm = document.querySelector(".signup-form");
const loginEmail = document.querySelector(".email");
const loginPassword = document.querySelector(".password");
const error = document.querySelector(".error-class");
let searchValue;
const token = JSON.parse(localStorage.getItem("token"));
const dashboard = document.querySelector(".dashboard");
if (token) {
  if (token.role == "admin") {
    dashboard.style.display = "block";
  }
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
    const { data } = await axios.post(
      "http://localhost:3000/api/v1/auth/login",
      {
        email: loginEmail.value,
        password: loginPassword.value,
      }
    );

    error.innerText = "";
    error.innerText = "Login successful";
    error.classList.remove("error");
    error.classList.add("success");
    localStorage.setItem(
      "token",
      JSON.stringify({
        token: data.token,
        name: data.name,
        role: data.role,
        id: data.id,
        email: data.email,
      })
    );
  } catch (err) {
    error.innerText = "";
    console.log(err);
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

signUpForm.addEventListener("submit", (e) => {
  loginUser(e);
});
