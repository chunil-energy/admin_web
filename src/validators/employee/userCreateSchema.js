import {toTypedSchema} from "@vee-validate/zod";
import * as zod from "zod";
import {employmentTypeChoice, payTypeChoice} from "@/choices/employee";

const userCreateSchema = toTypedSchema(
    zod.object({
        username: zod.string(
            {required_error: '사용자명은 필수 항목입니다.'}
        ).min(
            3, '사용자명을 3자리 이상 입력하세요.'
        ).max(
            15, '사용자명을 15자리 이하로 입력하세요.'
        ),
        password: zod.string({
            required_error: '비밀번호는 필수 항목입니다.'
        }).min(10, '비밀번호를 10자리 이상 입력하세요.'),
        password1: zod.string({required_error: '비밀번호 확인은 필수 항목입니다.'}),
        name: zod.string({required_error: '성명은 필수 항목입니다.'}),
        cellphone: zod.string().nullable().optional(),
        email: zod.string().email('이메일 형식이 올바르지 않습니다.').nullable().optional(),
    }).refine(schema => {
            return schema.password === schema.password1
    }, {message: '비밀번호가 일치하지 않습니다.', path: ['password']})
);

export default userCreateSchema
