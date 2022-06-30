let session=document.getElementsByName('session_id')[0].value;
let skill_arr=document.getElementsByName('skill_arr')[0].value.split(",");
const job=document.getElementsByName('job')[0].value
let ajax_tmp;


let chkList;
let core_3 = {};
let core_2 = {};
let prior_list = [];
chkList_set();
core_list = array2(skill_arr);

let min_limit_list = [];
let max_limit_list = [];
let level_limit_list = [];


let combi_set = [];
let combi_set_filter_info = [];
let combi_set_level_info = [];
let filter_index_info = [];
let page_index=0;

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
csrftoken = getCookie('csrftoken');


 window.onpageshow=function(event){
    skill_table();
	make_core_table();
	result_table();
}
function array2(arr){
	row=arr.length/5;
	if(row<=1){
		alert("확인가능한 강화코어가 존재하지 않습니다.\n직업과 이미지를 확인하시고 다시 시도해주세요.");
	}
	let mat=new Array(row);
	for(let i=0;i<row;i++){
		mat[i]=[arr[5*i+0],arr[5*i+1],arr[5*i+2],arr[5*i+3],arr[5*i+4]];
	}
	return mat;
}
function skill_table(){
	skill_list=job_skill[job];
	if(skill_list!=null){
		insert_table_list='';
		tmp='';
		for(let i=0;i<skill_list.length;i++){
			tmp=tmp+`<td class="col-md-1"><input type="checkbox" id="check_skill_${i}" name="skill_box" value="${i}" onclick="priority_skill_set(this);"/><label for="check_skill_${i}"><img src="./maple_img/${job}/${skill_list[i]}" />${skill_list[i].slice(0,2)}:${skill_list[i].slice(2,skill_list[i].length-4)}</label></td>`;
			if(i%3==2){
				insert_table_list=insert_table_list+"<tr>"+tmp+"</tr>";
				tmp='';
			}
		}
		if(skill_list.length%3!=0){
			insert_table_list=insert_table_list+"<tr>"+tmp+"</tr>";
			tmp='';
		}
		document.querySelector('skill_check').innerHTML=`<table class="table table-striped"><thead class="thead-dark" style="background-color: black;"><tr style="text-align: left; color: white"><th class="col-md-1" colspan="3"><h1>스킬표 : 필요한 스킬 옆 박스를 체크해주세요</h1></th></tr></thead>${insert_table_list}</table>`;
	}
	else{
		document.querySelector('skill_check').innerHTML='';
	}
}

function make_core_table(){
	user_path=`./tmp/${session}/`;
	skill_path=`./maple_img/${job}/`;
	output_str=`<table border="1" class="table table-striped">
	<thead class="thead-dark" style="background-color: black;">
	<tr style="text-align: left; color: white"><th class="col-md-1"></th><th class="col-md-1">코어</th>
	<th class="col-md-2">메인스킬</th><th class="col-md-2">서브스킬</th><th class="col-md-3">정보</th>
	  </tr></thead><tbody>`;
	for(let i in core_list){
		output_str+=`<tr id="tr_${core_list[i][4]}번"><th>${core_list[i][4]}번</th>`;
		output_str+=`<td><img src='${user_path}skill${core_list[i][4]}.png'></td>`;
		output_str+=`<td><img src='${skill_path}${job_skill[job][core_list[i][0]]}'></td>`;
		output_str+=`<td><img src='${skill_path}${job_skill[job][core_list[i][1]]}'>`;
		output_str+=`<img src='${skill_path}${job_skill[job][core_list[i][2]]}'></td>`;
		output_str+=`<td id='td_${core_list[i][4]}번'></td></tr>`;
	}
	document.querySelector('core_table').innerHTML=`${output_str}</tbody>`;
}

function chkList_set(){
	let tmp_chkList = document.querySelectorAll("input[name=skill_box]:checked");
	let arr = [];
	for(let i = 0;i<tmp_chkList.length;i++){
		arr.push(tmp_chkList[i].value);
	}
	chkList=arr;
}

function priority_skill_set(cb){
	let tmp_prior_string="";
	
	if(cb.checked){
		prior_list.push(cb.value);
	}
	else{
		prior_list=prior_list.filter((element)=>element!==cb.value);
	}
	make_core_info();
	make_filter_table();
	min_max_limit_change(0);
	result_table();
	limit_level_change();
	change_prior_skill_img();
}

function change_prior_skill_img(){
	let tmp_text = "";
	for(i in prior_list){
		tmp_text += `<img src="./maple_img/${job}/${job_skill[job][prior_list[i]]}"> →`
	}
	document.querySelector('prior_skill').innerHTML = tmp_text.slice(0,tmp_text.length-1);
}


