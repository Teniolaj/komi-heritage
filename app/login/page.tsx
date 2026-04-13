"use client";

import { PageWrapper } from "@/components/PageWrapper";
import { PrimaryButton } from "@/components/ui/Button";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { signInWithGoogle } from "@/lib/supabase/auth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    await signInWithGoogle();
    // signInWithGoogle triggers a redirect – loading state stays true until page unloads
  }

  return (
    <PageWrapper className="bg-surface font-body overflow-hidden">
      <main className="flex h-screen w-full">
        {/* Left Side: Immersive Imagery */}
        <section className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <img 
            className="absolute inset-0 h-full w-full object-cover grayscale-[20%] sepia-[10%] contrast-125" 
            alt="Traditional Ghanaian Kenkey bowl" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCF6Q0i9_pXV3VHJeyHCzjGiSQ5H5fa-7XO2A5JNL7SgNfx5O6QIT0JVMirGN1hbIQnqadtSLMEfTn1S7rJ5YhSHK_x4Wi5Ojq2kuRPr6j5EMUxrmK97_Vhrkc77CiQjJTA74g5if3V3bsAnbfmwtBZA919VBjyxeO08vOkV8Kr6M13HDDigv3UQ0YSwqvb1PFkdJnTRUNqKHGBqmLPEkC8BbqHO1cDLbCtKsIOwmyEKJFCy4bdd6OZMVABLvS0NQ0QLbNab0gOkHo"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-12 left-12 right-12 z-20">
            <span className="font-dm-sans text-secondary-fixed font-bold tracking-[0.2em] uppercase mb-2 block text-xs">The Living Archive</span>
            <p className="text-surface font-headline italic text-4xl leading-tight font-bold">
              "The taste of home, <br/>preserved for the future."
            </p>
            <div className="mt-6 w-12 h-1 bg-secondary-container"></div>
          </div>
        </section>

        {/* Right Side: Interaction Area */}
        <section className="w-full lg:w-1/2 bg-[#fcf9f4] flex flex-col items-center justify-center relative px-6 md:px-12 py-12 md:py-24 overflow-y-auto min-h-screen">
          {/* Brand Identity Header */}
          <div className="w-full max-w-md flex flex-col items-center mb-10 mt-8 lg:mt-0">
            <span className="font-headline font-black text-3xl uppercase tracking-tighter text-primary mb-4">
              Komi Heritage
            </span>
            
            {/* Food Strip Detail */}
            <div className="flex w-full h-12 gap-1 mb-6 overflow-hidden opacity-90">
              <img className="flex-1 h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBT4a7ztClr7dudbv8HPG6JFrMepRLIApoVro9t808_YZnixGsGzh2fOYrdOhQs1odjYHpw3t8hVuU1LIZuOND08TH-8--95f2XS8CS79pfecU1lxffA-ks20S8Vjbum1FLy_h-arVeYEoN4zsWuKj5Mvf7UuIIo7i9LaNr56zBCE_LXKZSHeEbW_RubNf4xrfzaaNxb2Ypgso4jwke9J7RXdQyy_aAxDI-9LoBqt5Sy7t1UZxT8_Yf5Em6V3jqdkP0rUmgh6mT5j8" alt="Pepper Sauce" />
              <img className="flex-1 h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDW4tW1HagtXg5cCzovFXaFKtG0f1YlhDmPoSWYQYuFfdhp-s3gHHoMxNLAYJ0jgByabVYqE2vC080NlOR03vas1EEF829FsK8mOlJITI228mTpdmaYRBPjsP8xfEwcMf-kf-mOSq98nJ0CTe8nHERGYqpfqWnfr_Zcn7pFvDZGd2J9Bpuhom32FkdvNRuuyXDJLpVLRVARXHaKe6k-DWUsaziLxaK51i6QL5AMg_X1KTwt2uvaz8C6J3V6VwKSGjozoAzRM7r93Vg" alt="Heritage Texture" />
              <img className="flex-1 h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLxUcqpzBffFmsQX3W2WhOho_nt8cSza1NIi1O5E3Z0_WD2FPWRl36txqI8mrmBAD0v-q6mno5CrdOcSThCQWD0usePj3-oRlG-wa1ff6Wm0vsW9OgpR2Z6C2wSmorZndMGpy3eX-0eJefpCxrGx4s5JYc0tVT2C2c7N6J_QoWviijgRDvSM_g1bCZ3Lr0uXEhpoxntVqpvHI_mINOzZLfT_uSEiyUL9BKQncsjrhdGE2Okj31DTtil1JP4n7rDZGYkPTBN_uTw-U" alt="Golden Fish" />
            </div>
          </div>

          {/* Login Card */}
          <div className="w-full max-w-md bg-white border border-outline-variant/15 p-8 md:p-10 shadow-sm">
            <div className="mb-8">
              <h1 className="text-4xl font-headline font-bold text-on-surface mb-2 tracking-tight">Welcome Back</h1>
              <p className="text-on-surface-variant font-body text-sm tracking-wide">Enter your credentials to access the archive.</p>
            </div>

            <form className="space-y-6">
              {/* Email Input */}
              <div className="relative group">
                <label className="block text-[10px] font-dm-sans uppercase tracking-widest font-bold text-secondary mb-1">Email Address</label>
                <input 
                  className="w-full bg-transparent border-0 border-b-2 border-outline-variant py-3 px-0 focus:border-primary focus:ring-0 transition-colors duration-300 font-body placeholder:text-surface-dim outline-none" 
                  placeholder="heritage@accra.com" 
                  type="email" 
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="flex justify-between items-end mb-1 font-dm-sans">
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-secondary">Password</label>
                  <Link href="/forgot" className="text-[10px] font-bold text-primary hover:text-primary-container transition-colors uppercase tracking-widest">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input 
                    className="w-full bg-transparent border-0 border-b-2 border-outline-variant py-3 px-0 focus:border-primary focus:ring-0 transition-colors duration-300 font-body placeholder:text-surface-dim outline-none pr-10" 
                    placeholder="••••••••" 
                    type={showPassword ? "text" : "password"} 
                  />
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-on-surface-variant z-10 block" 
                    type="button"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <PrimaryButton className="w-full py-4 uppercase tracking-[0.2em] font-dm-sans font-bold text-xs mt-4 shadow-xl shadow-primary-container/20 border-0" onClick={() => {}}>
                Log In
              </PrimaryButton>
            </form>

            {/* Divider */}
            <div className="relative my-8 flex items-center">
              <div className="flex-grow border-t border-outline-variant/30"></div>
              <span className="mx-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-dm-sans">or</span>
              <div className="flex-grow border-t border-outline-variant/30"></div>
            </div>

            {/* Social Login */}
            <button
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full bg-white border-2 border-surface-container-high text-on-surface font-dm-sans font-bold py-4 px-6 flex items-center justify-center gap-3 hover:bg-surface-container-low transition-all duration-300 uppercase tracking-[0.15em] text-xs disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
              )}
              {googleLoading ? "Redirecting…" : "Continue with Google"}
            </button>

            {/* Footer Link */}
            <div className="mt-8 text-center font-dm-sans">
              <p className="text-sm text-tertiary">
                New here? <Link className="font-bold text-primary hover:underline underline-offset-4 ml-1 transition-all" href="/signup">Create an account</Link>
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 font-dm-sans pb-12 lg:pb-0 block">
             © THE LIVING ARCHIVE. ACCRA HERITAGE.
          </div>
        </section>
      </main>
    </PageWrapper>
  );
}
