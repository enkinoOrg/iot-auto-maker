# IOT AUTO MAKER 

### 목표
- IoT 소스 자동 생성용 백엔드 서버 구축
### 폴더 구조
- [backend](backend/README.md) : FastAPI를 사용한 데이테베이스 API
- [documents](documents/README.md) : 문서 기능 정의 
- documents/images : 문서에 삽입되는 이미지 폴더

```
.
├── README.md : 현재 파일
├── backend : 백엔드 개발 폴더
│   ├── README.md
│   ├── app
│   │   ├── __init__.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── routes
│   │   │   └── __init__.py
│   │   └── services
│   │       └── __init__.py
│   ├── main.py
│   └── requirements.txt
└── documents
    ├── README.md : 기능 정의 테이블
    ├── images : 문서 삽입용 이미지 파일들
    ├── 관리자_기능_문서.md
    └── 사용자_기능_문서.md

```
### 시스템 구조도
![시스템 구조도](documents/images/2023_공개SW-GCP.jpg)
