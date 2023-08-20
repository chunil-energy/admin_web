// import vehiclePositionChoice from "@/choices/vehicle";

import {vehiclePositionChoice} from "@/choices/vehicle";

const vehiclePositionParser = (typeValue) => {
    return vehiclePositionChoice[typeValue]
}
export default vehiclePositionParser