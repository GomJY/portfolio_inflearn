## 프로젝트 소개
### [사이트 바로가기](https://www.yeolju.com/)
인프런 기능중에서 강의를 결제하고, 글을 작성하며 커뮤니케이션을 할수 있는  인프런 클론 서비스를 제작해보았습니다.

### 프로젝트 기간: 2020/09/01 ~ 2020/09/20

### 프로젝트 참여자: 김주열

## 기능

FFMPEP으로 파일을 변환하여 HLS스트리밍을 하고 싶었지만,저의 ec2.nano🖥️ 서버는 강의영상을 제공하는 것 만으로도 많은 자원을 사용하여 배제하고 최종적으로  아래 기능을 채택 하였습니다.

- progressive download을 통한 스트리밍 강의 서버스
- auth를 통한 Google, Kakao, Facebook, Github 간편 가입 및 로그인 기능
- [**아임포트**](https://www.iamport.kr/)를 사용한 결제 기능
- 질문글을 답변글을 통한 커뮤니티 기능

## 구성하는 기술

최대한 인프런에서 사용한 기술과 현재 저의 서버에 환경을 고려하며 아래에 기술을 사용하였습니다.

### 서버 - Nodejs

- **Express - 프레임 워크**
- **[FxSQL](https://github.com/marpple/FxSQL) - DB연동**
- **passport - 세션관리**
- **bcrypt - 해싱암호화**
- **multer - 미디어 파일**

### 프론트

- **HTML, CSS, Javascript, Jquery**

### 데이터베이스

- **MYSQL**

### 호스팅, 도메인, 인증서(SSL)

- **AWS EC2 - 호스팅 서버**
- **ROUTE 53 - 도메인 및 DNS**
- **ACM to ALB - 인증서 및 인스턴스 어플리케이션 라우팅**

### 기타

- **Git, Github - 형상관리**

## DB 구성도 💾
![Untitled](https://user-images.githubusercontent.com/39614239/93670666-0612d980-fad8-11ea-8c96-040821b81d43.png)

## 스크린샷 및 UI 설명서🎑📘

### 스크린샷🎑

[Google Slides - create and edit presentations online, for free.](https://docs.google.com/presentation/d/1X6TrALrvGd0ybIRGESanHU-W5tNQ9MaV5f9F5p4DnSU/edit?usp=sharing)

### UI 설명서📘

[Google Slides - create and edit presentations online, for free.](https://docs.google.com/presentation/d/1XW1d7EOHfH8pO1lEdw4n1Bpg6hgco_l1h95nyEPvjUc/edit?usp=sharing)

## 소스 코드 및 서비스 도메인 🚩

### [Github 링크 바로가기](https://github.com/GomJY/portfolio_inflearn)

### [노션링크](https://www.notion.so/2020-6d07be329fb24f81bf5b510793e9744b) 
[인프런2020 회고록🙏](https://www.notion.so/2020-d09975acd3c7466a98c694660d138dea)

