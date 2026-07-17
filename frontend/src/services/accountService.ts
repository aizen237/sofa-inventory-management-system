import api from "./api";

export async function changePassword(currentPassword: string, newPassword: string) {
  await api.put("/account/change-password", { currentPassword, newPassword });
}