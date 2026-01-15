import { Router } from "express";
import { addlog, homepage, loginpage } from "../controller/controller.js";

const router = Router();

router.route("/").get(homepage);

router.route("/login").get(loginpage);

router.route("/addlog").get(addlog);

export const routerdata = router;
