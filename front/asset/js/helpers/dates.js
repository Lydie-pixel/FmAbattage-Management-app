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

// Trier par année
export function initYearFilter(
    selectId,
    yearsBack = 5
) {

    const select =
        document.getElementById(selectId);
    if (!select) return;
    const currentYear =
        new Date().getFullYear();

    for (
        let i = currentYear;
        i >= currentYear - yearsBack;
        i--
    ) {
        const option =
            document.createElement("option");

        option.value = i;
        option.textContent = i;
        select.appendChild(option);
    }
    select.value = currentYear;
}