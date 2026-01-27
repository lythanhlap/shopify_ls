document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-testimonial]").forEach((slider) => {
    const track = slider.querySelector("[data-track]");
    const viewport = slider.querySelector(".testimonial__viewport");
    const prevBtn = slider.querySelector("[data-prev]");
    const nextBtn = slider.querySelector("[data-next]");

    if (!track || !viewport) return;

    let items = Array.from(track.children);
    let itemWidth = 0;
    let visibleCount = 1;
    let index = 0;
    let isAnimating = false;

    const calc = () => {
      const rect1 = items[0].getBoundingClientRect();
      const rect2 = items[1].getBoundingClientRect();
      itemWidth = rect2.left - rect1.left;
      visibleCount = Math.round(viewport.offsetWidth / itemWidth);
    };

    const cloneSlides = () => {
      const headClones = items
        .slice(0, visibleCount)
        .map((el) => el.cloneNode(true));
      const tailClones = items
        .slice(-visibleCount)
        .map((el) => el.cloneNode(true));

      headClones.forEach((el) => track.appendChild(el));
      tailClones.reverse().forEach((el) => track.prepend(el));

      items = Array.from(track.children);
      index = visibleCount;
      track.style.transform = `translateX(-${index * itemWidth}px)`;
    };

    const move = (animate = true) => {
      track.style.transition = animate ? "transform 0.45s ease" : "none";
      track.style.transform = `translateX(-${index * itemWidth}px)`;
    };

    const init = () => {
      calc();
      cloneSlides();
    };

    nextBtn.addEventListener("click", () => {
      if (isAnimating) return;
      isAnimating = true;

      index++;
      move(true);

      setTimeout(() => {
        if (index >= items.length - visibleCount) {
          index = visibleCount;
          move(false);
        }
        isAnimating = false;
      }, 450);
    });

    prevBtn.addEventListener("click", () => {
      if (isAnimating) return;
      isAnimating = true;

      index--;
      move(true);

      setTimeout(() => {
        if (index < visibleCount) {
          index = items.length - visibleCount * 2;
          move(false);
        }
        isAnimating = false;
      }, 450);
    });

    window.addEventListener("resize", () => {
      track.style.transition = "none";
      track.style.transform = `translateX(-${index * itemWidth}px)`;
    });

    // mobile swipe
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    const swipeThreshold = 40; // minium swipe

    viewport.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      track.style.transition = "none";
    });

    viewport.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
      const diff = currentX - startX;
      track.style.transform = `translateX(${-(index * itemWidth) + diff}px)`;
    });

    viewport.addEventListener("touchend", () => {
      if (!isDragging) return;
      isDragging = false;

      const diff = currentX - startX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff < 0) {
          nextBtn.click(); // swipe left -> next
        } else {
          prevBtn.click(); // swipe right -> prev
        }
      } else {
        move(true); 
      }
    });

    init();
  });
});
