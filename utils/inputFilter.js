import emulateKeyboardTabDown from './emulateKeyboardTabDown'

/**
 * Integer - /^-?\d*$/.test(value)
 * Integer >= 0 - /^\d*$/.test(value)
 * Integer >= 0 and <= 500 - /^\d*$/.test(value) && (value === "" || parseInt(value) <= 500)
 * Float (use . or , as decimal separator) - /^-?\d*[.,]?\d*$/.test(value)
 * Currency (at most two decimal places) - /^-?\d*[.,]?\d{0,2}$/.test(value)
 * A-Z only - /^[a-z]*$/i.test(value)
 * Hexadecimal - /^[0-9a-f]*$/i.test(value)
 * */
// https://stackoverflow.com/a/469362/14366160
// Restricts input for the given textbox to the given inputFilter
export default function (inputFilter) {
  return {
    keyup: (e) => {
      let element = e.target;
      if (element) {
        if (e.keyCode === 13) {
          emulateKeyboardTabDown();
        }
      }
      processEvent.call(this, e, inputFilter);
    },
    keydown: (e) => {
      processEvent.call(this, e, inputFilter);
    }
  };
}

function processEvent (e, inputFilter) {
  let element = e.target;
  if (element) {
    if (inputFilter.regExp(element.value)) {
      if (inputFilter.hasOwnProperty('checkOnMax') && !inputFilter.checkOnMax(element.value)) {
        switch (inputFilter.name) {
          case 'checkIntegerOnMinMax':
          case 'checkDoubleOnMinMax':
            if (inputFilter.processValue) element.value = inputFilter.processValue(inputFilter.max);
            else element.value = inputFilter.max;
            break;
          case 'checkIntegerOnMax':
          case 'checkDoubleOnMax':
            if (inputFilter.processValue) element.value = inputFilter.processValue(inputFilter.max);
            else element.value = inputFilter.max;
            break;
        }
      } else {
        element.oldValue = element.value;
        element.oldSelectionStart = element.selectionStart;
        element.oldSelectionEnd = element.selectionEnd;
      }
    } else if (element.hasOwnProperty('oldValue')) {
      element.value = element.oldValue;
      element.setSelectionRange(element.oldSelectionStart, element.oldSelectionEnd);
    } else {
      element.value = '';
    }
  }
}
