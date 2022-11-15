import "./css/Home.css";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import React, { Component } from "react";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import * as Constants from "../Constants";
import { AuthContext } from "../App";
import Taller_Img from "../img/taller.jpeg";
import Clases_Img from "../img/clases.jpeg";
import Cuenco_Azul from "../img/cuenco-azul.jpeg";
import Cuenco_Marron from "../img/cuenco-marron.jpeg";
import Cuenco_Rosado from "../img/cuenco-rosado.jpeg";
import Plato_Blanco from "../img/plato-blanco.jpeg";
import Pote_Blanco from "../img/pote-blanco.jpeg";

import * as cursosService from "../services/cursos.service";
import Loader from "../components/basics/Loader";

import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { FreeMode, Pagination } from "swiper";

export default function Header() {
  const [cursos, setCursos] = useState([]);

  const value = useContext(AuthContext);

  let navigate = useNavigate();

  useEffect(() => {
    cursosService.find().then((data) => {
      setCursos(data);
    });
  }, []);
  if (cursos.length > 0) {
    return (
      <main className="container main">
        <div className="cont-home">
          <section className="bnida-cont">
            <h1 className="bnida-title">
              ¡Bienvenidas y bienvenidos a Cándida Gres!
            </h1>
            <p className="bnida-bajada">Tu imaginación, en tus manos.</p>
          </section>
          <section className="taller d-flex">
            <div className="taller-data">
              <h2>Taller</h2>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Modi,
                illum nostrum cumque asperiores eius a ea adipisci aut debitis
                at sint ratione dolorem aperiam perspiciatis pariatur quo ab non
                magnam. Quasi beatae, eligendi ipsum labore asperiores, cumque
                laborum mollitia possimus accusamus placeat voluptates,
                laboriosam dolorem commodi nihil. Neque est eaque aspernatur?
                Porro cupiditate sit non amet corrupti iste voluptatibus
                commodi. Ea odit ad est nisi exercitationem, ullam sapiente,
                maiores, recusandae perferendis praesentium quam provident autem
                repellat amet commodi. Quod voluptatibus necessitatibus
                perferendis quas repudiandae amet dolores rem aut distinctio
                voluptas?
              </p>
            </div>
            <img
              className="img-bnida"
              src={Taller_Img}
              alt="Taller donde se imparten las clases en Cándida Gres."
            />
          </section>
          <section className="clases d-flex">
            <div className="taller-data">
              <h2>Clases</h2>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Modi,
                illum nostrum cumque asperiores eius a ea adipisci aut debitis
                at sint ratione dolorem aperiam perspiciatis pariatur quo ab non
                magnam. Quasi beatae, eligendi ipsum labore asperiores, cumque
                laborum mollitia possimus accusamus placeat voluptates,
                laboriosam dolorem commodi nihil. Neque est eaque aspernatur?
                Porro cupiditate sit non amet corrupti iste voluptatibus
                commodi. Ea odit ad est nisi exercitationem, ullam sapiente,
                maiores, recusandae perferendis praesentium quam provident autem
                repellat amet commodi. Quod voluptatibus necessitatibus
                perferendis quas repudiandae amet dolores rem aut distinctio
                voluptas?
              </p>
            </div>
            <img
              className="img-bnida"
              src={Clases_Img}
              alt="Taller donde se imparten las clases en Cándida Gres."
            />
          </section>
          <section className="alumnos ">
            <div className="taller-data">
              <h2>Alumnas y alumnos</h2>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Modi,
                illum nostrum cumque asperiores eius a ea adipisci aut debitis
                at sint ratione dolorem aperiam perspiciatis pariatur quo ab non
                magnam. Quasi beatae, eligendi ipsum labore asperiores, cumque
                laborum mollitia possimus accusamus placeat voluptates,
                laboriosam dolorem commodi nihil. Neque est eaque aspernatur?
                Porro cupiditate sit non amet corrupti iste voluptatibus
                commodi. Ea odit ad est nisi exercitationem, ullam sapiente,
                maiores, recusandae perferendis praesentium quam provident autem
                repellat amet commodi. Quod voluptatibus necessitatibus
                perferendis quas repudiandae amet dolores rem aut distinctio
                voluptas?
              </p>
            </div>
            <Swiper
              slidesPerView={3.5}
              spaceBetween={30}
              freeMode={true}
              // pagination={{
              //   clickable: true,
              // }}
              modules={[FreeMode, Pagination]}
              className="mySwiper"
            >
              <SwiperSlide>
                <img
                  className="img-bnida-swiper"
                  src={Cuenco_Azul}
                  alt="Taller donde se imparten las clases en Cándida Gres."
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  className="img-bnida-swiper"
                  src={Pote_Blanco}
                  alt="Taller donde se imparten las clases en Cándida Gres."
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  className="img-bnida-swiper"
                  src={Cuenco_Rosado}
                  alt="Taller donde se imparten las clases en Cándida Gres."
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  className="img-bnida-swiper"
                  src={Cuenco_Marron}
                  alt="Taller donde se imparten las clases en Cándida Gres."
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  className="img-bnida-swiper"
                  src={Plato_Blanco}
                  alt="Taller donde se imparten las clases en Cándida Gres."
                />
              </SwiperSlide>
            </Swiper>
          </section>
        </div>
      </main>
    );
  } else {
    return (
      <main className="container main">
        <Loader></Loader>
      </main>
    );
  }
}

// export default Header;
