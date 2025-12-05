import NonprofitsDiscover from './NonprofitsDiscover';

export default function Explore() {


  return (
	<div className="min-h-screen bg-slate-900 text-white max-w-7xl mx-auto rounded-2xl mt-8 overflow-hidden py-4 px-6">
	  <h1 className="text-2xl font-semibold">
	  	Explore
	  </h1>

	  <h2 className="text-lg border-b pb-1 mb-2">
	  	Nonprofits
	  </h2>
	  <div className="mb-4 overflow-x-scroll p-2 max-h-48 scrollbar-hide">
	  	<NonprofitsDiscover />
	  </div>

	  <h2 className="text-lg border-b pb-1 mb-2">
	  	Causes
	  </h2>

	  <h2 className="text-lg border-b pb-1 mb-2">
	  	Fundraisers
	  </h2>

	  

	</div>
  );

}