let myLeads = JSON.parse(localStorage.getItem("myLinks")) || [];
const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");

inputBtn.addEventListener("click", function () {
  const inputValue = inputEl.value.trim();
  const isValidLink = isValidDomain(inputValue);

  if (inputValue !== "" && isValidLink) {
    const customName = prompt("Enter a custom name for the link or click OK:");
    const formattedUrl = formatUrl(inputValue);

    const linkObject = {
      name: customName || inputValue,
      url: formattedUrl,
    };

    myLeads.push(linkObject);
    inputEl.value = "";
    renderLeads();
    saveLeads();
  } else {
    alert("Invalid link. Please enter a valid URL with a specified domain.");
  }
});

function renderLeads() {
  let listItems = "";
  for (let i = 0; i < myLeads.length; i++) {
    listItems += `<div class="link-container">
      <a target='_blank' href='${myLeads[i].url}'>${myLeads[i].name}</a>
      <button class="delete-link-btn" data-index="${i}">Remove</button>
      </div>`;
  }
  ulEl.innerHTML = listItems;

  const deleteLinkBtns = document.querySelectorAll(".delete-link-btn");
  deleteLinkBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const indexToDelete = parseInt(btn.getAttribute("data-index"), 10);
      confirmDeleteLink(indexToDelete);
    });
  });
}

function confirmDeleteLink(index) {
  const shouldDelete = confirm(
    "Do you want to remove this link from your collection?"
  );
  if (shouldDelete) {
    deleteLink(index);
    renderLeads();
  }
}

deleteBtn.addEventListener("click", function () {
  const shouldDelete = confirm(
    "This will permanently delete ALL links from your collection"
  );
  if (shouldDelete) {
    localStorage.clear();
    myLeads = [];
    renderLeads();
  }
});

function deleteLink(index) {
  myLeads.splice(index, 1);
  saveLeads();
}

function saveLeads() {
  localStorage.setItem("myLinks", JSON.stringify(myLeads));
}

function formatUrl(url) {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname) {
      return parsedUrl.href;
    }
  } catch (error) {
    console.error("Error parsing URL:", error);
  }
  return null;
}

function isValidDomain(url) {
  try {
    const parsedUrl = new URL(url);
    return !!parsedUrl.hostname;
  } catch (error) {
    return false;
  }
}

document.addEventListener("DOMContentLoaded", renderLeads);
