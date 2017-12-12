//设置字体大小
//(function (doc, win) {
//	var docEl = doc.documentElement,
//			resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
//			recalc = function () {
//				var clientWidth = docEl.clientWidth;
//				if (!clientWidth) return;
//				docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
//			};
//	if (!doc.addEventListener) return;
//	win.addEventListener(resizeEvt, recalc, false);
//	doc.addEventListener('DOMContentLoaded', recalc, false);
//})(document, window);

//百度站长统计代码
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "//hm.baidu.com/hm.js?09296d797105fe1b8fc3ac57feac05a6";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();

//获取url地址栏参数
var dataUrl = {
	//根据传入的字段获取url带的参数 例如： index.html?id=3,传入id 函数返回字符传'3'
	getUrlVal : function(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    	var result = window.location.search.substr(1).match(reg);
   		return result ? decodeURIComponent(result[2]) : null;
	},
	getUrlString : function(){
		var list = window.location.href.split('/');
		var data = list[list.length-1];
		var end = data.indexOf('.');
		return data.substr(0,end);
	}
};

//轮播图组件
function Rolling(o) {
	this.index = ++o.index || 1; //当前滚动的位置，当index大于可轮播的次数listLength或者等于0,为不可滚动状态
	this.num = o.num || 1; //默认滚动一个列表
	this.obj = o.obj || null; //要轮播的对象ul
	this.perObj = o.perObj || null; //向上翻页的按钮对象
	this.nextObj = o.nextObj || null; //向下翻页的按钮对象
	this.focusPoint = o.focusPoint || null; //焦点对象，默认为null。意思不开启焦点对象，如要开启可传入焦点对象可自动开启
	this.focusClass = o.focusClass || 'mien-active'; //当前焦点位置类名
	this.replaceBtn = o.replaceBtn || false;//是否在轮播到第一页或最后一页时替换翻页按钮图片。默认值为true,并替换按钮图片为re+图片名。如：per.png替换成re-per.ping
	console.log(o.replaceBtn);
	this.listLength = Math.ceil(o.obj.find('li').length / this.num); //可轮播的次数
	this.listObj = o.obj.children('li');
	this.listWidth =this.listObj.width() + parseInt(this.listObj.css('margin-left')) + parseInt(this.listObj.css('margin-right')); //列表宽度
	this.init(); //初始化
}

Rolling.prototype.init = function() {
		
		var thisObj = this;
		this.initLeft();
		this.replaceFun();
		if(this.focusPoint !== null) {
			this.createFocusPoint();
		}
		this.perObj.unbind('click').on('click', function() {
			thisObj.rollPrev();
		});
		this.nextObj.unbind('click').on('click', function() {
			thisObj.rollNext();
		});
	};
	//创建焦点,并给当前位置的焦点添加类mien-active
Rolling.prototype.createFocusPoint = function() {
	var str = '',
		thisObj = this;
	for(var i = 0; i < this.listLength; i++) {
		if(i == this.index - 1) {
			str += '<li class="' + this.focusClass + '"></li>';
		} else {
			str += '<li></li>';
		}
	}
	this.focusPoint.append(str);
	this.focusPoint.children().click(function() {
		var oldIndex = $('.' + thisObj.focusClass).index() + 1; //之前的焦点位置
		var index = $(this).index() + 1; //当前点击的焦点
		var sum = index - oldIndex;
		var perObject = thisObj.perObj.find('img');
		var nextObject = thisObj.nextObj.find('img');
		if (index == 1 && !thisObj.replaceBtn){
			perObject.attr('src',perObject.attr('data-src'));
			nextObject.attr('src',nextObject.attr('data-src'));
		}else if (index == thisObj.listLength && !thisObj.replaceBtn){
			perObject.attr('src',perObject.attr('re-src'));
			nextObject.attr('src',nextObject.attr('re-src'));
		}else if (!thisObj.replaceBtn){
			perObject.attr('src',perObject.attr('re-src'));
			nextObject.attr('src',nextObject.attr('data-src'));
		}
		thisObj.index += sum;
		if(sum > 0) {
			thisObj.obj.animate({
				marginLeft: '-=' + Math.abs(sum) * thisObj.num * thisObj.listWidth + 'px'
			});
		}
		if(sum < 0) {
			thisObj.obj.animate({
				marginLeft: '+=' + Math.abs(sum) * thisObj.num * thisObj.listWidth + 'px'
			});
		}
		$(this).addClass(thisObj.focusClass).siblings().removeClass(thisObj.focusClass);
	});
};
Rolling.prototype.initLeft = function() {
	if(this.index == 1) {
		return;
	}
	this.obj.css('margin-left', -(this.index - 1) * this.listWidth); //初始化全屏图片显示的位置
};
Rolling.prototype.rollPrev = function() {
	--this.index;
	//当点击到第一页就return
	if (this.index <= 1 && !this.replaceBtn){
		this.perObj.find('img').attr('src',this.perObj.find('img').attr('data-src'));
	}
	if(!this.thisIndex()) {
		++this.index;
		return;
	}
	if (!this.replaceBtn){
		this.nextObj.find('img').attr('src',this.nextObj.find('img').attr('data-src'));
	}
	this.obj.animate({
		marginLeft: '+=' + this.num * this.listWidth + 'px'
	});
	if(this.focusPoint !== null) {
		$('.' + this.focusClass).removeClass(this.focusClass).prev().addClass(this.focusClass);
	}
};
Rolling.prototype.rollNext = function() {
	++this.index;
	if (this.index == this.listLength && !this.replaceBtn){
		this.nextObj.find('img').attr('src',this.nextObj.find('img').attr('re-src'));
	}
	//当点击到最后一页就return
	if(!this.thisIndex()) {
		--this.index;
		return;
	}
	if (!this.replaceBtn){
		this.perObj.find('img').attr('src',this.perObj.find('img').attr('re-src'));
	}
	this.obj.animate({
		marginLeft: '-=' + this.num * this.listWidth + 'px'
	});
	
	if(this.focusPoint !== null) {
		$('.' + this.focusClass).removeClass(this.focusClass).next().addClass(this.focusClass);
	}
};
Rolling.prototype.replaceFun = function(){
	var perObject = this.perObj.find('img'),
		nextObject = this.nextObj.find('img');
	var perSrc = perObject.attr('src'),
		nextSrc = nextObject.attr('src');
	perObject.attr({'data-src':perSrc,'re-src':this.splitSrc(perSrc)});
	nextObject.attr({'data-src':nextSrc,'re-src':this.splitSrc(nextSrc)});
};

Rolling.prototype.splitSrc = function(str){
	var list = str.split('/');
	var data = list[list.length-1];
	var sub = data.substr(0,data.indexOf('.'));
	return str.replace(sub,'re-' + sub);
};

Rolling.prototype.thisIndex = function() {
	if(this.index > this.listLength || this.index <= 0) {
		return false;
	}
	return true;
};

function createRolling(o) {
	return new Rolling(o);
}

//关于我们

