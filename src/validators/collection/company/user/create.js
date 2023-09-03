import {toTypedSchema} from "@vee-validate/zod";
import * as zod from "zod";

const companyUserCreateSchema = toTypedSchema(
    zod.object({
        user: zod.number().transform(v => v === '' ? null : v).nullable().optional(),
        name: zod.string().transform(v => v === '' ? null : v).nullable().optional(),
        grade: zod.string().transform(v => v === '' ? null : v).nullable().optional(),
        tel: zod.string().transform(v => v === '' ? null : v).nullable().optional(),
        hp: zod.string().transform(v => v === '' ? null : v).nullable().optional(),
        email: zod.string().email().transform(v => v === '' ? null : v).nullable().optional(),
        is_owner: zod.boolean().nullable().optional(),
        memo: zod.string().transform(v => v === '' ? null : v).nullable().optional(),
    }).refine(
        schema => {
            return Boolean(schema.user) === true || Boolean(schema.name) === true
        }, {message: '사용자와 성함 중 하나를 반드시 입력하세요.', path: ['user', 'name']}
    ).refine(
        schema => {
                return Boolean(schema.tel) === true || Boolean(schema.hp) === true
        }, {message: '전화번호와 휴대전화번호 중 하나를 반드시 입력하세요.', path: ['tel', 'hp']}
    )
);

export default companyUserCreateSchema
