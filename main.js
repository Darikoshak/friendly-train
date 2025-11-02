const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

if (!ctx) {
    console.error("Не удалось получить 2D контекст");
}

// --- Переменные для нашего "мяча" ---
let ball = {
    x: 0,
    y: 0,
    radius: 30, // Сделаем его чуть меньше
    velocityY: 0, // Вертикальная скорость
    gravity: 1, // Сила гравитации
    bounce: 0.9,  // Фактор "прыгучести" (0.8 = 80%)
    color: 'blue'
};

// --- Функция инициализации и изменения размера ---
// Эта функция будет устанавливать размер холста и
// размещать мяч в центре при запуске и при изменении окна
function init() {
    // Устанавливаем размер canvas (90% окна)
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Начальная позиция мяча - центр
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityY = 0; // Сбрасываем скорость

    console.log("Canvas initialized:", canvas.width, canvas.height);
}

// --- Функция для рисования мяча ---
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

// --- Главный цикл анимации ---
function animate() {
    // 1. Запрашиваем следующий кадр
    // Это создает плавный цикл
    requestAnimationFrame(animate);

    // 2. Очищаем холст перед новым кадром
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 3. Обновляем физику

    // Применяем гравитацию к скорости
    ball.velocityY += ball.gravity;

    // Применяем скорость к позиции
    ball.y += ball.velocityY;

    // 4. Проверяем коллизию (столкновение) с "полом"
    // (canvas.height - ball.radius) — это позиция пола
    if (ball.y + ball.radius > canvas.height) {

        // 1. Ставим мяч ровно на "пол", чтобы он не "провалился"
        ball.y = canvas.height - ball.radius;

        // 2. Инвертируем скорость (отскок) и применяем затухание (bounce)
        ball.velocityY = -ball.velocityY * ball.bounce;

        // Если отскок очень маленький, останавливаем мяч
        if (Math.abs(ball.velocityY) < 1) {
            ball.velocityY = 0;
            ball.gravity = 0; // Выключаем гравитацию, чтобы он не "дрожал"
        } else {
            ball.gravity = 0.5; // Убедимся, что гравитация включена, если он еще прыгает
        }
    }

    // 5. Рисуем мяч в новой позиции
    drawBall();
}

// --- Запуск ---

// 1. Устанавливаем начальные размеры
init();

// 2. Запускаем анимацию
animate();

// 3. Перерисовываем (сбрасываем) при изменении размера окна
window.onresize = init;