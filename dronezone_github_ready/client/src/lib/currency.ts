/**
 * Format a number as Kenyan Shillings currency
 * @param amount The amount to format
 * @param options Formatting options
 * @returns Formatted string in Kenyan Shillings
 */
export function formatCurrency(
  amount: number | string | null | undefined,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    compact?: boolean;
  } = {}
): string {
  // Handle null, undefined or empty string
  if (amount === null || amount === undefined || amount === '') {
    return 'KSh 0.00';
  }

  // Convert to number if it's a string
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  // Handle invalid numbers
  if (isNaN(numericAmount)) {
    return 'KSh 0.00';
  }

  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    compact = false,
  } = options;

  try {
    const formatter = new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits,
      maximumFractionDigits,
      notation: compact ? 'compact' : 'standard',
      compactDisplay: 'short',
    });

    return formatter.format(numericAmount);
  } catch (error) {
    // Fallback in case of any error
    return `KSh ${numericAmount.toFixed(2)}`;
  }
}

/**
 * Convert USD to KES based on an approximate exchange rate
 * Note: In a production app, you would use a real-time exchange rate API
 */
export function convertUsdToKes(usdAmount: number | string | null | undefined): number {
  if (usdAmount === null || usdAmount === undefined || usdAmount === '') {
    return 0;
  }

  const numericAmount = typeof usdAmount === 'string' ? parseFloat(usdAmount) : usdAmount;
  
  if (isNaN(numericAmount)) {
    return 0;
  }

  // Using an approximate exchange rate of 1 USD = 130 KES
  // In a real application, this would come from an external API
  const exchangeRate = 130;
  
  return numericAmount * exchangeRate;
}