const birthDateFields = {
    day: {
        element: document.getElementById('day'),
        currentLength: 0,
        maxSize: 2,
        moveForward: () => moveForward(birthDateFields.month.element),
    },
    month: {
        element: document.getElementById('month'),
        currentLength: 0,
        maxSize: 2,
        moveBackward: () => moveBackward(birthDateFields.day.element),
        moveForward: () => moveForward(birthDateFields.year.element),
    },
    year: {
        element: document.getElementById('year'),
        currentLength: 0,
        maxSize: 4,
        moveBackward: () => moveBackward(birthDateFields.month.element),
    },
};

const backKey = 'ArrowLeft';
const forwardKeys = ["ArrowRight", "Tab"];

let cursorPositionSave = 0;

function moveBackward(targetField) {
    targetField.focus();
    targetField.selectionStart = targetField.value.length;
}

function moveForward(targetField) {
    targetField.focus();
    targetField.selectionStart = 0;
}

function updateCursorPositionSave() {
    const activeElement = document.activeElement;
    cursorPositionSave = activeElement.selectionStart;
    if (activeElement.id === 'year') {
        cursorPositionSave += birthDateFields.month.maxSize + 1;
        cursorPositionSave += birthDateFields.day.maxSize + 1;

    } else if (activeElement.id === 'month') {
        cursorPositionSave += birthDateFields.day.maxSize + 1;
    }
}

function cursorAlreadyAtTheBeginningOfTheElement() {
    const isAtTheStartOfTheCurrentElement = document.activeElement.selectionStart === 0;
    const hasCursorMoved = cursorPositionSave !== getCursorPosition();
    return isAtTheStartOfTheCurrentElement && !hasCursorMoved;
}

function cursorAlreadyAtTheEndOfTheElement() {
    const activeElement = document.activeElement;
    const isAtTheEndOfTheCurrentElement = activeElement.selectionStart === activeElement.value.length;
    const hasCursorMoved = cursorPositionSave !== getCursorPosition();
    return isAtTheEndOfTheCurrentElement && !hasCursorMoved;
}

function getCursorPosition() {
    const activeElement = document.activeElement;
    let cursorPosition = activeElement.selectionStart;

    if (activeElement.id === 'year') {
        cursorPosition += birthDateFields.month.maxSize + 1;
        cursorPosition += birthDateFields.day.maxSize + 1;

    } else if (activeElement.id === 'month') {
        cursorPosition += birthDateFields.day.maxSize + 1;
    }

    return cursorPosition;
}

const validator = /^\d+$/; // Only numbers
function validateField(event) {
    const fieldName = event.target.id;
    const field = birthDateFields[fieldName];
    const value = event.target.value;
    if (!validator.test(value) || value.length > field.maxSize) {
        field.element.value = value.substring(0, value.length - 1);
    }

    if (field.element.value.length >= field.maxSize && field.moveForward) {
        field.moveForward();
    }
    updateCursorPositionSave(fieldName, field);
    field.currentLength = value.length;
}

function moveCursor(event) {
    const fieldName = event.target.id;
    const field = birthDateFields[fieldName];
    const key = event.key;

    if (field.moveBackward &&
        backKey === key && cursorAlreadyAtTheBeginningOfTheElement()
    ) {
        field.moveBackward();

    } else if (field.moveForward &&
        forwardKeys.includes(key) &&
        cursorAlreadyAtTheEndOfTheElement()) {
        field.moveForward();
    }

    if (backKey.includes(key) || forwardKeys.includes(key)) {
        updateCursorPositionSave(fieldName, field);
    }
}

function handleBackspaceKey(event) {
    const fieldName = event.target.id;
    if (event.inputType === 'deleteContentBackward' &&
        event.target.value.length === 0 &&
        birthDateFields[fieldName].moveBackward
    ) {
        birthDateFields[fieldName].moveBackward();
        updateCursorPositionSave();
    }
}

for (const field of Object.values(birthDateFields)) {
    field.element.addEventListener('beforeinput', handleBackspaceKey);
    field.element.addEventListener('click', updateCursorPositionSave);
    field.element.addEventListener('input', validateField);
    field.element.addEventListener('keyup', moveCursor);
}