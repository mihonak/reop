/**
 * ================
 * = ElementMover =
 * ================
 *
 * @author : nobuoka
 * @url : http://www.vividcode.info/projects/jsminilib/element_mover.html
 * @version : 1.0.1
 * 
 * == 概要 ==
 * HTML Element をドラッグして移動できるようにする JavaScript ライブラリ.
 * 
 * == 使用方法 ==
 * 1. まず, このスクリプトファイルを HTML 文書内で読み込みます. 
 *    head 要素内 "ではなく" body 要素を閉じる直前に script 要素を置いて読み込んでください. 
 * 2. ドラッグにより移動可能にしたい要素の class 属性に "movable" または "movable_rel" を
 *    追加してください. それだけで, その要素はドラッグにより移動可能になります. 
 *    なお, "movable" の場合 CSS の position プロパティが "absolute" に, "movable_rel" の場合
 *    position プロパティは "relative" になります. 
 * 3. また, 移動可能にしたい要素のどこでもドラッグ可能にするのではなく, ドラッグが有効な部分を
 *    移動可能な要素の一部だけにしたい場合, 移動可能な要素の中に class 属性に "movable_controller" を
 *    追加した要素を入れると, その部分だけがドラッグ有効となります.
 *        例) <div class="movable">
 *              <div class="movable_controller">この部分をドラッグすると移動する</div>
 *              <div>この部分をドラッグしても移動しない</div>
 *            </div>
 * 
 * == 動作確認ブラウザ ==
 * - Firefox 3.6
 * - Opera 10.50
 * - Opera 9.60
 * - Safari 4.0
 * - Internet Explorer 8
 * - Internet Explorer 7
 * - Internet Explorer 6
 */
