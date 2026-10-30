# 앱 인 동아 Claude 플러그인

선생님이 Claude와 이야기하면서 수업 게임·수업 도구·학급 운영 도구를 HTML 파일 하나로 만들고, 앱 인 동아에 올리기 전에 규칙에 맞는지 검사하도록 돕는 동아출판의 Claude 플러그인이에요. 플러그인은 올리기·검수·공개를 하지 않아요. 그 일은 모두 사람이 해요.

## 설치

**Claude Code** (2.1.292 이상): Claude에게 아래 명령을 실행해 달라고 하거나 터미널에 붙여 넣은 뒤 `/reload-plugins`를 입력해요.

```
claude plugin install app-in-donga --marketplace cskwork/app-in-donga-plugin --scope user
```

**Claude 웹·데스크톱 앱 채팅**: [Releases](https://github.com/cskwork/app-in-donga-plugin/releases)나 앱 인 동아 만들기 가이드에서 `app-in-donga-plugin.zip`을 받아 **Customize › Plugins › Add › Upload plugin**으로 올리고, **Settings › Capabilities › Code execution and file creation**을 켜요. 학교에서 Claude Team·Enterprise를 쓰면 관리자가 기본 설치로 정해 둘 수 있어요.

자세한 내용은 [plugin/app-in-donga/README.md](plugin/app-in-donga/README.md)를 보세요.

## 이 저장소

`plugin/app-in-donga/`와 `.claude-plugin/marketplace.json`은 동아출판 Content Forge 저장소에서 만들어 복사한 사본이에요. 여기서 직접 고치지 않아요.
