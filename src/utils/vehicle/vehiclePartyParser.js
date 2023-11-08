const vehiclePartyParser = (partyValue) => {
    if (partyValue.user) {
        return partyValue.user?.name ? `${partyValue.user.name}(${partyValue.user.username})` : partyValue.user.username
    } else if (partyValue.company) {
        return partyValue.company.name
    } else {
        return null
    }
}
export default vehiclePartyParser