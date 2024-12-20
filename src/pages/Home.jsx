import "./Home.css";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

// import React, { Component } from "react";
import Taller_Img from "../img/taller.jpeg";
import Clases_Img from "../img/clases.jpeg";
import Cuenco_Azul from "../img/cuenco-azul.jpeg";
import Cuenco_Marron from "../img/cuenco-marron.jpeg";
import Cuenco_Rosado from "../img/cuenco-rosado.jpeg";
import Plato_Blanco from "../img/plato-blanco.jpeg";
import Pote_Blanco from "../img/pote-blanco.jpeg";
import Torno from "../img/torno.jpeg";

import { Swiper, SwiperSlide } from "swiper/react";

import { Autoplay, FreeMode } from "swiper";
import OpenClassBanner from "../components/OpenClassBanner/OpenClassBanner";
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

export default function Home({ props }) {

  return (
    <main className="container main">
      <div className="cont-home">
        <section>
          <OpenClassBanner props={{ setShowToast: props.setShowToast }} />
        </section>
        <section className="welcome-cont">
          <h1 className="title">
            ¡Bienvenidas y bienvenidos a Cándida Gres!
          </h1>
          <p className="slogan">Tu imaginación, en tus manos.</p>
        </section>
        <section className="row justify-content-between g-4" id="workshop">
          <div className="taller-data col-12 col-md-5">
            <h2>Taller</h2>
            <p>
              En el taller se pretende crear un espacio para la práctica del
              hacer cerámico, la decoración y la ornamentación de las
              creaciones propias, pudiendo con esto desarrollar la autonomía y
              puesta en práctica de las capacidades adquiridas.
            </p>
            <p>
              El universo cerámico es muy amplio. Hay diversas maneras de
              construir y, en nuestro taller, acompañamos la libre exploración
              sobre las diversas técnicas de trabajo del material. Hay quienes
              dan sus primeros pasos en el torno y quienes se están
              perfeccionando.
            </p>
            <p>
              {" "}
              Permanecemos en constante búsqueda de creaciones innovadoras
              para que tengas siempre algo nuevo y diferente. ¡Animate!
            </p>
          </div>
          <div className="col-12 col-md-6">

            <img
              className="w-100 lazyload"
              data-src={Taller_Img}
              alt="Taller donde se imparten las clases en Cándida Gres."
              loading="lazy"
            />
          </div>
        </section>
        <section className="classes-row row justify-content-between g-4" id="classes">
          <div className="taller-data col-12 col-md-5">
            <h2>Clases</h2>
            <p>
              Las clases de cerámica se plantean como una actividad donde
              quienes deseen participar podrán adquirir destrezas y
              competencias que podrán aplicar en situaciones propias del hacer
              cerámico. Los participantes serán capaces de conocer el proceso
              de elaboración de la pasta cerámica, amasarla, centrarla en el
              torno, ahuecarla, estirarla verticalmente, tornear y retornear,
              ornamentar y decorar.
            </p>
            <p>
              El objetivo de este taller es el de crear un ámbito de
              conocimiento, aprendizaje y expresión a través de la cerámica.
              La arcilla es un material de potencialidades únicas, y al
              trabajar con ella conectamos con algo ancestral, que ha
              acompañado a todas las culturas humanas desde sus inicios.
            </p>
            <p>
              La clase está dirigida a adultos con o sin experiencia previa.
              La modalidad de trabajo es una guía personalizada en la
              concepción y desarrollo de proyectos personales, incluyendo a
              quienes –a pesar de contar con conocimientos anteriores– deseen
              profundizar determinadas temáticas o técnicas específicas.
            </p>
          </div>
          <img
            className="col-12 col-md-6 lazyload"
            data-src={Clases_Img}
            alt="Taller donde se imparten las clases en Cándida Gres."
            loading="lazy"
          />
        </section>
        <section id="students">
          <div className="taller-data mb-5">
            <h2>Alumnas y alumnos</h2>
            <p>
              A continuación te mostramos algunas de las cosas que podés hacer
              en el taller. Desde vasijas hasta platos y decoraciones, vas a
              aprender a expresarte a través de la cerámica para sacar a
              bailar toda tu imaginación y tus ideas. Estas piezas son de
              alumnos que no tenían experiencia previa antes de asistir al
              taller, y ahora pueden decorar, utilizar, vender y regalar sus
              creaciones. ¡Vos también podes ser parte de este aprendizaje!
            </p>
          </div>
          <div className="container overflow-hidden row d-grid">

            <Swiper
              slidesPerView={window.innerWidth < 500 ? 1.5 : 3.5}
              spaceBetween={30}
              freeMode={true}
              grabCursor={true}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              modules={[Autoplay, FreeMode]}
              className="mySwipe col-12"
            >
              <SwiperSlide>
                <img
                  className="home-swiper-img lazyload"
                  data-src={Cuenco_Azul}
                  alt="Taller donde se imparten las clases en Cándida Gres."
                  loading="lazy"

                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  className="home-swiper-img lazyload"
                  data-src={Pote_Blanco}
                  alt="Taller donde se imparten las clases en Cándida Gres."
                  loading="lazy"

                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  className="home-swiper-img lazyload"
                  data-src={Cuenco_Rosado}
                  alt="Taller donde se imparten las clases en Cándida Gres."
                  loading="lazy"

                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  className="home-swiper-img lazyload"
                  data-src={Cuenco_Marron}
                  alt="Taller donde se imparten las clases en Cándida Gres."
                  loading="lazy"

                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  className="home-swiper-img lazyload"
                  data-src={Torno}
                  alt="Taller donde se imparten las clases en Cándida Gres."
                  loading="lazy"

                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  className="home-swiper-img lazyload"
                  data-src={Plato_Blanco}
                  alt="Taller donde se imparten las clases en Cándida Gres."
                  loading="lazy"

                />
              </SwiperSlide>
            </Swiper>
          </div>

        </section>
        <section className="contact-row row justify-content-between g-4" id="contact">
          <div className="taller-data col-12 col-xl-5">
            <h2>Contactanos</h2>
            <ul className="p-0 d-flex flex-column gap-4">
              <li className="d-flex align-items-center gap-2"><span className="pi pi-map-marker"></span><span><span className="negritas">Taller:</span> Av del Puerto 215, Piso 6 of 619, Bahía Grande, Nordelta Tigre</span></li>
              <li className="d-flex align-items-center gap-2"><span className="pi pi-whatsapp"></span><span><span className="negritas">Whatsapp:</span> 11 6826-5868</span></li>
              <li className="d-flex align-items-center gap-2"> <span className="pi pi-instagram"></span><span><span className="negritas">Instagram:</span> <a className="decoration-none" href='https://www.instagram.com/candidagres/' target="_blank" rel="noreferrer">candidagres</a></span></li>
            </ul>
          </div>
          <div className="col-12 col-xl-6 rounded-4 overflow-hidden p-0 map-cont">
            <iframe title="workshop-location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3292.154999060103!2d-58.6502908235186!3d-34.39740604663305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bca1d244596239%3A0xfbd1bff6e48c05fd!2sAv.%20del%20Puerto%20215%2C%20B1670%20Rinc%C3%B3n%20de%20Milberg%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1734476923909!5m2!1ses!2sar" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </section>
      </div>
    </main>
  );
  // } else {
  //   return (
  //     <main className="container main">
  //       <Loader></Loader>
  //     </main>
  //   );
  // }
}

// export default Header;
