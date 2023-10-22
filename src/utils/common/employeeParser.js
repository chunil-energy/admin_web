
const employeeParser = (value) => {
    return value.grade ? `${value.name} ${value.grade}` : value.name
}

export default employeeParser