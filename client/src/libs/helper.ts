import { isAxiosError } from "axios";
import toast from "react-hot-toast";

// global error handler
export const handleApiError = (error: unknown): void => {
  if (isAxiosError(error)) {
    // catch Zod Validation Errors (Array)
    const zodErrors = error.response?.data?.errors;

    if (zodErrors && Array.isArray(zodErrors) && zodErrors.length > 0) {
      // toast the very first validation error
      toast.error(zodErrors[0].message);
      return;
    }

    // catch Standard Backend Errors ("Email already exists", "Invalid credentials")
    const serverMessage = error.response?.data?.message;

    if (serverMessage) {
      toast.error(serverMessage);
      return;
    }
  }

  // fallback for network timeouts or completely unexpected frontend errors
  if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error("An unexpected error occurred. Please try again.");
  }
};

// capitalize the first letter of a string
export const capitalize = (str: string) => {
  const capitalizedString = str.charAt(0).toUpperCase() + str.slice(1);
  return capitalizedString;
};
