import Header from "@/components/Header";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

interface ParamsWithSearch {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ query?: string; filter?: string }>;
}

const ProfilePage = async ({ params, searchParams }: ParamsWithSearch) => {
  const { id } = await params;
  const { query, filter } = await searchParams;
  
  // Get the current session
  const session = await auth();
  
  // If no session, redirect to login
  if (!session?.user) {
    redirect("/login");
  }
  
  const user = session.user;
  
  // Check if the user is trying to access their own profile
  const isOwnProfile = user.id === id;
  
  // If trying to access someone else's profile, you might want to fetch that user's data
  // For now, we'll just show the current user's profile
  
  return (
    <main className="wrapper page">
      <Header
        subHeader={isOwnProfile ? "Welcome to your profile" : `Viewing ${user.name}'s profile`}
        title={user.name || "Anonymous User"}
        userImg={user.image || "/assets/images/dummy.jpg"}
      />
      
      {/* Additional profile content */}
      <div className="mt-8 space-y-6">
        {/* User Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-2">Total Videos</h3>
            <p className="text-3xl font-bold text-blue-400">12</p>
            <p className="text-slate-400 text-sm">recordings created</p>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-2">Total Views</h3>
            <p className="text-3xl font-bold text-green-400">1,234</p>
            <p className="text-slate-400 text-sm">across all videos</p>
          </div>
        </div>
        
        
        
      </div>
    </main>
  );
};

export default ProfilePage;