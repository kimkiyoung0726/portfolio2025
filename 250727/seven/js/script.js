$(function () {
  // 상단 슬라이드
  $(".slide").slick({
    autoplay: true,
    // autoplaySpeed: 2000,
    dots: true,
    dotsClass: "paging",
    customPaging: function (slick, index) {
      // console.log(slick, index);
      return `<span>${index}</span>`;
    },
    prevArrow: ".visual .btn.btn-prev",
    nextArrow: ".visual .btn.btn-next",
  });

  // 차별화상품
  const $tabMenu = $('.tab-menu li');
  const $tabContent = $('.tab-con-item');
  // 초기로딩 화면에서 0번 탭으로 설정
  tabAction(0);
  $tabMenu.on('click', function (e) {
    e.preventDefault();
    let index = $(this).index();
    // 탭 메뉴의 인덱스 값 가져오기
    tabAction(index);
  });

  function tabAction(index) {
    $tabMenu.removeClass('on');
    $tabMenu.eq(index).addClass('on');
    $tabContent.hide();
    $tabContent.eq(index).show();
  }

  // tab menu slide
  // $tabContent.slick({
  //   // slidesToShow: 3,
  //   // slidesToScroll: 1,
  //   // arrows: true,
  // });


  // header gnb
  // 자주 사용할 대상을 변수에 저장
  const $win = $(window);
  const $header = $('header');
  const $gnb = $('.gnb');
  const $menu = $('.gnb > li');
  const $submenu = $('.submenu');
  const duration = 300;

  // 데스크톱에서만 마우스 이벤트 작동
  $gnb.on('mouseenter', 'li', function () {
    if ($(window).width() > 1024) {
      $header.addClass('active');
      $(this).addClass('on');
      $submenu.stop().show();
    }
  });
  $gnb.on('mouseleave', 'li', function () {
    if ($(window).width() > 1024) {
      $header.removeClass('active');
      $menu.removeClass('on');
      $submenu.stop().hide();
    }
  });


  // 마우스 휠을 움직일 때
  $win.on('wheel', function (e) {
    // console.log(e);

    if (e.originalEvent.wheelDelta > 0) {
      // 마우스 휠을 올렸을 때
      console.log('휠 올림');
      $header.removeClass('hide');
    } else {
      // 마우스 휠을 내렸을 때
      console.log('휠 내림');
      $header.addClass('hide');
    }
  });

  // 모바일 메뉴 토글
  const $mobileMenuBtn = $('.mobile-menu-btn');
  const $mobileGnb = $('.gnb');
  
  $mobileMenuBtn.on('click', function() {
    console.log('햄버거 버튼 클릭됨');
    console.log('현재 화면 너비:', $(window).width());
    
    $(this).toggleClass('active');
    $mobileGnb.toggleClass('mobile-active');
    
    console.log('버튼 active 클래스:', $(this).hasClass('active'));
    console.log('메뉴 mobile-active 클래스:', $mobileGnb.hasClass('mobile-active'));
    
    // 햄버거 메뉴 애니메이션
    if ($(this).hasClass('active')) {
      $(this).find('span').eq(0).css('transform', 'rotate(45deg) translate(5px, 5px)');
      $(this).find('span').eq(1).css('opacity', '0');
      $(this).find('span').eq(2).css('transform', 'rotate(-45deg) translate(7px, -6px)');
    } else {
      $(this).find('span').eq(0).css('transform', 'none');
      $(this).find('span').eq(1).css('opacity', '1');
      $(this).find('span').eq(2).css('transform', 'none');
    }
  });

  // 모바일에서 메뉴 클릭 시 메뉴 닫기
  $mobileGnb.on('click', 'a', function() {
    if ($(window).width() <= 1024) {
      $mobileMenuBtn.removeClass('active');
      $mobileGnb.removeClass('mobile-active');
      $mobileMenuBtn.find('span').eq(0).css('transform', 'none');
      $mobileMenuBtn.find('span').eq(1).css('opacity', '1');
      $mobileMenuBtn.find('span').eq(2).css('transform', 'none');
    }
  });

  // 화면 크기 변경 시 메뉴 상태 초기화
  $(window).on('resize', function() {
    if ($(window).width() > 1024) {
      // 데스크톱으로 변경 시 모바일 메뉴 닫기
      $mobileMenuBtn.removeClass('active');
      $mobileGnb.removeClass('mobile-active');
      $mobileMenuBtn.find('span').eq(0).css('transform', 'none');
      $mobileMenuBtn.find('span').eq(1).css('opacity', '1');
      $mobileMenuBtn.find('span').eq(2).css('transform', 'none');
      
      // 데스크톱 메뉴 상태 초기화
      $header.removeClass('active');
      $menu.removeClass('on');
      $submenu.hide();
    } else {
      // 태블릿/모바일로 변경 시 데스크톱 메뉴 상태 초기화
      $header.removeClass('active');
      $menu.removeClass('on');
      $submenu.hide();
    }
  });
});