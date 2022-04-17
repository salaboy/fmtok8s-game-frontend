import "./Nav.scss";
import React, { useEffect, useState, useContext, useRef } from "react";
import { NavLink} from 'react-router-dom'
import AppContext from '../../contexts/AppContext';
import cn from 'classnames';

function Nav() {
  const {  currentSection } = useContext(AppContext);

    // let ticketsEnabled = window._env_.FEATURE_TICKETS_ENABLED
    // let c4pEnabled = window._env_.FEATURE_C4P_ENABLED

    return (
      <div className={  cn({
          ["Nav"]: true,
          ["--backoffice"]: currentSection === "back-office",
        })}>
        <div className="Nav__container">
        
          <div className="Nav__back-office">
            {currentSection !== "back-office" && (
              <span>
                <NavLink activeClassName='--active' to='/back-office' exact> -> </NavLink>
              </span>
            )}
            {currentSection === "back-office" && (
              <span>
                <NavLink activeClassName='--active' to='/' exact> Back to Site </NavLink>
              </span>
            )}
          </div>
        </div>
      </div>
    );

}
export default Nav;
