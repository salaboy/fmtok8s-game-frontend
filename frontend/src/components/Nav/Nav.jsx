import "./Nav.scss";
import React, { useEffect, useState, useContext, useRef } from "react";
import { NavLink} from 'react-router-dom'
import AppContext from '../../contexts/AppContext';
import cn from 'classnames';

function Nav() {
  const {  currentSection, user } = useContext(AppContext);

    // let ticketsEnabled = window._env_.FEATURE_TICKETS_ENABLED
    // let c4pEnabled = window._env_.FEATURE_C4P_ENABLED

    return (
      <div className={  cn({
          ["Nav"]: true,
          ["--leaderboard"]: currentSection === "back-leaderboard",
        })}>
        <div className="Nav__container">
          {user && currentSection !== "leaderboard" && (
            <div className="Nav__user">{user.charAt(0)}</div>
          )}
          <div className="Nav__back-office">
            {currentSection !== "leaderboard" && (
              <span>
                <NavLink activeClassName='--active' to='/leaderboard' exact> -> </NavLink>
              </span>
            )}
            {currentSection === "leaderboard" && (
              <span>
                <NavLink activeClassName='--active' to='/' exact> {'<-'} </NavLink>
              </span>
            )}
          </div>
        </div>
      </div>
    );

}
export default Nav;
