// 마라나타 초대 랜딩 로직 (딥링크 미설치 fallback).
//   경로(/join/group, /join/church)로 초대 종류를 판별하고 ?code= 로 코드를 읽어
//   안내 + 스토어 설치 + 'maranatha://' 앱 열기(이미 설치된 경우 폴백)를 채운다.
//   세 페이지(/join, /join/group, /join/church)가 이 파일을 공유한다.

// ── 스토어 링크 (출시 후 동작) ───────────────────────────────
//   ⚠️ App Store 정식 숫자 ID 확보 시 APPSTORE_URL을
//   'https://apps.apple.com/kr/app/id<숫자ID>' 로 교체.
var PLAY_URL = 'https://play.google.com/store/apps/details?id=com.hongdoc.maranatha';
var APPSTORE_URL = 'https://apps.apple.com/kr/search?term=마라나타';

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

  // 교회 초대: 교회 정보 카드 (URL 파라미터 name/region/denom/time).
  //   church/index.html에만 #churchInfo가 있어, 그 페이지에서 교회명이 오면
  //   기본 제목 대신 교회 카드를 보여 준다. (group/일반 페이지에는 영향 없음)
  if (type === 'church') {
    var q = new URLSearchParams(window.location.search);
    var cname = (q.get('name') || '').trim();
    var info = document.getElementById('churchInfo');
    if (cname && info) {
      document.getElementById('churchName').textContent = cname;
      var meta = [q.get('region'), q.get('denom'), q.get('time')]
        .map(function (s) { return (s || '').trim(); })
        .filter(Boolean)
        .join('  ·  ');
      var metaEl = document.getElementById('churchMeta');
      if (meta) {
        metaEl.textContent = meta;
        metaEl.hidden = false;
      }
      info.hidden = false;
      titleEl.hidden = true;
      subEl.hidden = true;
      var hintEl = document.getElementById('hint');
      if (hintEl) {
        hintEl.textContent = '앱을 설치하면 이 교회에 바로 가입 신청할 수 있어요.';
      }
    }
  }

  // 초대 코드 표시
  if (code) {
    document.getElementById('code').textContent = code;
    document.getElementById('codeBox').hidden = false;
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
