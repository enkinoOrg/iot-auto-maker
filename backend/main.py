# fastapi
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models import ProjectModel
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

@app.get("/template")
async def root():
    write_file('modelSample/model.py', "print('Hello World')")

# python 파일 작성 함수
def write_file(file_name, content):
    with open(file_name, 'w') as f:
        f.write(content)

def make_model(table_list):
    print("=== make model start ===")
    copy_file_content('modelSample/model.txt', 'modelSample/model.py')
    print("=== copy end ===")
    for table in table_list:
        print(f'{table["name"]}: {table["type"]}')
        append_text_to_file('modelSample/model.py', f'\t{table["name"]}: {table["type"]}\n')

def copy_file_content(source_path: str, target_path: str):
    with open(source_path, 'r') as f1:
        content = f1.read()
    
    with open(target_path, 'w') as f2:
        f2.write(content)

def append_text_to_file(file_path: str, text: str):
    with open(file_path, 'a') as f:
        f.write(text)