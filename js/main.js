let message = document.querySelector(".message");
let container = document.querySelector(".container");
let computerPaper = document.querySelector(".computer-papers");
let playersPaper = document.querySelector(".player-papers");
let playground = document.querySelector(".play-ground");
let restPapers = document.querySelector(".rest-of-papers");
let paperName = ["zero", "one", "two", "three", "four", "five", "six"];
let papersNum = 7;
let fragment = document.createDocumentFragment();
let validNumber_1;
let validNumber_2;
let firstPlay = true;
let playStatus = false;

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

    paper.append(face, back);

    fragment.appendChild(paper);
  }
}

// Put the papers in the divs
// The parameters is the parentDiv and number of papers and want it flip or not
randomDiv(playersPaper, papersNum, false);
randomDiv(computerPaper, papersNum, true);
randomDiv(restPapers, fragment.childElementCount, true);

let myPapers = document.querySelectorAll(".player-papers .paper");

// put click event in the papers of the player
myPapers.forEach((ele) => {
  ele.addEventListener("click", () => {
    // to play first play only
    firstPlay && playground.appendChild(ele);
    firstPlay = false;
    validNumbers();

    playerPlay(ele);
  });
});

// when the player play turn on all the functions (computerplay, validnumbers, pullpapers,...)
function playerPlay(ele) {
  let playGroundLength =
    document.querySelector(".play-ground").childElementCount;

  if (playStatus) {
    playEvent(ele);

    let updateLength = document.querySelector(".play-ground").childElementCount;

    // to know if the play-ground increment by one paper to replace the playStatus
    if (updateLength > playGroundLength) {
      playStatus = false;
    }
  }

  showEndMessage(
    document.querySelector(".player-papers"),
    document.querySelector(".computer-papers")
  );

  let compPapers = document.querySelectorAll(".computer-papers .paper");
  setTimeout(() => {
    computerPlay(compPapers);
  }, 1000);
}

// the computer play auto
function computerPlay(ele) {
  let playGroundLength =
    document.querySelector(".play-ground").childElementCount;

  // loop on the computers papers to see which paper valid to play
  for (let i = 0; i < ele.length; i++) {
    playEvent(ele[i]);

    let updateLength = document.querySelector(".play-ground").childElementCount;

    // to know if the play-ground increment by one paper to replace the playStatus and break the loop
    if (updateLength > playGroundLength) {
      playStatus = true;
      break;
    }
  }
  showEndMessage(
    document.querySelector(".computer-papers"),
    document.querySelector(".player-papers")
  );
}

// to put the paper in the right place
function playEvent(ele) {
  // chosse the elements to compare thier numbers
  let firstNum = ele.firstChild.firstChild;
  let secondNum = ele.firstChild.lastChild;

  // put the paper in the first and reflex it
  if (firstNum.dataset.num === validNumber_1) {
    firstNum.parentElement.appendChild(firstNum);
    playground.prepend(ele);
    ele.classList.remove("flip");
  }

  // put the paper in the last
  else if (firstNum.dataset.num === validNumber_2) {
    playground.appendChild(ele);
    ele.classList.remove("flip");
  }

  // put the paper in the first
  else if (secondNum.dataset.num === validNumber_1) {
    playground.prepend(ele);
    ele.classList.remove("flip");
  }

  // put the paper in the last and reflex it
  else if (secondNum.dataset.num === validNumber_2) {
    secondNum.parentElement.prepend(secondNum);
    playground.appendChild(ele);
    ele.classList.remove("flip");
  }

  // pull paper if dose not exist
  else {
    if (document.querySelector(".rest-of-papers").hasChildNodes())
      pullPaper(ele.parentElement);
  }
  // know the valid numbers
  validNumbers();
}

// Take a paper from the rest-papers to the one who need it
function pullPaper(parent) {
  let paper = restPapers.firstChild;
  parent.appendChild(paper);
  if (parent.classList.contains("player-papers")) {
    paper.classList.remove("flip");
    paper.addEventListener("click", () => {
      playerPlay(paper);
    });
  }
  playEvent(paper);
}

// This Function to get the two numbers that is valid to play in the play ground
function validNumbers() {
  let groundLength = playground.childElementCount;
  validNumber_1 = playground.children[0].children[0].children[0].dataset.num;
  validNumber_2 =
    playground.children[groundLength - 1].children[0].children[1].dataset.num;
}

// to get put papers in the parent randomly
function randomDiv(parent, loop, flip) {
  for (let i = 0; i < loop; i++) {
    let random =
      fragment.children[Math.floor(Math.random() * fragment.childElementCount)];
    flip && random.classList.add("flip");
    parent.appendChild(random);
  }
}

// to create the dots in every paper
function createDots(dotsNum, parent) {
  for (let i = 0; i < dotsNum; i++) {
    let div = document.createElement("div");
    div.classList.add(`child-dot`);
    parent.appendChild(div);
  }
}

// show the end message who win or lose
function showEndMessage(parent, loser) {
  let totalPoints = 0;

  // calculate the points
  for (let i = 0; i < loser.childElementCount; i++) {
    totalPoints += Number(loser.children[i].firstChild.firstChild.dataset.num);
    totalPoints += Number(loser.children[i].firstChild.lastChild.dataset.num);
  }

  // show the message to each one
  if (parent.childElementCount === 0) {
    message.classList.add("show");
    if (parent.classList.contains("player-papers")) {
      message.innerHTML = `<div>Congratulations You Win By ${totalPoints} Points`;
    } else {
      message.innerHTML = `<div>Oops You Lose By ${totalPoints} Points`;
    }
  }
}

// To show message if the screen less than 600px turn to landscape
function showWidthMessage() {
  if (window.innerWidth < 600) {
    message.innerHTML = `<div class='message-content'>Put Your Phone in Landscape</div>
                           <i class="fa-solid fa-mobile-screen-button fa-rotate-90"></i>`;
    message.classList.add("show");
  } else {
    message.innerHTML = "";
    message.classList.remove("show");
  }
}
showWidthMessage();
window.addEventListener("resize", () => {
  showWidthMessage();
});
