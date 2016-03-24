/**
 * @author floyd
 *download www.jb51.net
 */

//子弹类
var Bullet = function(){
	//子弹Dom元素
	this.dom = null;
	
	this.init();
}
Bullet.prototype = {
	//子弹移动速度
	movepx : 8,
	//子弹移动频率
	movesp : 10,
	//初始化
	init : function(){
		this.dom = document.createElement('div');
		this.dom.className = 'bullet';
	},
	//设置子弹初始位置
	//flyerinfo = {left:1,top:1,width:1,position:1,level:1}
	setPosition : function(flyerinfo){
		//子弹在飞机的中点位置
		var center = flyerinfo.left + ((flyerinfo.width-this.dom.clientWidth)/2),
			//偏移量
			offset = 0;
		//设置第几发子弹
		flyerinfo.position = (flyerinfo.level % 2 != 0)?flyerinfo.position:flyerinfo.position+1;
		//计算偏移量
		offset = (flyerinfo.position % 2 != 0)?(parseInt(flyerinfo.position/2,10) * this.dom.clientWidth):flyerinfo.position / 2 * this.dom.clientWidth * -1;
		//设置子弹位置
		this.dom.style.left = center + offset + 'px';
		this.dom.style.top = flyerinfo.top - this.dom.clientHeight + 'px';
		
	},
	//子弹动画，移动
	animation : function(){
		
		var _this = this;
		//处理移动函数
		var process = function(){
			
			var top = _this.dom.offsetTop;
			
			top = top - _this.movepx >= 0 ? top - _this.movepx : 0;
			_this.dom.style.top = top + 'px';
			//判断是否移动到尽头，是否击中敌机
			if(top > 0 && !_this.checkBeat()){
				setTimeout(process,_this.movesp);
			}
			else {
				_this.onend();
			}
		}
		process();
	},
	//外部接口，是否击中敌机
	checkBeat : function(){},
	//外部接口，子弹结束事件
	onend : function(){}
	
}
