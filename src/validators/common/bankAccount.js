import {toTypedSchema} from "@vee-validate/zod";
import * as zod from "zod";

const bankAccountObject = zod.object({
    bank: zod.string({required_error: '은행을 선택하세요.'}),
    account_number: zod.string({required_error: '계좌번호를 입력하세요.'}),
    account_holder: zod.string({required_error: '예금주를 입력하세요.'}),
})

const bankAccountSchema = toTypedSchema(bankAccountObject);

export {bankAccountSchema, bankAccountObject}
