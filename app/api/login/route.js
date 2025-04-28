import User from "@/app/model/user";
import connectToDatabase from "@/app/lib/dbConnect";
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(request) {
  await connectToDatabase();

  try {
    const { studentId, password } = await request.json();

    if (!studentId || !password) {
      return NextResponse.json(
        { success: false, message: "only fill student id properly!" },
        { status: 400 }
      );
    }
    if (studentId.length != 10) {
      return NextResponse.json({
        success: false, message: 'bro id has 10 digits'
      });
    }

    const user = await User.findOne({ studentId });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials!" }, 
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials!" },
        { status: 401 }
      );
    }

    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); 

    user.sessions.push({ token: sessionToken, expiresAt });
    await user.save();

    const response = NextResponse.json(
      { success: true, message: "Login successful!" },
      { status: 200 }
    );

    response.cookies.set('session_id', sessionToken, {
      expires: expiresAt,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax', 
      path: '/',
    });

    response.cookies.set('studentId', studentId, {
      expires: expiresAt,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error!" },
      { status: 500 }
    );
  }
}
