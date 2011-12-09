(function(){
	var D = document,B = D.body,H,S,ORG  = B.innerHTML;

	var scrollTopLength = function(){return (D.documentElement.scrollTop || B.scrollTop);};
	var positionY = scrollTopLength() + 10;

	//Marker class (prototype)
	/*-------------------------------------------------------------------*/
	var Marker = function(id,text,textType,color){
		this.initialize(id,text,textType,color);
	}
	Marker.prototype = {
		initialize:function(id,text,textType,color){
			this.id = id;
			this.text = text;
			this.textType = textType;
			this.color = color;
			this.check = D.createElement('input');this.check.id = id;this.check.type = 'checkbox';this.check.value = textType;
			this.label = D.createElement('label');this.label.setAttribute('for',id);this.label.innerHTML = text;
			this.elem = D.createElement('p');
			this.elem.appendChild(this.check);
			this.elem.appendChild(this.label);
			var self = this;
			this.check.onclick = function(){
				if(this.checked){
					self.markOn();
				}else{
					self.markOff();
				}
			};
		},
		markOn:function(id,text,textType,color){
			var self = this;
			var s = '[REOP-array-separator]',t = H.innerHTML.replace(new RegExp('(<)','ig'),s+'$1').replace(new RegExp('(>)','ig'),'$1'+s).split(s);
			for(var i=0;i<t.length;i++){
				if(t[i].substr(0,1)=='<'){//do nothing for HTML tags
				}else{
					t.splice(i,1,t[i].replace(new RegExp('(&.{2,4};)','ig'),s+'$1'+s).split(s));
					for(var j=0;j<t[i].length;j++){
						if(t[i][j].substr(0,1)!='&'){
							t[i][j] = t[i][j].replace(new RegExp('('+self.textType+')','ig'),'<span class="'+self.id+'">$1</span>');
						}
					}
					t[i] = t[i].join('');
				}
			}
			H.innerHTML = t.join('');
		},
		markOff:function(id,text,textType,color){
			var self = this;
			H.innerHTML = H.innerHTML.replace(new RegExp('<span class="'+self.id+'">('+self.textType+')</span>','ig'),'$1');
		}
	}
	var patterns = [];
	patterns[0] = new Marker('REOP1','アルファベット','[a-z]+','#9f9');
	patterns[1] = new Marker('REOP2','カタカナ','[ァ-タダ-ヶー]+','#99f');
	patterns[2] = new Marker('REOP3','半角スペース',' +','#f99');
	patterns[3] = new Marker('REOP4','全角スペース','　+','#ee0');
	patterns[4] = new Marker('REOP5','半角数字','[0-9]+','#6ee');
	
	//Panel class (constructor)
	/*-------------------------------------------------------------------*/
	var Panel = function(){
		this.elem = D.createElement('div');
		this.elem.className = 'REOP-ctrl movable';
		this.create = function(){
			var self = this;
			S = D.createElement('style');
			S.setAttribute('id','REOP-style');
			for(var i=0;i<patterns.length;i++){
				S.innerHTML += 'span.'+patterns[i].id+'{background:'+patterns[i].color+';}';
			}
			S.innerHTML += '.REOP-ctrl{position:fixed;top:'+positionY+'px;right:10px;z-index:9998;width:200px;padding:0 10px 10px;text-align:left;color:#fff;background:#000;opacity:0.7;box-shadow: 0 3px 7px rgba(0, 0, 0, 0.6);border-radius:3px;}';
			S.innerHTML += '.REOP-ctrl p{margin:5px 0;}.REOP-ctrl input,.REOP-ctrl label{margin-right:5px;vertical-align:middle;}';
			S.innerHTML += '.REOP-ctrl div{margin:0 -10px 10px;padding:2px;background:#333;cursor:move;text-align:right;border-radius:3px;}.REOP-ctrl span{cursor:pointer;}'
			D.head.appendChild(S);
			B.innerHTML = '<div id="REOP-HighLightArea">'+B.innerHTML+'</div>';
			H = D.getElementById('REOP-HighLightArea');
			B.insertBefore(self.elem,H);
			self.elem.innerHTML = '<div class="movable_controller"><span id="REOP-close">閉じる</span></div>';
			for(var i=0;i<patterns.length;i++){
				self.elem.appendChild(patterns[i].elem);
			}
		};
		this.remove = function(){
			D.getElementById('REOP-close').onclick = function(){
				D.head.removeChild(D.getElementById('reop'));
				D.head.removeChild(D.getElementById('REOP-style'));
				B.innerHTML = ORG;
			}
			
		};
	};
	var panel = new Panel();
	panel.create();
	panel.remove();

	//ElementMover
	/*-------------------------------------------------------------------*/
	(function(){
		var s = D.createElement('script');
		s.setAttribute('type', 'text/javascript');
		s.setAttribute('charset', 'utf-8');
		s.setAttribute('src', 'http://mihonak.github.com/reop/element_mover-1.0.js');
		B.appendChild(s);
	})();


})();