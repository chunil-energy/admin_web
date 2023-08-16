import onlyDigitParser from "@/utils/onlyDigitParser";

const brnParser = (value) => {
    const targetValue = onlyDigitParser(value)
    if (targetValue.length !== 10) {
        return targetValue
    }
    return `${targetValue.slice(0,3)}-${targetValue.slice(3,5)}-${targetValue.slice(5, 10)}`
}

export default brnParser