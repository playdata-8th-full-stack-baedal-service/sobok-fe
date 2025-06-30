import React from 'react';

function Header({ lefttitle, title, rightone, righttwo, rightthree }) {
  return (
    <header className='Header'>
      <div>{lefttitle}</div>
      <div>{title}</div>
      <div className='Right'>
        {rightone && <div>{rightone}</div>}
        {righttwo && <div>{righttwo}</div>}
        {rightthree && <div>{rightthree}</div>}
      </div>
    </header>
  );
}

export default Header;
