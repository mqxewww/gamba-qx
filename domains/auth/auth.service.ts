import axiosInstance from "@/lib/axios";

export async function postMagicLink(email: string): Promise<void> {
  await axiosInstance.post<void>("/auth/magic-link", {
    email,
  });
}
