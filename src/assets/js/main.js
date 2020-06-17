const page404 = () => {
    let container = document.querySelector('.c-404__wrapper');

    window.onmouseover = (e) => {
        let x = -e.clientX / 5,
            y = -e.clientY / 5;

        container.style.backgroundPositionX = x + 'px';
        container.style.backgroundPositionY = y + 'px';
    };
};


page404();

window.addEventListener('load', () => {
    console.log('main js is loaded');
});
