import "dotenv/config"
import z from "zod"

const envSchema = z.object({
    PORT: z.coerce.number().int().positive().default(3000),

    HOST: z.string().default("0.0.0.0"),

    NODE_ENV: z
        .enum(["development", "test", "production"])
        .default("development"),

    REDIS_URL: z.string().min(1),

    DATABASE_URL: z.string().min(1),
    MOCK_PAYMENT_WEBHOOK_SECRET: z.string().min(1),
    RABBITMQ_URL: z.string().min(1),
})

const result = envSchema.safeParse(process.env);

if (!result.success) {
    console.error("Invalid environment configuration:");
    console.error(z.treeifyError(result.error));

    process.exit(1);
}

export const env = result.data;