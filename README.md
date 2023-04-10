# IOT-Auto-Maker
---

### 가상환경 설정

1. 가상환경 생성

```
$ python -m venv .venv
```

2. 가상환경 활성화

```
$ . .venv/bin/activate
```

3. requirements 설치

```
$ pip3 install -r requirements.txt
```

### fast api 실행

```
$ uvicorn src.main:app --reload 
```