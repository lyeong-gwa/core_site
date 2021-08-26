
function previewImage(targetObj, View_area,num) {
	var preview = document.getElementById(View_area); //div id
	var ua = window.navigator.userAgent;

  //ie일때(IE8 이하에서만 작동)
	if (ua.indexOf("MSIE") > -1) {
		targetObj.select();
		try {
			var src = document.selection.createRange().text; // get file full path(IE9, IE10에서 사용 불가)
			var ie_preview_error = document.getElementById("ie_preview_error_" + View_area);


			if (ie_preview_error) {
				preview.removeChild(ie_preview_error); //error가 있으면 delete
			}

			var img = document.getElementById(View_area); //이미지가 뿌려질 곳

			//이미지 로딩, sizingMethod는 div에 맞춰서 사이즈를 자동조절 하는 역할
			img.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+src+"', sizingMethod='scale')";
		} catch (e) {
			if (!document.getElementById("ie_preview_error_" + View_area)) {
				var info = document.createElement("<p>");
				info.id = "ie_preview_error_" + View_area;
				info.innerHTML = e.name;
				preview.insertBefore(info, null);
			}
		}

  //ie가 아닐때(크롬, 사파리, FF)
	} else {
		var files = targetObj.files;
		var i=num;
			
			var file = files[i];

			var prevImg = document.getElementById("prev_" + View_area); //이전에 미리보기가 있다면 삭제
			if (prevImg) {
				preview.removeChild(prevImg);
			}
			var img = document.createElement("img"); 
			img.id = "prev_" + View_area;
			
			img.classList.add("d-block");
			img.classList.add("w-75");
			img.classList.add("margin_auto");
			img.file = file;


			preview.appendChild(img);
			if (window.FileReader) { // FireFox, Chrome, Opera 확인.
				var reader = new FileReader();
				reader.onloadend = (function(aImg) {
					return function(e) {
						aImg.src = e.target.result;
					};
				})(img);
				reader.readAsDataURL(file);
			} else { // safari is not supported FileReader
				//alert('not supported FileReader');
				if (!document.getElementById("sfr_preview_error_"
						+ View_area)) {
					var info = document.createElement("p");
					info.id = "sfr_preview_error_" + View_area;
					info.innerHTML = "not supported FileReader";
					preview.insertBefore(info, null);
				}
			}

		
	}
}

function button_checking(targetObj) {
	var files = targetObj.files;
	var text='';
	if(files.length>1){
		for ( var i = 1; i < files.length; i++) {
			text=text+'<div id="img'+i+'" class="carousel-item"></div>';
		}
		text='<div id="img0" class="carousel-item active"></div>'+text;
		document.querySelector('checking').innerHTML=text;
		for ( var i = 0; i < files.length; i++) {
			previewImage(targetObj, 'img'+i,i)
		}
	}
	else if(files.length==1){
		text='<div id="img0" class="carousel-item active"></div>'+text;
		document.querySelector('checking').innerHTML=text;
		previewImage(targetObj, 'img0',0)
	}
	document.querySelector('button_switch').innerHTML='<button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span></button><button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span></button>';
}


function skill_table(job){
	let JsonData = document.getElementById("job_skill_class").value;
	let myJsonData = JSON.parse(JsonData);

	string_job=job.options[job.selectedIndex].value;
	//skill_list=job_skill(job.options[job.selectedIndex].value);
	skill_list=myJsonData[string_job];
	if(skill_list!=null){
		insert_table_list='';
		tmp='';
		for(let i=0;i<skill_list.length;i++){
			tmp=tmp+`<td class="col-md-1"><input type="checkbox" id="check_skill_${i}" name="skill_box" value="${i}"/><label for="check_skill_${i}"><img src="./maple_img/${string_job}/${skill_list[i]}" />${skill_list[i].slice(0,2)}:${skill_list[i].slice(2,skill_list[i].length-4)}</label></td>`;
			if(i%3==2){
				insert_table_list=insert_table_list+"<tr>"+tmp+"</tr>";
				tmp='';
			}
		}
		if(skill_list.length%3!=0){
			insert_table_list=insert_table_list+"<tr>"+tmp+"</tr>";
			tmp='';
		}
		document.querySelector('skill_check').innerHTML=`<table class="table table-striped">${insert_table_list}</table>`;
	}
	else{
		document.querySelector('skill_check').innerHTML='';
	}
}

document.querySelector("#info").addEventListener("submit",bansubmit);

 function bansubmit(A){
	 
	let chkList = document.querySelectorAll("input[name=skill_box]:checked");
	let chkprofile = document.querySelector("input[name=profile_pt]").value;
	let chkprofile_count_limit=document.querySelector("input[name=profile_pt]").files.length;
	if(chkList.length<1){
		alert("강화스킬를 선택해주세요!");
		A.preventDefault();
	}else if(chkprofile==''){
		alert("코어창 상태이미지를 업로드해주세요!");
		A.preventDefault();
	}else if(chkprofile_count_limit>15){
		alert("이미지파일은 최대 15개로 제한합니다");
		A.preventDefault();
	}else{
		document.getElementById('post_button').disabled = true;
		LoadingWithMask();
	}
 }

