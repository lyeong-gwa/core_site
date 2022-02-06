import sys
import base64
import numpy as np
import cv2
from PIL import Image
from io import BytesIO
import json
from ast import literal_eval
import os 
import time
import random
import pandas as pd
import matplotlib.pyplot as plt
from pandas import Series
from itertools import product
from itertools import combinations
import itertools
from collections import OrderedDict
from numpyencoder import NumpyEncoder
import shutil
from skimage.metrics import structural_similarity as ssim
import natsort
class page:
    def __init__(self,page_image):
        self.page_image=page_image

def search_image(base,template_arr,thr=0.90): #pil형 이미지 두개 input base이미지에 template 이미지가 있다면 true
        imgray = cv2.cvtColor(np.array(base),cv2.COLOR_BGR2GRAY)
        return_value=-1
        for temp in template_arr:
            template=cv2.cvtColor(np.array(temp),cv2.COLOR_BGR2GRAY)
            w,h = template.shape[::-1]
            res=cv2.matchTemplate(imgray,template,cv2.TM_CCOEFF_NORMED)
            loc = np.where(res>=thr)
            if len(loc[0])==1:
                return_value=template_arr.index(temp)
                break
        return return_value        
        

def skill_level(base,template_arr,skill_check=False): #pil형 이미지 두개 input base이미지에 template 이미지가 있다면 true
    if skill_check==False:
        base_cut=base
    else:
        base_cut=base.crop((10,3,30,13))
    imgray = cv2.cvtColor(np.array(base_cut),cv2.COLOR_BGR2GRAY)
    return_value=[]
    for temp in template_arr:
        template=cv2.cvtColor(np.array(temp),cv2.COLOR_BGR2GRAY)
        return_value.append(round(ssim(imgray,template),5))

    if max(return_value) <0.85 :
        return -1
    return return_value.index(max(return_value))   
        
        
        
        

def Matching(base_page,target_image='zero_target.png',thr=0.9): #페이지 1차가공 page배열에 강화코어 좌표를 붙여서 리턴
    array_return=[]
    count=0
    template = cv2.imread(target_image,cv2.IMREAD_GRAYSCALE)
    font_count=0
    for i_base in base_page:
        imgray = cv2.cvtColor(np.array(i_base.page_image),cv2.COLOR_BGR2GRAY)
        w,h = template.shape[::-1]
        
        res=cv2.matchTemplate(imgray,template,cv2.TM_CCOEFF_NORMED)
        loc = np.where(res>=thr)
        base= cv2.cvtColor(np.array(i_base.page_image),cv2.COLOR_RGB2BGR)
        base= cv2.cvtColor(np.array(base),cv2.COLOR_RGB2BGR)
        for pt in zip(*loc[::-1]):
            #cv2.rectangle(base,pt,(pt[0]+w,pt[1]+h),(0,0,255),2)
            cv2.putText(base, str(font_count), pt, cv2.FONT_HERSHEY_DUPLEX, 0.8,(155,0,0), 2, cv2.LINE_AA)
            font_count=font_count+1
        
        if len(loc[::-1][0])>0:
            x_min=min(loc[::-1][0])
            x_max=max(loc[::-1][0])
            y_min=min(loc[::-1][1])
            y_max=max(loc[::-1][1])
            x_min=max(50,x_min)
            y_min=max(30,y_min)
            i_base.user_page_image=Image.fromarray(base[y_min-30:y_max+90,x_min-50:x_max+75])

        else:             
            i_base.user_page_image=Image.fromarray(base)
        #cv2.imwrite('result_image/result{}.png'.format(count), base)
        base_page[count].x=loc[1]
        base_page[count].y=loc[0]
        count=count+1    
    return base_page



def Skill_cutting(page_arr):#page_arr에 스킬이미지 정보드 붙임
    count=0
    for page in page_arr:
        img_return=[]
        for x,y in zip(page.x,page.y):
            img_return.append(page.page_image.crop((x-10,y-6,x+30,y+44)))
        page_arr[count].skill_image=img_return
        count=count+1
    return page_arr




def skill_classification(job,page_arr): # 'adel', page배열넣기
    left_name = os.listdir(job+"/left/")
    right_name = os.listdir(job+"/right/")
    top_name = os.listdir(job+"/top/")
    level_map = os.listdir("level/")
    
    left_name = natsort.natsorted(left_name)
    right_name = natsort.natsorted(right_name)
    top_name = natsort.natsorted(top_name)
    level_map = natsort.natsorted(level_map)
    
    left_image=[]
    right_image=[]
    top_image=[]
    level_image=[]
    for i,j,k in zip(left_name,right_name,top_name):
        left_image.append(Image.open(job+"/left/"+i))
        right_image.append(Image.open(job+"/right/"+j))
        top_image.append(Image.open(job+"/top/"+k))
    
    for i in level_map:
        level_image.append(Image.open("level/"+i))

    page_count=0
    for page in page_arr:
        page.skill_kinds=len(os.listdir(job+"/left/"))
        page_arr[page_count].skill_arr=[]
        for skill in page.skill_image:
            tmp=[]
            tmp_left=skill.crop((6,31,20,45))
            tmp_top=skill.crop((13,17,27,26))
            tmp_right=skill.crop((21,31,34,45))
            tmp.append(skill_level(tmp_left,left_image))
            tmp.append(skill_level(tmp_top,top_image))
            tmp.append(skill_level(tmp_right,right_image))
            page_arr[page_count].skill_arr.append(tmp)
        
        #코어레벨 측정하는 공간!
        page_arr[page_count].skill_level=[]
        for skill in page.skill_image:
            page_arr[page_count].skill_level.append(skill_level(skill,level_image,True)+1)
        page_count=page_count+1



