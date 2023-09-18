import json
import requests
import os
import shutil
import sys
from makeFileFunc.function import copy_file_content, replace_word_in_file, replace_word_to_array
from makeDBFunc.function import create_content_db_postgre, create_content_model_postgre

# copy file 함수
def copy_folder(src_folder, dst_folder):
    if (os.path.isdir(dst_folder)):
        print("exist")
        shutil.rmtree(dst_folder)
    shutil.copytree(src_folder, dst_folder)

def copy_main_file(router_name):
    copy_file_content('postgresql/txt/main.txt', 'build/postgresql/src/app/main.py')
    replace_word_in_file('build/postgresql/src/app/main.py', '{router_name}', router_name)
    # main.txt.삭제
    os.remove('build/postgresql/src/app/main.txt')
    os.remove('build/postgresql/txt/main.txt')

# 3. db.py를 복사
def copy_db_file(table_list, table_name):
    copy_file_content('build/postgresql/txt/db.txt', 'build/postgresql/src/app/db.py')
    content = create_content_db_postgre(table_list)
    print(content)
    replace_word_in_file('build/postgresql/src/app/db.py', 'table_content', content)
    replace_word_in_file('build/postgresql/src/app/db.py', 'schema_name', table_name)
    # db.txt 삭제
    os.remove('build/postgresql/src/app/db.txt')
    os.remove('build/postgresql/txt/db.txt')

def copy_crud_file(table_list, schema_model, schema_db, table_name):
    copy_file_content('build/postgresql/txt/crud.txt', 'build/postgresql/src/app/api/crud.py')
    replace_word_in_file('build/postgresql/src/app/api/crud.py', '${schema_model}', schema_model)
    replace_word_in_file('build/postgresql/src/app/api/crud.py', '${schema_name}', schema_db)
    replace_word_in_file('build/postgresql/src/app/api/crud.py', '${table_name}', table_name)

    # create 함수 생성
    replace_word_in_file('build/postgresql/src/app/api/crud.py', 'create_content', create_crud_content(table_list))

    # update 함수 생성
    replace_word_in_file('build/postgresql/src/app/api/crud.py', 'update_content', update_crud_content(table_list))
    os.remove('build/postgresql/src/app/api/crud.txt')

def copy_models_file(table_list, schema_model, schema_db):
    copy_file_content('build/postgresql/txt/models.txt', 'build/postgresql/src/app/api/models.py')
    content = create_content_model_postgre(table_list)
    replace_word_in_file('build/postgresql/src/app/api/models.py', 'model_content', content)

    replace_word_in_file('build/postgresql/src/app/api/models.py', '${schema_model}', schema_model)
    replace_word_in_file('build/postgresql/src/app/api/models.py', '${schema_name}', schema_db)

    os.remove('build/postgresql/src/app/api/models.txt')

# content 생성
def copy_routers_file(table_list, schema_model, schema_db):
    copy_file_content('build/postgresql/txt/routers.txt', 'build/postgresql/src/app/api/routers.py')
    os.remove('build/postgresql/src/app/api/routers.txt')
    content = ""
    # models에 있는 내용을 가져와서 content에 추가

    for table in table_list:
        print(f'{table["data_name"]}: {table["data_type"]}')
        content += f'"{table["data_name"]}": payload.{table["data_name"]},\n\t\t'

    replace_word_in_file('build/postgresql/src/app/api/routers.py', '${schema_model}', schema_model)

    replace_word_in_file('build/postgresql/src/app/api/routers.py', '${schema_name}', schema_db)
    
    # TODO : 'object contets 가 맞는지 여부 확인 필요
    replace_word_in_file('build/postgresql/src/app/api/routers.py', 'object contets', content)

    replace_word_in_file('build/postgresql/src/app/api/routers.py', 'update_content', content)


def make_mqtt_subscribe_file(sec_key, table_id, table_name):
    replace_word_to_array('build/postgresql/mqtt/src/subscribe.py', '${sec_key}', sec_key)
    replace_word_in_file('build/postgresql/mqtt/src/subscribe.py', '${table_id}', table_id)
    replace_word_in_file('build/postgresql/mqtt/src/subscribe.py', '${table_name}', table_name)

