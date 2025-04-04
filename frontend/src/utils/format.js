export function formatEuro(amount) {
    const numericAmount = Number(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
        return 'Gratuit';
    }

    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
    }).format(numericAmount);
}
