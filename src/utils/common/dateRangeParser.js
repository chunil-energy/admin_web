import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.locale('ko')

const dateRangeParser = (value) => {
    let data = typeof value === 'string' ? JSON.parse(value) : value
    let bounds = data.bounds
    let lower = dayjs(data.lower)
    let upper = dayjs(data.upper)
    if (bounds[0] === "(") {
        lower = lower.add(1, 'day')
    }
    if (bounds[1] === ")") {
        upper = upper.add(-1, 'day')
    }
    return [lower.format('YYYY-MM-DD'), upper.format('YYYY-MM-DD')]
}

export default dateRangeParser