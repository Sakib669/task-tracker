import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get("jobId");
  if (!jobId) {
    return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
  }

  const data = await redis.get(`job:${jobId}`);
  if (!data) {
    return NextResponse.json({ status: "pending" });
  }

  const parsed = JSON.parse(data);
  return NextResponse.json(parsed);
}
