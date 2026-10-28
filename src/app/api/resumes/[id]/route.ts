// src/app/api/resumes/[id]/route.ts
import {NextResponse} from "next/server";
import {db} from "@/db";
import {resumesTable} from "@/db/schema";
import {eq} from "drizzle-orm";
import {ResumeDocumentSchema} from "@/schemas/resume.schema";

interface RouteContext {
  params: Promise<{id: string}>;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const {id} = await context.params;
    const body = await request.json();

    const parsed = ResumeDocumentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {success: false, error: parsed.error.format()},
        {status: 400},
      );
    }

    const resumeData = parsed.data;

    // Update resume record in PostgreSQL
    await db
      .update(resumesTable)
      .set({
        title: resumeData.title,
        headerData: JSON.stringify(resumeData.headerData),
        styleConfig: JSON.stringify(resumeData.styleConfig),
        updatedAt: new Date(),
      })
      .where(eq(resumesTable.id, id));

    return NextResponse.json({success: true, updatedAt: resumeData.updatedAt});
  } catch (error) {
    console.error("Failed to auto-save resume:", error);
    return NextResponse.json(
      {success: false, error: "Internal Server Error"},
      {status: 500},
    );
  }
}
