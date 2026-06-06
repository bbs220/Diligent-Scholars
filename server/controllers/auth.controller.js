export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
  } catch (error) {
    console.error(`😭 Error in user signin: ${error}`);
  }
};

export const login = async (req, res) => {
  try {
  } catch (error) {
    console.error(`😭 Error in user login: ${error}`);
  }
};

export const logout = (req, res) => {
  try {
  } catch (error) {
    console.error(`😭 Error in user logout: ${error}`);
  }
};
