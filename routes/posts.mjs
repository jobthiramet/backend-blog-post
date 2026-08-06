import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const postsRouter = Router();

const postSelectFields = `
  posts.id,
  posts.image,
  categories.name AS category,
  posts.title,
  posts.description,
  posts.date,
  posts.content,
  statuses.status AS status,
  posts.likes_count
`;

const postFromJoin = `
  FROM posts
  INNER JOIN categories ON posts.category_id = categories.id
  INNER JOIN statuses ON posts.status_id = statuses.id
`;

// 4. GET /posts — list with pagination & filter
postsRouter.get("/", async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 6, 1);
    const offset = (page - 1) * limit;
    const category = req.query.category || null;
    const keyword = req.query.keyword || null;

    const filterClause = `
      WHERE ($1::text IS NULL OR categories.name ILIKE $1)
        AND (
          $2::text IS NULL
          OR posts.title ILIKE '%' || $2 || '%'
          OR posts.description ILIKE '%' || $2 || '%'
          OR posts.content ILIKE '%' || $2 || '%'
        )
    `;

    const countResult = await connectionPool.query(
      `
        SELECT COUNT(*)::int AS total
        ${postFromJoin}
        ${filterClause}
      `,
      [category, keyword]
    );

    const totalPosts = countResult.rows[0]?.total || 0;
    const totalPages = totalPosts === 0 ? 0 : Math.ceil(totalPosts / limit);

    const postsResult = await connectionPool.query(
      `
        SELECT ${postSelectFields}
        ${postFromJoin}
        ${filterClause}
        ORDER BY posts.date DESC
        LIMIT $3 OFFSET $4
      `,
      [category, keyword, limit, offset]
    );

    return res.status(200).json({
      totalPosts,
      totalPages,
      currentPage: page,
      limit,
      posts: postsResult.rows,
      nextPage: page < totalPages ? page + 1 : null,
    });
  } catch (error) {
    console.error("GET /posts error:", error.message);
    return res.status(500).json({
      message: "Server could not read post because database connection",
    });
  }
});

// 1. GET /posts/:postId — single post
postsRouter.get("/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const result = await connectionPool.query(
      `
        SELECT ${postSelectFields}
        ${postFromJoin}
        WHERE posts.id = $1
      `,
      [postId]
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        message: "Server could not find a requested post",
      });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("GET /posts/:postId error:", error.message);
    return res.status(500).json({
      message: "Server could not read post because database connection",
    });
  }
});

// 2. PUT /posts/:postId — update post
postsRouter.put("/:postId", async (req, res) => {
  const { postId } = req.params;
  const { title, image, category_id, description, content, status_id } =
    req.body;

  try {
    const result = await connectionPool.query(
      `
        UPDATE posts
        SET
          title = $2,
          image = $3,
          category_id = $4,
          description = $5,
          content = $6,
          status_id = $7
        WHERE id = $1
        RETURNING id
      `,
      [postId, title, image, category_id, description, content, status_id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        message: "Server could not find a requested post to update",
      });
    }

    return res.status(200).json({
      message: "Updated post sucessfully",
    });
  } catch (error) {
    console.error("PUT /posts/:postId error:", error.message);
    return res.status(500).json({
      message: "Server could not update post because database connection",
    });
  }
});

// 3. DELETE /posts/:postId — delete post
postsRouter.delete("/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const result = await connectionPool.query(
      `
        DELETE FROM posts
        WHERE id = $1
        RETURNING id
      `,
      [postId]
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        message: "Server could not find a requested post to delete",
      });
    }

    return res.status(200).json({
      message: "Deleted post sucessfully",
    });
  } catch (error) {
    console.error("DELETE /posts/:postId error:", error.message);
    return res.status(500).json({
      message: "Server could not delete post because database connection",
    });
  }
});

export default postsRouter;
