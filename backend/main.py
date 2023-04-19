# fastapi
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models import ProjectModel
from makeFileFunc.funciton import copy_file_content
from makeFileFunc.funciton import append_text_to_file
app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():

    return {"message": "Hello World"}

@app.post("/template")
async def root(projectModel: ProjectModel):
    print(projectModel)
    table_list = projectModel.tableName
    make_model(table_list)
    # db에 테이블을 만드는 작업
    # template body
    # 사용자 정보랑, version
    return projectModel

# python 파일 작성 함수
def make_model(table_list):

    # models.py생성
    print("=== make model start ===")
    copy_file_content('modelSample/model.txt', 'api_result/src/app/api/models.py')
    print("=== copy end ===")
    for table in table_list:
        print(f'{table["name"]}: {table["type"]}')
        append_text_to_file('api_result/src/app/api/models.py', f'\t{table["name"]}: {table["type"]}\n')

    # crud.py 
    print("=== make crud start ===")
    copy_file_content('modelSample/crud.txt', 'api_result/src/app/api/crud.py')
