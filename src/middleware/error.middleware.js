export const errorHandler = (err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "Something went wrong",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : undefined
  });
};