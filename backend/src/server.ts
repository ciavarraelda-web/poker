import express from "express";
import bodyParser from "body-parser";
import { setupPokerRoutes } from "./api/routes";

const app = express();
app.use(bodyParser.json());

setupPokerRoutes(app);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Poker backend running on port ${PORT}`);
});
