let container = document.querySelector(".container");
let computerPaper = document.querySelector(".computer-papers");
let playersPaper = document.querySelector(".player-papers");
let playground = document.querySelector(".play-ground");
let restPapers = document.querySelector(".rest-of-papers");
let paperName = ["zero", "one", "two", "three", "four", "five", "six"];
let j = 0;
let papersNum = 7;
let fragment = document.createDocumentFragment();
let playerStatus = false;
let computerStatus = true;
let firstPlay = true;
let validNumber_1;
let validNumber_2;

// create all the papers and push it in the array
for (let i = 0; i < paperName.length; i++) {
  for (let j = 0; j < paperName.length; j++) {
    let paper = document.createElement("div");
    paper.classList.add("paper");

    // create the face of the paper
    let face = document.createElement("div");
    face.classList.add("face", "one-side");

    // create the back of the paper
    let back = document.createElement("div");
    back.classList.add("back", "one-side");

    // create the first half in the paper
    let div_1 = document.createElement("div");
    div_1.classList.add(paperName[i], `numbers`);
    face.appendChild(div_1);

    // create the dots
    createDots(i, div_1);
    div_1.dataset.num = div_1.childElementCount;

    // create the second half in the paper
    let div_2 = document.createElement("div");
    div_2.classList.add(paperName[j], `numbers`);
    face.appendChild(div_2);

    if (div_1.className === div_2.className) {
      paper.classList.add("same-num");
    }
    // create the dots
    createDots(j, div_2);
    div_2.dataset.num = div_2.childElementCount;

    paper.appendChild(face);
    paper.appendChild(back);

    fragment.appendChild(paper);
  }
}

randomDiv(playersPaper, papersNum, false);
randomDiv(computerPaper, papersNum, true);
randomDiv(restPapers, fragment.childElementCount, true);

let myPapers = document.querySelectorAll(".player-papers .paper");
let compPapers = document.querySelectorAll(".computer-papers .paper");

myPapers.forEach((ele) => {
  ele.addEventListener("click", () => {
    firstPlay && playground.prepend(ele);
    firstPlay = false;
    playerPlay(ele);
  });
});

function playerPlay(ele) {
  if (playerStatus) {
    playEvent(ele);
    let myNewPapers = document.querySelectorAll(".player-papers .paper");
    if (myNewPapers.length < myPapers.length) {
    }
    computerStatus = true;
  }

  validNumbers();
  setTimeout(() => {
    compPlay();
  }, 1000);
}

function compPlay() {
  if (computerStatus) {
    for (let i = 0; i < compPapers.length; i++) {
      playEvent(compPapers[i]);
      if (playerStatus) break;
    }
    validNumbers();
    computerStatus = false;
  }
}

function pullPaper(parent) {
  let clonePaper = restPapers.firstChild.cloneNode(true);
  parent.classList.contains("player-papers") &&
    clonePaper.classList.remove("flip");
  parent.appendChild(clonePaper);
  restPapers.firstChild.remove();
  playEvent(clonePaper);
}

function playEvent(ele) {
  let firstPrepend = ele.firstChild.firstChild;

  let lastPrepend = ele.firstChild.lastChild;

  if (firstPrepend.dataset.num === validNumber_1) {
    playerStatus = true;
    ele.classList.remove("flip");
    ele.children[0].lastChild.after(firstPrepend);

    let clone = ele.cloneNode(true);
    playground.prepend(clone);
    ele.classList.add("cloned");
    document.querySelector(".cloned").remove();
  } else if (firstPrepend.dataset.num === validNumber_2) {
    playerStatus = true;
    ele.classList.remove("flip");

    let clone = ele.cloneNode(true);
    ele.classList.add("cloned");
    document.querySelector(".cloned").remove();
    playground.appendChild(clone);
  } else if (lastPrepend.dataset.num === validNumber_1) {
    playerStatus = true;
    ele.classList.remove("flip");

    let clone = ele.cloneNode(true);
    ele.classList.add("cloned");
    document.querySelector(".cloned").remove();
    playground.prepend(clone);
  } else if (lastPrepend.dataset.num === validNumber_2) {
    playerStatus = true;
    ele.classList.remove("flip");
    ele.children[0].firstChild.before(lastPrepend);

    let clone = ele.cloneNode(true);
    ele.classList.add("cloned");
    document.querySelector(".cloned").remove();
    playground.appendChild(clone);
  } else {
    pullPaper(ele.parentElement);
  }
}

function validNumbers() {
  let groundLength = playground.childElementCount;
  validNumber_1 = playground.children[0].children[0].children[0].dataset.num;
  validNumber_2 =
    playground.children[groundLength - 1].children[0].children[1].dataset.num;
}

function randomDiv(parent, loop, flip) {
  parent.innerHTML = ``;
  for (let i = 0; i < loop; i++) {
    let random =
      fragment.children[Math.floor(Math.random() * fragment.childElementCount)];
    flip && random.classList.add("flip");
    parent.appendChild(random);
  }
}

function createDots(dotsNum, parent) {
  for (let i = 0; i < dotsNum; i++) {
    let div = document.createElement("div");
    div.classList.add(`child-dot`);
    parent.appendChild(div);
  }
}
