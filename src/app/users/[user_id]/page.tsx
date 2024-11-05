
// app/user/[username]/page.tsx

import UserProfile from '../../components/user-profile/UserProfile';
import TabbedLayout from '../../components/user-profile/TabbedLayout';
import NavBar from '../../components/NavBar';

// Mock async function to fetch user data
async function fetchUserData(username: string) {
  // Replace this with your actual data fetching logic
  return {
    imageUrl: '/user.jpg',
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
      { title: 'Clean Water Initiative', description: 'Bringing clean water to communities.', imageUrl: '/causes/clean-water-initiative.svg' },
      { title: 'Wildlife Preservation', description: 'Protecting endangered species.', imageUrl: '/causes/hippo.svg' },
    ],
    activities: [
      { id: 1, type: 'donation', date: '2024-01-10', description: 'Donated to Clean Water Initiative' },
      { id: 2, type: 'fundraiser', date: '2024-01-08', description: 'Started a fundraiser for Wildlife Preservation' },
    ],
    isPublic: true, // Mock data for demonstration
  };
}

type UserPageProps = {
  params: { username: string };
};

export default async function UserPage({ params }: UserPageProps) {
  const { username } = params;

  // Fetch user data based on the username
  const userData = await fetchUserData(username);

  return (
    <div className="w-full min-h-screen bg-accent-sand">
      {/* Navbar */}
      <NavBar />
      <div className="px-4 py-4 max-w-6xl mx-auto">

      {/* User Profile */}
      <div className="p-6 md:flex md:space-x-8">
        <UserProfile {...userData} />
      </div>

      {/* Conditional Content for Public Profile */}
      {userData.isPublic && (
        <TabbedLayout
          causes={userData.causes}
          activities={userData.activities}
          fundraisers={userData.fundraisers}
        />
      )}
      </div>
    </div>
  );
}
