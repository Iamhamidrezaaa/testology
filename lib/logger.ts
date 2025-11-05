import { prisma } from "@/lib/prisma";

export async function logEvent(
  layer: string, 
  action: string, 
  status: string, 
  meta: any = {}
) {
  try {
    const start = performance.now();

    await prisma.systemLog.create({
      data: {
        layer,
        action,
        status,
        meta,
        latencyMs: meta.latency || 0,
      },
    });

    const latency = Math.round(performance.now() - start);
    console.info(`[${layer}] ${action} (${status}) - ${latency}ms`);
  } catch (err) {
    console.error("Logger error:", err);
  }
}

export async function logError(layer: string, action: string, error: any, meta: any = {}) {
  try {
    await prisma.systemLog.create({
      data: {
        layer,
        action,
        status: "error",
        meta: {
          ...meta,
          error: error?.message || String(error),
          stack: error?.stack,
        },
        latencyMs: meta.latency || 0,
      },
    });
    console.error(`[${layer}] ${action} ERROR:`, error);
  } catch (err) {
    console.error("Error logger failed:", err);
  }
}

export async function logSuccess(layer: string, action: string, meta: any = {}) {
  try {
    await prisma.systemLog.create({
      data: {
        layer,
        action,
        status: "success",
        meta,
        latencyMs: meta.latency || 0,
      },
    });
    console.info(`[${layer}] ${action} SUCCESS`);
  } catch (err) {
    console.error("Success logger failed:", err);
  }
}











