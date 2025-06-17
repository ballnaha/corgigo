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

/**
 * Timezone utility functions for Thai timezone handling
 * ฟังก์ชันสำหรับจัดการเวลาไทยให้ถูกต้อง
 */

// ชื่อเดือนภาษาไทย
const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

// ชื่อเดือนภาษาไทยแบบสั้น
const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

/**
 * แปลงเวลาเป็นรูปแบบไทยแบบเต็ม (วันที่ + เวลา)
 * @param dateString - วันที่ในรูปแบบ string หรือ Date object
 * @returns วันที่และเวลาในรูปแบบไทย เช่น "15 มกราคม 2567 เวลา 16:30"
 */
export const formatThaiDateTime = (dateString: string | Date): string => {
  const date = new Date(dateString);
  
  // ใช้ UTC components เพื่อหลีกเลี่ยงปัญหา timezone conversion
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  
  const thaiYear = year + 543; // แปลงเป็นปี พ.ศ.
  const thaiMonthName = THAI_MONTHS[month];
  const formattedHour = hour.toString().padStart(2, '0');
  const formattedMinute = minute.toString().padStart(2, '0');
  
  return `${day} ${thaiMonthName} ${thaiYear} เวลา ${formattedHour}:${formattedMinute}`;
};

/**
 * แปลงเป็นวันที่ไทยเท่านั้น (ไม่มีเวลา)
 * @param dateString - วันที่ในรูปแบบ string หรือ Date object
 * @returns วันที่ในรูปแบบไทย เช่น "15 มกราคม 2567"
 */
export const formatThaiDate = (dateString: string | Date): string => {
  const date = new Date(dateString);
  
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  
  const thaiYear = year + 543;
  const thaiMonthName = THAI_MONTHS[month];
  
  return `${day} ${thaiMonthName} ${thaiYear}`;
};

/**
 * แปลงเป็นวันที่ไทยแบบสั้น
 * @param dateString - วันที่ในรูปแบบ string หรือ Date object
 * @returns วันที่ในรูปแบบไทยแบบสั้น เช่น "15 ม.ค. 67"
 */
export const formatThaiDateShort = (dateString: string | Date): string => {
  const date = new Date(dateString);
  
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  
  const shortThaiYear = (year + 543).toString().slice(-2); // เอาเฉพาะ 2 หลักท้าย
  const thaiMonthShort = THAI_MONTHS_SHORT[month];
  
  return `${day} ${thaiMonthShort} ${shortThaiYear}`;
};

/**
 * แปลงเป็นเวลาเท่านั้น (ไม่มีวันที่)
 * @param dateString - วันที่ในรูปแบบ string หรือ Date object
 * @returns เวลาในรูปแบบ HH:MM เช่น "16:30"
 */
export const formatThaiTime = (dateString: string | Date): string => {
  const date = new Date(dateString);
  
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  
  const formattedHour = hour.toString().padStart(2, '0');
  const formattedMinute = minute.toString().padStart(2, '0');
  
  return `${formattedHour}:${formattedMinute}`;
};

/**
 * แปลงเป็นรูปแบบ relative time (เช่น "2 ชั่วโมงที่แล้ว")
 * @param dateString - วันที่ในรูปแบบ string หรือ Date object
 * @returns เวลาแบบ relative เช่น "2 ชั่วโมงที่แล้ว", "3 วันที่แล้ว"
 */
export const formatThaiRelativeTime = (dateString: string | Date): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 1) {
    return 'เมื่อสักครู่';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} นาทีที่แล้ว`;
  } else if (diffHours < 24) {
    return `${diffHours} ชั่วโมงที่แล้ว`;
  } else if (diffDays < 7) {
    return `${diffDays} วันที่แล้ว`;
  } else {
    return formatThaiDate(dateString);
  }
};

/**
 * ฟังก์ชันสำหรับ debug เวลา
 * @param dateString - วันที่ที่ต้องการ debug
 * @param label - ป้ายกำกับสำหรับ log
 */
export const debugDateTime = (dateString: string | Date, label: string = 'DateTime'): void => {
  const date = new Date(dateString);
  
  console.group(`🕐 ${label} Debug`);
  console.log('Original input:', dateString);
  console.log('Parsed date (UTC):', date.toISOString());
  console.log('Parsed date (Local):', date.toString());
  console.log('Thai formatted:', formatThaiDateTime(dateString));
  console.groupEnd();
};

/**
 * ตรวจสอบว่าวันที่อยู่ในช่วงเวลาไหน
 * @param dateString - วันที่ที่ต้องการตรวจสอบ
 * @returns 'today' | 'yesterday' | 'this_week' | 'this_month' | 'older'
 */
export const getDateRange = (dateString: string | Date): 'today' | 'yesterday' | 'this_week' | 'this_month' | 'older' => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays <= 7) return 'this_week';
  if (diffDays <= 30) return 'this_month';
  return 'older';
}; 