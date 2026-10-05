// Uso: node scripts/reset-admin-password.mjs [email] <nueva-contraseña>
// Si no se pasa email, usa admin@cptsantafe.org. Lee DATABASE_URL del .env.
import "dotenv/config";
import bcrypt from "bcryptjs";
import pg from "pg";

const args = process.argv.slice(2);
const [email, password] = args.length >= 2 ? args : ["admin@cptsantafe.org", args[0]];

if (!password || password.length < 8) {
  console.error("Uso: node scripts/reset-admin-password.mjs [email] <nueva-contraseña (mín. 8 caracteres)>");
  process.exit(1);
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  const hash = await bcrypt.hash(password, 10);
  const res = await client.query('UPDATE "AdminUser" SET "passwordHash" = $1 WHERE email = $2', [hash, email]);
  if (res.rowCount === 0) {
    console.error(`No existe un admin con el email ${email}`);
    process.exit(1);
  }
  console.log(`Contraseña actualizada para ${email}`);
} finally {
  await client.end();
}
