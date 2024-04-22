const projectBackBtn = document.querySelector(".project__back-btn");
const bookmarkBtn = document.querySelector(".bookmark-btn");
const bookmarkCheckbox = document.getElementById("bookmark-checkbox");
const bookmarked = document.querySelector(".bookmarked");
const notBookmarked = document.querySelector(".not-bookmarked");
const bookmarkText = document.querySelector(".bookmark-text");
const projectInputRadio = document.querySelectorAll(".project__input-radio");
const project = document.querySelectorAll(".project");
const selectRewardBtn = document.querySelectorAll(".select-reward__btn");
const modalCloseBtn = document.querySelector(".modal-close-svg");
const backProjectContainer = document.querySelector(".back-project__container");
const selectProjectBtn = document.querySelectorAll(".select-project__btn");
const thanksContainer = document.querySelector(".thanks-container");
const gotItBtn = document.querySelector(".gotit-btn");
const pledgeBambooValue = document.querySelector("#pledge__bamboo-value");
const pledgeBlackValue = document.querySelector("#pledge__black-value");
const backedMoneyValue = document.querySelector(".backed__money-value");
const progressBar = document.querySelector(".progress__bar");
const rewardLeftBamboo = document.querySelectorAll(".reward-left__bamboo");
const rewardLeftBlack = document.querySelectorAll(".reward-left__black");
const backedBackersLeft = document.querySelector('.backed__backers');
const errorDiv = document.querySelector('.error');
const minPledgeValueElement = document.querySelector('.min-pledge-value');
const hamburgerIcon = document.querySelector('.hamburger-icon');
const pcNavList = document.querySelector('.pc-nav__list');


// Event Listener that run when page is load
window.addEventListener('DOMContentLoaded' , () => {
  if(JSON.parse(localStorage.getItem('name'))) {
    let getData = JSON.parse(localStorage.getItem('name'));
    if (
      Number(getData.backMoney) == 100000 ||
      Number(getData.backMoney) >= 100000
    ) {
      backedMoneyValue.innerText = "89125";
      progressBar.style.width = "80%";
      rewardLeftBamboo[0].innerText = '101';
      rewardLeftBamboo[1].innerText = '101';
      rewardLeftBlack[0].innerText = '64';
      rewardLeftBlack[1].innerText = '64';
    } else if (
      Number(getData.backMoney) == 99000 ||
      Number(getData.backMoney) >= 99000
    ) {
      progressBar.style.width = "99%";
    } else {
      backedMoneyValue.innerText = Number(getData.backMoney);
      backedBackersLeft.innerText = Number(getData.backBackers);
      rewardLeftBamboo[0].innerText = Number(getData.bambooLeft);
      rewardLeftBamboo[1].innerText = Number(getData.bambooLeft);
      rewardLeftBlack[0].innerText = Number(getData.blackLeft);
      rewardLeftBlack[1].innerText = Number(getData.blackLeft);
    }
  }
})

// Event Listener For Bookmark Button
bookmarkBtn.addEventListener("click", () => {
  if (bookmarkCheckbox.checked === true) {
    bookmarked.style.display = "block";
    notBookmarked.style.display = "none";
    bookmarkText.innerText = "Bookmarked";
    bookmarkText.style.color = "hsl(176, 72%, 28%)";
  } else {
    bookmarked.style.display = "none";
    notBookmarked.style.display = "block";
    bookmarkText.innerText = "Bookmark";
    bookmarkText.style.color = "hsl(0, 0%, 48%)";
  }
});

// Event Listener For Select Reward Button
selectRewardBtn.forEach((selectRewardBtnElement) => {
  selectRewardBtnElement.addEventListener("click", () => {
    addClass(backProjectContainer , 'showed')
    document.body.style.overflow = "hidden";
  });
});

// Event Listener For Project Back Button for open back this project container
projectBackBtn.addEventListener("click", () => {
});

// Event Listener For Close Button for close back this project container
modalCloseBtn.addEventListener("click", function () {
  removeClass(backProjectContainer , 'showed')
  document.body.style.overflow = "scroll";
});

