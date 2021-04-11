const page404 = () => {

  console.log('404 on load');

  let container = document.querySelector('.c-404__wrapper');

  window.onmouseover = (e) => {
      let x = -e.clientX / 5,
          y = -e.clientY / 5;

      container.style.backgroundPositionX = x + 'px';
      container.style.backgroundPositionY = y + 'px';
  };
};

export default page404;
