# IOT-Auto-Maker
---

### 가상환경 설정

1. 가상환경 생성

```sh
$ python -m venv .venv
```

2. 가상환경 활성화

```sh
# MAC , linux
$ .venv/bin/activate

# Windows
# 보안 오류 PSSecurityException 를 해제하기 위해서는 아래 명령 실행 (참고: https://hbesthee.tistory.com/1942)
$ Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope LocalMachine
$ .venv\Scripts\activate
```

3. requirements 설치

```
$ pip3 install -r requirements.txt
```

### fast api 실행

```
$ uvicorn main:app --reload 
```

- 작업 테이블 생성
    ```
    ### Request Body
    {   
        "tableName": "string",
        "version":""
        "data": [
            {
                id: 0,
                fieldName: "",
            }
        ]
    }
    ```