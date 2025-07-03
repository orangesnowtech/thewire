// Add commas to numbers for better readability
export function numberCommas(num: number): string {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0';
  }
  
  return num.toLocaleString('en-US');
}
