// ES6 이후 생김  보다 엄격하고 효율적인 작업을 위해 사용
'use strict';

const container =document.querySelector('.image-container');
const playTime =document.querySelector('.play-time');
const startButton =document.querySelector('.start-button');
const gameText =document.querySelector('.game-text');
const cheatButton = document.querySelector('.cheat-button');
const tileCount = 16;

// functions

let tiles = [];
const dragged = {
  el:null,
  class:null,
  index:null,
};
// 게임이 끝났을 때 드래깅이 안되게 하기위해 만든 변수
let isPlaying = false;
let timeInterval = null;
let time = 0;

//해당하는 값의 위치들이 맞는지 확인
function checkStatus() {
  const currentList = [...container.children];
  //한 줄일 경우 return도 생략이 가능
  const unMatchedList = currentList.filter((child,index) => Number(child.getAttribute('data-index')) !== index);
  console.log(unMatchedList);
  if(unMatchedList.length === 0 ) {
    //game finish
    gameText.style.display ="block";
    isPlaying = false;
    //게임이 끝나면 시간도 멈추게 됩니다. timeInterval에 시간++ 을 넣어서
    clearInterval(timeInterval);
  }
};

function setGame() {
  isPlaying = true;
  time = 0;
  container.innerHTML="";
  //게임이 실행도중에 갑자기 다시 실행될 수도 있으니까 그럴 때 시간도 다시 0부터
  clearInterval(timeInterval);
  gameText.style.display = "none";
  timeInterval = setInterval(()=> {
    playTime.innerText = time;
    time++;
  }, 1000);

  tiles = createImageTiles();
  //한 줄일 경우 {} 도 생략가능 인자가 하나 일때도 (tile)부분을 아래처럼 생략이 가능
  tiles.forEach(tile => container.appendChild(tile));
  setTimeout(() => {
    // append를 두번하기 때문에 초기화를 하고 다시 추가를 해줍니다.
    container.innerHTML="";
    shuffle(tiles).forEach(tile => container.appendChild(tile));
  },5000);
}

function createImageTiles() {
  const tempArray = [];
  Array(tileCount).fill().forEach((_, index) => {
    const li = document.createElement('li');
    li.setAttribute('data-index', index);
    //드래그가 잘 안될때 html의 속성을 추가해주면 됩니다.
    li.setAttribute('draggable', true);
    li.classList.add(`list${index}`);
    tempArray.push(li);
  })
  return tempArray;
}

function shuffle(array) {
  let index = array.length - 1; // 제일 마지막 인덱스
  while(index > 0) {
    const randomIndex = Math.floor(Math.random()*(index+1));
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
    index--;
  }
  return array;
};

// Events

container.addEventListener('dragstart', (e) => {
  //console.log(e);
  if(!isPlaying) return; 
  const obj = e.target;
  dragged.el = obj;
  dragged.class= obj.className;
  //console.log(typeof e.target.parentNode.children);  //indexOf는 배열에서 사용가능 Object임
  // ...을 하게 되면 가지고 있는 기본원소들이 불러진다.
  dragged.index = [...obj.parentNode.children].indexOf(obj);
});

container.addEventListener('dragover', (e) => {
  e.preventDefault();
  //console.log('over');

});

container.addEventListener('drop', (e) => {
  //drop이 안나오는 이유는 dragover된 상태에서 drag를 놓았기 때문에 안나온다..
  // dragover e.preventDefault()로 이벤트가 발생하지 않도록  문제를 해결
  //console.log('dropped');
  if(!isPlaying) return; 
  const obj = e.target;



  //해당 클래스네임과 드래그된 클래스네임이 달라야 옮겨져야겠죠?
  if(obj.className !== dragged.class) {
    let originPlace;
    let isLast = false;
  
    // 다음 
    if(dragged.el.nextSibling){
      originPlace = dragged.el.nextSibling;
    } else {
      originPlace = dragged.el.previousSibling;
      isLast = true;
    }
    const droppedIndex = [...obj.parentNode.children].indexOf(obj);
    // 가져온 인덱스가 드랍될 인덱스보다 뒤에 있다면을 의미
        dragged.index > droppedIndex ? obj.before(dragged.el) : obj.after(dragged.el)
        isLast ? originPlace.after(obj) : originPlace.before(obj);
        //앞뒤는 되지만 위아래가 안되서 그부분을 보완해야 합니다.
  }
  checkStatus();
});

startButton.addEventListener('click', () => {
  setGame();
})

cheatButton.addEventListener('click', (e) => {
  
})

