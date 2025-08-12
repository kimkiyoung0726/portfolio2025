<<<<<<< HEAD
// 포트폴리오
$(function () {
  const $portfolioItem = $(".portfolio-item");
  let portIdx = 0;
  changePortfolioItem(0);

  $portfolioItem.on("click", function () {
    portIdx = $(this).index();
    changePortfolioItem(portIdx);
  });
=======
// 포트폴리오
$(function () {
  const $portfolioItem = $(".portfolio-item");
  let portIdx = 0;
  changePortfolioItem(0);

  $portfolioItem.on("click", function () {
    portIdx = $(this).index();
    changePortfolioItem(portIdx);
  });
>>>>>>> e30074e (처음 커밋)
});