const init = function () {
  const imagesList = document.querySelectorAll(".gallery__item");
  imagesList.forEach((img) => {
    img.dataset.sliderGroupName = Math.random() > 0.5 ? "nice" : "good";
  }); // za każdym przeładowaniem strony przydzielaj inną nazwę grupy dla zdjęcia

  runJSSlider();
};

document.addEventListener("DOMContentLoaded", init);

const runJSSlider = function () {
  const imagesSelector = ".gallery__item";
  const sliderRootSelector = ".js-slider";

  const imagesList = document.querySelectorAll(imagesSelector);
  const sliderRootElement = document.querySelector(sliderRootSelector);

  initEvents(imagesList, sliderRootElement);
  initCustomEvents(imagesList, sliderRootElement, imagesSelector);
};

const initEvents = function (imagesList, sliderRootElement) {
  imagesList.forEach(function (item) {
    item.addEventListener("click", function (e) {
      fireCustomEvent(e.currentTarget, "js-slider-img-click");
    });
  });

  // todo:
  // utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-img-next]
  // na elemencie [.js-slider__nav--next]
  const navNext = sliderRootElement.querySelector(".js-slider__nav--next");
  navNext.addEventListener("click", function (e) {
    fireCustomEvent(e.currentTarget, "js-slider-img-next");
  });

  // todo:
  // utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-img-prev]
  // na elemencie [.js-slider__nav--prev]
  const navPrev = sliderRootElement.querySelector(".js-slider__nav--prev");
  navPrev.addEventListener("click", function (e) {
    fireCustomEvent(e.currentTarget, "js-slider-img-prev");
  });

  // todo:
  // utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-close]
  // tylko wtedy, gdy użytkownik kliknie w [.js-slider__zoom]
  const zoom = sliderRootElement.querySelector(".js-slider__zoom");
  zoom.addEventListener("click", function (e) {
    if (e.target === e.currentTarget) {
      fireCustomEvent(e.currentTarget, "js-slider-close");
    } else {
      return null;
    }
  });
};

const fireCustomEvent = function (element, name) {
  console.log(element.className, "=>", name);

  const event = new CustomEvent(name, {
    bubbles: true,
  });

  element.dispatchEvent(event);
};

const initCustomEvents = function (
  imagesList,
  sliderRootElement,
  imagesSelector
) {
  imagesList.forEach(function (img) {
    img.addEventListener("js-slider-img-click", function (event) {
      onImageClick(event, sliderRootElement, imagesSelector);
    });
  });

  sliderRootElement.addEventListener("js-slider-img-next", onImageNext);
  sliderRootElement.addEventListener("js-slider-img-prev", onImagePrev);
  sliderRootElement.addEventListener("js-slider-close", onClose);
};

const onImageClick = function (event, sliderRootElement, imagesSelector) {
  // todo:
  // 1. dodać klasę [.js-slider--active], aby pokazać całą sekcję
  // 2. wyszukać ściężkę (atrybut [src]) do klikniętego elementu i wstawić do [.js-slider__image]
  // 3. pobrać nazwę grupy zapisaną w dataset klikniętego elementu
  // 4. wyszukać wszystkie zdjęcia należące do danej grupy, które wykorzystasz do osadzenia w dolnym pasku
  // 5. utworzyć na podstawie elementu [.js-slider__thumbs-item--prototype] zawartość dla [.js-slider__thumbs]
  // 6. zaznaczyć przy pomocy klasy [.js-slider__thumbs-image--current], który element jest aktualnie wyświetlany

  sliderRootElement.classList.add("js-slider--active");
  const imgSrc = event.currentTarget.querySelector(`.gallery__image`).src;
  const imgPlace = sliderRootElement.querySelector(".js-slider__image");
  imgPlace.src = imgSrc;
  const imgGroup = event.currentTarget.dataset.sliderGroupName;
  const imagesList = Array.from(document.querySelectorAll(imagesSelector));

  const sliderThumbs = sliderRootElement.querySelector(".js-slider__thumbs");
  const thumbsItemPrototype = sliderThumbs.cloneNode(true);
  thumbsItemPrototype
    .querySelector(".js-slider__thumbs-item--prototype")
    .classList.remove("js-slider__thumbs-item--prototype");
  const thumbsItemTemplate = thumbsItemPrototype.querySelector(
    ".js-slider__thumbs-item"
  );

  for (let ele of imagesList) {
    if (ele.dataset.sliderGroupName === imgGroup) {
      const clonedTemplate = thumbsItemTemplate.cloneNode(true);
      const thumbsImage = clonedTemplate.querySelector(
        ".js-slider__thumbs-image"
      );
      const eleImgSrc = ele
        .querySelector(".gallery__image")
        .getAttribute("src");
      thumbsImage.src = eleImgSrc;

      if (thumbsImage.src === imgSrc) {
        thumbsImage.classList.add("js-slider__thumbs-image--current");
      }

      sliderThumbs.appendChild(clonedTemplate);
    }
  }
};

