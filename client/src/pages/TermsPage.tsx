import { Link, useNavigate } from "react-router";
import { BookOpenText, ArrowLeft } from "lucide-react";
import { useThemeStore } from "../stores/useThemeStore";

const TermsPage = () => {
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
            Terms of Service
          </h1>
          <p className="text-sm opacity-70">Last updated: November 2026</p>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
            <p className="leading-relaxed opacity-90">
              By creating an account or accessing Diligent Scholars, you agree to
              be bound by these Terms of Service. If you do not agree with any
              part of these terms, you may not use our services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">2. Educational Community Standards</h2>
            <p className="leading-relaxed opacity-90">
              Diligent Scholars is a real-time collaborative learning community.
              You agree to engage constructively, respect fellow scholars, and
              refrain from harassment, hate speech, spamming, or fraudulent
              activity during messages and video sessions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">3. Account & Security</h2>
            <p className="leading-relaxed opacity-90">
              You are responsible for maintaining the confidentiality of your
              login credentials. Diligent Scholars cannot and will not be liable
              for any loss or damage arising from failure to protect your account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">4. Real-Time Communication Services</h2>
            <p className="leading-relaxed opacity-90">
              Live messaging and peer video calls are powered by Stream IO. You
              agree not to transmit malicious payloads, capture unauthorised
              recordings of fellow learners, or abuse network bandwidth.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">5. Termination</h2>
            <p className="leading-relaxed opacity-90">
              We reserve the right to suspend or terminate accounts that violate
              community guidelines or platform integrity without prior notice.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
