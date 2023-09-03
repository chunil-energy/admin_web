import {toTypedSchema} from "@vee-validate/zod";
import * as zod from "zod";
import {vehiclePositionChoice, vehicleTypeChoice} from "@/choices/vehicle";
import {companyOriginTypeChoice, companyTypeChoice, companyWorkTypeChoice} from "@/choices/company";

const companyUpdateSchema = toTypedSchema(
    zod.object({
        name: zod.string({required_error: "업체명은 필수 항목입니다.",}).nonempty('업체명은 필수 항목입니다.'),
        type: zod.enum(Object.keys(companyTypeChoice)),
        work_type: zod.enum(Object.keys(companyWorkTypeChoice)),
        ceo_name: zod.string().nullable().optional(),
        manager_name: zod.string().nullable().optional(),
        manager_tel: zod.string().nullable().optional(),
        manager_hp: zod.string().nullable().optional(),
        manager_email: zod.string().email().nullable().optional(),
    })
);

export default companyUpdateSchema
