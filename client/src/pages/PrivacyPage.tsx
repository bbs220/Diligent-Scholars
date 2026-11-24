import { Link, useNavigate } from "react-router";
import { BookOpenText, ArrowLeft } from "lucide-react";
import { useThemeStore } from "../stores/useThemeStore";

const PrivacyPage = () => {
  const { theme } = useThemeStore();
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div
      className="min-h-dvh bg-base-100 text-base-content font-inter p-4 sm:p-6 lg:p-8"
      data-theme={theme}
    >
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex items-center justify-between border-b border-base-300 pb-4">
          <Link to="/" className="flex items-center gap-2">
            <BookOpenText className="size-7 sm:size-8 text-primary shrink-0" />
            <span className="text-xl sm:text-2xl font-bold font-mono bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary tracking-wider">
              Diligent Scholars
            </span>
          </Link>
          <button
            type="button"
            onClick={handleBack}
            className="btn btn-ghost btn-sm sm:btn-md gap-2"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm opacity-70">Last updated: November 2026</p>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">1. Information We Collect</h2>
            <p className="leading-relaxed opacity-90">
              We collect the information you provide when creating an account:
              your full name, email address, password hash, avatar image,
              geographic location (if provided), and educational skill
              preferences.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">2. How We Use Information</h2>
            <p className="leading-relaxed opacity-90">
              Your information is used solely to authenticate your identity,
              match you with complementary learning partners, facilitate
              real-time peer communication, and maintain platform security.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">3. Third-Party Services</h2>
            <p className="leading-relaxed opacity-90">
              We utilise Stream IO for real-time messaging and WebRTC video
              calling infrastructure. Only public user identifiers, display
              names, and avatars necessary for establishing real-time sessions
              are shared with Stream IO.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">4. Cookies & Authentication</h2>
            <p className="leading-relaxed opacity-90">
              We issue HTTP-only, secure, SameSite cookies exclusively for session
              management and JWT token rotation. We do not use third-party tracking
              or advertising cookies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">5. Data Retention & Deletion</h2>
            <p className="leading-relaxed opacity-90">
              You retain the right to request deletion of your account and
              associated records at any time by contacting platform support or
              via your profile preferences.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
