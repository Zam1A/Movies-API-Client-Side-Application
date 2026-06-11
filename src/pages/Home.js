import React from "react";
import Slider from "react-slick";
import { useHistory } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../pages/Home.css";
import image1 from "../images/image1.jpg";
import image2 from "../images/image2.jpg";
import image3 from "../images/image3.jpg";

const Home = () => {
  const history = useHistory();

  const handleNavigate = (path) => {
    history.push(path);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    dotsClass: "custom-dots",
    customPaging: () => <span></span>,
  };

  const slides = [
    { image: image1, alt: "Movies", path: "/movies", wrapper: "button-wrapper1" },
    { image: image2, alt: "Register", path: "/register", wrapper: "button-wrapper2" },
    { image: image3, alt: "Login", path: "/login", wrapper: "button-wrapper3" },
  ];

  return (
    <div className="home">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div
            key={slide.path}
            role="button"
            tabIndex="0"
            onClick={() => handleNavigate(slide.path)}
            onKeyDown={(event) => event.key === "Enter" && handleNavigate(slide.path)}
          >
            <img src={slide.image} alt={slide.alt} />
            <div className={slide.wrapper}></div>
          </div>
        ))}
      </Slider>
      <div className="home-footer">
        <p>Movie data is provided by OMDb.</p>
        <p>(c) 2023 Yan Xiong</p>
      </div>
    </div>
  );
};

export default Home;