function classification_job_f(choice_class){
	string_class=choice_class.options[choice_class.selectedIndex].value;
	let sub_class={
		adventurer:`<option value="Hero">히어로</option>
		<option value="Paladin">팔라딘</option>
		<option value="Dark_Knight">다크나이트</option>
		<option value="Bulldog">불독</option>
		<option value="Sun_call">썬콜</option>
		<option value="Bishop">비숍</option>
		<option value="Bow_master">보우마스터</option>
		<option value="Jingu_Shrine">신궁</option>
		<option value="Pathfinder">패스파인더</option>
		<option value="Night_Rod">나이트로드</option>
		<option value="Shadow">섀도어</option>
		<option value="Dual_blade">듀얼블레이드</option>
		<option value="Viper">바이퍼</option>
		<option value="Captain">캡틴</option>
		<option value="Cannon_shooter">캐논슈터</option>
		`,
		cygnus:`<option value="Soul_Master">소울마스터</option>
		<option value="Mikhail">미하일</option>
		<option value="Flame_Wizard">플레임위자드</option>
		<option value="Windbreaker">윈드브레이커</option>
		<option value="Night_walker">나이트워커</option>
		<option value="Striker">스트라이커</option>
		`,
		resistance:`<option value="Blaster">블래스터</option>
		<option value="Battle_mage">배틀메이지</option>
		<option value="Wild_hunter">와일드헌터</option>
		<option value="Mechanic">메카닉</option>
		<option value="Xenon">제논</option>
		`,
		daemon:`<option value="Demon_Slayer">데몬슬레이어</option>
		<option value="Demon_Avenger">데몬어벤져</option>
		`,
		hero:`<option value="Aran">아란</option>
		<option value="Evan">에반</option>
		<option value="Luminous">루미너스</option>
		<option value="Mercedes">메르세데스</option>
		<option value="Phantom">팬텀</option>
		<option value="Eun_Wol">은월</option>
		`,
		nova:`<option value="Kaiser">카이저</option>
		<option value="Cain">카인</option>
		<option value="Cadena">카데나</option>
		<option value="Angelic_buster">엔젤릭버스터</option>
		`,
		Lev:`<option value="Adele">아델</option>
		<option value="Illium">일리움</option>
		<option value="Arc">아크</option>
		`,
		anima:`<option value="Lala">라라</option>
		<option value="Hoyoung">호영</option>
		`,
		zero:`<option value="Zero">제로</option>`,
		kinesis:`<option value="Kinesis">키네시스</option>`,
	};
	switch(string_class){
		case 'adventurer':
			document.querySelector('select[name="job"]').innerHTML=`<option value="bad">직업선택</option>${sub_class.adventurer}`
			break;
		case 'cygnus':
			document.querySelector('select[name="job"]').innerHTML=`<option value="bad">직업선택</option>${sub_class.cygnus}`
			break;
		case 'resistance':
			document.querySelector('select[name="job"]').innerHTML=`<option value="bad">직업선택</option>${sub_class.resistance}`
			break;
		case 'daemon':
			document.querySelector('select[name="job"]').innerHTML=`<option value="bad">직업선택</option>${sub_class.daemon}`
			break;
		case 'hero':
			document.querySelector('select[name="job"]').innerHTML=`<option value="bad">직업선택</option>${sub_class.hero}`
			break;
		case 'nova':
			document.querySelector('select[name="job"]').innerHTML=`<option value="bad">직업선택</option>${sub_class.nova}`
			break;
		case 'Lev':
			document.querySelector('select[name="job"]').innerHTML=`<option value="bad">직업선택</option>${sub_class.Lev}`
			break;
		case 'anima':
			document.querySelector('select[name="job"]').innerHTML=`<option value="bad">직업선택</option>${sub_class.anima}`
			break;
		case 'zero':
			document.querySelector('select[name="job"]').innerHTML=`<option value="bad">직업선택</option>${sub_class.zero}`
			break;
		case 'kinesis':
			document.querySelector('select[name="job"]').innerHTML=`<option value="bad">직업선택</option>${sub_class.kinesis}`
			break;
		default:
			document.querySelector('select[name="job"]').innerHTML=``
			break;
	}
	skill_table(document.querySelector("select[name=job]"));
}
function LoadingWithMask() {
    //화면의 높이와 너비를 구합니다.
    var maskHeight = $(document.body).height();
    var maskWidth  = window.document.body.clientWidth;
     
    //화면에 출력할 마스크를 설정해줍니다.
    var mask       ="<div id='mask' style='position:absolute; z-index:9000; background-color:#000000; display:none; left:0; top:0;'></div>";
      
    let loadingImg ="<img src='./Spinner.gif' style='position: relative; display: block; margin: 0px auto;'/>";
  
    //화면에 레이어 추가
    $('body')
        .append(mask)
        
    //마스크의 높이와 너비를 화면 것으로 만들어 전체 화면을 채웁니다.
    $('#mask').css({
            'width' : maskWidth
            ,'height': maskHeight
            ,'opacity' :'0.3'
    });
  
    //마스크 표시
    $('#mask').show();  
  
    //로딩중 이미지 표시
    document.getElementById('loadingImg').innerHTML=loadingImg;
}

window.onpageshow=function(event){
	skill_table(document.querySelector("select[name=job]"));
}