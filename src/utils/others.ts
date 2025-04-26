import crypto from 'crypto';


export function getFileExtension(filename: string) {
   // Get file extension
   const fileExtension = filename.split('.').pop();
   return fileExtension;
}

/**
 * Convert duration string into milisecond. ie: 3d to 3*24*60*60*1000
 * @param {string} time - Time in human readable. i.e: 1d, 1m, 1w ..
 * @returns {number} - Duration in milisecond
 * @example 
 * const duration = convertToMili('3d'); // 259200000
 */
export function convertToMili(time: string | undefined): number {
   let duration = 0;

   if (!time) {
      return duration
   }
   const timeUnit = time.slice(-1); // get the last character
   const timeValue = parseInt(time.slice(0, -1)); // get the number part

   switch (timeUnit) {
      case 'ms':
         duration = timeValue; // milliseconds
         break;
      case 's':
         duration = timeValue * 1000; // seconds to milliseconds
         break;
      case 'm':
         duration = timeValue * 60 * 1000; // minutes to milliseconds
         break;
      case 'h':
         duration = timeValue * 60 * 60 * 1000; // hours to milliseconds
         break;
      case 'd':
         duration = timeValue * 24 * 60 * 60 * 1000; // days to milliseconds
         break;
      case 'w':
         duration = timeValue * 7 * 24 * 60 * 60 * 1000; // weeks to milliseconds
         break;
      case 'y':
         duration = timeValue * 365 * 24 * 60 * 60 * 1000; // years to milliseconds
         break;
      default:
         throw new Error('Invalid time unit');
   }
   return duration;
}


/**
 * * Normalize the object by removing unwanted properties and replace the _id to id.
 * @param {any} doc - The object to be normalized.
 */
export function normalizeObj(doc: any) {
   doc.id = doc._id.toString();
   delete doc._id;
   delete doc.__v;
   return doc;
}

export function generateOTP(): string {
   const otp = crypto.randomInt(100000, 999999);
   return otp.toString();
}