const init = function () {
  const imagesList = document.querySelectorAll(".gallery__item");
  imagesList.forEach((img) => {
    img.dataset.sliderGroupName = Math.random() > 0.5 ? "nice" : "good";
  });
  
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
    item.addEventListener("click", () => {
      fireCustomEvent(sliderRootElement, "slide-start");
    });
  });
  
  const navNext = sliderRootElement.querySelector(".js-slider__nav--next");
  navNext.addEventListener("click", function (e) {
    fireCustomEvent(e.currentTarget, "js-slider-img-next");
  });
  
  const navPrev = sliderRootElement.querySelector(".js-slider__nav--prev");
  navPrev.addEventListener("click", function (e) {
    fireCustomEvent(e.currentTarget, "js-slider-img-prev");
  });
  
  const zoom = sliderRootElement.querySelector(".js-slider__zoom");
  zoom.addEventListener("click", function (e) {
    if (e.target === e.currentTarget) {
      fireCustomEvent(e.currentTarget, "js-slider-close");
    }
  });
  zoom.addEventListener("click", () => {
    fireCustomEvent(sliderRootElement, "slide-stop");
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
  sliderRootElement.addEventListener("slide-start", slideStartStop.startSlide);
  sliderRootElement.addEventListener("slide-stop", slideStartStop.stopSlide);
  sliderRootElement.addEventListener("js-slider-img-prev", onImagePrev);
  sliderRootElement.addEventListener("js-slider-close", onClose);
};

const onImageClick = function (event, sliderRootElement, imagesSelector) {
  sliderRootElement.classList.add("js-slider--active");
  showZommedImg(event, sliderRootElement);
  showSliderThumbsItems(event, sliderRootElement, imagesSelector);
};

const onImageNext = function (event) {
  console.log(this, "onImageNext");
  
  const figureCurrent = this.querySelector(
    ".js-slider__thumbs-image--current"
  ).parentNode;
  const figureNext = figureCurrent.nextElementSibling;

  if (!figureNext) {
    changeImgToCurrent(this, getFirstThumbImage(this));
  } else {
    const imgNext = figureNext.querySelector(".js-slider__thumbs-image");
    changeImgToCurrent(this, imgNext);
  }
  function getFirstThumbImage(currentTarget) {
    const figureParent = currentTarget.querySelector(".js-slider__thumbs");
    const figureFirst = figureParent.children[1];
    const imgFirst = figureFirst.querySelector(".js-slider__thumbs-image");
    return imgFirst;
  }
};

const onImagePrev = function (event) {
  console.log(this, "onImagePrev");
  
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
    changeImgToCurrent(this, getLastThumbImage(this));
  } else {
    const imgPrev = figurePrev.querySelector(".js-slider__thumbs-image");
    changeImgToCurrent(this, imgPrev);
  }

  function getLastThumbImage(currentTarget) {
    const figureParent = currentTarget.querySelector(".js-slider__thumbs");
    const figureLast = figureParent.lastElementChild;
    const imgLast = figureLast.querySelector(".js-slider__thumbs-image");
    return imgLast;
  }
};

const onClose = function (event) {
  event.currentTarget.classList.remove("js-slider--active");
  const sliderThumbs = event.currentTarget.querySelector(".js-slider__thumbs");
  while (sliderThumbs.children.length > 1) {
    sliderThumbs.removeChild(sliderThumbs.children[1]);
  }
};

const slideStartStop = {
  intervalId: "",
  startSlide: function () {
    slideStartStop.intervalId = setInterval(() => {
      fireCustomEvent(this, "js-slider-img-next");
    }, 5000);
  },
  stopSlide: function () {
    clearInterval(slideStartStop.intervalId);
  },
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

function showZommedImg(event, sliderRootElement) {
  const imgSrc = event.currentTarget.querySelector(`.gallery__image`).src;
  const imgPlace = sliderRootElement.querySelector(".js-slider__image");
  imgPlace.src = imgSrc;
}

function showSliderThumbsItems(event, sliderRootElement, imagesSelector) {
  const sliderThumbs = sliderRootElement.querySelector(".js-slider__thumbs");
  const thumbsItemTemplate = createthumbsItemTemplate(sliderRootElement);
  const imgSrc = event.currentTarget.querySelector(`.gallery__image`).src;
  const imgGroup = event.currentTarget.dataset.sliderGroupName;
  const imagesList = Array.from(document.querySelectorAll(imagesSelector));

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
}

function createthumbsItemTemplate(sliderRootElement) {
  const sliderThumbs = sliderRootElement.querySelector(".js-slider__thumbs");
  const thumbsItemPrototype = sliderThumbs.cloneNode(true);
  thumbsItemPrototype
    .querySelector(".js-slider__thumbs-item--prototype")
    .classList.remove("js-slider__thumbs-item--prototype");
  const thumbsItemTemplate = thumbsItemPrototype.querySelector(
    ".js-slider__thumbs-item"
  );
  return thumbsItemTemplate;
}
