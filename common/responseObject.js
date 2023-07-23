const ResponseObject = class {
  constructor() {}

  status(statusError, result = null) {
    return {
      responseStatus: new StatusErrorObject().status(statusError),
      result,
    };
  }
};

const StatusErrorObject = class {
  constructor() {
    this.table = {
      "00000": {
        status: "SUCCESS",
        message: "",
      },
      20000: {
        status: "ERROR",
        message: "ไม่พบ User Id",
      },
      20001: {
        status: "ERROR",
        message: "ไม่สามารถใช้อีเมลเดิมสมัครบริษัทซ้ำได้",
      },
      20002: {
        status: "ERROR",
        message: "ไม่พบ Company ID",
      },

      20003: {
        status: "ERROR",
        message: "Email หรือ Password ไม่ถูกต้อง",
      },
      30001: {
        status: "ERROR",
        message: "กรุณาระบุ data type ให้ถูกต้อง",
      },
      30002: {
        status: "ERROR",
        message: "ไม่มีสิทธิ์การเข้าถึง",
      },
      30003: {
        status: "ERROR",
        message: "ไม่พบ GPS Fixed Id ที่ติดตั้ง",
      },
      30004: {
        status: "ERROR",
        message: "สินทรัพย์ไม่ใช่ของบริษัท",
      },
      30005: {
        status: "ERROR",
        message: "สินทรัพย์ถูกเชื่อม GPS ในระบบแล้ว",
      },
      30006: {
        status: "ERROR",
        message: "GPS ID ถูกเชื่อมไปแล้ว",
      },
      30007: {
        status: "ERROR",
        message: "ไม่สามารถเพิ่ม Tag ซ้ำได้",
      },
      30008: {
        status: "ERROR",
        message: "กรุณาระบุ Tag Id กับ Tag Name ให้ถูกต้อง",
      },
      30009: {
        status: "ERROR",
        message: "ไม่พบ GPS ID ของบริษัท",
      },
      30010: {
        status: "ERROR",
        message: "ไม่สามารถสร้าง Area name ซ้ำได้",
      },
      30011: {
        status: "ERROR",
        message: "ไม่พบ Area Id ของบริษัท",
      },
      30012: {
        status: "ERROR",
        message: "เกิดข้อผิดพลาดในการ decrypt",
      },
      30013: {
        status: "ERROR",
        message: "ไม่พบ GPS ID ของบริษัท",
      },
      30014: {
        status: "ERROR",
        message: "ไม่พบ Tag Id ที่ต้องการแก้ไข",
      },
      30015: {
        status: "ERROR",
        message: "ไม่สามารถเพิ่ม Tag เกิน 10 Tag ได้",
      },
      30016: {
        status: "ERROR",
        message: "ไม่พบ Tag Id ที่ต้องการลบ",
      },
      30017: {
        status: "ERROR",
        message: "ไม่พบ Area Id ที่ต้องการลบ",
      },
      30018: {
        status: "ERROR",
        message: "ไม่สามารถสร้าง Tag เกิน 10 Tag ได้",
      },
      30019: {
        status: "ERROR",
        message: "ไม่สามารถสร้างชื่อ gps ซ้ำได้",
      },
      30020: {
        status: "ERROR",
        message: "ไม่พบ GPS Device ในฐานข้อมูล",
      },
      30021: {
        status: "ERROR",
        message: "กรุณาระบุวันเวลาในการ filter ให้ถูกต้อง",
      },
      30022: {
        status: "ERROR",
        message: "กรุณาระบุ page ให้ถูกต้อง",
      },
      30023: {
        status: "ERROR",
        message: "ไม่พบ GPS Device ในฐานข้อมูล",
      },

      90000: {
        status: "ERROR",
        message: "System error",
      },
    };
  }
  status(code) {
    return this.table[code]
      ? { code: code, ...this.table[code] }
      : { code: "90000", ...this.table["90000"] };
  }
};

module.exports = {
  ResponseObject,
};
