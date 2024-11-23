// === Переменные для управления элементами и состояниями игры ===

// Получаем все клетки игрового поля
const tiles = Array.from(document.querySelectorAll(".tile"));

// Элемент для отображения текущего игрока
const playerDisplay = document.querySelector(".display-player");

// Кнопка для сброса игры
const resetButton = document.querySelector("#reset");

// Элемент для объявления результата игры
const announcer = document.querySelector(".announcer");

// Состояние игрового поля: массив из 9 строк, соответствующих клеткам
let board = ["", "", "", "", "", "", "", "", ""];

// Указатель на текущего игрока ("X" или "O")
let currentPlayer = "X";

// Флаг, указывающий, активна ли игра
let isGameActive = true;

// Константы для обозначения результатов игры
const PLAYERX_WON = "PLAYERX_WON";
const PLAYERO_WON = "PLAYERO_WON";
const TIE = "TIE";

// Выигрышные комбинации (индексы клеток на игровом поле)
const winningConditions = [
  [0, 1, 2], // Первая строка
  [3, 4, 5], // Вторая строка
  [6, 7, 8], // Третья строка
  [0, 3, 6], // Первый столбец
  [1, 4, 7], // Второй столбец
  [2, 5, 8], // Третий столбец
  [0, 4, 8], // Диагональ слева направо
  [2, 4, 6], // Диагональ справа налево
];

// === Логика игры ===

// Проверяем, есть ли победитель или ничья
const checkWinOrTie = () => {
  let roundWon = false;

  // Проверяем все выигрышные комбинации
  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i]; // Получаем индексы текущей комбинации

    // Проверяем, что клетки не пустые и значения совпадают
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      roundWon = true;
      break; // Если найден победитель, выходим из цикла
    }
  }

  // Если есть победитель, объявляем результат
  if (roundWon) {
    announce(currentPlayer === "X" ? PLAYERX_WON : PLAYERO_WON);
    isGameActive = false; // Останавливаем игру
    return;
  }

  // Если доска полностью заполнена и нет победителя, объявляем ничью
  if (!board.includes("")) {
    announce(TIE);
  }
};

// Проверяем, пуста ли клетка
const isTileEmpty = (tile) => tile.innerText === "";

// Обновляем массив `board` с ходом текущего игрока
const updateBoard = (index) => {
  board[index] = currentPlayer;
};

// Смена текущего игрока
const switchPlayer = () => {
  // Убираем CSS-класс текущего игрока
  playerDisplay.classList.remove(`player${currentPlayer}`);

  // Меняем игрока на "X" или "O"
  currentPlayer = currentPlayer === "X" ? "O" : "X";

  // Обновляем текст и добавляем CSS-класс для нового игрока
  playerDisplay.innerText = currentPlayer;
  playerDisplay.classList.add(`player${currentPlayer}`);
};

// Обработка клика на клетку
const handleTileClick = (tile, index) => {
  // Проверяем, пуста ли клетка и активна ли игра
  if (isTileEmpty(tile) && isGameActive) {
    // Устанавливаем текущий ход в клетку
    tile.innerText = currentPlayer;
    tile.classList.add(`player${currentPlayer}`); // Добавляем стили текущего игрока

    // Обновляем состояние доски
    updateBoard(index);

    // Проверяем, есть ли победитель или ничья
    checkWinOrTie();

    // Если игра продолжается, меняем игрока
    if (isGameActive) switchPlayer();
  }
};

// Объявляем результат игры
const announce = (type) => {
  switch (type) {
    case PLAYERO_WON:
      // Объявляем победу игрока O
      announcer.innerHTML = 'Player <span class="playerO">O</span> Won';
      break;
    case PLAYERX_WON:
      // Объявляем победу игрока X
      announcer.innerHTML = 'Player <span class="playerX">X</span> Won';
      break;
    case TIE:
      // Объявляем ничью
      announcer.innerText = "Tie";
      break;
  }
  announcer.classList.remove("hide"); // Делаем элемент `announcer` видимым
};

// Сбрасываем игру в начальное состояние
const resetGame = () => {
  // Очищаем массив доски
  board = ["", "", "", "", "", "", "", "", ""];
  isGameActive = true; // Включаем активное состояние игры
  announcer.classList.add("hide"); // Скрываем сообщение о результате

  // Если текущий игрок был "O", переключаем обратно на "X"
  if (currentPlayer === "O") switchPlayer();

  // Очищаем текст и стили всех клеток
  tiles.forEach((tile) => {
    tile.innerText = "";
    tile.classList.remove("playerX", "playerO");
  });
};

// === События ===

// Добавляем обработчик клика на каждую клетку
tiles.forEach((tile, index) => {
  tile.addEventListener("click", () => handleTileClick(tile, index));
});

// Добавляем обработчик на кнопку "Reset"
resetButton.addEventListener("click", resetGame);
