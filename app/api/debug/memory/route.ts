import { NextResponse } from "next/server";

const MB = 1024 * 1024;

function mb(value: number) {
  return Math.round(value / MB);
}

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const usage = process.memoryUsage();

  return NextResponse.json({
    rssMB: mb(usage.rss),
    heapUsedMB: mb(usage.heapUsed),
    heapTotalMB: mb(usage.heapTotal),
    externalMB: mb(usage.external),
    arrayBuffersMB: mb(usage.arrayBuffers),
    uptimeSec: Math.round(process.uptime()),
  });
}