function make_filter_table(){

	let option_form_min=`<select class="selectpicker" name='min_limit' onchange='min_max_limit_change(0)'><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option></select>`;
	let option_form_max=`<select class="selectpicker" name='max_limit' onchange='min_max_limit_change(1)'><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option selected>6</option></select>`;
	let option_form_level=`<select class="selectpicker" name='level_limit' onchange='limit_level_change()'>`;
	for(let i=0;i<51;i++){
		option_form_level+=`<option>${i}</option>`;
	}
	option_form_level+=`</select>`;
	skill_list=job_skill[job];
	if(skill_list!=null && prior_list.length>=1){
		insert_table_list='';
		tmp='';
		for(let k=0; k < prior_list.length ; k++){
			i=prior_list[k];
			tmp=tmp+`<td class="col-md-1"><img src="./maple_img/${job}/${skill_list[i]}" /><div style="float:right">${option_form_min}~${option_form_max}중첩<br>${option_form_level}레벨이상</div></td>`;
			if(k%2==1){
				insert_table_list=insert_table_list+"<tr>"+tmp+"</tr>";
				tmp='';
			}
		}
		if(prior_list.length%2!=0){
			insert_table_list=insert_table_list+"<tr>"+tmp+"</tr>";
			tmp='';
		}

		document.querySelector('filter_table').innerHTML=`<table class="table table-striped"><thead class="thead-dark" style="background-color: black;"><tr style="text-align: left; color: white"><th class="col-md-1" colspan="3"><h1>필터표 :  <button id='post_button'class="btn btn-primary btn-block " onclick="make_filter_result_table()">필터적용하기</button><div style="float:right">일괄 적용↓</div></h1>
		<div style="float:right"><select class="selectpicker" name="master_min_limit" onchange="master_limit(1,this)"><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option></select>~<select class="selectpicker" name="master_max_limit" onchange="master_limit(2,this)"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option selected="">6</option></select>중첩<br>
		<select class="selectpicker" name="master_level_limit" onchange="master_limit(3,this)"><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option><option>11</option><option>12</option><option>13</option><option>14</option><option>15</option><option>16</option><option>17</option><option>18</option><option>19</option><option>20</option><option>21</option><option>22</option><option>23</option><option>24</option><option>25</option><option>26</option><option>27</option><option>28</option><option>29</option><option>30</option><option>31</option><option>32</option><option>33</option><option>34</option><option>35</option><option>36</option><option>37</option><option>38</option><option>39</option><option>40</option><option>41</option><option>42</option><option>43</option><option>44</option><option>45</option><option>46</option><option>47</option><option>48</option><option>49</option><option>50</option></select>레벨이상</div>
		</th></tr></thead>${insert_table_list}</table>`;
	}
	else{
		document.querySelector('filter_table').innerHTML='';
	}
}

function limit_level_change(){
	let tmp_limit_level=document.getElementsByName('level_limit');
	level_limit_list=[];
	for(let i = 0 ; i < tmp_limit_level.length ; i++){
		level_limit_list.push(tmp_limit_level[i].value);
	}
}



function make_filter_result_table(){

	filter_index_info=[];

	let min_target = Array(job_skill[job].length).fill(0);
	let max_target = Array(job_skill[job].length).fill(100);
	let min_target_level = Array(job_skill[job].length).fill(0);

	for(let i in prior_list){
		min_target[prior_list[i]]=min_limit_list[i];
		max_target[prior_list[i]]=max_limit_list[i];
		min_target_level[prior_list[i]]=level_limit_list[i];
	}

	for(let i in combi_set_filter_info){
		swi=true;
		for(let j in combi_set_filter_info[i]){
			if(combi_set_filter_info[i][j] > max_target[j] || combi_set_filter_info[i][j] < min_target[j] || combi_set_level_info[i][j] < min_target_level[j]){
				swi=false;
				break;
			}
		}
		if(swi){
			filter_index_info.push(i);
		}
	}
	page_index=0;
	move_result_page(0);
	}

