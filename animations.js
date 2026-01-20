// Animated Number Count-Up
function animateValue(element, start, end, duration) {
    if (!element) return;

    const isPercentage = element.textContent.includes('%');
    const isDecimal = element.textContent.includes('.');
    const isCurrency = element.textContent.includes('+') || element.textContent.includes('-');

    const range = end - start;
    const increment = range / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
        current += increment;

        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }

        let displayValue;
        if (isPercentage) {
            displayValue = Math.round(current) + '%';
        } else if (isCurrency) {
            const sign = current >= 0 ? '+' : '';
            displayValue = sign + current.toFixed(2);
        } else if (isDecimal) {
            displayValue = current.toFixed(2);
        } else {
            displayValue = Math.round(current);
        }

        element.textContent = displayValue;
    }, 16);
}

// Export for use in main script
if (typeof window !== 'undefined') {
    window.animateValue = animateValue;
}
