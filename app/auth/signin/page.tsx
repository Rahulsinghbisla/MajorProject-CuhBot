"use client";

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authClient } from "@/lib/auth-client";
import { useState } from 'react';
import { Eye, Mail, Lock, Loader2 } from "lucide-react";
import { Checkbox } from '@/components/ui/checkbox';
import { GoogleIcon } from '../icons';

const page = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const handleSocial = async () => {
    setLoading2(true)
    try {
      await authClient.signIn.social({

        provider: "google",
        callbackURL: "/",

      });
    } catch (error) {
      console.error("Error is ", error)
    }
    finally {
      setLoading2(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);


    try {
      await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
        rememberMe: false
      }, {
        onRequest: () => setLoading(true),
        onSuccess: () => {
          setLoading(false);
        },
        onError: (ctx) => {
          setLoading(false);
        }
      });
    } catch (error) {

      setLoading(false);
      console.error("Authentication crash:", error);
    } finally {

      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="grid flex-grow grid-cols-1 lg:grid-cols-2">

        {/* --- LEFT SIDE: Informational Panel --- */}
        <div className="relative hidden lg:flex flex-col justify-between p-12 text-white bg-gradient-to-br from-[#1a1a40] to-[#2a2a60] overflow-hidden">
          {/* Background Image Overlay */}
          <div className="absolute inset-0 opacity-20 bg-[url('/images/bot.jpg')] bg-cover bg-center mix-blend-overlay" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <div className="p-2 bg-white/10 rounded-lg">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#1a1a40] font-bold">U</div>
              </div>
              <div>
                <h2 className="text-xl font-bold leading-none">CuhBot</h2>
                <p className="text-xs text-blue-200">University Assistant</p>
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-4">Welcome to <span className="text-blue-400">CuhBot</span></h1>
            <p className="text-gray-300 mb-10 max-w-sm">Your smart companion for all university related information.</p>

            <div className="space-y-6">
              <FeatureItem icon="💬" title="Get Instant Answers" desc="Ask anything about admissions, academics, and more." />
              <FeatureItem icon="📖" title="24/7 Available" desc="ChatBot is always here to help you anytime, anywhere." />
              <FeatureItem icon="🛡️" title="Reliable & Secure" desc="Your data is safe with us. We prioritize privacy." />
            </div>
          </div>

          {/* Character Image Placeholder */}
          {/* <div className="relative z-10 mt-auto flex justify-center">
                        <img src="./images/bot.png" alt="ChatBot Mascot" className="w-64 drop-shadow-2xl" />
                    </div> */}
        </div>

        {/* --- RIGHT SIDE: Form Panel --- */}
        <div className="flex flex-col items-center justify-center p-8 lg:p-16 relative">
          {/* Language Selector */}
          <div className="absolute top-8 right-8">
            <Button variant="outline" size="sm" className="rounded-full gap-2">
              🌐 English <span className="text-[10px]">▼</span>
            </Button>
          </div>

          <div className="w-full max-w-[400px] space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex p-4 bg-indigo-50 text-indigo-600 rounded-2xl mb-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">U</div>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">Sign in to <span className="text-indigo-600">ChatBot</span></h2>
              <p className="text-sm text-gray-500">Create your account to access your assistant</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="space-y-2">
                <Label className="text-gray-700 font-semibold">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                  <Input
                    className="pl-10 py-6 bg-gray-50 border-gray-100 rounded-xl text-gray-900"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-gray-700 font-semibold">Password</Label>
                  <button type="button" className="text-xs font-semibold text-indigo-600 hover:underline">Forgot Password?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                  <Input
                    className="pl-10 py-6 pr-10 bg-gray-50 border-gray-100 rounded-xl text-gray-900"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Eye className="absolute right-3 top-4 w-5 h-5 text-gray-400 cursor-pointer" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="text-sm font-medium leading-none text-gray-500 cursor-pointer">
                  Remember me
                </label>
              </div>

              <Button type="submit" className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-lg font-semibold shadow-lg shadow-indigo-200" disabled={loading}>
                {loading ? "Creating account..." : "Sign In"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-400">or</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full py-6 border-gray-100 rounded-xl gap-3 text-gray-600 font-semibold hover:bg-gray-50 hover:text-gray-900"
              onClick={handleSocial}
              disabled={loading2}
            >
              {loading2 ? (<Loader2 className="mr-2 size-5 animate-spin" />) : (<GoogleIcon className="mr-2 size-5" />)}
              Login with Google
            </Button>

            <p className="text-center text-sm text-gray-500">
              you don't have an account? <a href="/auth/signup" className="text-indigo-600 font-bold hover:underline">Sign up</a>
            </p>
          </div>
        </div>
      </div>

      {/* --- BOTTOM FOOTER --- */}
      <footer className="py-8 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FooterInfo icon="🛡️" title="Trusted & Secure" desc="We keep your information safe and confidential." />
          <FooterInfo icon="⏰" title="Always Available" desc="Get help anytime, 24/7 from CuhBot." />
          <FooterInfo icon="🎓" title="Made for Students" desc="Designed to support your academic journey." />
        </div>
        <p className="text-center text-xs text-gray-400 mt-8">© 2026 CuhBot. All rights reserved.</p>
      </footer>
    </div>
  )
}

// Sub-components for cleaner code
const FeatureItem = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
  <div className="flex gap-4 items-start p-4 bg-white/5 rounded-2xl border border-white/10">
    <span className="text-2xl">{icon}</span>
    <div>
      <h3 className="font-semibold text-sm">{title}</h3>
      <p className="text-xs text-gray-400">{desc}</p>
    </div>
  </div>
);

const FooterInfo = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
  <div className="flex items-center gap-3">
    <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-xl">{icon}</div>
    <div>
      <h4 className="text-sm font-bold text-gray-800">{title}</h4>
      <p className="text-xs text-gray-500">{desc}</p>
    </div>
  </div>
)

export default page
