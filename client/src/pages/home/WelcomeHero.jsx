import React from 'react';
import logo from '../../attachments/logo.png';

const WelcomeHero = () => {
  return (
    <div className="homeHero">
      <img src={logo} alt="TalkNet Logo Large" className="heroLogo" />
      <h2 className="heroSubtitle">Connect. Talk. Share.</h2>
      <div className="heroBackgroundDecoration"></div>
    </div>
  );
};

export default WelcomeHero;