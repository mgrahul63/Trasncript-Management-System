import { useEffect, useState } from "react";

const Carousel = () => {
  const images = [
    { src: "/images/hall1.jpg", caption: "Welcome to Hall 1" },
    { src: "/images/hall2.jpg", caption: "Explore Hall 2" },
    { src: "/images/hall3.jpg", caption: "Experience Hall 3" },
    { src: "/images/hall4.jpg", caption: "Discover Hall 4" },
  ];

  const [index, setIndex] = useState(0);

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const goToSlide = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  // Auto-rotate every 10 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="transition-all duration-500 relative"
      style={{
        backgroundImage: `url(${images[index].src})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover", // Ensures image covers the area
        width: "100%",
        height: "600px", // Fixed height
        objectFit: "contain",
      }}
    >
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute px-2 py-1 rounded z-10 transition-all"
        aria-label="Previous slide"
        style={{
          position: "absolute",
          top: "50%",
          left: "30px",
          transform: "translate(-50%, -50%)",
          fontSize: "20px",
        }}
      >
        ←
      </button>

      <button
        onClick={nextSlide}
        className="absolute px-2 py-1 rounded z-10 transition-all"
        aria-label="Next slide"
        style={{
          position: "absolute",
          top: "50%",
          right: "0px",
          transform: "translate(-50%, -50%)",
          fontSize: "20px",
        }}
      >
        →
      </button>

      {/* Centered Caption */}
      <div
        className="absolute text-center px-8 py-4 rounded-lg backdrop-blur-sm max-w-[90%]"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "20px",
        }}
      >
        <h3 className="text-2xl font-bold text-center text-black">
          {images[index].caption}
        </h3>
      </div>

      {/* Slide Indicators */}
      <div
        className="absolute  flex gap-2"
        style={{
          position: "absolute",
          top: "90%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "20px",
        }}
      >
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === index ? "bg-white w-6" : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
