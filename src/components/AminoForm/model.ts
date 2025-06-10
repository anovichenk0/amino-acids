import { z } from "zod";

const aminoAcidSchema = z
    .string()
    .min(1, { message: "Последовательность не может быть пустой" })
    .regex(/^[ARNDCQEGHILKMFPSTWYV-]+$/i, {
        message:
            "Допустимы только латинские буквы аминокислот (A, R, N, D, C, E, Q, G, H, I, L, K, M, F, P, S, T, W, Y, V) и дефис (-)",
    })
    .transform((str) => str.toUpperCase());

export const schema = z.object({
    aminoFirst: aminoAcidSchema,
    aminoSecond: aminoAcidSchema,
});
