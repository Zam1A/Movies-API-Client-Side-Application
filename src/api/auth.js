const USERS_KEY = "movieAppUsers";

const readUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch (error) {
    return [];
  }
};

const writeUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const tokensFor = (email) => ({
  bearerToken: {
    token: `local-token-${email}`,
  },
});

export const registerUser = async (email, password) => {
  const normalizedEmail = email.trim().toLowerCase();
  const users = readUsers();

  if (users.some((user) => user.email === normalizedEmail)) {
    return {
      error: true,
      message: "This email is already registered.",
    };
  }

  writeUsers([
    ...users,
    {
      email: normalizedEmail,
      password,
    },
  ]);

  return {
    message: "User registered.",
  };
};

export const loginUser = async (email, password) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = readUsers().find((item) => (
    item.email === normalizedEmail && item.password === password
  ));

  if (!user) {
    return {
      error: true,
      message: "Invalid email or password.",
    };
  }

  return tokensFor(normalizedEmail);
};
