import { NextResponse } from "next/server";
import { getProjectPickerOptions } from "@/lib/projects";

export async function GET() {
  try {
    const projects = await getProjectPickerOptions();
    return NextResponse.json({ projects });
  } catch {
    return NextResponse.json({ projects: [] });
  }
}
