import React from 'react';

const Element = ({ index, text, fontSize = 14, color= 'black', backgroundColor = 'white', isLineBreak = false }) => {
  if (isLineBreak) return <br/>
  return (
    <span data-index={index} style={{fontSize, backgroundColor, color }}>
  	  {text}
  	</span>
  )
}

export default Element;