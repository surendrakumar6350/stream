import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    

      return NextResponse.json({ success: true });
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}