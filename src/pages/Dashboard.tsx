import { supabase } from "../supabase-client"

export default function Dashboard() {
    const logout = async () => {
        await supabase.auth.signOut()
    }
  return (
    <div>
      <h1 className='text-9xl text-white'>Dashboard</h1>
      <button onClick={logout}>Log out</button>
    </div>
  )
}
