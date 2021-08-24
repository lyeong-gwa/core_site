combi_set=document.querySelector("input[name=combi_set]").value.split(",")
combi_size=document.querySelector("input[name=combi_size]").value
combi_arr=[]
for(let i=0;i<combi_set.length;i=i+parseInt(combi_size)){
	tmp_arr=[]
	for(let j=0;j<combi_size;j++){
		tmp_arr.push(combi_set[i+j])
	}
	combi_arr.push(tmp_arr)
}
function skill_table(job,skill_level){
	let JsonData = document.getElementById("job_skill_class").value;
	let myJsonData = JSON.parse(JsonData);

	string_job=job.value;
	skill_list=myJsonData[job.value];
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

	string_job=job.value;
	skill_list=myJsonData[job.value];
	if(skill_list!=null){
		insert_table_list='<td style="background-color: black;color: white" id="result_id">결과표</td><td colspan="3" style="background-color: black;color: white">조합 : <span id="result_combi"></span></td><tr></tr>';
		tmp='';
		for(let i=0;i<skill_list.length;i++){
			tmp=tmp+`<td class="col-md-1"><img src="./maple_img/${string_job}/${skill_list[i]}" />${skill_list[i].slice(2,skill_list[i].length-4)}<span id="result_skill_level${i}" style="float:right">0</span></td>`;
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
	let option_form_min=`<select class="selectpicker" name='min_limit' onchange='min_max_limit_change(0)'><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option></select>`;
	let option_form_max=`<select class="selectpicker" name='max_limit'onchange='min_max_limit_change(1)'><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option></select>`;
	let option_form_level=`<select class="selectpicker" name='level_limit'>`;
	for(let i=1;i<51;i++){
		option_form_level=option_form_level+`<option>${i}</option>`
	}
	option_form_level=option_form_level+`</select>`
	string_job=job.value;
	skill_list=myJsonData[job.value];
	if(skill_list!=null){
		insert_table_list='<td style="background-color: black;color: white">필터창</td><td colspan="3" style="background-color: black;color: white"><span></span></td><tr></tr>';
		tmp='';
		for(let i=0;i<skill_list.length;i++){
			tmp=tmp+`<td class="col-md-1"><img src="./maple_img/${string_job}/${skill_list[i]}" />${skill_list[i].slice(2,skill_list[i].length-4)}<span style="float:right">${option_form_min}~${option_form_max}중첩, ${option_form_level}레벨 이상</span></td>`;
			if(i%2==1){
				insert_table_list=insert_table_list+"<tr>"+tmp+"</tr>";
				tmp='';
			}
		}
		if(skill_list.length%2!=0){
			insert_table_list=insert_table_list+"<tr>"+tmp+"<td></td></tr>";
			tmp='';
		}
		insert_table_list=insert_table_list+"<tr>"+'<td></td><td class="col-md-1"><button class="btn btn-primary btn-block">필터시작!</button></td>'+"</tr>";
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

function check_button(i,combi,detail,skill_level){
	document.getElementById('result_combi').innerHTML=combi;
	document.getElementById('result_id').innerHTML="결과표 : "+i;
	detail=detail.split(",").map(Number);
	skill_level=skill_level.split(",").map(Number);
	final_result_skill_level=Array.apply(null, new Array(skill_level.length)).map(Number.prototype.valueOf,0);
	result_return=[];
	for(let i=0;i<detail.length/3;i++){
		result_return[3*i] = skill_level[detail[i*3]] ;
		result_return[3*i+1] = skill_level[detail[i*3]];
		result_return[3*i+2] = skill_level[detail[i*3]];
	}

	for(let i=0;i<detail.length;i++){
		final_result_skill_level[detail[i]]=final_result_skill_level[detail[i]]+result_return[i];
	}

	for(let i=0;i<final_result_skill_level.length;i++){
		document.getElementById("result_skill_level"+i).innerHTML= final_result_skill_level[i];
	}		
}

function min_max_limit_change(check){
	min_limit=document.getElementsByName('min_limit');
	max_limit=document.getElementsByName('max_limit');
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


window.onpageshow=function(event){
	document.querySelector("combi_label").innerHTML=`<h3>발견된 총 조합 : ${combi_arr.length}개</h3>`;
	document.getElementById("info_100").innerText=`최대 100가지 조합을 보여줍니다 ▼  찾아낸 조합 : ${combi_arr.length} | 필터 후 남은 조합 : ${combi_arr.length}`;

	skill_table(document.querySelector("input[name=job]"),document.querySelector("input[name=skill_level]"));
	result_table(document.querySelector("input[name=job]"));
	filter_table(document.querySelector("input[name=job]"));
}