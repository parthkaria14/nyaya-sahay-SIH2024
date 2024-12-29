import { useEffect } from "react";

const FloatingBlurredShapes = () => {
  useEffect(() => {
    const shapes = document.querySelectorAll(".blur-shape");
    
    const animateShapes = () => {
      shapes.forEach((shape) => {
        // Cast shape to HTMLElement
        const element = shape as HTMLElement;
        element.style.animation = "moveShapes 8s infinite ease-in-out";
      });
    };
    
    animateShapes();
  }, []);

  return (
    <>
      <div className="blur-shape blur-shape-1"></div>
    </>
  );
};

export default FloatingBlurredShapes;
