let SESSION=document.getElementsByName('session_id')[0].value;
let combi_size=document.querySelector("input[name=combi_size]").value;
let combi_set=document.querySelector("input[name=combi_set]").value.split(",");
let skill_level_list=document.getElementsByName('skill_level')[0].value.split(",");
let essential_skill=document.getElementsByName('essential_skill')[0].value.split(",");

let combi_arr=[];
let detail_skill=document.getElementsByName('skill_arr_detail')[0].value.split(",");
let detail_arr=[];
let filter_index_list=[];
let all_index_list=[];
let nesting_arr=[];
let level_arr=[];
for(let i=0;i<detail_skill.length;i=i+combi_size*3){
	tmp=[];
	for(let j=0;j<combi_size*3;j=j+3){
		tmp.push(detail_skill[i+j]);
		tmp.push(detail_skill[i+j+1]);
		tmp.push(detail_skill[i+j+2]);
	}
	detail_arr.push(tmp);
}

for(let i=0;i<combi_set.length;i=i+parseInt(combi_size)){
	let tmp_arr=[];
	for(let j=0;j<combi_size;j++){
		tmp_arr.push(combi_set[i+j]);
	}
	combi_arr.push(tmp_arr);
}
function skill_table(job,skill_level){
	let JsonData = document.getElementById("job_skill_class").value;
	let myJsonData = JSON.parse(JsonData);

	let string_job=job.value;
	let skill_list=myJsonData[job.value];
	skill_level=skill_level.value;
	skill_level=skill_level.split(",").map(Number);
	if(skill_list!=null){
		insert_table_list='';
		tmp='';
		for(let i=0;i<skill_list.length;i++){
			tmp=tmp+`<td class="col-md-1"><img src="./maple_img/${string_job}/${skill_list[i]}" />${skill_list[i].slice(0,2)}:${skill_list[i].slice(2,skill_list[i].length-4)}<span style="float:right;padding-right:10px;">예상레벨:${skill_level[i]}</span></td>`;
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

function result_table(job){
	let JsonData = document.getElementById("job_skill_class").value;
	let myJsonData = JSON.parse(JsonData);

	let string_job=job.value;
	let skill_list=myJsonData[job.value];
	if(skill_list!=null){
		insert_table_list='<td style="background-color: black;color: white" id="result_id">결과표</td><td colspan="3" style="background-color: black;color: white">조합 : <span id="result_combi"></span></td><tr></tr>';
		tmp='';
		for(let i=0;i<skill_list.length;i++){
			let color_td='';
			if(essential_skill.indexOf(i+'')!=-1){
				color_td='style="background-color: rgb(255, 255, 128);"';
			}
			tmp=tmp+`<td class="col-md-1" ${color_td}><img src="./maple_img/${string_job}/${skill_list[i]}" />${skill_list[i].slice(2,skill_list[i].length-4)}<span id="result_skill_level${i}" style="float:right">0</span></td>`;
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

function filter_table(job){
	let JsonData = document.getElementById("job_skill_class").value;
	let myJsonData = JSON.parse(JsonData);
	let option_form_min=`<select class="selectpicker" name='min_limit' onchange='min_max_limit_change(0)'><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option></select>`;
	let option_form_max=`<select class="selectpicker" name='max_limit'onchange='min_max_limit_change(1)'><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option></select>`;
	let option_form_level=`<select class="selectpicker" name='level_limit'>`;
	let all_level=`<select class="selectpicker" name='all_level' onchange="es_min_max(3)">`;
	for(let i=0;i<51;i++){
		option_form_level=option_form_level+`<option>${i}</option>`;
		all_level=all_level+`<option>${i}</option>`;
	}
	option_form_level=option_form_level+`</select>`;
	all_level=all_level+`</select>`;
	string_job=job.value;
	skill_list=myJsonData[job.value];
	if(skill_list!=null){
		insert_table_list='<td style="background-color: black;color: white">필터창</td><td colspan="3" style="background-color: black;color: white"><span></span></td><tr></tr>';
		tmp='';
		for(let i=0;i<skill_list.length;i++){
			let color_td='';
			if(essential_skill.indexOf(i+'')!=-1){
				color_td='style="background-color: rgb(255, 255, 128);"';
			}
			tmp=tmp+`<td class="col-md-1" ${color_td}><img src="./maple_img/${string_job}/${skill_list[i]}" />${skill_list[i].slice(2,skill_list[i].length-4)}<br><span style="float:right">${option_form_min}~${option_form_max}중첩, ${option_form_level}레벨 이상</span></td>`;
			if(i%2==1){
				insert_table_list=insert_table_list+"<tr>"+tmp+"</tr>";
				tmp='';
			}
		}
		if(skill_list.length%2!=0){
			insert_table_list=insert_table_list+"<tr>"+tmp+"<td></td></tr>";
			tmp='';
		}
		insert_table_list=insert_table_list+`<tr><td></td><td style="float:right; background-color: black;color: white">필수스킬 전체 적용 : <select class="selectpicker" name='all_min' onchange="es_min_max(0)"><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option></select>~<select class="selectpicker" name='all_max' onchange="es_min_max(1)"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option></select>중첩,${all_level}레벨 이상</td></tr>`;
		tmp='';
		insert_table_list=insert_table_list+"<tr>"+'<td><center><button id="left_button" class="btn btn-primary btn-block" onclick="filter_starting(0)">전체 조합에 대한 필터 시작하기!</button></center></td><td class="col-md-1"><center><button id="right_button"class="btn btn-primary btn-block" onclick="filter_starting(1)">필터된 조합들에 대한 필터 시작하기!</button></center></td>'+"</tr>";
		document.querySelector('filter_table').innerHTML=`<table class="table table-striped">${insert_table_list}</table>`;
	}
	else{
		document.querySelector('filter_table').innerHTML='';
	}
	max_limit=document.getElementsByName('max_limit');
	for(let i=0;i<max_limit.length;i++){
		max_limit[i].value=6;
	}
	//console.log(document.getElementsByName('min_limit').length);
}

function check_button(i,detail,skill_level){
	document.getElementById('result_combi').innerHTML=combi_arr[i];
	document.getElementById('result_id').innerHTML="결과표 : "+i;
	let tmp_main_core=[];
	for(let j=0;j<detail_arr[i].length;j=j+3){
		tmp_main_core.push(detail_arr[i][j]);
	}
	 for(let j=0;j<level_arr[i].length;j++){
		 let main='';
		if(tmp_main_core.indexOf(j+'')!=-1){
			main='(메인)';
		}
	 	document.getElementById("result_skill_level"+j).innerHTML= `${main} ${level_arr[i][j]}레벨 ${nesting_arr[i][j]}중첩`;
	 }		
}

function min_max_limit_change(check){
	let min_limit=document.getElementsByName('min_limit');
	let max_limit=document.getElementsByName('max_limit');
	for(let i=0;i<min_limit.length;i++){
		if(max_limit[i].value<min_limit[i].value){
			if(check==0){
				max_limit[i].value=min_limit[i].value;
			}
			else{
				min_limit[i].value=max_limit[i].value;
			}
		}
		//console.log(min_limit[i].value);
		//console.log(max_limit[i].value);
	}
}

function init_info(){
	let log_nesting_arr=[];
	let log_level_arr=[];
	let skill_size=skill_level_list.length;
	for(let i=0;i<detail_arr.length;i++){
		let tmp_nesting=new Array(skill_size).fill(0);
		let tmp_level=new Array(skill_size).fill(0);

		for(let j=0;j<detail_arr[i].length;j=j+3){
			let level=parseInt(skill_level_list[detail_arr[i][j]]);
			tmp_level[detail_arr[i][j]]=tmp_level[detail_arr[i][j]]+level;
			tmp_level[detail_arr[i][j+1]]=tmp_level[detail_arr[i][j+1]]+level;
			tmp_level[detail_arr[i][j+2]]=tmp_level[detail_arr[i][j+2]]+level;
			tmp_nesting[detail_arr[i][j]]=tmp_nesting[detail_arr[i][j]]+1;
			tmp_nesting[detail_arr[i][j+1]]=tmp_nesting[detail_arr[i][j+1]]+1;
			tmp_nesting[detail_arr[i][j+2]]=tmp_nesting[detail_arr[i][j+2]]+1;	
		}
		log_nesting_arr.push(tmp_nesting);
		log_level_arr.push(tmp_level);
	}
	level_arr=log_level_arr;
	nesting_arr=log_nesting_arr;
}

function setting_filter(){
	let tmp_html='<div style="width: 100%; height:300px; overflow-y:auto; overflow-x: hidden;"><table class="table">';
	for(let i = 0; i < filter_index_list.length; i++){
		tmp_html=tmp_html+`<tr>`;
		tmp_html=tmp_html+`<th scope="row" class="text-center" valign="middle">${i}</th>`;
		for(let j=0;j<combi_arr[filter_index_list[i]].length;j++){
			tmp_html=tmp_html+`<td><img style="float:left;padding-right:5px;"src="./tmp/${SESSION}/skill${combi_arr[filter_index_list[i]][j]}.png" />`;
			tmp_html=tmp_html+`<div> 위치: ${combi_arr[filter_index_list[i]][j]}<br>메인스킬: ${detail_arr[filter_index_list[i]][3*j]}번<br>보조스킬: ${detail_arr[filter_index_list[i]][3*j+1]}, ${detail_arr[filter_index_list[i]][3*j+2]}번</div></td>`;
		}
		tmp_html=tmp_html+`<td style="padding: auto; width:8%"><button class="btn btn-primary btn-block" style="font-size:12px;" onclick="check_button(${filter_index_list[i]})">${i} : 확인</button></td>`;
		tmp_html=tmp_html+`</tr>`;
		if(i>100){
			break;
		}
	}
	tmp_html=tmp_html+`</table></div>`;
	document.querySelector('filter_start').innerHTML=tmp_html;
	document.getElementById("info_100").innerText=`최대 100가지 조합을 보여줍니다 ▼  찾아낸 조합 : ${combi_arr.length} | 필터 후 남은 조합 : ${filter_index_list.length}`;
}

function filter_starting(check){
	let min_limit=document.getElementsByName('min_limit');
	let max_limit=document.getElementsByName('max_limit');
	let level_limit=document.getElementsByName('level_limit');
	let target_index=[];
	let new_filter_index_list=[];

	if(check==0){
		target_index=all_index_list;
	}
	else{
		target_index=filter_index_list;
	}
	for(let i=0;i<target_index.length;i++){
		index=target_index[i];
		let check=1;
		//nesting_arr[index] level_arr[index]

		for(let j=0;j<level_arr[index].length;j++){
			if(!(level_arr[index][j]>=level_limit[j].value && nesting_arr[index][j]>=min_limit[j].value && nesting_arr[index][j]<=max_limit[j].value)){
				check=0;
				break;
			}
		}
		if(check==1){
			new_filter_index_list.push(index);
		}
	}
	if(new_filter_index_list.length==0){
		alert("결과를 찾을 수 없었습니다. \n");
	}
	else{
		filter_index_list=new_filter_index_list;
	}
	setting_filter();
}
function es_min_max(check){
	let min_limit=document.getElementsByName('all_min')[0].value;
	let max_limit=document.getElementsByName('all_max')[0].value;
	let level_limit=document.getElementsByName('all_level')[0].value;
	if(check==0){
		for(let i=0;i<essential_skill.length;i++){
			document.getElementsByName('min_limit')[essential_skill[i]].value=min_limit;
		}
		min_max_limit_change(0);
	}else if(check==1){
		for(let i=0;i<essential_skill.length;i++){
			document.getElementsByName('max_limit')[essential_skill[i]].value=max_limit;
		}
		min_max_limit_change(1);
	}
	else{
		for(let i=0;i<essential_skill.length;i++){
			document.getElementsByName('level_limit')[essential_skill[i]].value=level_limit;
		}
	}
}


window.onpageshow=function(event){
	document.querySelector("combi_label").innerHTML=`<h3>발견된 총 조합 : ${combi_arr.length}개</h3>`;
	document.getElementById("info_100").innerText=`최대 100가지 조합을 보여줍니다 ▼  찾아낸 조합 : ${combi_arr.length} | 필터 후 남은 조합 : ${combi_arr.length}`;
	for(let i=0;i<combi_arr.length;i++){
		filter_index_list.push(i);
		all_index_list.push(i);
	}
	init_info();
	skill_table(document.querySelector("input[name=job]"),document.querySelector("input[name=skill_level]"));
	result_table(document.querySelector("input[name=job]"));
	filter_table(document.querySelector("input[name=job]"));
	// console.log(detail_arr);
	// console.log(combi_arr);
	// console.log(skill_level_list);
	// console.log(nesting_arr);
	// console.log(level_arr);
	// console.log(essential_skill);
}

