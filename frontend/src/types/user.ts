export interface UserSummary {
  id: number;
  name: string;
  email: string;
  role: "OWNER" | "EMPLOYEE";
  branchName: string;
  active: boolean;
}

export interface CreateUserResult {
  username: string;
  temporaryPassword: string;
}