(function() {
	// 要素の class 属性にクラス名を追加する
	var addClassName = function( elem, className ) {
		if( elem.className ) {
			if( ! elem.className.match( new RegExp("(?:^|[\\x09\\x0A\\x0D\\x20]+)" + className + "(?:$|[\\x09\\x0A\\x0D\\x20]+)") ) ) {
				elem.className = elem.className + " " + className;
			}
		} else {
			elem.className = className;
		}
	};
	// 要素の class 属性からクラス名を削除する
	// 削除したいクラス名が元々なければ何もしない
	var removeClassName = function( elem, className ) {
		if( elem.className ) {
			var classNameList = elem.className.split( /[\x09\x0A\x0D\x20]+/ );
			for( var i = 0; i < classNameList.length; i++ ) {
				if( classNameList[i] === className ) {
					classNameList.splice( i, 1 );
				}
			}
			elem.className = classNameList.join( " " );
		}
	};
	var zIndexInterval = 10;
	var movableElems = [];
	movableElems.showTheMostFront = function( elem ) {
		var index = null;
		for( var i = 0; i < this.length; i++ ) {
			if( this[i][0] === elem ) {
				index = i;
				break;
			}
		}
		if( index !== null ) {
			var tmp = this[index][1];
			for( var i = 0; i < this.length; i++ ) {
				if( index === i ) {
					this[i][1] = 100 + ( this.length - 1 ) * zIndexInterval;
					this[i][0].style.zIndex = String( this[i][1] );
					addClassName( this[i][0], "active" );
				} else if( this[i][1] > tmp ) {
					this[i][1] -= zIndexInterval;
					this[i][0].style.zIndex = String( this[i][1] );
					removeClassName( this[i][0], "active" );
				} else {
					removeClassName( this[i][0], "active" );
				}
			}
		}
	};
	// 指定した要素の子孫で、指定した class 名を持つ要素を取得する
	var getElementsByClassName = function( elem, className ) {
		var resElems = [];
		var elems = elem.getElementsByTagName("*");
		for( var i = 0; i < elems.length; i++ ) {
			var elem = elems.item(i);
			if( elem.className ) {
				var classNameList = elem.className.split( /[\x09\x0A\x0D\x20]+/ );
				for( var j = 0; j < classNameList.length; j++ ) {
					if( classNameList[j] === className ) {
						resElems.push( elem );
						break;
					}
				}
			}
		}
		return resElems;
	};
	// イベントリスナ
	var createMouseDownEventListener = function(e) {
		var elem = e;
		if( elem.addEventListener ) {
			return function(evt) {
				// テキスト選択しないように
				evt.preventDefault();
				if( ! elem._do_moving_ ) {
					elem._do_moving_ = true;
					elem._offset_x_ = elem.offsetLeft;
					elem._offset_y_ = elem.offsetTop;
					elem._page_x_   = evt.pageX;
					elem._page_y_   = evt.pageY;
					elem.style.left = "0px";
					elem.style.top  = "0px";
					elem._offset_x_ = elem._offset_x_ - elem.offsetLeft;
					elem._offset_y_ = elem._offset_y_ - elem.offsetTop;
					elem.style.left = elem._offset_x_ + "px";
					elem.style.top  = elem._offset_y_ + "px";
				}
			};
		} else if( elem.attachEvent ) {
			return function(evt) {
				evt.returnValue = false;
				if( ! elem._do_moving_ ) {
					elem._do_moving_ = true;
					elem._offset_x_ = elem.offsetLeft;
					elem._offset_y_ = elem.offsetTop;
					elem._page_x_   = document.documentElement.scrollLeft + evt.clientX;
					elem._page_y_   = document.documentElement.scrollTop  + evt.clientY;
					elem.style.left = "0px";
					elem.style.top  = "0px";
					elem._offset_x_ = elem._offset_x_ - elem.offsetLeft;
					elem._offset_y_ = elem._offset_y_ - elem.offsetTop;
					elem.style.left = elem._offset_x_ + "px";
					elem.style.top  = elem._offset_y_ + "px";
				}
			};
		} else {
			return function(evt) {
				// do nothing
			};
		}
	};
	var createMouseUpEventListener = function(e) {
		var elem = e;
		return function(evt) {
			elem._do_moving_ = false;
		};
	};
	var createMouseMoveEventListener = function(e) {
		var elem = e;
		if( elem.addEventListener ) {
			return function(evt) {
				if( elem._do_moving_ ) {
					var diffX = evt.pageX - elem._page_x_;
					var diffY = evt.pageY - elem._page_y_;
					//elem.style.left = evt.pageX + elem._offset_x_ - elem._page_x_ + "px";
					//elem.style.top  = evt.pageY + elem._offset_y_ - elem._page_y_ + "px";
					elem.style.left = elem._offset_x_ + diffX + "px";
					elem.style.top  = elem._offset_y_ + diffY + "px";
					//elem.offsetLeft = elem._offset_x_ + diffX;
				}
			};
		} else if( elem.attachEvent ) {
			return function(evt) {
				if( elem._do_moving_ ) {
					evt.returnValue = false;
					var diffX = document.documentElement.scrollLeft + evt.clientX - elem._page_x_;
					var diffY = document.documentElement.scrollTop  + evt.clientY - elem._page_y_;
					elem.style.left = elem._offset_x_ + diffX + "px";
					elem.style.top  = elem._offset_y_ + diffY + "px";
				}
			};
		} else {
			return function(evt) {
				// do nothing
			};
		}
	};
	var createMEMouseDownEventListener = function(e) {
		var elem = e;
		return function(evt) {
			movableElems.showTheMostFront( elem );
		};
	};
	// 指定した要素をドラッグにより移動可能にする
	var makeElementMovable = function( elem, stylePos ) {
		elem.style.position = stylePos;
		var tmp = [elem, 100 + movableElems.length * zIndexInterval];
		movableElems.push( tmp );
		elem.style.zIndex = String( tmp[1] );
		// コントローラー要素を取得
		var controllerElems = getElementsByClassName( elem, "movable_controller" );
		if( controllerElems.length == 0 ) { controllerElems.push( elem ); }
		// イベントリスナを追加していく
		elem._do_moving_ = false;
		if( elem.addEventListener ) {
			for( var i = 0; i < controllerElems.length; i++ ) {
				elem.addEventListener( "mousedown", createMEMouseDownEventListener(elem), false );
				controllerElems[i].addEventListener( "mousedown", createMouseDownEventListener(elem), false );
				document.addEventListener( "mouseup", createMouseUpEventListener(elem), false );
				document.addEventListener( "mousemove", createMouseMoveEventListener(elem), false );
			}
		} else if( elem.attachEvent ) {
			for( var i = 0; i < controllerElems.length; i++ ) {
				elem.attachEvent( "onmousedown", createMEMouseDownEventListener(elem) );
				controllerElems[i].attachEvent( "onmousedown", createMouseDownEventListener(elem) );
				document.attachEvent( "onmouseup", createMouseUpEventListener(elem) );
				document.attachEvent( "onmousemove", createMouseMoveEventListener(elem) );
			}
		}
	};
	var targetElems = null;
	targetElems = getElementsByClassName( document, "movable_rel" );
	for( var i = 0; i < targetElems.length; i++ ) {
		makeElementMovable( targetElems[i], "relative" );
	}
	targetElems = getElementsByClassName( document, "movable" );
	for( var i = 0; i < targetElems.length; i++ ) {
		makeElementMovable( targetElems[i], "absolute" );
	}
})();
