const SplashArt = () => {
  return (
    <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
      <div className="max-w-md xl:max-w-lg p-6 lg:p-8 xl:p-12">
        {/* image */}
        <div className="relative aspect-square w-64 lg:w-72 xl:w-80 max-w-sm mx-auto">
          <img
            src="/images/checked.png"
            alt="Checkbox checked illustration"
            className="w-full h-full object-contain"
          />
        </div>
        {/* splash description */}
        <div className="text-center space-y-3 xl:space-y-4 mt-6 xl:mt-8">
          <h2 className="text-xl lg:text-2xl xl:text-3xl font-semibold leading-snug">
            Connect with studious people worldwide
          </h2>
          <p className="text-sm lg:text-base xl:text-lg opacity-70">
            Learn new things, make friends, and improve your knowledge together
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashArt;