function move_result_page(P_N){
	page_index+=P_N;
	page_index=Math.max(0,page_index);
	page_index=Math.min(page_index,parseInt(filter_index_info.length/100));
	let page_info=`<ul class="pagination justify-content-center">
	<li class="page-item"><a class="page-link" href="javascript:move_result_page(-1);">Prev</a></li>
	<li class="page-item"><a class="page-link" id='result_page'>${page_index+1}페이지</a></li>
	<li class="page-item"><a class="page-link" href="javascript:move_result_page(1);">Next</a></li>
	</ul>`;

	let combi_text = "";
	let combi_text_limit = Math.min(page_index*100+100,filter_index_info.length) 
	for(let i = page_index*100 ; i< combi_text_limit ; i++){
		let tmp_text="";
		for(let j in combi_set[filter_index_info[i]]){
			tmp_text+=`<td>${core_list[combi_set[filter_index_info[i]][j]][4]}번</td>`;
		}
		combi_text+=`<tr onclick="javascript:change_result_table(${i})"><th>${i}</th>${tmp_text}</tr>`;
	}


	document.querySelector('filter_result_table').innerHTML=`<div class="col-sm-12" style="height:280px; overflow-y:auto; overflow-x: hidden;"><table class="table table-striped"><thead class="thead-dark" style="background-color: black;"><tr style="text-align: left; color: white"><th class="col-md-1"></th><th class="col-md-11" colspan="${combi_set[0].length+1}"><h1>조합표 : ${filter_index_info.length}개 </h1></th></tr></thead><tbody>${combi_text}</tbody></table></div>${page_info}`;

}

function change_result_table(index){
	let target_combi=combi_set[filter_index_info[index]];
	let tmp_nesting_list=combi_set_filter_info[filter_index_info[index]];
	let tmp_level_list=combi_set_level_info[filter_index_info[index]];

	let combi_text="";
	for(let i in target_combi){
		let target_core=core_list[target_combi[i]];
		combi_text+=`${target_core[4]}, `;

	}
	for(let i=0;i<tmp_nesting_list.length;i++){
		document.getElementById(`result_skill_level${i}`).innerHTML=`${tmp_nesting_list[i]}중첩 : ${tmp_level_list[i]}레벨`;
	}

	document.getElementById('result_id').innerHTML=`결과표 : ${index}번 조합`;
	document.getElementById('result_combi').innerHTML=combi_text;
}

function master_limit(check,change_val){
	let tmp_list=[];
	let target;
	if(check==1){
		target=document.getElementsByName('min_limit');
	}
	else if(check==2){
		target=document.getElementsByName('max_limit');
	}
	else{
		target=document.getElementsByName('level_limit');
	}
	for(let i=0;i<target.length;i++){
		target[i].value=change_val.value;
	}
	min_max_limit_change(0);
	limit_level_change();
}



function min_max_limit_change(check){
	let min_limit=document.getElementsByName('min_limit');
	let max_limit=document.getElementsByName('max_limit');
	let tmp_min_list=[];
	let tmp_max_list=[];
	for(let i=0;i<min_limit.length;i++){
		if(max_limit[i].value<min_limit[i].value){
			if(check==0){
				max_limit[i].value=min_limit[i].value;
			}
			else{
				min_limit[i].value=max_limit[i].value;
			}
		}
		tmp_min_list.push(min_limit[i].value);
		tmp_max_list.push(max_limit[i].value);
	}
	min_limit_list = tmp_min_list;
	max_limit_list = tmp_max_list;
}







function result_table(){
	let skill_list=job_skill[job];
	
	if(skill_list!=null){
		insert_table_list='<td style="background-color: black;color: white" id="result_id">결과표</td><td colspan="3" style="background-color: black;color: white">조합 : <span id="result_combi"></span></td><tr></tr>';
		tmp='';
		for(let i=0;i<skill_list.length;i++){
			let color_td='';
			if(prior_list.indexOf(i+'')!=-1){
				color_td='style="background-color: rgb(255, 255, 128);"';
			}
			tmp=tmp+`<td class="col-md-1" ${color_td}><img src="./maple_img/${job}/${skill_list[i]}" />${skill_list[i].slice(2,6)}....<span id="result_skill_level${i}" style="float:right"></span></td>`;
			if(i%3==2){
				insert_table_list=insert_table_list+"<tr>"+tmp+"</tr>";
				tmp='';
			}
		}
		if(skill_list.length%3!=0){
			insert_table_list=insert_table_list+"<tr>"+tmp+"</tr>";
			tmp='';
		}
		
		document.querySelector('result_table').innerHTML=`<table class="table table-striped">${insert_table_list}</table>`;
	}
	else{
		document.querySelector('result_table').innerHTML='';
	}
}




