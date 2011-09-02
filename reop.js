(function(){
	var D = document,B = D.body,P,H,S;
	S = D.createElement('style');
	S.innerHTML = 'span.c1{background:#9f9;}span.c2{background:#99f;}span.c3{background:#f99;}span.c4{background:#ee0;}span.c5{background:#6ee;}';
	D.head.appendChild(S);
	B.innerHTML = '<div id="REOP-HighLightArea">'+B.innerHTML+'</div>';
	H = D.getElementById('REOP-HighLightArea');
	B.insertBefore(P=D.createElement('div'),H);
	P.style.cssText = 'position:fixed;top:10px;right:10px;z-index:9998;width:300px;padding:10px;text-align:left;color:#fff;background:#000;border:#fff solid 2px;opacity:0.5;';
	P.innerHTML = '<input id="c1" type="checkbox" value="[a-z]+" /><label for="c1">アルファベット</label>';
	P.innerHTML += '<br /><input id="c2" type="checkbox" value="[ア-ン,ァ-ョ,ー]+" /><label for="c2">カタカナ</label>';
	P.innerHTML += '<br /><input id="c3" type="checkbox" value=" +" /><label for="c3">半角スペース</label>';
	P.innerHTML += '<br /><input id="c4" type="checkbox" value="　+" /><label for="c4">全角スペース</label>';
	P.innerHTML += '<br /><input id="c5" type="checkbox" value="[0-9]+" /><label for="c5">半角数字</label>';
	
	var inputs = P.getElementsByTagName('input');
	var chks =[];
	for(i=0;i<inputs.length;i++){
		if(inputs[i].type == 'checkbox'){
			chks.push(inputs[i]);
		}
	}
	for(i=0;i<chks.length;i++){
		chks[i].onclick = function(){
			(function (w,cls,status){
				if(status==true){
					var s = '[REOP-array-separator]',t = H.innerHTML.replace(new RegExp('(<)','ig'),s+'$1').replace(new RegExp('(>)','ig'),'$1'+s).split(s);
					for(i=0;i<t.length;i++){
						if(t[i].substr(0,1)=='<'){//do nothing for HTML tags
						}else{
							t.splice(i,1,t[i].replace(new RegExp('(&.{2,4};)','ig'),s+'$1'+s).split(s));
							for(j=0;j<t[i].length;j++){
								if(t[i][j].substr(0,1)!='&'){
									t[i][j] = t[i][j].replace(new RegExp('('+w+')','ig'),'<span class="'+cls+'">$1</span>');
								}
							}
							t[i] = t[i].join('');
						}
					}
					H.innerHTML = t.join('');
				}else{
					H.innerHTML = H.innerHTML.replace(new RegExp('<span class="'+cls+'">('+w+')</span>','ig'),'$1');
				}
			})(this.value,this.id,this.checked);
		}
	}
	
})();