// Event Listener For Select Project Button for Submit the pledge
selectProjectBtn.forEach((selectProjectBtnElement) => {
  selectProjectBtnElement.addEventListener("click", () => {
    if (projectInputRadio[1].checked === true) {
        addPledge(pledgeBambooValue, 25 , rewardLeftBamboo);
    } else if (projectInputRadio[2].checked === true) {
      addPledge(pledgeBlackValue, 75 , rewardLeftBlack);
    } else {
      addClass(thanksContainer , 'thanks-showed')
    }
  });
});

// Event Listener For Got It Button for closing the thanks section
gotItBtn.addEventListener("click", () => {
  thanksContainer.classList.remove("thanks-showed");
  backProjectContainer.classList.remove("showed");
  document.body.style.overflow = "scroll";
});

// Function for submitting the pledge
function addPledge(pledgeInputValue, minPledgeValue , rewardLeftText) {
  if (pledgeInputValue.value === "" || pledgeInputValue.value < minPledgeValue || pledgeInputValue.value > 200) {
    minPledgeValueElement.innerText = minPledgeValue;
    addClass(errorDiv , 'showed')
    setTimeout(()=>{
        removeClass(errorDiv , 'showed')
    },3000)
  } else {
    backedMoneyValue.innerText = parseInt(backedMoneyValue.innerText) + Number(pledgeInputValue.value);
    if (pledgeInputValue.value <= 100) {
      progressBar.style.width = `${Number(
        Number(`${progressBar.clientWidth}`) + Number(`${0.5}`)
      )}px`;
    } else {
      progressBar.style.width = `${Number(
        Number(`${progressBar.clientWidth}`) + Number(`${2.2}`)
      )}px`;
    }
    addClass(thanksContainer , 'thanks-showed')

    rewardLeftTextForEach(rewardLeftText);
    backedBackersLeft.innerText = `${parseInt(backedBackersLeft.innerText) - 1}`;
    pledgeInputValue.value = '';
    saveToLocal();
    if (
      backedMoneyValue.innerText == 100000 ||
      backedMoneyValue.innerText >= 100000
    ) {
      backedMoneyValue.innerText = "89125";
      progressBar.style.width = "80%";
      rewardLeftBamboo[0].innerText = '101';
      rewardLeftBamboo[1].innerText = '101';
      rewardLeftBlack[0].innerText = '64';
      rewardLeftBlack[1].innerText = '64';
    } else if (
      backedMoneyValue.innerText == 99000 ||
      backedMoneyValue.innerText >= 99000
    ) {
      progressBar.style.width = "99%";
    }  }
}

// Function for decrease the value of remainig pledge
function rewardLeftTextForEach(rewardLeft) {
    rewardLeft.forEach((rewardLeftElement) => {
        rewardLeftElement.innerText = `${parseInt(rewardLeftElement.innerText) - 1}`;
    });
}

// Event Listener on hamburger button for opening or closing menu
let menuOpen = false;
hamburgerIcon.addEventListener('click' , () => {
  if(!menuOpen) {
    hamburgerIcon.children[0].setAttribute('href' , 'Images/sprite.svg#icon-close-menu')
    addClass(pcNavList , 'showed')
    document.querySelector('.mobile-overlay').style.display = 'block';
    menuOpen = true;
  } else{
    hamburgerIcon.children[0].setAttribute('href' , 'Images/sprite.svg#icon-hamburger');
    document.querySelector('.mobile-overlay').style.display = 'none';
    removeClass(pcNavList , 'showed')
    menuOpen = false;
  }
})

// Function for save data into local storage
function saveToLocal() {
  let objData = {
    backMoney: backedMoneyValue.innerText,
    backBackers: backedBackersLeft.innerText,
    bambooLeft: rewardLeftBamboo[0].innerText,
    blackLeft: rewardLeftBlack[0].innerText,
    progress: progressBar.clientWidth
  };
  let setToLocal = localStorage.setItem('name',JSON.stringify(objData))
}

// Function for add classes
function addClass(element , classAdded) {
  element.classList.add(classAdded);
}

// Function for remove classes
function removeClass(element , classRemoved) {
  element.classList.remove(classRemoved);
}
