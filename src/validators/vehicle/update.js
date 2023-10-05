import {toTypedSchema} from "@vee-validate/zod";
import * as zod from "zod";
import {vehiclePositionChoice, vehicleTypeChoice} from "@/choices/vehicle";

const vehicleUpdateSchema = toTypedSchema(
    zod.object({
        car_no: zod.string({required_error: "차량번호는 필수 항목입니다.",}).nonempty('차량번호는 필수 항목입니다.'),
        vin: zod.string({required_error: "차대번호는 필수 항목입니다."}).length(17, {message: '차대번호는 17자리 숫자+알파벳입니다.'}).nonempty('차대번호는 필수 항목입니다.'),
        name: zod.string({required_error: "차명은 필수 항목입니다.",}).nonempty('차명은 필수 항목입니다.'),
        position: zod.enum(Object.keys(vehiclePositionChoice)),
        vehicle_type: zod.enum(Object.keys(vehicleTypeChoice)),
        owner_party: zod.number({required_error: "차량 소유자는 필수 항목입니다.",}),
        user_party: zod.number({required_error: "차량 사용자는 필수 항목입니다.",}),
        manager_party: zod.number({required_error: "차량 관리자는 필수 항목입니다.",}),
        driver: zod.number().optional().nullable()
        // parent: zod.string().transform((value) => value === null ? '' : value.id).optional()
    })
);

export default vehicleUpdateSchema