function make_core_info(){
	chkList_set();
	core_3=[];
	core_2=[];
	for(let i in core_list){
		let main_sub = "서브";
		let core_3_2 = 0;
		if(chkList.indexOf(core_list[i][1])>=0){
			core_3_2=core_3_2 + 1;
		}
		if(chkList.indexOf(core_list[i][2])>=0){
			core_3_2=core_3_2 + 1;
		}
		if(chkList.indexOf(core_list[i][0])>=0){
			main_sub = "메인";
			core_3_2=core_3_2 + 1;
			document.getElementById("tr_"+core_list[i][4]+"번").style.fontSize="20px";
			document.getElementById("tr_"+core_list[i][4]+"번").style.fontWeight = "900";
			document.getElementById("tr_"+core_list[i][4]+"번").style.color = "#000000";
		}
		else{
			document.getElementById("tr_"+core_list[i][4]+"번").style.fontSize="10px";
			document.getElementById("tr_"+core_list[i][4]+"번").style.fontWeight = "300";
			document.getElementById("tr_"+core_list[i][4]+"번").style.color = "#808080";
		}
		if(core_3_2==3){
			document.getElementById("tr_"+core_list[i][4]+"번").style.backgroundColor="#80FF00";
			core_3.push(i);
		}
		else if(core_3_2==2){
			document.getElementById("tr_"+core_list[i][4]+"번").style.backgroundColor="#FFFF00";
			core_2.push(i);
		}
		else{
			document.getElementById("tr_"+core_list[i][4]+"번").style.backgroundColor="#FFFFFF";
		}
		document.getElementById("td_"+core_list[i][4]+"번").innerHTML=`${core_3_2}중첩 ${main_sub}코어`;
	}
	core_3 =core_split(core_3);
	core_2 =core_split(core_2);
	
	let tmp_core_3_index=Object.keys(core_3);
	if(tmp_core_3_index.length>=1){
		for(let i in tmp_core_3_index){
			if(tmp_core_3_index[i] in core_2){
				delete core_2[tmp_core_3_index[i]];
			}
		}
	}
}

function core_split(core_num){
	let dict={};
	for(let i in core_num){
		if(core_list[core_num[i]][0] in dict){
			dict[core_list[core_num[i]][0]].push(core_num[i]);
		}
		else{
			dict[core_list[core_num[i]][0]]=[core_num[i]];
		}
	}
	return dict;
}

function request_core_calc(btn){
	btn.innerText = "계산중...";
	btn.disabled = true;
	

	for(let i in Object.keys(core_2)){
		let target=[];
		let tmp_replace_list=[];
		let target_list=core_2[Object.keys(core_2)[i]];
		for(let j in target_list){

			if(prior_list.indexOf(core_list[target_list[j]][1])>=0){
				target.push(core_list[target_list[j]][1]);
			}
			else{
				target.push(core_list[target_list[j]][2]);
			}
		}
		for(let j in target){
			for(let k = j;k < target.length;k++){
				if(j != k && target[j]==target[k]){
					target[k]=-1;
				}
			}
		}
		for(let j in target){
			if(target[j]!=-1){
				tmp_replace_list.push(target_list[j]);
			}
		}
		core_2[Object.keys(core_2)[i]]=tmp_replace_list;
	}

	let main_list=[];

	for(let i in prior_list){
		if(Object.keys(core_3).indexOf(prior_list[i])>=0){
			main_list.push(core_3[prior_list[i]]);
		}
	}

	let tmp_core_2_no_push_index=[];
	for(let i in prior_list){
		if(Object.keys(core_2).indexOf(prior_list[i])>=0){
			main_list.push(core_2[prior_list[i]]);
			tmp_core_2_no_push_index.push(prior_list[i]);
		}
	}
	if(document.getElementById('sub_core_use').checked){
		for(let i in Object.keys(core_2)){
			if(tmp_core_2_no_push_index.indexOf(Object.keys(core_2)[i])==-1){
				main_list.push(core_2[Object.keys(core_2)[i]]);
			}
		}
	}


	let param={
		'main_list': JSON.stringify(main_list),
		'core_num': document.getElementById("core_num").value,
		'prior_list': JSON.stringify(prior_list),
		'job': job,
		'session' : session
	};
	$.ajax({
		url : "/ajax",
		type : "POST",
		data : param,
		headers: { "X-CSRFToken": csrftoken },
		success : function(data) {
			ajax_tmp = data;
			document.querySelector('len_combi').innerHTML=`${data['combi_set'][0].length}개`;
			combi_set = data['combi_set'][0];
			combi_set_filter_info=[];
			combi_set_level_info=[];
			for(let i in combi_set){
				let tmp_info=Array(job_skill[job].length).fill(0);
				let tmp_level=Array(job_skill[job].length).fill(0);
				for(let j in combi_set[i]){
					let target_core=core_list[combi_set[i][j]].slice(0,3);
					for(let k in target_core){
						tmp_info[target_core[k]]+=1;
						tmp_level[target_core[k]]+=core_list[combi_set[i][j]][3]*1;
						
					}
				}
				combi_set_filter_info.push(tmp_info);
				combi_set_level_info.push(tmp_level);
			}
			btn.innerText = "조합찾기";
			btn.disabled = false;
		},
		error : function(){
			btn.innerText = "조합찾기";
			btn.disabled = false;
			alert('오류발생! 잠시 후 다시 이용해주세요.');
		}
	});
}





