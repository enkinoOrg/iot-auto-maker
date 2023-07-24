# fastapi
import os
from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from app.models import ProjectModel, ProjectModel2
from makeDBFunc.function import db_sqlalchemy_postgre, create_content_db_postgre, create_content_model_postgre
from makeFileFunc.funciton import replace_word_in_file
from makeFileFunc.funciton import copy_file_content
from makeFileFunc.funciton import append_text_to_file
from makeFileFunc.funciton import replace_space_to_underbar

from dotenv import load_dotenv
from supabase import create_client, Client

## test용
import re
import os
from pydantic import BaseModel

import shutil

app = FastAPI()

load_dotenv()

origins = [
    "http://localhost",
    "http://localhost:3000",
]
2
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(url, key)

@app.get("/")
async def root():

    return {"message": "Hello World"}

# template3에서 폴서 생성 및 복사 테스트
@app.post("/template3")
async def copy_postgresql_folder(projectModel: ProjectModel):
    print(projectModel)
    table_list = projectModel.tableName
    table_name = replace_space_to_underbar(projectModel.projectName)

    # schema model
    schema_model = table_name + "_model"
    schema_db = table_name + "_db"
        
    
    #TODO 기존에 폴더 존재할때 예외처리
    copy_folder('postgresql', 'api_result/postgresql')
    copy_main_file(projectModel.projectName)
    copy_db_file(table_list, table_name)
    copy_crud_file(table_list, schema_model, schema_db, table_name)
    copy_models_file(table_list, schema_model, schema_db)
    # copy_routers_file(table_list, schema_model, schema_db)
    copy_routers_file(table_list, schema_model, schema_db)
    
    print("=== copy end ===")

# 1. 기본 폴더 설정 structure
# 폴더를 복사하는 함수
# 기존에 폴더가 존재하면 예외처리
# 함수들 파일 분리 예정

def copy_folder(src_folder, dst_folder):
    if (os.path.isdir(dst_folder)):
        print("exist")
        shutil.rmtree(dst_folder)
    shutil.copytree(src_folder, dst_folder)

# 2. main.py를 복사
def copy_main_file(router_name):
    copy_file_content('postgresql/txt/main.txt', 'api_result/postgresql/src/app/main.py')
    replace_word_in_file('api_result/postgresql/src/app/main.py', '{router_name}', router_name)
    # main.txt.삭제
    os.remove('api_result/postgresql/src/app/main.txt')
    os.remove('api_result/postgresql/txt/main.txt')

# --------------------- main.py까지 완료 ---------------------

# 3. db.py를 복사
def copy_db_file(table_list, table_name):
    copy_file_content('api_result/postgresql/txt/db.txt', 'api_result/postgresql/src/app/db.py')
    content = create_content_db_postgre(table_list)
    print(content)
    replace_word_in_file('api_result/postgresql/src/app/db.py', 'table_content', content)
    replace_word_in_file('api_result/postgresql/src/app/db.py', 'schema_name', table_name)
    # db.txt 삭제
    os.remove('api_result/postgresql/src/app/db.txt')
    os.remove('api_result/postgresql/txt/db.txt')

# --------------------- db.py까지 완료 ---------------------

# 4. crud.py를 생성
# 5. crud (create, read, update, delete) 함수를 생성
def copy_crud_file(table_list, schema_model, schema_db, table_name):
    copy_file_content('api_result/postgresql/txt/crud.txt', 'api_result/postgresql/src/app/api/crud.py')
    replace_word_in_file('api_result/postgresql/src/app/api/crud.py', '${schema_model}', schema_model)
    replace_word_in_file('api_result/postgresql/src/app/api/crud.py', '${schema_name}', schema_db)
    replace_word_in_file('api_result/postgresql/src/app/api/crud.py', '${table_name}', table_name)

    # create 함수 생성
    replace_word_in_file('api_result/postgresql/src/app/api/crud.py', 'create_content', create_crud_content(table_list))

    # update 함수 생성
    replace_word_in_file('api_result/postgresql/src/app/api/crud.py', 'update_content', update_crud_content(table_list))
    os.remove('api_result/postgresql/src/app/api/crud.txt')

def create_crud_content(table_list):
    content = ""
    for table in table_list:
        content += f'{table["name"]}=payload.{table["name"]},\n\t\t'
    return content

def update_crud_content(table_list):
    content = ""
    for table in table_list:
        content += f'{table["name"]}=payload.{table["name"]},\n\t\t\t'
    return content

# model
def copy_models_file(table_list, schema_model, schema_db):
    copy_file_content('api_result/postgresql/txt/models.txt', 'api_result/postgresql/src/app/api/models.py')
    content = create_content_model_postgre(table_list)
    replace_word_in_file('api_result/postgresql/src/app/api/models.py', 'model_content', content)

    replace_word_in_file('api_result/postgresql/src/app/api/models.py', '${schema_model}', schema_model)
    replace_word_in_file('api_result/postgresql/src/app/api/models.py', '${schema_name}', schema_db)

    os.remove('api_result/postgresql/src/app/api/models.txt')

# content 생성
def copy_routers_file(table_list, schema_model, schema_db):
    copy_file_content('api_result/postgresql/txt/routers.txt', 'api_result/postgresql/src/app/api/routers.py')
    os.remove('api_result/postgresql/src/app/api/routers.txt')
    content = ""
    # models에 있는 내용을 가져와서 content에 추가

    for table in table_list:
        print(f'{table["name"]}: {table["type"]}')
        content += f'"{table["name"]}": payload.{table["name"]},\n\t\t'

    replace_word_in_file('api_result/postgresql/src/app/api/routers.py', '${schema_model}', schema_model)

    replace_word_in_file('api_result/postgresql/src/app/api/routers.py', '${schema_name}', schema_db)
    
    replace_word_in_file('api_result/postgresql/src/app/api/routers.py', 'object contets', content)

    replace_word_in_file('api_result/postgresql/src/app/api/routers.py', 'update_content', content)


# mqtt 서버 생성
# @app.post("/template") 
# async def get_mqtt_server(projectModel2: ProjectModel2):
#     print (projectModel2)

# 1. project id를 받아서 feild목록을 가져오기.
@app.post("/template")
async def make_project_file(project_id: int):
    print(project_id)
    # project_id를 받아서 supabase에서 project_id에 해당하는 field를 가져온다.
    response = supabase.table('project_field').select('*').eq('project_id', project_id).execute()
    print("response : ", response.data)

    # response.data => array