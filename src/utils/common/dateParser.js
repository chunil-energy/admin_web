import dayjs from "dayjs"
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/ko';


dayjs.extend(utc)
dayjs.locale('ko')

const dateParser = (dateTimeString) => {
    return dayjs(dateTimeString).format('YYYY-MM-DD')
}

export default dateParser