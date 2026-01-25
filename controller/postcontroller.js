import { checkemail } from "../model/model.js";
import { signupValidation } from "../validation/validation.js";

//********************** SignUp Data **************************
export const signup = async (req, res) => {
  const { data, error } = signupValidation.safeParse(req.body);

  if (error) {
    console.log(error);
    req.flash("error", error.errors[0].message);
    return res.redirect("/signup");
  }

  const { email, name, pass } = data;

  const [checkedemail] = await checkemail(email);

  if (checkedemail) {
    req.flash("error", "Email Already Exists");
    return res.redirect("/signup");
  }

  console.log(email, name, pass);

  res.redirect("/");
};

export const login = (req, res) => {
  const { email, pass } = req.body;

  console.log(email, pass);

  res.redirect("/");
};
