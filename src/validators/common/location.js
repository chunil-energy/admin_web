import * as zod from "zod";
import {toTypedSchema} from "@vee-validate/zod";

const locationObject = zod.object({
    name: zod.string().optional().nullable(),
    address: zod.string({required_error: '주소를 입력하세요.'}),
    address_detail: zod.string({required_error: '상세 주소를 입력하세요.'}).nonempty('상세 주소를 입력하세요.'),
    meta: zod.any({required_error: '주소 메타데이터가 없습니다.'}),
    description: zod.string().optional().nullable(),
})


const locationSchema = toTypedSchema(locationObject);

export {locationSchema, locationObject}
