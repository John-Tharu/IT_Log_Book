import { Router } from "express";
import { homepage, loginpage } from "../controller/controller.js";

const router = Router();

router.route("/").get(homepage);

router.route("/login").get(loginpage);

export const routerdata = router;
