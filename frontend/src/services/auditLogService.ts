import api from "./api";
import type { AuditLogEntry } from "../types/auditLog";

export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  const response = await api.get<AuditLogEntry[]>("/audit-logs");
  return response.data;
}