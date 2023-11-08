const jobTypeChoice = {
    of: '일반 사무직',
    smm: '소형 수집운반 관리',
    sm: '소형 수집운반 기사',
    etc: '기타',
}

const jobTypeParser = (value) => {
    return jobTypeChoice[value]
}

export {jobTypeParser, jobTypeChoice}