let job_skill={
	Night_Rod:['00슈리켄 버스트.png', '01윈드 탈리스만.png', '02마크 오브 어쌔신,나이트로드.png', '03다크 플레어.png', '04트리플 스로우.png', '05슈리켄 챌린지.png', '06쿼드러플 스로우.png', '07써든레이드.png', '08쇼다운 챌린지.png', '09포 시즌.png'],
	Night_walker:['00럭키세븐.png', '01쉐도우 배트,래버너스 배트.png', '02트리플 스로우.png', '03쿼드러플 스로우.png', '04스타더스트.png', '05퀀터플 스로우.png', '06다크니스 오멘.png', '07쉐도우 스티치.png', '08도미니언.png'],
	Dark_Knight:['00파이널 어택.png', '01스피어 풀링.png', '02라만차 스피어.png', '03리프어택_돌진_어퍼차지.png', '04비홀더 강화.png', '05다크 임페일.png', '06궁니르 디센트.png', '07다크 신서시스.png'],
	Demon_Slayer:['00데빌 사이더.png', '01데몬 슬래시.png', '02소울 이터.png', '03다크 쓰러스트.png', '04데몬 트레이스.png', '05다크 저지먼트.png', '06데스 드로우.png', '07블러디 레이븐.png', '08데모닉 브레스.png', '09데몬 익스플로젼.png', '10데몬 임팩트.png', '11데빌 크라이.png', '12메타모포시스.png', '13다크 바인드.png', '14서버러스.png'],
	Demon_Avenger:['00더블 슬래시.png', '01데몬 스트라이크.png', '02배츠 스웜.png', '03문라이트 슬래시.png', '04인헤일 바이탈러티.png', '05실드 차지.png', '06엑스큐션.png', '07실드 체이싱.png', '08아머 브레이크.png', '09블러디 임프리즌.png', '10사우전드 소드.png', '11인핸시드 익시드.png'],
	Dual_blade:['00 샤프 슬래시.png', '01토네이도 스핀.png', '02페이탈블로우.png', '03슬래시 스톰.png', '04플래시 뱅.png', '05블레이드 어센션.png', '06플라잉 어썰터.png', '07블러디 스톰.png', '08사슬지옥.png', '09파이널 컷.png', '10블레이드 퓨리.png', '11팬텀블로우.png', '12써든레이드.png', '13아수라.png', '14히든블레이드.png'],
	Lala:['00정기 뿌리기.png', '01잠 깨우기.png', '02산 꼬마.png', '03산의 씨앗.png', '04용맥 분출.png', '05용맥 흡수.png', '06넝쿨 타래.png', '07용맥의 자취.png'],
	Luminous:['00트윙클 플래쉬.png', '01다크 폴링.png', '02실피드 랜서.png', '03보이드 프레셔.png', '04스펙트럴 라이트.png', '05샤인 리뎀션.png', '06녹스피어.png', '07데스 사이드.png', '08라이트 리플렉션.png', '09모닝 스타폴.png', '10아포칼립스.png', '11앱솔루트 킬.png', '12아마겟돈.png'],
	Mercedes:['00스피드 듀얼샷,크로스 피어싱.png', '01차지 드라이브,파이널 샷,데몰리션,문썰트.png', '02스트라이크 듀얼샷,파이널 어택.png', '03리프 토네이도,거스트 다이브.png', '04유니콘 스파이크.png', '05엘리멘탈 나이트.png', '06이슈타르의 링.png', '07레전드리 스피어.png', '08라이트닝 엣지.png', '09래쓰 오브 엔릴.png'],
	Mechanic:['00드릴 러쉬.png', '01개틀링 샷.png', '02로켓 부스터.png', '03어드밴스트 개틀링 샷.png', '04호밍 미사일.png', '05로봇런처 RM7.png', '06로켓 펀치.png', '07마그네틱 필드.png', '08매시브파이어 SPLASH,IRON.png', '09서포트 웨이버 H-EX.png', '10워머신 타이탄.png', '11로봇 팩토리 RM1.png', '12매시브 파이어 SPLASH-F,IRON-B.png', '13디스토션 필드.png'],
	Mikhail:['00샤이닝 피어스.png', '01로얄 가드, ~.png', '02소울 어썰트.png', '03샤이닝 체이스, ~.png', '04소울 릴리즈.png', '05인스톨 실드, ~.png', '06샤이닝 크로스.png', '07데들리 차지.png', '08파이널 어택.png'],
	Viper:['00씨 서펜트 버스트,어썰트.png', '01쇼크 웨이브.png', '02터닝킥.png', '03스크류 펀치.png', '04씨 서펜트, 어썰트 인레이지.png', '05피스트 인레이지.png', '06전함 노틸러스.png', '07훅 봄버.png'],
	Battle_mage:['00트리플 블로우.png', '01데스.png', '02쿼드 블로우.png', '03다크 체인.png', '04데스 블로우.png', '05배틀 스퍼트.png', '06다크 라이트닝.png', '07피니쉬 블로우.png', '08다크 제네시스.png', '09배틀킹 바.png'],
	Bow_master:['00파이널어택.png', '01바람의 시.png', '02애로우 블로우.png', '03피닉스.png', '04리트리트샷.png', '05애로우 플래터,플레시 미라주.png', '06폭풍의 시.png', '07언카운터블 애로우.png', '08퀴버 카트리지.png', '09윈드 오브 프레이.png'],
	Bulldog:['00플레임 오브.png', '01포이즌 브레스.png', '02이그나이트.png', '03익스플로젼.png', '04포이즌 미스트.png', '05텔레포트 마스터리,포이즌리젼.png', '06플레임 헤이즈.png', '07미스트 이럽션.png', '08이프리트.png', '09플레임 스윔.png', '10메테오.png', '11메기도 플레임.png', '12파이어 오라.png'],
	Blaster:['00매그넘 펀치.png', '01리볼빙 캐논.png', '02릴리즈 파일벙커.png', '03익스플로젼 무브.png', '04더블 팡.png', '05해머 스매시.png', '06리프트 프레스,매그넘 캐논.png', '07쇼크 웨이브 펀치.png', '08플래시 무브.png', '09허리케인 믹서.png', '10리볼빙 벙커.png', '11하이퍼 매그넘 펀치.png'],
	Bishop:['00힐, 엔젤릭 터치.png', '01홀리 애로우.png', '02샤이닝 레이.png', '03빅뱅.png', '04바하뮤트.png', '05엔젤레이.png', '06제네시스,트라이엄프 페더.png', '07헤븐즈 도어,파운틴 포 엔젤.png'],
	Shadow:['00새비지 블로우.png', '01무스펠 하임.png', '02메소 익스플로젼.png', '03엣지 카니발.png', '04다크 플레어.png', '05암살.png', '06크루얼 스탭.png', '07써든레이드.png', '08베일 오브 섀도우.png'],
	Soul_Master:['00사일런트 무브,~.png', '01코믹스 매터.png', '02블레이징 어썰트,~.png', '03코믹스버스트.png', '04솔라 슬래시.png', '05소울 페네트레이션.png', '06코믹스 샤워.png', '07솔루나 슬래시.png'],
	Striker:['01.충아.png', '02.섬광.png', '03.회축.png', '04.파도,해파.png', '05.승천.png', '06.뇌성.png', '07.질풍.png', '08.섬멸.png', '09.벽력.png', '10.해신강림.png'],
	Jingu_Shrine:['00파이널어택.png', '01볼트 스위프트,프리져.png', '02애로우 블로우.png', '03리트리트샷.png', '04피어싱,인핸스 피어싱.png', '05스나이핑,인핸스 스나이핑.png', '06롱 레인지 트루샷,애로우 일루전.png'],
	Sun_call:['00썬더 볼트.png', '01콜드 빔.png', '02칠링 스텝.png', '03아이스 스트라이크.png', '04글레이셜 월.png', '05썬더 스피어.png', '06엘퀴네스.png', '07체인 라이트닝.png', '08블리자드.png', '09프로즌 오브.png', '10라이트닝 스피어.png'],
	Adele:['00플레인.png', '01샤드,원더.png', '02펀토.png', '03임페일,레조넌스,마커.png', '04크리에이션,게더링.png', '05크로스.png', '06테리토리,트레드.png', '07디바이드.png', '08오더,그레이브.png', '09블로섬,스콜.png'],
	Aran:['00스매쉬 웨이브.png', '01스매쉬 스윙.png', '02파이널 차지.png', '03파이널 어택.png', '04파이널 토스.png', '05롤링 스핀.png', '06저지먼트.png', '07게더링 캐쳐.png', '08파이널 블로우.png', '09비욘더.png', '10스톰 오브 피어.png', '11헌터즈 타겟팅.png', '12마하의 영역.png'],
	Arc:['00플레인 차지드라이브.png', '01잊혀지지 않는 악몽,잊혀지지 않는 흉몽.png', '02스칼렛 차지드라이브,지워지지 않는 상처.png', '03멈출 수 없는 충동,멈출 수 없는 본능.png', '04다가오는 죽음,돌아오는 증오.png', '05거스트 차지드라이브,채워지지 않는 굶주림.png', '06어비스 차지드라이브,걷잡을 수 없는 혼돈.png', '07기어 다니는 공포,황홀한 구속,끝없는 고통.png'],
	Evan:['00서클 오브 마나.png', '01드래곤 스파킹.png', '02서클 오브 윈드.png', '03드래곤 스위프트.png', '04서클 오브 썬더.png', '05드래곤 다이브.png', '06마법 잔해.png', '07서클 오브 어스.png', '08드래곤 브레스.png', '09다크 포그.png', '10드래곤 마스터.png', '11서먼 오닉스 드래곤.png'],
	Angelic_buster:['00석세서.png', '01버블 스타.png', '02스팅 익스플로젼.png', '03핑크 스커드.png', '04소울 시커.png', '05폴링 스타.png', '06랜드 크래시.png', '07프라이멀 로어.png', '08트리니티.png', '09피니투라 페투치아.png', '10소울 레조넌스.png', '11슈퍼 노바.png'],
	Wild_hunter:['00더블샷,트리플샷,와일드샷.png', '01서먼 재규어.png', '02클로우 컷.png', '03파이널 어택.png', '04크로스 로드,화이트 히트 러쉬.png', '05어시스턴트 헌팅 유닛.png', '06소닉 붐,재규어 소울.png', '07와일드 발칸.png', '08드릴 컨테이너.png', '09플래쉬 레인.png'],
	Windbreaker:['00브리즈 애로우.png', '01페어리 턴.png', '02거스트 샷.png', '03트라이플링 윔,스톰 윙.png', '04서리바람의 군무.png', '05핀포인트 피어스.png', '06천공의 노래.png', '07스파이럴 볼텍스.png', '08몬순.png', '09스톰 브링어.png'],
	Eun_Wol:['00섬권.png', '01파력권.png', '02파쇄철조 하.png', '03파쇄철조 전.png', '04여우령.png', '05통백권.png', '06파쇄철조 회.png', '07소혼 장막.png', '08속박술.png', '09환령 강신.png', '10폭류권.png', '11귀참.png', '12사혼 각인.png', '13분혼 격참.png', '14정령의 화신.png'],
	Illium:['00크래프트_자벨린2, 글로리 윙.png', '01커스 마크 완성.png', '02리액션_디스트럭션2.png', '03마키나, 리액션 도미네이션2.png', '04글로리 윙.png', '05크래프트 롱기누스.png', '06롱기누스 존.png', '07데우스, 리요.png'],
	Xenon:['00에너지 스플라인.png', '01핀포인트 로켓.png', '02퀵실버 소드.png', '03이온 쓰러스터.png', '04컴뱃 스위칭.png', '05다이아그널 체이스.png', '06필라 스크램블.png', '07이지스 시스템.png', '08트라이앵글 포메이션.png', '09블레이드 댄싱.png', '10퍼지롭 매스커레이드.png', '11홀로그램 그래피티.png', '12컨파인 인탱글.png', '13멜트다운 익스플로젼.png'],
	Zero:['00문 스트라이크,어퍼 슬래시.png', '01피어스 쓰러스트,파워 스텀프.png', '02플래시 어썰터,프론트 슬래시.png', '03스핀 커터,스로잉 웨폰.png', '04롤링 커브,터닝 드라이브.png', '05롤링 어썰터,휠 윈드.png', '06윈드 커터,기가 크래시.png', '07윈드 스트라이크,점핑 크래시.png', '08스톰 브레이크,어스 브레이크.png', '09쉐도우 레인.png'],
	Cadena:['00스트로크,터프 허슬,웨폰 버라이어티.png', '01서먼 커팅 시미터,서먼 스크래칭 클로.png', '02서먼 슬래싱 나이프,서먼 스로잉 윙대거.png', '03서먼 슈팅 샷건,서먼 릴리싱 봄.png', '04서먼 스트라이킹 브릭.png', '05테이크다운.png', '06서먼 비팅 니들배트.png', '07크러시,프로페셔널 에이전트.png'],
	Kaiser:['00드래곤슬래시.png', '01플레임 샷.png', '02임팩트 웨이브.png', '03피어스 러쉬.png', '04윌 오브 소드.png', '05윙비트.png', '06체인풀링.png', '07페트리파이드.png', '08기가 슬래셔.png', '09블루 스트릭.png', '10소드 스트라이크.png', '11인퍼널 브레스.png', '12프로미넌스.png'],
	Cain:['00스트라이크 애로우,체이싱 샷.png', '01스캐터링 샷.png', '02드래곤 팡,리메인 인센스.png', '03샤프트 브레이크.png', '04팬텀 블레이드,테어링 나이프.png', '05데스 블레싱,스니키 스나이핑.png', '06폴링 더스트.png', '07체인 시클,포이즌 니들.png'],
	Cannon_shooter:['00캐논 스플래셔.png', '01펀칭캐논.png', '02기간틱 백스탭.png', '03슬러그샷.png', '04몽키 러쉬붐.png', '05캐논 스파이크.png', '06캐논 점프.png', '07오크통 룰렛.png', '08몽키 퓨리어스,미니 캐논볼.png', '09캐논 바주카.png', '10전함 노틸러스.png', '11마그네틱 앵커.png', '12서포트 몽키 트윈스.png', '13캐논 버스터.png', '14롤링 캐논 레인보우.png'],
	Captain:['00매그넘 샷.png', '01백스텝샷.png', '02서먼 크루,어셈블 크루.png', '03더블 배럴 샷.png', '04불릿 스매시.png', '05시즈 봄버.png', '06래피드 파이어.png', '07전함 노틸러스.png', '08헤드샷.png', '09퍼실레이드.png', '10캡틴 디그니티.png', '11배틀쉽 봄버.png', '12컨티뉴얼 에이밍.png', '13스트레인지 봄.png'],
	Kinesis:['00싸이킥 포스.png', '01크래시.png', '02매드크래시.png', '03얼티메이트 딥임팩트.png', '04싸이킥 드레인.png', '05싸이킥 그랩.png', '06얼티메이트 트레인.png', '07텔레키네시스.png', '08싸이코 브레이크.png', '09얼티메이트-BPM.png', '10에버싸이킥.png', '11싸이코 메트리.png', '12얼티메이트 메테리얼.png'],
	Paladin:['00파이널 어택.png', '01디바인 스윙.png', '02페이지 오더.png', '03디바인 저지먼트, 스티그마.png', '04리프어택_돌진_어퍼 차지.png', '05디바인 차지.png', '06블래스트.png', '07생츄어리.png', '08스마이트.png'],
	Pathfinder:['01카디널 디스차지,에디셔널 디스차지.png', '02카디널 블래스트,에디셔널 블래스트.png', '03카디널 트랜지션.png', '04레이븐.png', '05스플릿 미스텔.png', '06트리플 임팩트.png', '07엣지 오브 레조넌스.png', '08콤보 어썰트.png', '09에인션트 아스트라.png'],
	Phantom:['00더블 피어싱.png', '01콜 오브 페이트.png', '02브리즈 카르트.png', '03블랑 카르트.png', '04코트 오브 암즈.png', '05팬텀 차지.png', '06얼티밋 드라이브.png', '07트와일라이트.png', '08템페스트 오브 카드.png', '09로즈 카르트 피날레.png', '10탤런트 오브 팬텀시프1.png', '11탤런트 오브 팬텀시프2.png', '12탤런트 오브 팬텀시프3.png', '13탤런트 오브 팬텀시프4.png'],
	Flame_Wizard:['00오비탈 플레임.png', '01플레임 바이트.png', '02플레임 볼텍스.png', '03오비탈 익스플로젼.png', '04플레임 템페스타.png', '05마엘스트롬.png', '06블레이징 익스팅션.png', '07인페르노라이즈.png', '08카타클리즘.png', '09피닉스 드라이브.png'],
	Hoyoung:['00여의선 인, 금고봉 인.png', '01토파류,지진쇄.png', '02파초풍,멸화염.png', '03마봉 호로부,둔갑 천근석.png', '04추적 귀화부.png', '05권술 미생강변.png', '06권술 호접지몽.png', '07권술 흡성와류.png', '08환영 분신부,선기 둔갑 태을선인.png'],
	Hero:['00파이널 어택.png', '01브랜디쉬.png', '02플래시 슬래시.png', '03브레이브 슬래시.png', '04리프어택,돌진,어퍼차지.png', '05발할라.png', '06오라 블레이드.png', '07레이징 블로우.png', '08인사이징.png', '09레이지 업라이징.png'],

}
