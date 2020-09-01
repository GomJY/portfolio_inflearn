document.querySelector(".mainNavigation > .item").addEventListener("mouseover", (e) => {
  console.log(e);
  console.log(e.target.querySelector("ul"));
  // .classList.add("on");
});
console.log(document.querySelector(".mainNavigation > .item"));