def create_crud_content(table_list):
    content = ""
    for table in table_list:
        content += f'{table["data_name"]}=payload.{table["data_name"]},\n\t\t'
    return content

def update_crud_content(table_list):
    content = ""
    for table in table_list:
        content += f'{table["data_name"]}=payload.{table["data_name"]},\n\t\t\t'
    return content

def create_sensor_content(sensor_list):
    content = ''
    for sensor in sensor_list:
        content += f'int {sensor["data_name"].upper()}_PIN = d1\n'
    return content

def create_relay_content(sensor_list):
    content = ''
    for sensor in sensor_list:
        content += f'int {sensor["data_name"]} = 0\n'
    return content

def create_relay_pin_content(sensor_list):
    content = ''
    for sensor in sensor_list:
        content += f'int {sensor["data_name"].upper()}_PIN = d0\n'
    return content

def relay_control(relay_list):
    content = ''
    func_content = 'if (strcmp(relay_name,"${RELAY}")==0) {\n'+'\t\t${RELAY} = relay_value;\n'+'\t\tif (${RELAY}==1)\n'+'\t\t\tdigitalWrite(${RELAY_PIN}, HIGH);\n'+'\t\telse if (${RELAY}==0)\n'+'\t\t\tdigitalWrite(${RELAY_PIN}, LOW);\n'+'\t}\n'
    
    for relay in relay_list:
        # copy func_content to content2
        relay_name = relay['data_name']
        relay_name_upper = relay_name.upper()
        print(relay_name_upper)
        content2 = func_content
        content2 = content2.replace('${RELAY}', relay_name)
        content2 = content2.replace('${RELAY_PIN}', relay_name_upper+'_PIN')
        content+=content2

    return content

def copy_arduino_main_file(sensor_list, relay_list):
    copy_file_content('arduino/DHT11_WATER_RELAY_OLED.ino', 'build/arduino/main.ino')
    sensor_content = create_sensor_content(sensor_list)
    relay_content = create_relay_content(relay_list)
    relay_pin_content = create_relay_pin_content(relay_list)
    relay_control_content = relay_control(relay_list)
    print("raly_control_content: ", relay_control_content)
    replace_word_in_file('build/arduino/main.ino', '${sensor}', sensor_content)
    replace_word_in_file('build/arduino/main.ino', '${relay}', relay_content)
    replace_word_in_file('build/arduino/main.ino', '${relay_pin}', relay_pin_content)
    replace_word_in_file('build/arduino/main.ino', '${relay_control}', relay_control_content)


def main(url):
    # read json file in json directory

    if url.startswith('http'):
        data = requests.get(url).json()
    else:
        with open(url) as f:
            data = json.load(f)

    project_id = data['project_id']
    project_name = data['project_name']

        # fields
    project_field = data['project_field']

    print("project_field: ", project_field)

    sec_key = []
    for i in range(len(project_field)):
        sec_key.append(project_field[i]['data_name'])

    table_id = sec_key.pop(0)
    table_name = data['table_name']

    schema_model = table_name + "_model"
    schema_db = table_name + "_db"

    table_list = project_field
    print("schema_model : ", schema_model)
    print("schema_db : ", schema_db)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
    copy_folder('postgresql', 'build/postgresql')
    print("=== copy folder end ===")
    copy_main_file(table_name)
    print("=== copy main end ===")
    copy_db_file(table_list, table_name)
    print("=== copy db end ===")
    copy_crud_file(table_list, schema_model, schema_db, table_name)
    print("=== copy crud end ===")
    copy_models_file(table_list, schema_model, schema_db)
    print("=== copy models end ===")
    copy_routers_file(table_list, schema_model, schema_db)
    print("=== copy routers end ===")

    print("=== copy end ===")

    # mqtt 복사
    make_mqtt_subscribe_file(sec_key, table_id, table_name)
          
    print("=== copy arduino start ===")
    copy_folder('arduino', 'build/arduino')

    sensor_list = []
    relay_list = []

    for field in project_field:
        if field['is_relay']:
            relay_list.append(field)
        elif field['is_relay'] == False:
            sensor_list.append(field)

    print("sensor_list: ", sensor_list)
    print("relay_list: ", relay_list)
    copy_arduino_main_file(sensor_list, relay_list)



if __name__ == '__main__':
    main(sys.argv[1])

