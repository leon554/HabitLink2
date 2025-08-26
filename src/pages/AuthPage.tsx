
import Auth from '../components/Auth'
import SEO from '@/components/SEO'

export default function AuthPage() {
  return (
    <div className="">
      <SEO 
        title="Sign In | HabitLink"
        description="Sign in to HabitLink to track your habits and goals."
        url="https://habit-link.com/auth"
      />
      {/* Prevent indexing of the auth page */}
      <meta name="robots" content="noindex, nofollow" />
      <Auth/>
    </div>
  )
}
