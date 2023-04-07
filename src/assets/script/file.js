var sign_in_btn = document.getElementById("sign-in-btn");
var sign_up_btn = document.getElementById("sign-up-btn");
var container = document.getElementsByClassName("container")[0];

if(sign_in_btn!=null && sign_up_btn!=null){
  sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
    console.log("click");
  });
  sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
    console.log("click");
  });
}



