import {vehicleTypeChoice} from "@/choices/vehicle";

const vehicleTypeParser = (typeValue) => {
    return vehicleTypeChoice[typeValue]
}
export default vehicleTypeParser