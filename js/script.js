// 포트폴리오 탭 - 탭의 data-url을 iframe(.portfolio-frame)의 src로 전환
$(function () {
  const $tabs = $(".portfolio-tab");
  const $frame = $(".portfolio-frame");

  $tabs.on("click", function () {
    $tabs.removeClass("active");
    $(this).addClass("active");

    const url = $(this).data("url");
    if (url) $frame.attr("src", url);
  });
});
