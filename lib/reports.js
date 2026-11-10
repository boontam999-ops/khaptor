// รายงานประกาศไม่เหมาะสมจากผู้ใช้ (KV คีย์ reports = อาร์เรย์ ใหม่สุดก่อน)
export const REASONS = { scam: "สงสัยหลอกลวง", wrong: "ข้อมูลหรือราคาไม่ตรงความจริง", sold: "รถขายไปแล้ว", photo: "รูปไม่เหมาะสมหรือไม่ใช่รถคันนี้", dup: "ประกาศซ้ำ", other: "อื่นๆ" };
export const getReports = async env => (await env.SETTINGS.get("reports", "json")) || [];
export const saveReports = (env, list) => env.SETTINGS.put("reports", JSON.stringify(list.slice(0, 500)));
