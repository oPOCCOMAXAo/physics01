var canvas, context;

document.addEventListener("DOMContentLoaded", main, true);
document.addEventListener("mouseup", onmouseup, true);

function onmouseup(/*MouseEvent*/ e){
    var aStar = new Star();
    aStar.x = e.clientX;
    aStar.y = e.clientY;
    star.push(aStar);
    aStar.m = Math.ceil(Math.random() * 25);
    aStar.r = Math.sqrt(aStar.m);
    document.title = star.length;
}

var star = new Array(); // в этом массиве будут храниться все объекты
var count = 250; // начальное количество объектов
var HEIGHT = window.innerHeight, WIDTH = window.innerWidth;
var timer;

var G = 6.67E2; // задаём константу методом подбора
var dt = 0.025; // шаг вычисления

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
        aStar.m = 1 + Math.random() * 24;
        aStar.r = Math.sqrt(aStar.m);
        star.push(aStar);
    }
    
    // запуск таймер, ваш кэп ;-)
    timer = setInterval(Step, dt * 1000);
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
    var a1, a2, ax1, ay1, ax2, ay2, dx, dy, r;
    //абсолютно неупругое столкновение
    for(var i = 0; i < star.length; i++) {
        for(var j = i + 1; j < star.length; ) {
            dx = star[j].x - star[i].x;
            dy = star[j].y - star[i].y;
            r = Math.sqrt(dx * dx + dy * dy);
            if(r < star[i].r || r < star[j].r) {
                star[i].vx = (star[i].vx * star[i].m + star[j].vx * star[j].m) / (star[i].m + star[j].m);
                star[i].vy = (star[i].vy * star[i].m + star[j].vy * star[j].m) / (star[i].m + star[j].m);
                star[i].x = star[i].r > star[j].r ? star[i].x : star[j].x; 
                star[i].y = star[i].r > star[j].r ? star[i].y : star[j].y;
                star[i].m += star[j].m;
                star[i].r = Math.sqrt(star[i].m);
                star.splice(j, 1);
                continue;
            }
            j++;
        }
    }

    // важно провести вычисление каждый с каждым
    for(var i = 0; i < star.length; i++) // считаем текущей
        //чтобы не бегать два раза зря
        for(var j = i + 1; j < star.length; j++) // считаем второй
        {
            dx = star[j].x - star[i].x;
            dy = star[j].y - star[i].y;
            
            r = dx * dx + dy * dy;// тут R^2
            if(r < 1) r = 1; // избегаем деления на очень маленькое число
            a1 = G * star[j].m / r;
            a2 = G * star[i].m / r;
            r = Math.sqrt(r); // тут R
            ax1 = a1 * dx / r; // a * cos
            ay1 = a1 * dy / r; // a * sin
            ax2 = - a2 * dx / r; // a * cos
            ay2 = - a2 * dy / r; // a * sin
            star[i].vx += ax1 * dt;
            star[i].vy += ay1 * dt;

            star[j].vx += ax2 * dt;
            star[j].vy += ay2 * dt;
        }
    // координаты меняем позже, потому что они влияют на вычисление ускорения
    for(var i = 0; i < star.length; ){
        star[i].x += star[i].vx * dt;
        star[i].y += star[i].vy * dt;
        //удаляем улетевшие слишком далеко
        if(star[i].x > WIDTH * 2 || star[i].y > HEIGHT * 2 || star[i].x < (0 - WIDTH)  || star[i].y < (0 - HEIGHT)) {
            star.splice(i, 1);
            continue;
        }
        i++;
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
            star[i].x,
            star[i].y,
            star[i].r,
            0,
            Math.PI * 2
        );
        
        context.closePath();
        context.fill();
    }
}
