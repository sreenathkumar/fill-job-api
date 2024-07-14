import { getGroqChatCompletion } from "../AI";
import express from "express";

export const getJobDataController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const aiResponse = await getGroqChatCompletion();
    const data = aiResponse?.choices[0]?.message?.content;

    if (data) {
      res.status(200).send({
        status: "success",
        data: JSON.parse(data),
      });
    } else {
      res.status(500).send({
        status: "error",
        message: "An error occurred while fetching job data",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      message: "An error occurred while fetching job data",
    });
  }
};
