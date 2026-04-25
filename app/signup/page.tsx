"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { PageWrapper } from "@/components/PageWrapper";
import { PrimaryButton } from "@/components/ui/Button";
import { clearAuthTransition, startAuthTransition } from "@/lib/auth-transition";
import { signInWithGoogle, signUpWithEmail } from "@/lib/supabase/auth";

type SignupFormState = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
};

const initialFormState: SignupFormState = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
};

function normalizeGhanaPhone(rawPhone: string) {
  const digits = rawPhone.replace(/\D/g, "");
  const withoutLeadingZero = digits.startsWith("0") ? digits.slice(1) : digits;
  return withoutLeadingZero;
}

export default function SignupPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState<SignupFormState>(initialFormState);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function updateField<K extends keyof SignupFormState>(field: K, value: SignupFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    startAuthTransition("signing-in");

    const started = await signInWithGoogle();
    if (!started) {
      clearAuthTransition();
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const fullName = form.fullName.trim();
    const email = form.email.trim().toLowerCase();
    const phoneDigits = normalizeGhanaPhone(form.phone);
    const password = form.password;

    if (!fullName) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!email) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!phoneDigits || phoneDigits.length !== 9) {
      setErrorMessage("Please enter a valid Ghana phone number after +233.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setFormLoading(true);

    const { data, error } = await signUpWithEmail({
      email,
      password,
      fullName,
      phone: `+233${phoneDigits}`,
    });

    if (error) {
      setErrorMessage(error.message);
      setFormLoading(false);
      return;
    }

    if (data.session) {
      startAuthTransition("signing-in");
      router.push("/menu");
      router.refresh();
      return;
    }

    setSuccessMessage(
      "Account created. Check your email to confirm your account before signing in.",
    );
    setFormLoading(false);
    setForm((current) => ({
      ...current,
      password: "",
    }));
  }

  return (
    <PageWrapper className="bg-surface font-body overflow-x-hidden">
      <main className="min-h-screen flex flex-col md:flex-row">
        <section className="hidden md:block md:w-1/2 h-screen sticky top-0 bg-primary overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
          <img
            className="w-full h-full object-cover grayscale-[20%] sepia-[10%] contrast-125"
            alt="Heritage Kenkey Bowl"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFdJuG4Hrga-jq87-Cib33UKMiPS-g7gAVtzFpFmSoZmaUWQXGD_wpTIMNDcWl2O7GciV9jRvdqTRPq0XAoZPrG7IlXcE4hlrxsCTxH2h3oxU7AuCuDvbK00okxzqF7C09PmyJEA353gohH6xHVabFixFpD89VLjCsy22rgUMj0oVZ7SDKGaVN0FFeYdpPiuT5e1Qe7Rh1JIsmw_DJD50qyTU-KfWx_z_CJNZmlwQgt5i-3xpIHX5SJi0XKbL1FHtdLw0sGMF-p-Y"
          />
          <div className="absolute bottom-12 left-12 z-20 max-w-md">
            <span className="font-dm-sans text-[10px] text-secondary-fixed font-bold tracking-[0.2em] uppercase mb-2 block">
              The Living Archive
            </span>
            <h2 className="text-5xl text-surface font-headline italic font-bold leading-tight">
              Preserving the soul of Accra street food.
            </h2>
          </div>
        </section>

        <section className="w-full md:w-1/2 min-h-screen bg-[#fcf9f4] flex flex-col items-center justify-center p-6 md:p-12 relative overflow-y-auto pt-16 lg:pt-0">
          <div className="w-full max-w-md mb-8 flex flex-col items-center">
            <div className="mb-6">
              <h1 className="text-3xl font-black uppercase tracking-tighter text-primary font-headline">
                Komi Heritage
              </h1>
            </div>

            <div className="flex gap-1 w-full h-12 mb-2 opacity-90">
              <div className="flex-1 overflow-hidden">
                <img
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhLR0RmNxYXvqBF4JS5WI0eXfx9V1WjwWqC0baG138HaIA0y37qLOMuTEOJeXImCMlI2PnzBb-ruX40p7y85dsdz80jJhvlgq8XFG9F5wGo0K96sLslvNZGPbycDmEIzqhTKxN1eQf7-6LdskLWZAeXQEivWVDm57ClHhCRbZoOUmOKPw7iNt69jYoKPjzGtmfnuloGggw3FdrRHxn4KMeTq2toSiMBmEOsDm7L7FSBoA34ujmEcyG2fBKaOqiBoUEjCoxMrgEt9M"
                  alt="Corn texture"
                />
              </div>
              <div className="flex-1 overflow-hidden">
                <img
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBldbz_UWpZl-gAzULmVdmAmkl1d2N4yzhFCu4X9LMrBZupeUzw2KYifPjdoIR-4YaayjFVRHjoBQZgelCBW_z_QtF3uXkolrL0mA-6B9UNxHmD4JgmDN22apB4ETHrdLij7lr6hNBMmYkvJukgtWJC-nZ3UupU-szx18ZBRlHnhg-iBFQSnSN0HjVKJJQ2rQt6aSLQ7f4I93CiO7zN5-DJTUWkd35fCSQ4ThzUy247N6cdncWi8StDp08eKkRj58kXAZzJylNrYaI"
                  alt="Shito"
                />
              </div>
              <div className="flex-1 overflow-hidden">
                <img
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrlq7hR50dOl4xBG_UALxSlWk5peI2L64ueGqvRGgCCCp5K5ryManLa0BCnFkA8I8muRTm-WNcjhhCRJmoMoUFgeYbk0gwgBJiQ4VGgCPKkFalwrSGD3wpU-m3PbLTrd98k9uxGZw7EOzgrdIPYuOhydRCuZTTI8D-dsfIz7tbfpglukj6FBrPAW0DW4OYK7ayCo9ROSu3nCoWQwK1H-44qH-bMJRZjDPc0DUYE4_ius6mfDTdcWt3WbFKaR2wI17jH445xSq-8qk"
                  alt="Fish"
                />
              </div>
              <div className="flex-1 overflow-hidden">
                <img
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgpIHzgRVnn2ht0xcaCQX92xxm8eK4ggQ4w79OZ3JJz5NPmkYDPZMehXiyCDTpdZNVy86yMJLsb_eCpksiWojgxvIhGZSAlF5fahzePwA5paPCO8h6wzOsj8cI_c_mCMk-cLRHduXIT_5QWkNLjWEkFFQx8A4izJqHkWsTZhohlYUZVaB0BJa1sTFiX6UA9NK3wIC6lO6THHl2a1yJi74_dm_rqJiDZoSdBWr87C52N8VB-5PVFxYgnR7pME7rmaKdUI6u_ve4fDY"
                  alt="Spices"
                />
              </div>
            </div>
          </div>

          <div className="w-full max-w-md bg-white p-8 md:p-10 shadow-sm border border-outline-variant/15 border-2">
            <div className="mb-8">
              <h2 className="text-4xl font-headline font-bold text-on-surface mb-2 tracking-tight">
                Create Account
              </h2>
              <p className="text-tertiary text-sm">
                Join the archive and celebrate our heritage.
              </p>
            </div>

            <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-secondary mb-1 font-dm-sans">
                  Full Name
                </label>
                <input
                  className="w-full bg-transparent border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 transition-colors py-3 px-0 placeholder:text-surface-dim placeholder:font-light outline-none"
                  placeholder="Kwame Mensah"
                  type="text"
                  value={form.fullName}
                  onChange={(event) => updateField("fullName", event.target.value)}
                  disabled={formLoading}
                  autoComplete="name"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-secondary mb-1 font-dm-sans">
                  Email Address
                </label>
                <input
                  className="w-full bg-transparent border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 transition-colors py-3 px-0 placeholder:text-surface-dim outline-none"
                  placeholder="kwame@heritage.gh"
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  disabled={formLoading}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-secondary mb-1 font-dm-sans">
                  Phone Number
                </label>
                <div className="flex bg-transparent border-b-2 border-outline-variant focus-within:border-primary transition-colors pb-[4px]">
                  <span className="inline-flex items-center px-0 py-3 text-on-surface font-bold text-base md:text-lg font-dm-sans mr-2 border-0">
                    +233
                  </span>
                  <input
                    className="flex-1 bg-transparent border-0 focus:ring-0 py-3 px-0 outline-none text-base md:text-lg"
                    placeholder="24 000 0000"
                    type="tel"
                    inputMode="numeric"
                    value={form.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    disabled={formLoading}
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-secondary mb-1 font-dm-sans">
                  Password
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-transparent border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 transition-colors py-3 px-0 placeholder:text-surface-dim outline-none pr-10"
                    placeholder="........"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(event) => updateField("password", event.target.value)}
                    disabled={formLoading}
                    autoComplete="new-password"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-on-surface-variant z-10 block cursor-pointer"
                    type="button"
                    disabled={formLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <p className="rounded-2xl border border-[#9F1D23]/20 bg-[#9F1D23]/5 px-4 py-3 text-sm font-dm-sans font-medium text-[#9F1D23]">
                  {errorMessage}
                </p>
              )}

              {successMessage && (
                <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-dm-sans font-medium text-emerald-800">
                  {successMessage}
                </p>
              )}

              <PrimaryButton
                type="button"
                onClick={() => formRef.current?.requestSubmit()}
                disabled={formLoading}
                className="w-full py-4 text-xs uppercase tracking-[0.2em] font-bold font-dm-sans mt-4 shadow-xl shadow-primary-container/20 border-0"
              >
                {formLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Creating...
                  </span>
                ) : (
                  "Create Account"
                )}
              </PrimaryButton>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-outline-variant/30" />
                <span className="flex-shrink mx-4 text-[10px] uppercase tracking-widest text-tertiary/50 font-bold font-dm-sans">
                  OR
                </span>
                <div className="flex-grow border-t border-outline-variant/30" />
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || formLoading}
                className="w-full bg-white border-2 border-surface-container-high text-on-surface font-dm-sans font-bold py-4 flex items-center justify-center gap-3 hover:bg-surface-container-low transition-colors duration-200 uppercase tracking-[0.15em] text-xs disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {googleLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                )}
                {googleLoading ? "Redirecting..." : "Continue with Google"}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-sm text-tertiary">
                Already have an account?
                <Link
                  className="text-primary font-bold hover:underline underline-offset-4 ml-1 transition-all"
                  href="/login"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 mb-12 lg:mb-0 text-center text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 font-dm-sans block">
            The Living Archive. Accra Heritage.
          </div>
        </section>
      </main>
    </PageWrapper>
  );
}
