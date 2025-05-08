
'use server'

import { signIn, signOut } from "@/auth";

export async function doSocialLogin() {
    await signIn('google' ,{ redirectTo: "/profile" });
}

export async function doLogout() {
  await signOut({ redirectTo: "/" });
}