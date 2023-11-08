import {toTypedSchema} from "@vee-validate/zod";
import * as zod from "zod";

const userDetailSchema = toTypedSchema(
    zod.object({
        name: zod.string({required_error: '성명은 필수 항목입니다.'}),
        cellphone: zod.string().nullable().optional(),
        email: zod.string().email('이메일 형식이 올바르지 않습니다.').nullable().optional(),
    })
);

export default userDetailSchema
