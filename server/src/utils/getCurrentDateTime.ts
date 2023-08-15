export function getCurrentDateAndTime() {
    const date = new Date();
    const timestampMilliseconds = date.getTime();
    const seconds = Math.floor(timestampMilliseconds / 1000); // Convert to seconds
    const nanoseconds = (timestampMilliseconds % 1000) * 1000000; // Convert milliseconds to nanoseconds
  
    return {
      _seconds: seconds,
      _nanoseconds: nanoseconds,
    };
  }
  