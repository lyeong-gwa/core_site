function skill_table(job,skill_level){
	string_job=job.value;
	skill_list=job_skill(job.value)
	skill_level=skill_level.value
	skill_level=skill_level.split(",").map(Number);
	if(skill_list!=null){
		insert_table_list='';
		tmp='';
		for(let i=0;i<skill_list.length;i++){
			tmp=tmp+`<td class="col-md-1"><img src="./maple_img/${string_job}/${skill_list[i]}" />${skill_list[i].slice(0,2)}:${skill_list[i].slice(2,skill_list[i].length-4)}<span style="float:right;padding-right:10px;">예상레벨:${skill_level[i]}</span></td>`;
			if(i%4==3){
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
function job_skill(job){
	let filelist=null;
	switch(job){
		case 'adel':
		filelist=[
			'00플레인.png',
			'01샤드,원더.png',
			'02펀토.png',
			'03임페일,레조넌스,마커.png',
			'04크리에이션,게더링.png',
			'05크로스.png',
			'06테리토리,트레드.png',
			'07디바이드.png',
			'08오더,그레이브.png',
			'09블로섬,스콜.png'
		  ]
		break;
	}
	return filelist;
}

function result_table(job){
	string_job=job.value;
	skill_list=job_skill(job.value)
	if(skill_list!=null){
		insert_table_list='<td style="background-color: black;color: white" id="result_id">결과표</td><td colspan="3" style="background-color: black;color: white">조합 : <span id="result_combi"></span></td><tr></tr>';
		tmp='';
		for(let i=0;i<skill_list.length;i++){
			tmp=tmp+`<td class="col-md-1"><img src="./maple_img/${string_job}/${skill_list[i]}" />${skill_list[i].slice(2,skill_list[i].length-4)}<span id="result_skill_level${i}" style="float:right">0</span></td>`;
			if(i%4==3){
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

window.onpageshow=function(event){
	skill_table(document.querySelector("input[name=job]"),document.querySelector("input[name=skill_level]"));
	result_table(document.querySelector("input[name=job]"));
}