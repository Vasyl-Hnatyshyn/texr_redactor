export const reduceSameElements = (elements) => elements.reduce((acc, curr, index) => {
  if (curr.text === '') return acc;
  if (index === 0 || acc.length === 0) return [curr];
  const lastElement = acc[acc.length - 1];
  if (
    !curr.isLineBreak &&
    curr.fontSize === lastElement.fontSize &&
    curr.color === lastElement.color &&
    curr.backgroundColor === lastElement.backgroundColor
  ) {
    const currentValues = acc.slice(0, acc.length - 1);
    const mergedText = lastElement.text + curr.text;
    return [...currentValues, { ...lastElement, text: mergedText }];
  } else {
    return [...acc, curr]
  }
}, [])

export const getSelectionData = () => {
  const selObj = window.getSelection();
  const selRange = selObj.getRangeAt(0);
  const startNodeIndex = parseInt(selRange.startContainer.parentNode.dataset.index);
  const startNodeCharIndex = selRange.startOffset;
  const endNodeIndex = parseInt(selRange.endContainer.parentNode.dataset.index);
  const endNodeCharIndex = selRange.endOffset - 1;
  return {startNodeIndex, startNodeCharIndex, endNodeIndex, endNodeCharIndex}
}

export const sliceTextIntoParts = (text, firstBreak, secondBreak) => {
  if (firstBreak !== undefined && secondBreak !== undefined) {
    const firstPart = text.slice(0, firstBreak);
    const middle = text.slice(firstBreak, secondBreak);
    const lastPart = text.slice(secondBreak);
    return [firstPart, middle, lastPart]
  } else if (firstBreak !== undefined && secondBreak === undefined) {
    const firstPart = text.slice(0, firstBreak);
    const secondPart = text.slice(firstBreak);
    return [firstPart, secondPart]
  }
}