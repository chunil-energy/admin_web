import {toTypedSchema} from "@vee-validate/zod";
import * as zod from "zod";
const field = zod.union([
    zod.number().nonnegative({message: '0원 이상을 입력하세요'}), zod.string()
]).nullable().optional().transform((v) => v === '' ? null : v)

const priceSchema = toTypedSchema(
    zod.object({
            price_1t_m_xs: field,
            price_1t_m_sm: field,
            price_1t_m_1o3: field,
            price_1t_m_1o2: field,
            price_1t_m_2o3: field,
            price_1t_m_1: field,
            price_1t_f_xs: field,
            price_1t_f_sm: field,
            price_1t_f_1o3: field,
            price_1t_f_1o2: field,
            price_1t_f_2o3: field,
            price_1t_f_1: field,
            price_1t_c_xs: field,
            price_1t_c_sm: field,
            price_1t_c_1o3: field,
            price_1t_c_1o2: field,
            price_1t_c_2o3: field,
            price_1t_c_1: field,
            price_1t_w_xs: field,
            price_1t_w_sm: field,
            price_1t_w_1o3: field,
            price_1t_w_1o2: field,
            price_1t_w_2o3: field,
            price_1t_w_1: field,
            price_25t_m_1: field,
            price_25t_f_1: field,
            price_25t_c_1: field,
            price_25t_w_1: field,
    })
);

export default priceSchema
