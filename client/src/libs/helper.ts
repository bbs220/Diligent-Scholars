import { isAxiosError } from "axios";
import toast from "react-hot-toast";

// global error handler
export const handleApiError = (error: unknown): void => {
  if (isAxiosError(error)) {
    // catch Zod Validation Errors (Array)
    // checks both the root and the new 'data' wrapper just to be safe
    const zodErrors =
      error.response?.data?.errors || error.response?.data?.data?.errors;

    if (zodErrors && Array.isArray(zodErrors) && zodErrors.length > 0) {
      // toast the very first validation error
      toast.error(zodErrors[0].message);
      return;
    }

    // catch standard Backend Errors ("Email already exists", "Invalid credentials")
    // this perfectly catches our new { success, message, data } shape
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
