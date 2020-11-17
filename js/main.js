var timer=null;
var showBox=true;
var score=0;
var speed=300;
var index = 1;

// 开始暂停按钮
const begin = document.getElementById('begin');
const pause = document.getElementById('pause');
const main = document.getElementById('main');
const scoreText = document.getElementById('score');
const checkpoint = document.getElementById('checkpoint');

/**
 * 
 * @param 基础盒子方块 atom 
 * @param x轴多少个盒子宽 xnum 
 * @param y轴多少个盒子宽 ynum 
 * @param 画布 canvas 
 * @param 创建画布  createMap 
 */

function Map(atom,xnum,ynum){
    this.atom = atom;
    this.xnum = xnum;
    this.ynum = ynum;

    this.canvas = null; 
    this.createMap = function(){
        this.canvas = document.createElement('div');
        this.canvas.style.cssText='position:relative;top:30px;background:#fafafa';
        this.canvas.style.width=this.atom*this.xnum+'px'; //画布宽
        this.canvas.style.height=this.atom*this.ynum+'px'; //画布高
        if(showBox){
            for(var i=0;i<this.xnum;i++){
                for(var j=0;j<this.ynum;j++){
                var box = document.createElement('div');
                box.style.cssText='border:1px solid red';
                box.style.width=this.atom+'px';
                box.style.height=this.atom+'px';
                box.style.position='absolute';
                box.style.left+=i*this.atom+'px';
                box.style.top+=j*this.atom+'px';
                // box.style.backgroundColor='';
                this.canvas.appendChild(box);
                }
               
            }
           
        }
        main.appendChild(this.canvas);
    }
}



// 随机色
function RandomColor(){
    return Math.floor(Math.random()*200);
}

/**
 * 
 * @param 食物对象:宽 高 背景色 x轴位置 y轴位置 */
function Food(map){
    this.width = map.atom;
    this.height = map.atom;
    this.bgColor = "rgba("+RandomColor()+","+RandomColor()+","+RandomColor()+")";
    this.x = Math.floor(Math.random()*map.xnum);
    this.y = Math.floor(Math.random()*map.ynum);

    this.flag = document.createElement('div');
    this.flag.style.width=this.width+'px';
    this.flag.style.height=this.height+'px';
    this.flag.style.position='absolute';
    this.flag.style.left=this.width*this.x+'px';
    this.flag.style.top=this.height*this.y+'px';
    this.flag.style.backgroundColor=this.bgColor;
    
    map.canvas.appendChild(this.flag);
}

/**
 * 
 * @param 蛇对象:宽 高 移动方向 三个方块 显示在画布上 
 */
function snake(map){
    this.width = map.atom;
    this.height = map.atom;
    this.direction = 'right';
    this.body=[
        {x:2,y:0},
        {x:1,y:0},
        {x:0,y:0},
    ];

    this.display = function(){
        for(var i=0;i<this.body.length;i++){
            if(this.body[i].x!=null){
                var box = document.createElement('div');
                this.body[i].flag=box;
                box.style.width=this.width+'px';
                box.style.height=this.height+'px';
                box.style.position='absolute';
                box.style.backgroundColor='#000';
                box.style.left=this.width*this.body[i].x+'px';
                box.style.top=this.height*this.body[i].y+'px';
                map.canvas.appendChild(box);
            }    
        }
    }

    this.run=function(){
        // body每一位向前移一格
        for(var i = this.body.length-1;i>0;i--){
            this.body[i].x=this.body[i-1].x;
            this.body[i].y=this.body[i-1].y;
        }

        // 控制蛇头移动
        switch(this.direction){
            case 'left': this.body[0].x-=1;break;
            case 'right': this.body[0].x+=1;break;
            case 'up': this.body[0].y-=1;break;
            case 'down': this.body[0].y+=1;break;
        }


        // 吃到食物
        if(this.body[0].x==food.x && this.body[0].y==food.y){
            score++;
            if(score%3==0){
                 speed-=30;
                 checkpoint.textContent=`第${++index}关`;
            }
            clearInterval(timer);
            timer = setInterval(()=>{
               snake.run();
            },speed)
            console.log(speed);
           
            scoreText.textContent=score;
            this.body.push({x:null,y:null,flag:null});
            map.canvas.removeChild(food.flag);
            food=new Food(map)
        }

        // 撞墙从相反方向出来
        if(this.body[0].y>=map.ynum){
           this.body[0].y=0;
        }else if(this.body[0].y<0){
            this.body[0].y=map.ynum-1;
        }

        if(this.body[0].x>=map.xnum){
            this.body[0].x=0;
         }else if(this.body[0].x<0){
            this.body[0].x=map.xnum-1;
        }

        // 吃到蛇身游戏结束
        for(var i=4;i<this.body.length;i++){
            if(this.body[0].x == this.body[i].x && this.body[0].y == this.body[i].y){
                clearInterval(timer)
                alert('游戏结束了!')
                restart(map,this)
                return false
            }
        }

        // 移除蛇
        for(var i = 0;i<this.body.length;i++){
            if(this.body[i].flag!=null){
                map.canvas.removeChild(this.body[i].flag);
            }
        }
        // 重新展示
        this.display();
    }
}

// 重新开始游戏
function restart(map,snake){
    // 清空蛇长度
    for(var i = 0;i<snake.body.length;i++){
        map.canvas.removeChild(snake.body[i].flag);
    }
//    重新设置蛇长度
    snake.body=[
        {x:2,y:0},
        {x:1,y:0},
        {x:0,y:0},
    ];

    snake.direction = 'right';
    snake.display();
    // snake.run();
    // 分数 时间 关卡重置
    index=1;
    speed=300;
    score=0;
    checkpoint.textContent=`第${index}关`;
    scoreText.textContent=score;

    // 重新设置食物位置
    map.canvas.removeChild(food.flag);
    food = new Food(map)

}

// 创建画布
var map = new Map(20,40,20);
map.createMap();
// 创建食物
var food = new Food(map);
// 创建蛇
var snake = new snake(map);
snake.display();


// 键盘按下事件
window.addEventListener('keydown',function(e){
    var event = e || window.event;
    switch (event.keyCode) {
        case 38:
            if(snake.direction!='down'){
                 snake.direction = 'up';
            }
            break;
        case 40:
            if(snake.direction!='up'){
            snake.direction = 'down';
            }
            break;
        case 37:
            if(snake.direction!='right'){
            snake.direction = 'left';
            }
            break;
        case 39:
            if(snake.direction!='left'){
            snake.direction = 'right';
            }
            break;
    }
})

begin.addEventListener('click',function(){
    clearInterval(timer);
    timer = setInterval(()=>{
       snake.run();
    },speed)
    // 清除定时器重新设置定时器
})

pause.addEventListener('click',function(){
    clearInterval(timer)
})