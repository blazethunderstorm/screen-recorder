import { signIn, auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  
 
  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
 
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-cyan-500/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
   
      <div className="relative z-10 w-full max-w-md mx-4">
       
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
      
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-blue-200/80 text-sm">
              Sign in to continue to Screen Pro
            </p>
          </div>

         
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
            className="space-y-6"
          >
            <button
              type="submit"
              className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-gray-700 rounded-2xl font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 border border-gray-200 hover:bg-gray-50"
            >
             
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-gray-700 font-medium">Continue with Google</span>
              
             
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-blue-500/5 transition-all duration-300"></div>
            </button>
          </form>

          
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-2 text-blue-200/60 text-xs">
              <div className="w-2 h-2 bg-blue-400/40 rounded-full animate-pulse"></div>
              <span>Secure authentication</span>
              <div className="w-2 h-2 bg-purple-400/40 rounded-full animate-pulse delay-300"></div>
            </div>
          </div>

       
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full"></div>
        </div>

       
        <div className="text-center mt-6 text-blue-200/60 text-xs">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>

   
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-white/20 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-blue-300/40 rounded-full animate-bounce delay-500"></div>
        <div className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-purple-300/30 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-cyan-300/40 rounded-full animate-bounce delay-300"></div>
      </div>
    </div>
  );
}