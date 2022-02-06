import json
from itertools import product, combinations
import os
from ast import literal_eval
import sys

def core_calc(json_obj):
    product_list=list(combinations(json_obj["main_list"],min(int(json_obj["core_num"]),len(json_obj["main_list"]))))
    combi_set=[]
    for tmp_list in product_list:
        for tmp_set in list(product(*tmp_list)):
            combi_set.append(list(tmp_set))
        if len(combi_set)>2000000:
            break
    return combi_set

inputs = sys.argv[1]
inputs = json.loads(inputs)
input_str=json.dumps(inputs).replace('\\',"")[1:-1]
input_dict=literal_eval(input_str)

output = core_calc(input_dict)
send_output = json.dumps(output, ensure_ascii=False)

print(send_output)
