//转化时间格式
export function formatDateTime(date) {
    return date
        ? new Intl.DateTimeFormat('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Asia/Shanghai', // 明确指定时区
        }).format(new Date(date)).replace(/\//g, '-')
        : '';
}
