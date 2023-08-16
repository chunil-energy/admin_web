import onlyDigitParser from "@/utils/onlyDigitParser";

const corpRegisterNoParser = (value) => {
    const targetValue = onlyDigitParser(value)
    if (targetValue.length !== 13) {
        return targetValue
    }
    return `${targetValue.slice(0,6)}-${targetValue.slice(6,13)}`
}

export default corpRegisterNoParser