const onImageNext = function (event) {
  console.log(this, "onImageNext");
  // [this] wskazuje na element [.js-slider]

  // todo:
  // 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
  // 2. znaleźć element następny do wyświetlenie względem drzewa DOM dla [.js-slider__thumbs]
  // 3. sprawdzić czy ten element istnieje - jeśli nie to [.nextElementSibling] zwróci [null]
  // 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
  // 5. podmienić atrybut o nazwie [src] dla [.js-slider__image]

  const figureCurrent = this.querySelector(
    ".js-slider__thumbs-image--current"
  ).parentNode;
  const figureNext = figureCurrent.nextElementSibling;

  if (!figureNext) {
    const imgFirst = this.querySelector(
      ".js-slider__thumbs"
    ).children[1].querySelector(".js-slider__thumbs-image");
    changeImgToCurrent(this, imgFirst);
  } else {
    const imgNext = figureNext.querySelector(".js-slider__thumbs-image");
    changeImgToCurrent(this, imgNext);
  }
};

const onImagePrev = function (event) {
  console.log(this, "onImagePrev");
  // [this] wskazuje na element [.js-slider]

  // todo:
  // 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
  // 2. znaleźć element poprzedni do wyświetlenie względem drzewa DOM dla [.js-slider__thumbs]
  // 3. sprawdzić czy ten element istnieje i czy nie posiada klasy [.js-slider__thumbs-item--prototype]
  // 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
  // 5. podmienić atrybut [src] dla [.js-slider__image]

  const figureCurrent = this.querySelector(
    ".js-slider__thumbs-image--current"
  ).parentNode;
  const figurePrev = figureCurrent.previousElementSibling;

  if (
    !figurePrev ||
    figurePrev
      .getAttribute("class")
      .includes("js-slider__thumbs-item--prototype")
  ) {
    const imgLast = this.querySelector(
      ".js-slider__thumbs"
    ).lastElementChild.querySelector(".js-slider__thumbs-image");
    changeImgToCurrent(this, imgLast);
  } else {
    const imgPrev = figurePrev.querySelector(".js-slider__thumbs-image");
    changeImgToCurrent(this, imgPrev);
  }
};

const onClose = function (event) {
  // todo:
  // 1. należy usunać klasę [js-slider--active] dla [.js-slider]
  // 2. należy usunać wszystkie dzieci dla [.js-slider__thumbs] pomijając [.js-slider__thumbs-item--prototype]
  event.currentTarget.classList.remove("js-slider--active");
  const sliderThumbs = event.currentTarget.querySelector(".js-slider__thumbs");
  while (sliderThumbs.children.length > 1) {
    sliderThumbs.removeChild(sliderThumbs.children[1]);
  }
};

function changeImgToCurrent(currentTarget, newCurrentImg) {
  const imgCurrent = currentTarget.querySelector(
    ".js-slider__thumbs-image--current"
  );
  imgCurrent.classList.remove("js-slider__thumbs-image--current");
  newCurrentImg.classList.add("js-slider__thumbs-image--current");
  const imgNextPlace = currentTarget.querySelector(".js-slider__image");
  imgNextPlace.src = newCurrentImg.src;
}