import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(6, "Password minimal 6 karakter"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Nama minimal 2 karakter")
      .max(50, "Nama maksimal 50 karakter")
      .regex(/^[a-zA-Z\s]+$/, "Nama hanya boleh berisi huruf dan spasi"),
    email: z
      .string()
      .min(1, "Email wajib diisi")
      .email("Format email tidak valid"),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password harus mengandung huruf besar, huruf kecil, angka, dan karakter khusus"
      ),
    password_confirmation: z.string().min(1, "Konfirmasi password wajib diisi"),
    phone_number: z
      .string()
      .min(10, "Nomor telepon minimal 10 digit")
      .regex(/^\+?[0-9]+$/, "Format nomor telepon tidak valid"),
  })
  .refine(data => data.password === data.password_confirmation, {
    message: "Password tidak cocok",
    path: ["password_confirmation"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
