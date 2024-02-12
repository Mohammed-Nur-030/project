import React from 'react'

const Message = (props) => {
  const { sentBy, message, key, funcResult } = props


  const url = 'https://nani.pk/products/'

  const headingColors = ['bg-red-400', 'bg-[#00a6d2]', 'bg-[#55eec2]', 'bg-[#bde644] ', 'bg-purple-400', 'bg-pink-400', 'bg-indigo-400'];
   

  return (
    <div
      className={`${
        sentBy === 'user'
          ? 'justvoice__chat__msg__user'
          : 'justvoice__chat__msg__bot'
      }`}
    > 
       {message?.length > 0 ? (
        message
      ) : ( 
        <div className="justvoice_media_body">
          {funcResult?.map((m) => {
             const randomColorIndex = Math.floor(Math.random() * headingColors.length);
             console.log(randomColorIndex)
             const randomColor = headingColors[randomColorIndex];
            return(
              <div className="justvoice_media_head  rounded-xl my-2  shadow-lg bg-white ">
                <img src={m.image} className="justvoice_chat_img " alt="" />
                <h5  className={`text-md font-[500] text-center  rounded-b-xl py-2 text-white
                ${randomColor}
                `}
               >
                  <a target="_blank" href={url + m.handle}>
                    {m.title}
                  </a>{' '}
                </h5>
              </div>
            )
          })}
        </div>
       )} 
    </div>
  )
}

export default Message
