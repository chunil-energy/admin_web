import {toTypedSchema} from "@vee-validate/zod";
import * as zod from "zod";
import {employmentTypeChoice, payTypeChoice} from "@/choices/employee";
import {bankAccountObject} from "@/validators/common/bankAccount";
import {locationObject, locationSchema} from "@/validators/common/location";
import dayjs from "dayjs";

const employeeDetailSchema = toTypedSchema(
    zod.object({
        contract_company: zod.number({required_error: '고용 관계사를 선택하세요.'}),
        work_company: zod.number(),
        name: zod.string({required_error: '성명은 필수 항목입니다.'}),
        grade: zod.string().nullable().optional(),
        tel: zod.string().nullable().optional(),
        cellphone: zod.string({
            required_error: '휴대전화번호는 필수 항목입니다.'
        }),
        email: zod.string({
            required_error: '이메일은 필수 항목입니다.'
        }).email('올바른 이메일 형식이 아닙니다.').nullable().optional(),
        home: locationObject.nullable().optional(),
        // home_address: zod.string({required_error: '자택 주소는 필수 항목입니다.'}),
        // home_address_detail: zod.string({required_error: '자택 주소 상세는 필수 항목입니다.'}),
        // home_address_data: zod.any(),
        employment_type: zod.enum(Object.keys(employmentTypeChoice)),
        pay_type: zod.enum(Object.keys(payTypeChoice)),
        salary_account: bankAccountObject.optional().nullable(),
        work_start: zod.coerce.date().transform(v => dayjs(v).format('YYYY-MM-DD')),
        // work_start: zod.string({required_error: "입사일을 선택하세요."}).nonempty('배정일을 선택하세요.').pipe(zod.coerce.date({
        //     invalid_type_error: '날짜 형식이 올바르지 않습니다.'
        // })),
        work_end: zod.string().pipe(
            zod.coerce.date({invalid_type_error: '날짜 형식이 올바르지 않습니다.'})
        ).nullable().optional(),
    })
);

export default employeeDetailSchema
