/**
 * @author floyd
 */

//扩展数组方法，删除特定的值
Array.prototype.remove = function(obj){
	
	for(var i=0,l=this.length;i < l;i++){
		if(this[i] == obj){
			this.splice(i,1);
			return this;
		}
	}
	throw "The Array has no this Obj";
}

//游戏控制类
var Game = {
	//游戏背景dom
	gamePanel : null,
	//飞机玩家
	flyer : null,
	//敌机列表
	enemyList : [],
	//分数
	score : 0,
	//游戏是否结束
	isGameOver : false,
	//初始化
	init : function(){
		
		var _this = this;
		//获取游戏背景
		this.gamePanel = document.getElementById("gamePanel");
		//游戏背景获得焦点
		this.gamePanel.focus();
		//启动飞机
		this.startFlyer();
		//启动 敌机
		this.startEnemy();
		//设置键盘按下与释放事件
		document.body.onkeydown  = function(e){_this.onkeydown(e);};
		document.body.onkeyup = function(e){_this.onkeyup(e);}
	},
	//启动飞机
	startFlyer : function(){
		
		var _this = this;
		//新建飞机对象
		this.flyer = new Flyer();
		//设置位置
		this.flyer.setPosition(this.gamePanel,this.gamePanel.clientWidth,this.gamePanel.clientHeight);
		//重写发弹函数
		this.flyer.onSendBullet = function(){this.sendBullet(_this.enemyList);};
		//重写修改分数
		this.flyer.onChangeScore = function(){_this.changeScore();};
	},
	//启动敌机
	startEnemy : function(){
		//游戏结束，退出
		if(this.isGameOver)return;
		
		var _this = this;
		//新建一个敌机对象
		var enemy = new Enemy();
		//将敌机添加进游戏背景
		this.gamePanel.appendChild(enemy.dom);
		//随机出敌机的x坐标位置
		var randomX = parseInt(Math.random()* (this.gamePanel.clientWidth / enemy.dom.clientWidth),10);
		//设置位置
		enemy.setPosition(randomX * enemy.dom.clientWidth,0);
		//重写检测是否击中飞机玩家
		enemy.OnCheckCrash = function(){
			//游戏结束，退出
			if(_this.isGameOver)return;
			//判断是否击中
			if(Math.sqrt(Math.pow(_this.flyer.dom.offsetLeft-this.dom.offsetLeft,2)+Math.pow(_this.flyer.dom.offsetTop-this.dom.offsetTop,2))
				<= _this.flyer.dom.clientWidth/2 + this.dom.clientWidth/2){
				//敌机死亡
				this.isLive = false;
				//飞机玩家爆炸
				_this.flyer.burstFlyer();
				return true;
			}
			return false;
		}
		//重写敌机结束事件
		enemy.onend = function(){
			_this.gamePanel.removeChild(this.dom);
			_this.enemyList.remove(this);
		}
		//游戏结束函数
		enemy.gameover = function(){_this.gameover();}
		//敌机移动
		enemy.animation(this.gamePanel.clientWidth,this.gamePanel.clientHeight);
		//将敌机添加到列表中
		this.enemyList.push(enemy);
		//启动
		setTimeout(function(){_this.startEnemy();},500);
	},
	//键盘按下事件
	onkeydown : function(e){
		e = e || window.event;
		
		var keyCode = e.keyCode;
		
		//阻止浏览器默认事件
		if(keyCode == 32 || this.flyer.keyCodeAndDirection[keyCode]){
			if(e.preventDefault)e.preventDefault();
			else e.returnValue = false;
		}
		else return;
		//回调飞机键盘按下事件
		this.flyer.keydown(e);
	},
	//键盘释放事件
	onkeyup : function(e){
		e = e || window.event;
		//回调飞机键盘释放事件
		this.flyer.keyup(e);
	},
	//修改分数
	changeScore : function(){
		
		this.score += 100;
		document.getElementById('score').innerHTML =  this.score;
		//分数级别
		var scoreLevel = parseInt(this.score / 5000,10) + 1;
		//判断是否升级飞机子弹级别
		if(scoreLevel > 1){
			this.flyer.bulletLevel = scoreLevel>4?4:scoreLevel;
			//修改敌机移动速度
			Enemy.prototype.movesp = Enemy.prototype.movespMap[this.flyer.bulletLevel];
		}
	},
	//游戏结束
	gameover : function(){
		
		this.isGameOver = true;
		
		document.getElementById('score').innerHTML = "The Game is Over...You Score:" + this.score;
		
		for(var i=0,l=this.enemyList.length;i < l;i++){
			this.gamePanel.removeChild(this.enemyList[0].dom);
			this.enemyList.remove(this.enemyList[0]);
		}
		
		this.gamePanel.removeChild(this.flyer.dom);
		this.flyer = null;
		this.score = 0;
		
		this.gamePanel = null;
		
		document.body.onkeydown = null;
		document.body.onkeyup = null;
		
		document.getElementById('startBtn').style.display = 'block';
	}
}
//游戏开始入口
function Start(){
	Game.isGameOver = false;
	Game.init();
	document.getElementById('startBtn').style.display = 'none';
	document.getElementById('score').innerHTML = 0;
}