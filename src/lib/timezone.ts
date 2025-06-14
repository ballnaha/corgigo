import { toZonedTime, fromZonedTime, format } from 'date-fns-tz';
import { parseISO } from 'date-fns';

// Thailand timezone
export const THAILAND_TIMEZONE = 'Asia/Bangkok';

/**
 * แปลงเวลาปัจจุบันเป็นเวลาประเทศไทยแล้วเก็บเข้า DB
 * @returns Date object ที่ปรับเป็นเวลาไทยแล้ว
 */
export function getThailandNow(): Date {
  // สร้างเวลาไทยปัจจุบันโดยการเพิ่ม 7 ชั่วโมงจาก UTC
  // เพื่อให้ database เก็บเป็นเวลาไทยจริงๆ (เช่น 10:xx:xx แทนที่จะเป็น 03:xx:xx)
  const now = new Date();
  const thaiOffset = 7 * 60 * 60 * 1000; // 7 hours in milliseconds
  return new Date(now.getTime() + thaiOffset);
}

/**
 * แปลงเวลาใดๆ เป็นเวลาประเทศไทย
 * @param date - Date object หรือ string
 * @returns Date object ที่ปรับเป็นเวลาไทยแล้ว
 */
export function toThailandTime(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return toZonedTime(dateObj, THAILAND_TIMEZONE);
}

/**
 * แปลงเวลาไทยเป็น UTC สำหรับเก็บใน DB
 * @param thaiDate - Date object ในเวลาไทย
 * @returns Date object ในรูปแบบ UTC
 */
export function thaiTimeToUtc(thaiDate: Date): Date {
  return fromZonedTime(thaiDate, THAILAND_TIMEZONE);
}

/**
 * สร้าง Date object ใหม่ในเวลาไทยสำหรับเก็บ DB
 * @param year - ปี
 * @param month - เดือน (0-11)
 * @param day - วัน
 * @param hour - ชั่วโมง (0-23)
 * @param minute - นาที (0-59)
 * @param second - วินาที (0-59)
 * @returns Date object ที่ปรับเป็นเวลาไทยแล้ว
 */
export function createThailandDate(
  year: number,
  month: number,
  day: number,
  hour: number = 0,
  minute: number = 0,
  second: number = 0
): Date {
  // สร้าง Date ในเวลาไทย
  const thaiDate = new Date(year, month, day, hour, minute, second);
  // แปลงเป็น UTC สำหรับเก็บ DB
  return fromZonedTime(thaiDate, THAILAND_TIMEZONE);
}

/**
 * แสดงเวลาในรูปแบบไทย
 * @param date - Date object
 * @param formatString - รูปแบบการแสดงผล (default: 'dd/MM/yyyy HH:mm:ss')
 * @returns string ในรูปแบบเวลาไทย
 */
export function formatThailandTime(
  date: Date,
  formatString: string = 'dd/MM/yyyy HH:mm:ss'
): string {
  const thaiTime = toZonedTime(date, THAILAND_TIMEZONE);
  return format(thaiTime, formatString, { timeZone: THAILAND_TIMEZONE });
}

/**
 * ตรวจสอบว่าเวลาที่ส่งมาเป็นวันนี้ในเวลาไทยหรือไม่
 * @param date - Date object
 * @returns boolean
 */
export function isToday(date: Date): boolean {
  const today = getThailandNow();
  const thaiDate = toThailandTime(date);
  
  return (
    today.getFullYear() === thaiDate.getFullYear() &&
    today.getMonth() === thaiDate.getMonth() &&
    today.getDate() === thaiDate.getDate()
  );
}

/**
 * คำนวณความแตกต่างของเวลาเป็นนาที
 * @param date1 - Date object แรก
 * @param date2 - Date object ที่สอง
 * @returns จำนวนนาทีที่แตกต่าง
 */
export function getMinutesDifference(date1: Date, date2: Date): number {
  const diff = Math.abs(date1.getTime() - date2.getTime());
  return Math.floor(diff / (1000 * 60));
}

// Export constants
export const THAI_DATE_FORMAT = 'dd/MM/yyyy';
export const THAI_TIME_FORMAT = 'HH:mm';
export const THAI_DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';
export const THAI_FULL_DATETIME_FORMAT = 'dd/MM/yyyy HH:mm:ss'; 