//
//左侧tab加竖直方向滚动联动效果
//Liaction CHEN.SI
//科大国创 手机开发组
//2018-1-8 合肥

var YMTab = (function() {
	var layout = '<div id="LayoutParent">' +
		'<div class="flex-liaciton" id="layoutOfTitle">' +
		'<div><span class="main-color-orange" id="YMTitle"></span></div>' +
		'<div id="YMTabClose"><span class="mui-icon mui-icon-closeempty" style="font-size:3rem;color:gray;"></span></div>' +
		'</div>' +
		'<div class="flex-liaciton main-common-background-color" id="layoutOfBody">' +
		'<div id="layoutOfBodyOfLeft"></div>' +
		'<div id="layoutOfBodyOfRight"></div>' +
		'</div>' +
		'</div>';
	var isHaveInit = false;
	var currentSelectTabIndex = 0;
	var selectedTabClassName = 'main-backgroud-white';
	var base = {
		datas: {},
		debug: true,
		close: function() {
			var tab = document.getElementById('LayoutParentAll');
			if(!tab) {
				return;
			}
			var cls = 'ym-hidden';
			if(!tab.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))) {
				tab.className += " " + cls;
			}
		},
		show: function() {
			if(!isHaveInit) {
				return;
			}
			var tab = document.getElementById('LayoutParentAll');
			if(!tab) {
				return;
			}
			var cls = 'ym-hidden';
			var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
			tab.className = tab.className.replace(reg, ' ');
		},
		css: function(dom, cssObj) {
			if(!dom) {
				return;
			}
			var styleObj = dom.style;
			for(var k in cssObj) {
				eval('styleObj.' + k + ' = "' + cssObj[k] + '";');
			}
		},
		hasClass: function(dom, cls) {
			if(!dom) {
				return false;
			}
			return dom.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
		},
		addClass: function(dom, cls) {
			if(!dom) {
				return;
			}
			if(!dom.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))) {
				dom.className += " " + cls;
			}
		},
		removeClass: function(dom, cls) {
			if(!dom) {
				return;
			}
			var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
			dom.className = dom.className.replace(reg, ' ');
		},
		init: function(data) {
			if(isHaveInit) {
				return;
			}
			base.datas = data;
			isHaveInit = true;
			var top = 0;
			var bottom = 0;
			if(data && data.top && typeof(data.top) == "number") {
				top = parseFloat(data.top);
			}
			if(data && data.bottom && typeof(data.bottom) == "number") {
				bottom = parseFloat(data.bottom);
			}

			var tab = document.getElementById("LayoutParentAll");

			if(!tab) {
				tab = document.createElement("div");
				tab.setAttribute('id', 'LayoutParentAll');
				tab.innerHTML = layout;
				document.body.appendChild(tab);
			}

			document.getElementById('YMTabClose').addEventListener('tap', function() {
				base.close();
			});

			var oTopTitle = document.getElementById("YMTitle");
			if(data && data.title) {
				oTopTitle.innerHTML = data.title;
			}

			var oDivArray = [];
			var oLeftDivArray = [];

			var oLayoutOfTitle = document.getElementById("layoutOfTitle");
			var oLayoutOfTitleHeight = oLayoutOfTitle.offsetHeight;

			var oLayoutOfBody = document.getElementById("layoutOfBody");
			var oLayoutParent = document.getElementById("LayoutParent");

			oLayoutParent.addEventListener('tap', function(e) {
				e.stopPropagation();
				base.close();
			});
			oLayoutOfBody.addEventListener('tap', function(e) {
				e.stopPropagation();
			});

			base.css(oLayoutParent, {
				top: top + 'px'
			});
			base.css(oLayoutOfBody, {
				top: oLayoutOfTitleHeight + top + 'px',
				bottom: bottom + 'px'
			});

			var oLayoutOfBodyOfRight = document.getElementById("layoutOfBodyOfRight");
			oLayoutOfBodyOfRight.addEventListener('scroll', function() {
				var scTop = this.scrollTop;
				currentScrollIndexInArray(oDivArray, scTop, callBackWhenCanChangeSelected)
			});

			var oLayoutOfBodyOfLeft = document.getElementById("layoutOfBodyOfLeft");

			/**
			 * 获取当前是在哪个区域,比如0,1,2
			 * @param {Array} arr 包含显示局域每个块组成的数组
			 * @param {Number} scTop 当前滚动的距离
			 * @param {Function} callback 
			 */
			function currentScrollIndexInArray(arr, scTop, callback) {

				if(!arr || !(arr instanceof Array) || arr.length < 2) {
					return 0;
				}

				var index = 0;

				// 先获取对应的offsetTop
				var offsetTops = [];
				for(var i = 0; i < arr.length; i++) {
					offsetTops.push(arr[i].offsetTop);
				}

				for(var i = offsetTops.length - 1; i > 0; i--) {
					if(scTop >= offsetTops[i]) {
						index = i;
						break;
					}
				}
				callback && callback instanceof Function && callback(index);

				return index;
			}

			/**
			 * 
			 * @param {Object} arr
			 * @param {Object} index
			 */
			function changeLeftSelected(arr, index) {
				if(!arr || !(arr instanceof Array) || index < 0 || index > arr.length - 1) {
					return;
				}

				if(base.hasClass(arr[index], selectedTabClassName)) { // 说明处于选择状态,直接返回,不处理了
					return;
				}

				for(var i = 0; i < arr.length; i++) {
					// 有没有先统一不选择状态
					if(i != index && base.hasClass(arr[i], selectedTabClassName)) {
						base.removeClass(arr[i], selectedTabClassName);
						break;
					}
				}
				base.addClass(arr[index], selectedTabClassName);

			}

			function callBackWhenCanChangeSelected(index) {
				currentSelectTabIndex = index;
				// 默认进行tab选择改变
				changeLeftSelected(oLeftDivArray, index);
			}

			var datas = data.datas;

			// 左边标题
			var _leftHtml = '';
			// 右边
			var _rightHtml = '';
			for(var i = 0; i < datas.length; i++) {
				_leftHtml += '<div class="main-color-gray" id="left-' + i + '">' +
					data.html.left[i] +
					'</div>';
				// 右边数据填充
				var rightArray = datas[i].right.datas;
				_rightHtml += '<div style="flex-direction: column;" class="flex-liaciton" id="content-' + i + '">';
				_rightHtml += data.html.right[i] + '</div>';
			}
			oLayoutOfBodyOfLeft.innerHTML = (_leftHtml);
			oLayoutOfBodyOfRight.innerHTML = (_rightHtml);

			// 温馨提示,此处不能提前!!!
			for(var i = 0; i < datas.length; i++) {
				oDivArray.push(document.getElementById("content-" + i));
				oLeftDivArray.push(document.getElementById("left-" + i));
			}
			for(var i = 0; i < oLeftDivArray.length; i++) {
				base.addClass(oLeftDivArray[i], 'left-use-for-click');
			}

			// 点击左侧tab后,使对应区域滚动到顶部,得补高度,最后一个有效区域高度不能小于right容器的可视区
			var lastValidIndex = -1;
			for(var i = datas.length - 1; i > 0; i--) {
				var _datas = datas[i].right.datas;
				if(!_datas || _datas.length > 0) {
					lastValidIndex = i;
					break;
				}
			}

			// 判断是否有效(防止都为无效数据情况的出现)
			if(lastValidIndex != -1) {
				oDivArray[lastValidIndex].style.minHeight = oLayoutOfBodyOfRight.offsetHeight + 'px';
			}

			var leftUseForClickArray = document.getElementsByClassName('left-use-for-click');
			for(var k = 0; k < leftUseForClickArray.length; k++) {
				leftUseForClickArray[k].onclick = function(index) {
					return function() {
						if(currentSelectTabIndex === index) { // 防止同一tab重复点击
							return;
						}
						currentSelectTabIndex = index;

						var _datas = datas[index].right.datas;
						if(!_datas || _datas.length == 0) {
							if(data && data.callback && typeof(data.callback) == "object" && data.callback.leftTabClick && (data.callback.leftTabClick instanceof Function)) {
								data.callback.leftTabClick(index, false);
							}
							return;
						}
						if(data && data.callback && typeof(data.callback) == "object" && data.callback.leftTabClick && (data.callback.leftTabClick instanceof Function)) {
							if(data.callback.leftTabClick(index, true) !== false) {
								changeLeftSelected(oLeftDivArray, index);
								oLayoutOfBodyOfRight.scrollTop = oDivArray[index].offsetTop;
							}
							return;
						}
						changeLeftSelected(oLeftDivArray, index);
						oLayoutOfBodyOfRight.scrollTop = oDivArray[index].offsetTop;
					};
				}(k);
			}

			// 首次进入,默认选择第一项有效数据
			var firstValidIndex = -1;
			for(var i = 0; i < datas.length; i++) {
				var _datas = datas[i].right.datas;
				if(!_datas || _datas.length > 0) {
					firstValidIndex = i;
					break;
				}
			}
			if(firstValidIndex != -1) {
				changeLeftSelected(oLeftDivArray, firstValidIndex);
			}

			currentSelectTabIndex = firstValidIndex;
			var _leftWidth = oLayoutOfBodyOfLeft.offsetWidth + 'px';
			if(mui) { // 暂时使用mui的方法
				tab.addEventListener("swipeleft", function() {
					console.log("左");
					base.css(oLayoutOfBodyOfLeft, {
						width:'0px'
					});
				});
				tab.addEventListener("swiperight", function() {
					console.log("右");
					base.css(oLayoutOfBodyOfLeft, {
						width: _leftWidth
					});
				});
			}

			base.close();

		}
	};

	return base;
})();