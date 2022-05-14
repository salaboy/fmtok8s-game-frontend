import "./Header.scss";
import React, { useEffect, useState, useContext, useRef } from "react";
import { NavLink} from 'react-router-dom'
import Logo from '../../images/logo.svg';
import LogoWhite from '../../images/logo-white.svg';
import AppContext from '../../contexts/AppContext';
import Element from '../../components/Element/Element'
import cn from 'classnames';

function Header() {
    const { currentSection } = useContext(AppContext);

    return (
      <div className={  cn({
          ["Header"]: true,
          ["--home"]: currentSection === "home",
          ["--leaderboard"]: currentSection === "back-leaderboard",
        })}>
        <div className="Header__logo">
          <Element>
            {currentSection !== "leaderboard" && (
              <NavLink  to='/' exact> <img src={Logo} alt="KubeCon/KnativeCon 2022"/></NavLink>
            )}
            {currentSection === "leaderboard" && (
              <NavLink  to='/' exact> <img src={LogoWhite} alt="KubeCon/KnativeCon 2022"/></NavLink>
            )}
          </Element>
        </div>
      </div>
    );

}
export default Header;
