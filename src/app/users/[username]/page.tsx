
// app/user/[username]/page.tsx


// Mock async function to fetch user data
async function fetchUserData(username: string) {

  // Replace this with your actual data fetching logic
  return {
    imageUrl: '/user.jpg',
    username: username,
    name: 'Jane Doe',
    bio: 'Passionate about social causes and community development.',
    socialLinks: {
      tiktok: 'https://twitter.com/janedoe',
      instagram: 'https://linkedin.com/in/janedoe',
      youtube: 'https://janedoe.com',
      linkedin: 'https://janedoe.com',
      website: 'https://janedoe.com',
    },
    causes: [
      { title: 'Clean Water Initiative', imageUrl: '/causes/clean-water-initiative.svg' },
      { title: 'Wildlife Preservation', imageUrl: '/causes/hippo.svg' },
    ],
    activities: [
      { id: 1, type: 'donation', date: '2024-01-10', description: 'Donated to Clean Water Initiative' },
      { id: 2, type: 'fundraiser', date: '2024-01-08', description: 'Started a fundraiser for Wildlife Preservation' },
    ],
    isPublic: true, // Mock data for demonstration
  };
}

type UserPageProps = Promise<{username: string }>

export default async function UserPage(props: { params: UserPageProps}) {
  const params = props.params;
  const { username } = await params;
  console.log(username)

  // Fetch user data based on the username
  const userData = await fetchUserData(username);

  return (
    <div className="w-full min-h-screen bg-accent-sand">
      <div className="px-4 py-4 max-w-6xl mx-auto">

      {/* User Profile */}
      <div className="p-6 md:flex md:space-x-8">
        user profile
      </div>

      {/* Conditional Content for Public Profile */}
      {userData.isPublic && (
        <div className="">public data</div>
      )}
      </div>
    </div>
  );
}
