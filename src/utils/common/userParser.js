
const userParser = (value) => {
    if (value.name) {
        return `${value.name}(${value.username})`
    } else {
        return value.username
    }
}

export default userParser