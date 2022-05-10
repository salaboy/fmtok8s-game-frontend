import "./SectionHero.scss";
import React from "react";
import Element from '../../components/Element/Element'
import cn from 'classnames';

function SectionHero({title, small, center, children, smaller}) {

    var titleElement;
    if(small){
      titleElement = (
        <h2 data-scroll data-scroll-speed="1">
          <Element inline>{title} </Element>
        </h2>
      )
    }else {
      titleElement = (
        <h1 data-scroll data-scroll-speed="1">
          <Element inline>{title} </Element>
        </h1>
      )
    }

    return (
      <div className={  cn({
          ["SectionHero"]: true,
          ["--small"]: small === true,
          ["--smaller"]: smaller === true,
          ["--center"]: center === true,
        })}>
        <section>
          <div className="SectionHero__title">
              {titleElement}
              <Element inline>{children}</Element>
          </div>


        </section>
      </div>
    );

}
export default SectionHero;
