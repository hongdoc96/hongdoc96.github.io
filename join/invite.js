// 마라나타 초대 랜딩 로직 (딥링크 미설치 fallback).
//   경로(/join/group, /join/church)로 초대 종류를 판별하고 ?code= 로 코드를 읽어
//   안내 + 스토어 설치 + 'maranatha://' 앱 열기(이미 설치된 경우 폴백)를 채운다.
//   세 페이지(/join, /join/group, /join/church)가 이 파일을 공유한다.

// ── 스토어 링크 ─────────────────────────────────────────────
var PLAY_URL = 'https://play.google.com/store/apps/details?id=com.hongdoc.maranatha';
var APPSTORE_URL = 'https://apps.apple.com/kr/app/id6773760023';

(function () {
  var path = window.location.pathname;
  var type = /church/.test(path) ? 'church' : (/group/.test(path) ? 'group' : '');
  var code = (new URLSearchParams(window.location.search).get('code') || '')
    .trim().toUpperCase();

  var label = type === 'church' ? '교회' : (type === 'group' ? '모임' : '');

  var titleEl = document.getElementById('title');
  var subEl = document.getElementById('sub');
  if (label) {
    titleEl.textContent = label + ' 초대를 받았어요';
    subEl.textContent = '마라나타 앱에서 ' + label + '에 함께해요.';
  } else {
    titleEl.textContent = '마라나타 초대';
    subEl.textContent = '매일의 말씀과 기도, 함께하는 공동체.';
  }

  // [7일 함께 걷기]: 앱이 초대 링크에 실어 보낸 source로 첫 인상 카피를 분기.
  //   walk_complete / challenge_complete = 완주자가 보낸 초대(코드 없음, 신규 유입 타깃).
  //   group_invite(모임 초대)는 위 label 카피를 그대로 둔다.
  var source = (new URLSearchParams(window.location.search).get('source') || '').trim();
  var hintEl0 = document.getElementById('hint');
  var hintSet = false; // 아래 분기에서 안내를 이미 갈아끼웠는가
  if (source === 'walk_complete') {
    titleEl.textContent = '누군가 7일을 걷고, 당신을 떠올렸어요';
    subEl.textContent = "믿음의 첫 한 주 '7일 함께 걷기'. 하루 한 걸음씩, 혼자가 아니라 나란히 걸어요.";
    if (hintEl0) { hintEl0.textContent = '앱을 설치하면 바로 첫 걸음을 시작할 수 있어요.'; hintSet = true; }
  } else if (source === 'challenge_complete') {
    titleEl.textContent = '함께 걸을 사람이 당신을 초대했어요';
    subEl.textContent = '오늘의 말씀과 묵상을 매일 한 걸음씩. 마라나타에서 함께 걸어요.';
    if (hintEl0) { hintEl0.textContent = '앱을 설치하면 바로 시작할 수 있어요.'; hintSet = true; }
  }

  // 초대 대상 이름 카드 (URL 파라미터 name — 교회는 region/denom/time까지).
  //   이름이 오면 기본 제목 대신 그 카드를 보여 준다. 이름을 담을 요소가 없는
  //   페이지(/join 루트)에서는 아무 일도 하지 않는다.
  //   ⚠️ 2026-08-29: 이 처리가 통째로 `type === 'church'` 안에 있어서, 앱이
  //   v6.1146부터 모임 초대에도 실어 보내던 ?name= 을 **아무도 읽지 않았다**
  //   (그룹 페이지엔 담을 요소조차 없었다). 종류와 무관한 처리로 바꾼다 —
  //   교회의 지역·교단·예배시간 메타만 교회일 때 추가로 채운다.
  var q = new URLSearchParams(window.location.search);
  var nameParam = (q.get('name') || '').trim();
  var isChurch = type === 'church';
  var infoEl = document.getElementById(isChurch ? 'churchInfo' : 'groupInfo');
  var nameEl = document.getElementById(isChurch ? 'churchName' : 'groupName');
  if (type && nameParam && infoEl && nameEl) {
    nameEl.textContent = nameParam;
    if (isChurch) {
      var meta = [q.get('region'), q.get('denom'), q.get('time')]
        .map(function (s) { return (s || '').trim(); })
        .filter(Boolean)
        .join('  ·  ');
      var metaEl = document.getElementById('churchMeta');
      if (meta && metaEl) {
        metaEl.textContent = meta;
        metaEl.hidden = false;
      }
    }
    infoEl.hidden = false;
    titleEl.hidden = true;
    subEl.hidden = true;
    if (hintEl0) {
      // 코드가 없는 초대에서는 '위 초대 코드'를 가리키지 않는다 — 코드 상자가 숨어 있다.
      hintEl0.textContent = isChurch
        ? '앱을 설치하면 이 교회에 바로 가입 신청할 수 있어요.'
        : (code
            ? '앱을 설치하고 위 초대 코드를 입력하면 이 모임에 바로 참여할 수 있어요.'
            : '앱을 설치하면 이 모임에 바로 참여할 수 있어요.');
      hintSet = true;
    }
  }

  // 초대 코드 표시
  if (code) {
    document.getElementById('code').textContent = code;
    document.getElementById('codeBox').hidden = false;
  } else if (!hintSet && hintEl0) {
    // 코드 없는 초대(프로필 공유 등)에서 기본 안내가 '위 초대 코드'를 가리켰다 —
    //   코드 상자는 숨어 있으니 가리킬 것이 없다.
    hintEl0.textContent = '앱을 설치하면 바로 시작할 수 있어요.';
  }

  // '앱으로 열기' — 이미 설치된 경우 커스텀 스킴으로 앱 열기(폴백).
  //   (Universal Link가 자동으로 안 열린 경우 대비. 미설치면 아무 일 안 일어남.)
  if (type) {
    var openBtn = document.getElementById('openApp');
    openBtn.href = 'maranatha://join/' + type +
      (code ? '?code=' + encodeURIComponent(code) : '');
    openBtn.hidden = false;
  }

  // 스토어 버튼 — 플랫폼에 맞는 것을 위로.
  var ua = navigator.userAgent || '';
  var isIOS = /iPhone|iPad|iPod/i.test(ua);
  var playBtn = document.getElementById('playBtn');
  var appStoreBtn = document.getElementById('appStoreBtn');
  playBtn.href = PLAY_URL;
  appStoreBtn.href = APPSTORE_URL;
  if (isIOS) {
    // iOS면 App Store 버튼을 먼저 보이게 순서 교체.
    var stores = appStoreBtn.parentNode;
    stores.insertBefore(appStoreBtn, playBtn);
  }
})();
