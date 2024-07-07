const imageSrc = 'moana2.jpg'; // Путь к изображению пазла

const puzzlePieces = 9; // Количество частей пазла (3x3)

let piecesArray = []; // Массив для хранения кусочков пазла
let startTime; // Время начала игры
let gameInProgress = false; // Флаг указывает, идет ли игра в данный момент

// Функция для создания кусочков пазла
function createPuzzlePieces() {
  for (let i = 0; i < puzzlePieces; i++) {
    const piece = document.createElement('div');
    piece.classList.add('puzzlePiece');
    piece.setAttribute('id', `piece${i}`);
    piece.style.backgroundImage = `url(${imageSrc})`;
    const pieceWidth = 200; // Ширина кусочка
    const pieceHeight = 133; // Высота кусочка
    const xPos = (i % 3) * pieceWidth;
    const yPos = Math.floor(i / 3) * pieceHeight;
    piece.style.backgroundPosition = `-${xPos}px -${yPos}px`;
    piece.setAttribute('draggable', 'true');
    piece.addEventListener('dragstart', dragStart);
    piece.addEventListener('dragover', dragOver);
    piece.addEventListener('drop', drop);
    document.getElementById('puzzleContainer').appendChild(piece);
    piecesArray.push(piece);
  }
}

// Функция для перемешивания пазла
function shufflePuzzle() {
  piecesArray.sort(() => Math.random() - 0.5);
  piecesArray.forEach((piece, index) => {
    const xPos = (index % 3) * 200;
    const yPos = Math.floor(index / 3) * 133;
    piece.style.backgroundPosition = `-${xPos}px -${yPos}px`;
  });
  startGame(); // Начать игру после перемешивания
}

// Функция для начала игры
function startGame() {
  gameInProgress = true;
  startTime = new Date().getTime();
  updateTimer();
}

// Функция для обновления таймера
function updateTimer() {
  if (!gameInProgress) return;
  const currentTime = new Date().getTime();
  const timeDifference = currentTime - startTime;
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
  const minutes = Math.floor(timeDifference / (1000 * 60));
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  document.getElementById('timeDisplay').textContent = timeString;
  setTimeout(updateTimer, 1000);
}

// Функция для проверки завершения пазла
function checkIfSolved() {
  const currentOrder = piecesArray.map(piece => piece.id);
  const correctOrder = [...currentOrder].sort();
  if (JSON.stringify(currentOrder) === JSON.stringify(correctOrder)) {
    gameInProgress = false;
    document.getElementById('statusMessage').textContent = 'Поздравляем! Пазл собран!';
  }
}

// Функции для drag-and-drop
let draggedPiece = null;

function dragStart(e) {
  if (!gameInProgress) return;
  draggedPiece = e.target;
  setTimeout(() => {
    e.target.style.display = 'none';
  }, 0);
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  if (!gameInProgress) return;
  if (e.target.classList.contains('puzzlePiece')) {
    draggedPiece.style.display = 'block';
    e.target.parentNode.insertBefore(draggedPiece, e.target.nextSibling);
    checkIfSolved();
  }
}

// Вызов функции создания пазла при загрузке страницы
window.onload = function() {
  createPuzzlePieces();
  document.getElementById('statusMessage').textContent = 'Перетащите кусочки пазла для сборки.';
};
