import { deleteCookie } from "@/lib/cookies";
import { toast } from "sonner";

export function logout(redirectTo = "/beranda") {
  try {
    deleteCookie("access_token");
    deleteCookie("refresh_token");
  } catch {
  }

  try {
    window.dispatchEvent(new Event("auth-change"));
  } catch {}

  try {
    toast("Sesi Anda berakhir, silakan login kembali.");
  } catch {}

  setTimeout(() => {
    try {
      window.location.href = redirectTo;
    } catch {
    }
  }, 700);
}

export default logout;
