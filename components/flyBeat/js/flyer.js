/**
 * @author floyd
 */

//飞机类---玩家飞机
var Flyer = function(){
	//飞机对应的dom元素
	this.dom = null;
	//是否活着
	this.isLive = true;
	//是否移动中
	this.isMove = false;
	//移动的ID
	this.moveId = null;
	//是否发弹中
	this.isSend = false;
	//目前已经发了多少颗弹(存在屏幕显示)
	this.nowBullet = 0;
	
	this.init();
}
Flyer.prototype = {
	//游戏背景Dom
	gamePanel : null,
	//游戏背景宽度
	gameWidth : 0,
	//游戏背景高度
	gameHeight : 0,
	//飞机移动速度
	movepx : 10,
	//飞机移动频率
	movesp : 30,
	//飞机子弹级别
	bulletLevel : 1,
	//最大发弹数(存在屏幕显示)
	maxBullet : 12,
	//方向键值对应
	keyCodeAndDirection : {
		37 : "left",
		38 : "up",
		39 : "right",
		40 : "down"
	},
	//初始化
	init : function(){
		this.dom = document.createElement('div');
		this.dom.className = 'flyer';
	},
	//设置位置
	setPosition : function(gamePanel,width,height){
		//将飞机添加进游戏背景中
		this.gamePanel = gamePanel;
		this.gamePanel.appendChild(this.dom);
		//设置飞机的初始位置
		this.dom.style.left = (width - this.dom.clientWidth) / 2 + 'px';
		this.dom.style.top = height - this.dom.clientHeight + 'px';
		//获取到游戏背景的宽和高
		this.gameWidth = width;
		this.gameHeight = height;
	},
	//键盘按下事件
	keydown : function(e) {
		
		var keyCode = e.keyCode;
		//按了空格发弹
		if(keyCode == 32){
			//判断是否发弹中
			if(!this.isSend){
				//发弹
				this.onSendBullet();
				this.isSend = true;
			}
		}
		//判断是否移动中，移动
		else if(!this.isMove)this.move(keyCode);
	},
	//键盘释放事件
	keyup : function(e){
		//判断是否为键盘释放
		if(this.keyCodeAndDirection[e.keyCode]){
			//停止移动
			this.stopMove();
		}
		//发弹键释放
		else if(e.keyCode == 32){
			//设置为非发弹中
			this.isSend = false;
		}
	},
	//移动
	move : function(keyCode){
		//设置为移动中
		this.isMove = true;
		var _this = this;
		//判断移动方向
		switch(this.keyCodeAndDirection[keyCode]){
			case "left":{
				
				this.moveId = setInterval(function(){_this.moveLeftUp("left");},_this.movesp);
				break;
			}
			case "up":{
				
				this.moveId = setInterval(function(){_this.moveLeftUp("up");},_this.movesp);
				break;
			}
			case "right":{
				
				this.moveId = setInterval(function(){_this.moveRightDown("right")},_this.movesp);
				break;
			}
			case "down":{
				
				this.moveId = setInterval(function(){_this.moveRightDown("down");},_this.movesp);
				break;
			}
			default:break;
		}
		
	},
	//左或上移动
	moveLeftUp : function(direction){
		
		var leftOrUp = this.dom[direction=="left"?"offsetLeft":"offsetTop"];
		leftOrUp = leftOrUp - this.movepx >= 0 ? leftOrUp - this.movepx:0;
		this.dom.style[direction=="left"?"left":"top"] = leftOrUp + 'px';
		
		if(leftOrUp == 0){this.stopMove();}
	},
	//右或下移动
	moveRightDown : function(direction){
		
		var leftOrUp = this.dom[direction=="right"?"offsetLeft":"offsetTop"];
		var maxDistance = direction=="right"?this.gameWidth-this.dom.clientWidth:this.gameHeight - this.dom.clientHeight;
		leftOrUp = leftOrUp + this.movepx <= maxDistance ? leftOrUp + this.movepx:maxDistance;
		this.dom.style[direction=="right"?"left":"top"] = leftOrUp + 'px';
		
		if(leftOrUp == maxDistance){this.stopMove();}
	},
	//停止移动
	stopMove : function(){
		this.isMove = false;
		clearInterval(this.moveId);
	},
	//发射子弹,enemyList为敌机列表
	sendBullet :function(enemyList){
		//判断发单数是否超出
		if(this.bulletLevel + this.nowBullet > this.maxBullet){return;}
		
		var _this = this;
		//循环发弹，根据飞机子弹级别
		for (var i = 1,l=this.bulletLevel; i <= l; i++) {
			//新建一个子弹对象
			var bullet = new Bullet();
			//将子弹的dom添加到游戏背景中
			this.gamePanel.appendChild(bullet.dom);
			//设置子弹的初始位置
			bullet.setPosition({
				left: this.dom.offsetLeft,
				top: this.dom.offsetTop,
				width: this.dom.clientWidth,
				position : i,
				level : l
			});
			//重写子弹的检测是否打中敌机函数
			bullet.checkBeat = function(){
				//遍历敌机列表，判断是否打中敌机
				for (var i = 0, l = enemyList.length; i < l; i++) {
					//敌机是死的，跳过
					if(!enemyList[i].isLive)continue;
					//获取敌机的x,y坐标以及半径，还有子弹的x,y坐标以及半径
					var e_left = enemyList[i].dom.offsetLeft, e_top = enemyList[i].dom.offsetTop, e_radius = enemyList[0].dom.clientWidth / 2, b_left = this.dom.offsetLeft, b_top = this.dom.offsetTop, b_radius = bullet.dom.clientWidth / 2;
					//判断是否被击中
					//原理，比较两个圆的圆心距与两个圆的半径之和
					if (Math.sqrt(Math.pow(e_left - b_left, 2) + Math.pow(e_top - b_top, 2)) <= e_radius + b_radius) {
						//敌机死亡
						enemyList[i].isLive = false;
						//修改分数
						_this.onChangeScore();
						//返回true
						return true;
					}
				}
				return false;
			}
			//重写子弹的结束函数
			bullet.onend = function(){
				//从游戏背景移除子弹
				_this.gamePanel.removeChild(this.dom);
				//已经发弹数减一
				_this.nowBullet--;
			}
			//发弹动画，就是移动
			bullet.animation();
			//已发弹数加一
			_this.nowBullet++;
		}
	},
	//飞机爆炸
	burstFlyer : function(){
		this.dom.className = 'bingo';
	},
	//发射子弹外部接口，主要任务为回调sendBullet函数，传入敌机列表参数
	onSendBullet : function(){},
	//改分数外部接口
	onChangeScore : function(){}
}
