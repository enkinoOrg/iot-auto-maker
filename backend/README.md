# IOT AUTO MAKER

### 폴더 구조
├── README.md
├── build : 생성된 코드
│   └── postgresql
│       
├── json : 
│   └── data.json
├── main.py : main 함수
├── makeDBFunc
│   ├── __init__.py
│   ├── __pycache__
│   │   ├── __init__.cpython-38.pyc
│   │   └── function.cpython-38.pyc
│   └── function.py
├── makeFileFunc
│   ├── __init__.py
│   ├── __pycache__
│   │   ├── __init__.cpython-38.pyc
│   │   └── function.cpython-38.pyc
│   └── function.py
├── mqtt
│   └── src
│       ├── Dockerfile
│       ├── requirements.txt
│       └── subscribe.py
└── requirements.txt

### 실행
```
python -m venv .venv // 가상환경 생성
source .venv/bin/activate // 가상환경 적용
pip install -r requirements.txt
python main.py "json파일 위치, json파일의 url"
```