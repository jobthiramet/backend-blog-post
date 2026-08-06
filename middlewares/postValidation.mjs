function isMissing(value) {
  return value === undefined || value === null || value === "";
}

export function validatePostBody(req, res, next) {
  const { title, image, category_id, description, content, status_id } =
    req.body ?? {};

  if (isMissing(title)) {
    return res.status(400).json({ message: "Title is required" });
  }
  if (typeof title !== "string") {
    return res.status(400).json({ message: "Title must be a string" });
  }

  if (isMissing(image)) {
    return res.status(400).json({ message: "Image is required" });
  }
  if (typeof image !== "string") {
    return res.status(400).json({ message: "Image must be a string" });
  }

  if (isMissing(category_id)) {
    return res.status(400).json({ message: "Category id is required" });
  }
  if (typeof category_id !== "number") {
    return res.status(400).json({ message: "Category id must be a number" });
  }

  if (isMissing(description)) {
    return res.status(400).json({ message: "Description is required" });
  }
  if (typeof description !== "string") {
    return res.status(400).json({ message: "Description must be a string" });
  }

  if (isMissing(content)) {
    return res.status(400).json({ message: "Content is required" });
  }
  if (typeof content !== "string") {
    return res.status(400).json({ message: "Content must be a string" });
  }

  if (isMissing(status_id)) {
    return res.status(400).json({ message: "Status id is required" });
  }
  if (typeof status_id !== "number") {
    return res.status(400).json({ message: "Status id must be a number" });
  }

  return next();
}
