const NoRecommendedUsers = () => {
  return (
    <div className="card bg-base-200/50 border-2 border-dashed border-base-300 p-6 sm:p-8 md:p-10 text-center w-full max-w-2xl mx-auto">
      <h3 className="font-semibold text-base sm:text-lg md:text-xl mb-2 sm:mb-3">
        No scholars available for recommendations.
      </h3>
      <p className="text-sm sm:text-base text-base-content opacity-70">
        Check back later for new scholars to befriend.
      </p>
    </div>
  );
};
export default NoRecommendedUsers;
