const isKorNumberKey = (evt) => {
    // const regex = /^[ㄱ-ㅎ가-힣a-zA-Z0-9]+$/;
    const regex = /^[ㄱ-ㅎ가-힣0-9]+$/;
    const keyPressed = evt.key
    if (!regex.test(keyPressed)) {
        evt.preventDefault()
    }
}

export default isKorNumberKey