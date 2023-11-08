const isNumberKey = (evt) => {
    const allowedKeys =   ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    const keyPressed = evt.key
    if (!allowedKeys.includes(keyPressed)) {
        evt.preventDefault()
    }
}

export default isNumberKey