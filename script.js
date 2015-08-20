var canvas, context;

document.addEventListener("DOMContentLoaded", main, true);
document.addEventListener("mouseup", onmouseup, true);

function onmouseup(/*MouseEvent*/ e){
    var aStar = new Star();
    aStar.x = e.clientX;
    aStar.y = e.clientY;
    star.push(aStar);
    document.title = star.length;
    console.log(e);
}

var star = new Array(); // в этом массиве будут храниться все объекты
var count = 50; // начальное количество объектов
var HEIGHT = window.innerHeight, WIDTH = window.innerWidth;
var timer;

var G = 1; // задаём константу методом подбора

function main(){
    // создаём холст на весь экран и прикрепляем его на страницу
	canvas = document.createElement('canvas');
	canvas.height = HEIGHT;
	canvas.width = WIDTH;
	canvas.id = 'canvas';
	canvas.style.position = 'absolute';
	canvas.style.top = '0';
	canvas.style.left = '0';
	document.body.appendChild(canvas);
    context = canvas.getContext("2d");
    
    var aStar;
    for(var i = 0; i < count; i++){
        aStar = new Star();
        aStar.x = Math.random() * WIDTH;
        aStar.y = Math.random() * HEIGHT;
        star.push(aStar);
    }
    
    // запуск таймер, ваш кэп ;-)
    timer = setInterval(Step, 20);
}

function Star(){
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.r = 2; // Radius
    this.m = 1;
}

function Step(){
    var a, ax, ay, dx, dy, r;
    
    // важно провести вычисление каждый с каждым
    for(var i = 0; i < star.length; i++) // считаем текущей
        for(var j = 0; j < star.length; j++) // считаем второй
        {
            if(i == j) continue;
            dx = star[i].x - star[j].x;
            dy = star[i].y - star[j].y;
            
            r = dx * dx + dy * dy;// тут R^2
            if(r < 0.1) r = 0.1; // избегаем деления на очень маленькое число
            a = -G * star[j].m / r;
            
            r = Math.sqrt(r); // тут R
            ax = a * dx / r; // a * cos
            ay = a * dy / r; // a * sin
            
            star[i].vx += ax;
            star[i].vy += ay;
        }
    // координаты меняем позже, потому что они влияют на вычисление ускорения
    for(var i = 0; i < star.length; i++){
        star[i].x += star[i].vx;
        star[i].y += star[i].vy;
    }
    
    // выводим на экран
    Draw();
}

function Draw(){
    // очищение экрана
    context.fillStyle = "#000000";
    context.fillRect(0, 0, WIDTH, HEIGHT);
    
    // рисование кругов
    context.fillStyle = "#ffffff";
    for(var i = 0; i < star.length; i++){
        context.beginPath();
        
        context.arc(
            star[i].x - star[i].r,
            star[i].y - star[i].r,
            star[i].r,
            0,
            Math.PI * 2
        );
        
        context.closePath();
        context.fill();
    }
}
