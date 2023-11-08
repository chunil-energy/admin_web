import {toTypedSchema} from "@vee-validate/zod";
import * as zod from "zod";
import {companyOriginTypeChoice, companyTypeChoice, companyWorkTypeChoice} from "@/choices/company";
import {locationObject} from "@/validators/common/location";

const companyCreateSchema = toTypedSchema(
    zod.object({
        name: zod.string({required_error: "업체명은 필수 항목입니다.",}).nonempty('업체명은 필수 항목입니다.'),
        type: zod.enum(Object.keys(companyTypeChoice)),
        work_type: zod.enum(Object.keys(companyWorkTypeChoice)),
        brn: zod.string().length(10, {message: '사업자등록번호는 10자리 숫자입니다.'}).nullable().optional(),
        ceo_name: zod.string().nullable().optional(),
        manager_name: zod.string().nullable().optional(),
        manager_tel: zod.string().nullable().optional(),
        manager_hp: zod.string().nullable().optional(),
        manager_email: zod.string().email().nullable().optional(),
        location: locationObject.nullable().optional(),
        registration: zod.string().uuid('올바른 파일 UUID가 아닙니다.').nullable().optional(),
        origin: zod.enum(Object.keys(companyOriginTypeChoice)).nullable().optional(),
        recruiter: zod.number().nullable().optional()
    })
);

export default companyCreateSchema
