import { useRef, useEffect } from "react";

export const useDragScroll = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const mouseDownHandler = (e: MouseEvent) => {
      isDown = true;
      element.classList.add("dragging");
      startX = e.pageX - element.offsetLeft;
      scrollLeft = element.scrollLeft;
    };

    const mouseLeaveHandler = () => {
      isDown = false;
      element.classList.remove("dragging");
    };

    const mouseUpHandler = () => {
      isDown = false;
      element.classList.remove("dragging");
    };

    const mouseMoveHandler = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - element.offsetLeft;
      const walk = (x - startX) * 1.5; 
      element.scrollLeft = scrollLeft - walk;
    };

    element.addEventListener("mousedown", mouseDownHandler);
    element.addEventListener("mouseleave", mouseLeaveHandler);
    element.addEventListener("mouseup", mouseUpHandler);
    element.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      element.removeEventListener("mousedown", mouseDownHandler);
      element.removeEventListener("mouseleave", mouseLeaveHandler);
      element.removeEventListener("mouseup", mouseUpHandler);
      element.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, []);

  return ref;
};
