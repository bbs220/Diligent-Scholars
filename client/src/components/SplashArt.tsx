const SplashArt = () => {
  return (
    <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
      <div className="max-w-md p-8">
        {/* image */}
        <div className="relative aspect-square max-w-sm mx-auto">
          <img
            src="/images/checked.png"
            alt="Checkbox checked illustration"
            className="w-full h-full"
          />
        </div>
        {/* splash description */}
        <div className="text-center space-y-3 mt-6">
          <h2 className="text-xl font-semibold">
            Connect with studious people worldwide
          </h2>
          <p className="opacity-70">
            Learn new things, make friends, and improve your knowledge together
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashArt;
