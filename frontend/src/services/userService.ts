import api from "./api";
import type { UserSummary, CreateUserResult } from "../types/user";

export async function getUsers(): Promise<UserSummary[]> {
  const response = await api.get<UserSummary[]>("/users");
  return response.data;
}

export async function updateUser(
  id: number,
  fullName: string,
  branchId: number,
  active: boolean
) {
  const response = await api.put(`/users/${id}`, { fullName, branchId, active });
  return response.data;
}

export async function createUser(
  fullName: string,
  roleName: string,
  branchId: number | null
): Promise<CreateUserResult> {
  const response = await api.post<CreateUserResult>("/users", {
    fullName,
    roleName,
    branchId,
  });
  return response.data;
}