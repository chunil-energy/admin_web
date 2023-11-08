import {toTypedSchema} from "@vee-validate/zod";
import * as zod from "zod";

const affiliateCreateObject = zod.object({
    name_legal: zod.string({required_error: "법인명은 필수 항목입니다.",}).nonempty('법인명은 필수 항목입니다.'),
    name: zod.string({required_error: "사업장명은 필수 항목입니다.",}).nonempty('사업장명은 필수 항목입니다.'),
    rep: zod.string({required_error: "대표자명은 필수 항목입니다.",}).nonempty('대표자명은 필수 항목입니다.'),
    brn: zod.string({required_error: '사업자등록번호는 필수 항목입니다.',}).nonempty('사업자등록번호는 필수 항목입니다.').length(10, {message: '사업자등록번호는 10자리 숫자입니다.'}),
    parent: zod.number().nullable().optional(),
    registration_no: zod.string().length(13, {message: '법인등록번호는 13자리 숫자입니다.'}).nullable().optional()
}).superRefine((values, context) => {
    if (!values.registration_no) {
        if (!values?.parent) {
            context.addIssue({
                code: zod.ZodIssueCode.custom,
                message: '주사업장이 없는 경우 법인등록번호는 필수 항목입니다.',
                path: ['registration_no'],
            });
        }
    } else {
        if (values?.parent) {
            context.addIssue({
                code: zod.ZodIssueCode.custom,
                message: '주사업장이 있는 경우 법인등록번호를 입력할 수 없습니다.',
                path: ['registration_no'],
            });
        }
    }
})

const affiliateCreateSchema = toTypedSchema(affiliateCreateObject)

export default affiliateCreateSchema