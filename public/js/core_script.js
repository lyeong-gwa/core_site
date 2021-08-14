
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

document.querySelector("#info").addEventListener("submit",bansubmit);

 function bansubmit(A){
	let chkList = document.querySelectorAll("input[name=skill_box]:checked");
	let chkprofile = document.querySelector("input[name=profile_pt]").value;
	if(chkList.length<1){
		alert("강화스킬를 선택해주세요!");
		A.preventDefault();
	}else if(chkprofile==''){
		alert("코어창 상태이미지를 업로드해주세요!");
		A.preventDefault();
	}
 }

window.onpageshow=function(event){
	skill_table(document.querySelector("select[name=job]"));
}