const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

if (!ctx) {
    console.error("Не удалось получить 2D контекст");
}

// --- Переменные для управления частицами ---
let particles = [];
const numParticles = 200;
const heartScale = 15;
let mouse = {
    x: null,
    y: null,
    radius: 300
};

// --- Функция для получения координат точек на кривой сердца ---
function getHeartPoint(t) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return { x, y };
}

// --- Класс для отдельной частицы ---
class Particle {
    // ИЗМЕНЕНИЕ: Конструктор теперь принимает 't' (угол на кривой сердца)
    constructor(t) {
        this.radius = Math.random() * 2 + 1;
        // this.color = 'hsl(' + (t * 30) + ', 100%, 75%)'; // Цвет зависит от положения на сердце
        this.color = '#c334345a'; // Цвет зависит от положения на сердце

        // --- НОВЫЕ СВОЙСТВА ДЛЯ ОРБИТЫ ---
        this.t = t; // 't' - это параметр кривой, который определяет положение на сердце
        // Задаем каждой частице случайную скорость и направление движения по орбите
        this.speed = 0.00000005;

        // Целевая позиция (теперь она будет постоянно обновляться)
        this.target = { x: 0, y: 0 };

        // Начальная позиция (случайная, как и раньше)
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        // Скорость
        this.vx = 0;
        this.vy = 0;

        // ИЗМЕНЕНИЕ: 'friction' переименовано в 'damping' (демпфирование)
        // Оно не останавливает частицы полностью, а лишь сглаживает движение.
        this.damping = 0.95;
        this.attractionForce = 0.03;
        this.mouseRepelForce = 15;
    }

    // Метод для обновления позиции частицы
    update() {
        // --- ГЛАВНОЕ ИЗМЕНЕНИЕ ЛОГИКИ ---
        // 1. Двигаем нашу цель по контуру сердца
        this.t += this.speed;

        // 2. Вычисляем новые координаты цели на основе нового 't'
        const heartPoint = getHeartPoint(this.t);
        this.target.x = heartPoint.x * heartScale + canvas.width / 2;
        this.target.y = heartPoint.y * heartScale + canvas.height / 2;

        // --- Логика притяжения и отталкивания остается прежней ---
        // Она просто будет работать с постоянно движущейся целью

        // Взаимодействие с мышью
        let dxMouse = this.x - mouse.x;
        let dyMouse = this.y - mouse.y;
        let distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distanceMouse < mouse.radius) {
            // Отталкиваемся от мыши
            let forceDirectionX = dxMouse / distanceMouse;
            let forceDirectionY = dyMouse / distanceMouse;
            let force = (mouse.radius - distanceMouse) / mouse.radius;
            this.vx += forceDirectionX * force * this.mouseRepelForce;
            this.vy += forceDirectionY * force * this.mouseRepelForce;
        } else {
            // Притягиваемся к нашей движущейся целевой точке
            let dxTarget = this.target.x - this.x;
            let dyTarget = this.target.y - this.y;
            this.vx += dxTarget * this.attractionForce;
            this.vy += dyTarget * this.attractionForce;
        }

        // Применяем демпфирование
        this.vx *= this.damping;
        this.vy *= this.damping;

        // Обновляем позицию
        this.x += this.vx;
        this.y += this.vy;
    }

    // Метод для отрисовки (без изменений)
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// --- Функция инициализации ---
function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];

    // ИЗМЕНЕНИЕ: Теперь мы передаем 't' в конструктор частиц
    for (let i = 0; i < numParticles; i++) {
        // Мы равномерно распределяем частицы по всей длине кривой сердца
        const t = (i / numParticles) * 2 * Math.PI;
        particles.push(new Particle(t));
    }
}

// --- Главный цикл анимации (без изменений) ---
function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }

    requestAnimationFrame(animate);
}

// --- Запуск и обработчики событий (без изменений) ---
init();
animate();

window.addEventListener('resize', init);

window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', function () {
    mouse.x = null;
    mouse.y = null;
});