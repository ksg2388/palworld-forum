import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const userEmail = formData.get("userEmail") as string;
    const files = formData.getAll("files") as File[];

    // 이메일 전송 설정
    const transporter = nodemailer.createTransport({
      // 이메일 서버 설정
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // 관리자에게 이메일 전송
    await transporter.sendMail({
      from: userEmail,
      to: "kofiqa001@gmail.com",
      subject: `[문의/신고] ${title}`,
      text: `
        보낸 사람: ${userEmail}
        제목: ${title}
        내용: ${content}
      `,
      attachments: files.map((file: any) => ({
        filename: file.name,
        content: file,
      })),
    });

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.error("Email sending failed:", error);
    return NextResponse.json(
      { message: "Failed to send email", error: String(error) },
      { status: 500 }
    );
  }
}
