export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { iniciarCronMarketing } = await import("@/lib/marketing-queue");
    iniciarCronMarketing();
  }
}
