import { NextResponse, NextRequest } from "next/server";
import { chatDB } from "@/app/lib/database";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    // Fetch session on the server
    // const session = await getServerSession(authOptions);

    // if (!session || !session.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    console.log(body)

    // Get token from cookies
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await chatDB.sendChat(body, token);
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
