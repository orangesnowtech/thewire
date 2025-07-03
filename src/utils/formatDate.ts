import { Timestamp } from 'firebase/firestore';

// Format date for display - handles both Date objects and Firestore Timestamps
export function formatDate(date: Date | string | Timestamp): string {
  let d: Date;
  
  // Handle different date types
  if (date instanceof Timestamp) {
    d = date.toDate();
  } else if (typeof date === 'string') {
    d = new Date(date);
  } else if (date instanceof Date) {
    d = date;
  } else {
    return 'Invalid Date';
  }
  
  if (isNaN(d.getTime())) {
    return 'Invalid Date';
  }

  const now = new Date();
  const diffTime = Math.abs(now.getTime() - d.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // If it's today
  if (diffDays === 0) {
    return 'Today';
  }
  
  // If it's yesterday
  if (diffDays === 1) {
    return 'Yesterday';
  }
  
  // If it's within a week
  if (diffDays <= 7) {
    return `${diffDays} days ago`;
  }
  
  // Otherwise, return formatted date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
