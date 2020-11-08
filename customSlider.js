function customSlider({
    slidesIdentifier, // идентификатор всех слайдов
    bigCloneSlidesIdentifier, // идентификатор всех больших слайдов
    prevButtonIdentifier, // идентификатор кнопки предыдущий
    nextButtonIdentifier, // идентификатор кнопки следующий
    frameIdentifier, // идентификатор поля со слайдами ниже (который нужно скролить)
    wrapperIdentifier, // идентификатор обертки слайдов
    bigCloneWrapperIdentifier, // идентификатор обертки больших слайдов
    activeClass // активный класс
}) {
    // Находим все элементы
    const slides = document.querySelectorAll(slidesIdentifier);
    const prevButton = document.querySelector(prevButtonIdentifier);
    const nextButton = document.querySelector(nextButtonIdentifier);
    const wrapper = document.querySelector(wrapperIdentifier);
    const cloneSlides = document.querySelectorAll(bigCloneSlidesIdentifier);
    const cloneWrapper = document.querySelector(bigCloneWrapperIdentifier);
    const frame = document.querySelector(frameIdentifier);
    
    if ( // Проверяем на наличие всех элементов
        !slides.length || 
        !prevButton || 
        !nextButton || 
        !wrapper || 
        !cloneSlides.length || 
        !cloneWrapper || 
        !frame
    ) { return; }

    let index = 0; // порядковый номер слайда
    let translateX = 0; // изменение для нижнего поля со слайдами по оси Х
    
    function bigCloneSlidesChange() { // функция которая переключает большие слайды опираясь на порядковый номер
        const widthCloneSlide = deletePxTransformToNumber(window.getComputedStyle(cloneSlides[index]).width);
        const totalWidth = index ? widthCloneSlide * index : 0 ;

        cloneWrapper.style.transform = `translateX(-${totalWidth}px)`
    }

    function checkFrameLastSlide(direction) { // функция которая высчитывает положение активного слайда по отношению к полю видимости и меняет положение обертки
        const widthFrame = deletePxTransformToNumber(window.getComputedStyle(frame).width);
        const widthSlide = deletePxTransformToNumber(window.getComputedStyle(slides[index]).width);
        const marginRight = deletePxTransformToNumber(window.getComputedStyle(slides[0]).marginRight);
        const currentWidthFrame = widthFrame + translateX;

        if (direction === 'next') {
            const totalWidthToSlide = index ? ((widthSlide + marginRight) * index) + widthSlide : widthSlide;

            if (totalWidthToSlide > currentWidthFrame) {
                translateX += widthSlide + marginRight;
                wrapper.style.transform = `translateX(-${translateX}px)`
            }
            if (totalWidthToSlide < translateX) {
                translateX = 0;
                wrapper.style.transform = `translateX(-${translateX}px)`
            }
        }
        if (direction === 'prev') {
            const quantitySlidesIntoFrame = Math.round(widthFrame / (widthSlide + marginRight));
            const totalWidthToSlide = index ? (widthSlide + marginRight) * index : 0 ;

            if (totalWidthToSlide < translateX) {
                translateX -= widthSlide + marginRight;
                wrapper.style.transform = `translateX(-${translateX}px)`
            }
            if (totalWidthToSlide > currentWidthFrame) {
                translateX += (widthSlide + marginRight) * ((index + 1) - quantitySlidesIntoFrame);
                wrapper.style.transform = `translateX(-${translateX}px)`
            }
        }
    }

    function startActions() { // функция которая запускает действия
        removeAllActiveClasses(slides, activeClass);
        addOrRemoveActiveClass(slides[index], activeClass, true);
        bigCloneSlidesChange();
    }

    function indexChange(e) { // функция которая изменяет переменную "порядковый номер"
        e.preventDefault();

        if (e.currentTarget == prevButton) {
            index = index <= 0 ? slides.length - 1 : index - 1 ;
            checkFrameLastSlide('prev');
        }
        if (e.currentTarget == nextButton) {
            index = index >= slides.length - 1 ? 0 : index + 1 ;
            checkFrameLastSlide('next');
        }

        startActions();
    }

    prevButton.addEventListener('click', indexChange);
    nextButton.addEventListener('click', indexChange);

    slides.forEach((slide, i) => {
        slide.addEventListener('click', e => {
            e.preventDefault();

            index = i;
            startActions();
        });
    });
}

export default customSlider;

// customSlider({
//     slidesIdentifier: '.b-product--content--slider--block--slide',
//     bigCloneSlidesIdentifier: '.b-product--content--slider--main-slide--slide',
//     prevButtonIdentifier: '[data-main-slider-button-prev]',
//     nextButtonIdentifier: '[data-main-slider-button-next]',
//     frameIdentifier: '.b-product--content--slider--block--frame',
//     wrapperIdentifier: '.b-product--content--slider--block--frame--wrapper',
//     bigCloneWrapperIdentifier: '.b-product--content--slider--main-slide--wrapper',
//     activeClass: 'b-product--content--slider--block--slide---active'  
// });