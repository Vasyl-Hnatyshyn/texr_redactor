import React from 'react';
import './App.css'

import Element from './components/Element'
import Form from './components/form/Form'

import {
  reduceSameElements,
  getSelectionData,
  sliceTextIntoParts,
} from './components/utils'

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {setCurrentCarretData, setElements} from "./store/actions";


const App = ({elements,setElements,currentCarretData,setCurrentCarretData}) => {


  const textEditorRef = React.useRef();
  const toJSON = () => console.log(JSON.stringify(elements))
  
  React.useLayoutEffect(() => {
    if (!currentCarretData) return;
    const { startIndex, chartChar } = currentCarretData
    if (!textEditorRef.current.childNodes[startIndex]) return;
    let target = textEditorRef.current.childNodes[startIndex].childNodes[0]
    if (!target) {
      target = document.createTextNode(''); 
      textEditorRef.current.childNodes[startIndex].appendChild(target);
    }
    const range = document.createRange();
    const sel = window.getSelection();
    range.setStart(target, chartChar);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    setCurrentCarretData(null);
  }, [elements, currentCarretData])
  
  const onChange = (e) => {
    e.preventDefault()
    const childrenArr = [...textEditorRef.current.children];
    const newElements = elements.map((element, index) => {
      const HTMLNodeText = childrenArr[index].innerText;
      if (element.text === HTMLNodeText || element.isLineBreak) return element;
      else return { ...element, text: HTMLNodeText}
    })
    const { startNodeIndex, startNodeCharIndex } = getSelectionData()
    setCurrentCarretData({ startIndex: startNodeIndex, chartChar: startNodeCharIndex })
    setElements(newElements)
  }
  
  const onKeyDown = (e) => {
    if (e.key === 'Delete') {
       const { 
        endNodeCharIndex,
        endNodeIndex,
        startNodeCharIndex,
        startNodeIndex
      } = getSelectionData()
      const lineBreakIndex = endNodeIndex + 1;
      const targetNodeLength = elements[endNodeIndex].text.length
      if (
        endNodeCharIndex + 1 === targetNodeLength &&
          elements[lineBreakIndex] &&
          elements[lineBreakIndex].isLineBreak
      ) {
        e.preventDefault();
        const newElements = elements.filter((element, index) => index !== lineBreakIndex)
        const elementsWithoutDuplicates = reduceSameElements(newElements)
        setCurrentCarretData({ startIndex: startNodeIndex, chartChar: startNodeCharIndex })
        setElements(elementsWithoutDuplicates)
      }
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const { startNodeIndex: nodeIndex, startNodeCharIndex: nodeCharIndex } = getSelectionData()
      const newElements = elements.reduce((acc, curr, index) => {
        if (index !== nodeIndex) return [...acc, curr];
        const [firstPart, secondPart] = sliceTextIntoParts(curr.text, nodeCharIndex)
        return [...acc, { ...curr, text: firstPart }, { isLineBreak: true }, { ...curr, text: secondPart }]
      }, [])
      setCurrentCarretData({ startIndex: nodeIndex + 2, chartChar: 0 })
      setElements(newElements)
    }
    if (e.key === 'Backspace') {
      const { 
        endNodeCharIndex,
        endNodeIndex,
        startNodeCharIndex,
        startNodeIndex
      } = getSelectionData()
      const lineBreakIndex = endNodeIndex - 1;
      if (
        endNodeCharIndex === -1 &&
        endNodeIndex === startNodeIndex &&
        startNodeCharIndex === 0 &&
          elements[lineBreakIndex].isLineBreak
      ) {
        e.preventDefault();
        const newElements = elements.filter((element, index) => index !== lineBreakIndex)
        const elementsWithoutDuplicates = reduceSameElements(newElements)
        setCurrentCarretData({ startIndex: startNodeIndex - 2, chartChar: elements[startNodeIndex - 2].length - 1 })
        setElements(elementsWithoutDuplicates)
      }
      
    }
  }

  const handleButton = (options) => {
    const {startNodeIndex, startNodeCharIndex, endNodeIndex, endNodeCharIndex} = getSelectionData();
    const newElements = elements.reduce((acc, curr, index) => {
      if (index < startNodeIndex || index > endNodeIndex || curr.isLineBreak) return [...acc, curr];

      if (index === startNodeIndex && index === endNodeIndex) {
        const [firstPart, middle, lastPart] = sliceTextIntoParts(curr.text, startNodeCharIndex, endNodeCharIndex + 1)
        return [...acc, { ...curr, text: firstPart }, { ...curr, text: middle, ...options }, { ...curr, text: lastPart }]
      }

      if (index === startNodeIndex) {
        const [firstPart, secondPart] = sliceTextIntoParts(curr.text, startNodeCharIndex)
        return [...acc, { ...curr, text: firstPart }, { ...curr, text: secondPart, ...options }]
      }

      if (index === endNodeIndex) {
        const [firstPart, secondPart] = sliceTextIntoParts(curr.text, endNodeCharIndex + 1)
        return [...acc, { ...curr, text: firstPart, ...options }, { ...curr, text: secondPart }]
      }
      return [...acc, { ...curr, ...options }]

    }, [])
    const elementsWithoutDuplicates = reduceSameElements(newElements)
    setCurrentCarretData({ startIndex: startNodeIndex, chartChar: startNodeCharIndex })
    setElements(elementsWithoutDuplicates)
  }
 
  return (
    <div>
      <Form
        onInputChange={handleButton}
        toJSON={toJSON}
      />

      <div  className="redactor-field" contentEditable ref={textEditorRef} onKeyDown={onKeyDown} onInput={onChange}>
        {elements.map((element, index) => (
          <Element 
            key={element.text + index} 
            {...element} 
            index={index}
          />
      ))}
  </div>
    </div>
  )
}


const mapStateToProps = (state) => ({
  elements: state.elements,
  currentCarretData: state.currentCarretData,

});

const mapDispatchToProps = (dispatch) => ({
  setElements: bindActionCreators(setElements, dispatch),
  setCurrentCarretData: bindActionCreators(setCurrentCarretData, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);