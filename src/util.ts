/**
 * Cut input selection into 2 part and return text before selection start
 */
export function getBeforeSelectionText(input: HTMLTextAreaElement) {
  const { selectionStart } = input as any;
  return input.value.slice(0, selectionStart);
}

/**
 * Find the last match prefix index
 */
export function getLastMeasureIndex(text: string, prefix: string = ''): number {
  return text.lastIndexOf(prefix);
}

interface MeasureConfig {
  measureLocation: number;
  selectionEnd: number;
  prefix: string;
  targetText: string;
}

export function replaceWithMeasure(text: string, measureConfig: MeasureConfig) {
  const { measureLocation, selectionEnd, prefix, targetText } = measureConfig;

  // Do nothing if already exist same targetText
  const currentAfterMeasureText = text.slice(measureLocation);
  if (currentAfterMeasureText.indexOf(targetText) === prefix.length) {
    // [some text] + [@] + [target text] + [' ']
    const endLocation = measureLocation + prefix.length + targetText.length;
    let finalText = text;

    // Insert one space if not exist
    const lastChar = text[endLocation];
    if (lastChar !== ' ') {
      finalText = text.slice(0, endLocation) + ' ' + text.slice(endLocation);
    }

    return {
      text: finalText,
      selectionLocation: endLocation + 1,
    };
  }

  const beforeMeasureText = text.slice(0, measureLocation).replace(/ $/, '');
  const connectedStartText = `${beforeMeasureText} ${prefix}${targetText} `;
  const endText = text.slice(selectionEnd).replace(/^ /, '');

  return {
    text: `${connectedStartText}${endText}`,
    selectionLocation: connectedStartText.length,
  };
}
