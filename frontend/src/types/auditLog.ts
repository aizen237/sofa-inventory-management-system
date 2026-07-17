export interface AuditLogEntry {
  id: number;
  userName: string;
  action: string;
  entityType: string;
  branchName: string;
  details: string;
  timestamp: string;
}