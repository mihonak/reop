(function(){
	var D = document,B = D.body,H,S;

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
	patterns[0] = new Marker('c1','アルファベット','[a-z]+','#9f9');
	patterns[1] = new Marker('c2','カタカナ','[ァ-タダ-ヶー]+','#99f');
	patterns[2] = new Marker('c3','半角スペース',' +','#f99');
	patterns[3] = new Marker('c4','全角スペース','　+','#ee0');
	patterns[4] = new Marker('c5','半角数字','[0-9]+','#6ee');
	
	//Panel class (constructor)
	/*-------------------------------------------------------------------*/
	var Panel = function(){
		this.elem = D.createElement('div');
		this.elem.className = 'REOP-controler movable';
		this.create = function(){
			var self = this;
			S = D.createElement('style');
			for(var i=0;i<patterns.length;i++){
				S.innerHTML += 'span.'+patterns[i].id+'{background:'+patterns[i].color+';}';
			}
			S.innerHTML += '.REOP-controler p{margin:5px 0;}.REOP-controler input,.REOP-controler label{margin-right:5px;vertical-align:middle;}';
			D.head.appendChild(S);
			B.innerHTML = '<div id="REOP-HighLightArea">'+B.innerHTML+'</div>';
			H = D.getElementById('REOP-HighLightArea');
			B.insertBefore(self.elem,H);
			self.elem.style.cssText = 'position:fixed;top:10px;right:10px;z-index:9998;width:300px;padding:0 10px 10px;text-align:left;color:#fff;background:#000;border:#fff solid 2px;opacity:0.7;';
			self.elem.innerHTML = '<div class="movable_controller" style="height:10px;margin:0 -10px 10px;background:#ccc;cursor:move;"></div>';
			for(var i=0;i<patterns.length;i++){
				self.elem.appendChild(patterns[i].elem);
			}
		};
	};
	var panel = new Panel();
	panel.create();

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