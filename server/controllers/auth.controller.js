export const signup = async (req, res) => {
  res.status(200).json({ message: "signup route" });
};

export const login = async (req, res) => {
  res.status(200).json({ message: "login route" });
};

export const logout = (req, res) => {
  res.status(200).json({ message: "logout route" });
};
