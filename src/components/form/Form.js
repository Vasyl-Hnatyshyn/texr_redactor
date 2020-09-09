import React from 'react';
import './Form.css'


const Form = ({ onInputChange, toJSON }) => {
  const [bgColor, setBgColor] = React.useState("#000")
  const [textColor, setTextColor] = React.useState("#000")
  const [textSize, setTextSize] = React.useState("10px")

  const handleBgColorPicker = (e) => {
    const color = e.target.value
    onInputChange({ backgroundColor: color })
    setBgColor(color)
  }
  
  const handleTextColorPicker = (e) => {
    const color = e.target.value
    onInputChange({ color: color })
    setTextColor(color)
  }
  
  const handleTextSizePicker = (e) => {
    const size = e.target.value
    onInputChange({ fontSize: size })
    setTextSize(size)
  }

  return (
    <form >

      <label htmlFor="bg-color-picker">
        Background color
        <input type="color" id="bg-color-picker" value={bgColor} onChange={handleBgColorPicker} />
      </label>
      <label htmlFor="text-color-picker">
        Text color
        <input type="color" id="text-color-picker" value={textColor} onChange={handleTextColorPicker} />
      </label>
      <label htmlFor="text-size-picker">
        Font size
        <select id="text-size-picker" onChange={handleTextSizePicker} value={textSize}>
          <option value="5px">5</option>
          <option value="6px">6</option>
          <option value="8px">8</option>
          <option value="10px">10</option>
          <option value="12px">12</option>
          <option value="16px">16</option>
          <option value="20px">20</option>
          <option value="24px">24</option>
          <option value="50px">50</option>
        </select>
      </label>


      <button type="button" onClick={toJSON}>to JSON</button>

    </form>
  )
}

export default Form;