def MakeDF(paged):#중복제외한 강화코어 출력
    df = pd.DataFrame(columns=range(paged[0].skill_kinds+3))
    count=0
    for page in paged:
        skill_count=0
        for skill_label in page.skill_arr:
            tmp=np.zeros(page.skill_kinds+3,dtype=np.int32)
            tmp[skill_label[0]]=1
            tmp[skill_label[1]]=1
            tmp[skill_label[2]]=1
            tmp[-1]=count
            tmp[-2]=skill_label[0]
            tmp[-3]=page.skill_level[skill_count]
            skill_count=skill_count+1
            df.loc[len(df)] = tmp
            count=count+1
    s= df.iloc[:,-3]=df.iloc[:,-3].replace(Series(data=[1,3,4,6,8,10,13,15,19,22,26,30,34,                                              
                                                        39,44,49,55,61,67,74,80,88,95,103,111], index=range(1,26)))
    #df.to_csv("level.csv")
    df.iloc[:,-3]=df.iloc[:,-2].replace(df.groupby(df.iloc[:,-2]).sum().iloc[:,0])
    df=df.drop(df[df.iloc[:,-2]==-1].index)
    df=change_down_level(df)
    #df.to_csv("level.csv")
    s= df.iloc[:,-3]=df.iloc[:,-3].replace(Series(data=range(1,26), index=[1,3,4,6,8,10,13,15,19,22,26,30,34,                                              
                                                        39,44,49,55,61,67,74,80,88,95,103,111]))
    #df.to_csv("level.csv")
    df=df.drop_duplicates(range(paged[0].skill_kinds+1),keep='first')

    #df.to_csv("level_after.csv")
    df=df.reset_index()
    df=df.drop("index", axis=1)
    
    return df

def change_down_level(df):
    tmp=df.iloc[:,-3]
    tmpp=[]
    count_arr=[1,3,4,6,8,10,13,15,19,22,26,30,34,39,44,49,55,61,67,74,80,88,95,103,111]
    count_arr= sorted(count_arr,reverse=True)
    for i in tmp:
        for j in count_arr:
            if min(i,j)==i and i!=j:
                if i==j:
                    tmpp.append(j)
                    break
                else:
                    continue
            else :
                tmpp.append(j)
                break
    df.iloc[:,-3]=tmpp
    return df
    
def Make_skill_list(df):
    core_arr=[]
    for i in np.unique(df.iloc[:,-2].values):
        a=list(np.array(df[df.iloc[:,-2]==i].iloc[:,-1]))
        if len(a)!=0:
            core_arr.append(a)
    return core_arr
    

def return_core_combi(input_img,job):
    paged= Skill_cutting(Matching(input_img))
    skill_classification(job,paged)
    df = MakeDF(paged)
    skill_arr = change_table(df,paged)

    return paged,df,skill_arr

def createDirectory(directory): 
    if not os.path.exists(directory): 
        os.makedirs(directory) 

def change_table(table,paged):
    output=[]
    skill_arr=[]
    for i in paged:
        skill_arr=skill_arr+i.skill_arr

    for row in table.iterrows():
        tmp=skill_arr[np.array(row[1])[-1]]
        tmp.append(np.array(row[1])[-3])
        tmp.append(np.array(row[1])[-1])
        output.append(tmp)
    return output

# base64 받음
inputs = sys.argv[1]
inputs = json.loads(inputs)
input_str=json.dumps(inputs).replace('\\',"")[1:-1]
input_dict=literal_eval(input_str)


input_ID=input_dict['ID']
file_name=input_dict['img_path']
input_img=[]
for i in file_name:
    input_img.append(page(Image.open(i)))
job=input_dict['job']


os.chdir("./maple_python")
page_info,df,skill_arr=return_core_combi(input_img,"job/"+job)
os.chdir("../")

for i in file_name:
    os.remove(i)
createDirectory("public/tmp/"+input_ID)

count_1 = 0
count_2 = 0
cv_img_path=[]
for tmp_page in page_info:
    tmp_page.user_page_image.save("public/tmp/"+input_ID+"/"+str(count_1)+".png")
    cv_img_path.append("./tmp/{}/{}.png".format(input_ID,count_1))
    count_1=count_1+1
    for tmp_skill_img in tmp_page.skill_image:
        tmp_skill_img.save("public/tmp/"+input_ID+"/skill"+str(count_2)+".png")
        count_2=count_2+1
    
send_json=OrderedDict()
send_json['job']=input_dict['job']
send_json['session_ID']=input_ID
send_json['skill_arr']=skill_arr
send_json['cv_img_path']=cv_img_path
send_final=json.dumps(send_json, ensure_ascii=False, cls= NumpyEncoder)

print(send_final)
