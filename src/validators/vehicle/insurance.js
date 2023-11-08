import * as zod from "zod";
import {toTypedSchema} from "@vee-validate/zod";

export const vehicleInsuranceCreateObject = zod.object({
    insurer: zod.string({required_error: "보험사는 필수 항목입니다.",}),
    policy_no: zod.string({required_error: "증권번호는 필수 항목입니다.",}),
    certificate: zod.string({required_error: "증권은 필수 항목입니다.",}),
    insurance_duration: zod.array(zod.date({invalid_type_error: '날짜 형식이 올바르지 않습니다.'})).length(2)

})

const vehicleInsuranceCreateSchema = toTypedSchema(vehicleInsuranceCreateObject);

export default vehicleInsuranceCreateSchema