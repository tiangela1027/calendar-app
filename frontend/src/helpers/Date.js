export function handleDate(item) {
    let itemDate = item.create_date
    let parsedDate = new Date(itemDate);
    return "Made: " + parsedDate.toLocaleDateString() + " | " + parsedDate.toLocaleTimeString();
}