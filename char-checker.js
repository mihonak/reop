(function(){
	var D = document,B = D.body,C = B.innerHTML,P,H,S;
	S = D.createElement('style');
	S.innerHTML = 'span.c1{background:#9f9;}span.c2{background:#99f;}span.c3{background:#f99;}span.c4{background:#ee0;}span.c5{background:#9ff;}';
	D.head.appendChild(S);
	B.innerHTML = '<div id="HighLight">'+C+'</div>';
	H = D.getElementById('HighLight');
	B.insertBefore(P=D.createElement('div'),H);
	P.style.cssText = 'position:fixed;top:10px;right:10px;z-index:9998;width:300px;padding:10px;text-align:left;color:#fff;background:#000;border:#fff solid 2px;opacity:0.7;';
	P.innerHTML = '<input id="c1" type="checkbox" value="[a-z]+" /><label for="c1">アルファベット</label>';
	P.innerHTML += '<br /><input id="c2" type="checkbox" value="[ア-ン,ァ-ョ,ー]+" /><label for="c2">カタカナ</label>';
	P.innerHTML += '<br /><input id="c3" type="checkbox" value=" +" /><label for="c3">半角スペース</label>';
	P.innerHTML += '<br /><input id="c4" type="checkbox" value="　+" /><label for="c4">全角スペース</label>';
	P.innerHTML += '<br /><input id="c5" type="checkbox" value="[0-9]+" /><label for="c5">半角数字</label>';
	
	var inputs = P.getElementsByTagName('input');
	var chks =[],txtbx = [];
	for(i=0;i<inputs.length;i++){
		if(inputs[i].type == 'checkbox'){
			chks.push(inputs[i]);
		}else if(inputs[i].type=="text"){
			txtbx.push(inputs[i]);
		}
	}
	for(i=0;i<chks.length;i++){
		chks[i].onclick = function(){
			(function (w,cls,status){
				var s = '[separator]',r = '',t = H.innerHTML.replace(new RegExp('(<)','ig'),s+'$1').replace(new RegExp('(>)','ig'),'$1'+s);
				t = t.split(s);
				if(status==true){
					for(i=0;i<t.length;i++){
						if(t[i].substr(0,1)!='<'){
							t[i] = t[i].replace(new RegExp('('+w+')','ig'),'<span class="'+cls+'">$1</span>');
						}
						r += t[i];
					}
				}else{
					r = H.innerHTML.replace(new RegExp('<span class="'+cls+'">('+w+')</span>','ig'),'$1');
				}
				H.innerHTML = r;
			})(this.value,this.id,this.checked);
		}
	}
})();