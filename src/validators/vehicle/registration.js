import * as zod from "zod";
import {toTypedSchema} from "@vee-validate/zod";

export const vehicleRegistrationCreateObject = zod.object({
    issue_date: zod.coerce.date({invalid_type_error: '날짜 형식이 올바르지 않습니다.'}),
    registration: zod.string({required_error: "등록증은 필수 항목입니다.",}),
    memo: zod.string().optional().nullable()
})

const vehicleRegistrationCreateSchema = toTypedSchema(vehicleRegistrationCreateObject);

export default vehicleRegistrationCreateSchema