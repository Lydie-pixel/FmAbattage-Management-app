export function addDays(date, days) {
    const result = new Date(date);
    result.setDate(
        result.getDate() + days
    );
    return result;
}

export function getDevisExpiration(date) {
    return addDays(date, 15);
}

export function getFactureExpiration(date) {
    return addDays(date, 30);
}