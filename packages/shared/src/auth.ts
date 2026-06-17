import { z } from "zod";

import { userRoleSchema, type UserRole } from "./roles.js";

export const passwordSchema = z
  .string()
  .min(8, "Senha deve ter no mínimo 8 caracteres")
  .regex(/[A-Za-z]/, "Senha deve conter pelo menos uma letra")
  .regex(/\d/, "Senha deve conter pelo menos um número");

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
});

export type LoginInput = z.infer<typeof loginSchema>;

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

export type MeResponse = {
  user: AuthUser;
};

export type UserRecord = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
};

export type UserListResponse = {
  items: UserRecord[];
};

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(120),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: passwordSchema,
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "A nova senha deve ser diferente da senha atual",
    path: ["newPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const createUserSchema = z.object({
  email: z.string().trim().email(),
  name: z.string().trim().min(2).max(120),
  password: passwordSchema,
  role: userRoleSchema.default("vendedor"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(2).max(120).optional(),
    role: userRoleSchema.optional(),
    active: z.boolean().optional(),
  })
  .refine((data) => data.name !== undefined || data.role !== undefined || data.active !== undefined, {
    message: "Informe ao menos um campo para atualizar",
  });

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const adminSetPasswordSchema = z.object({
  password: passwordSchema,
});

export type AdminSetPasswordInput = z.infer<typeof adminSetPasswordSchema>;
