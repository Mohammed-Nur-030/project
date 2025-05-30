import React from 'react'
import { BiBot, BiChevronDown } from 'react-icons/bi'

const Header = (props) => {
  const { toggleChat } = props
  return (
    <div className="justvoice__chat__header">
      <div className="justvoice__chat__header__botname">
        <div className="justvoice__chat__bot__image">
          {/* <BiBot /> */}
          <img
            style={{
              width: '60px',
              height: '60px',
            }}
            src={"/images/justlogo1.png"}
            alt=""
          />
        </div>
        <div className="justvoice__chat__bot__name">
          <div className="justvoice__chat__bot__name_p">AI</div>
          <small>Your Personal Assistant</small>
        </div>
      </div>
      <div
        onClick={toggleChat}
        className="justvoice__close__chat__icon__wrapper"
      >
        <div className="justvoice__close__chat__icon__bg"></div>
        <div className="justvoice__mic__zindex">
          <BiChevronDown className="justvoice__chat__down__chevron" />
        </div>
      </div>
    </div>
  )
}

export default Header
