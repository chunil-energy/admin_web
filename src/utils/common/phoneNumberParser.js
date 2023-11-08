import onlyDigitParser from "@/utils/common/onlyDigitParser";

const phoneNumberParser = (value) => {
    const targetValue = onlyDigitParser(value)
    const length = targetValue.length
    let result = value
    if (length === 8) {
        result = `${targetValue.slice(0,4)}-${targetValue.slice(4,8)}`
    }
    if (length === 9 && targetValue.slice(0, 2) === '02') {
        result = `${targetValue.slice(0,2)}-${targetValue.slice(2,5)}-${targetValue.slice(5, 9)}`
    }
    if (length === 10) {
        if (targetValue.slice(0, 2) === '02') {
            result = `${targetValue.slice(0,2)}-${targetValue.slice(2,6)}-${targetValue.slice(6, 10)}`
        } else {
            result = `${targetValue.slice(0,3)}-${targetValue.slice(3,6)}-${targetValue.slice(6, 10)}`
        }
    }
    if (length === 11) {
        result = `${targetValue.slice(0,3)}-${targetValue.slice(3,7)}-${targetValue.slice(7, 11)}`
    }
    return result
}

export default phoneNumberParser