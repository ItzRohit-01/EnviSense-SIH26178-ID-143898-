import { useEffect, useState } from "react";
import {
  getReviewsByProductAPI,
  addReviewAPI,
  deleteReviewAPI,
} from "../services/reviewService";

import { getUserIdFromToken } from "../utils/auth";

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [avg, setAvg] = useState(0);

  const userId = getUserIdFromToken();

  /* ✅ LOAD ON PAGE OPEN */
  useEffect(() => {
    if (productId) {
      loadReviews();
    }
  }, [productId]);

  /* ================= LOAD REVIEWS ================= */
  const loadReviews = async () => {
    try {
      const data = await getReviewsByProductAPI(productId);

      if (!Array.isArray(data)) {
        setReviews([]);
        setAvg(0);
        return;
      }

      setReviews(data);

      if (data.length > 0) {
        const total = data.reduce(
          (sum, r) => sum + Number(r.rating || 0),
          0
        );
        setAvg((total / data.length).toFixed(1));
      } else {
        setAvg(0);
      }
    } catch (err) {
      console.log(err);
      setReviews([]);
      setAvg(0);
    }
  };

  /* ================= ADD REVIEW ================= */
  const submitReview = async () => {
    if (!rating || !comment) {
      alert("Give rating and comment");
      return;
    }

    try {
      await addReviewAPI({
        productId,
        rating: Number(rating),
        comment,
      });

      // clear input
      setRating(0);
      setComment("");

      // reload instantly
      loadReviews();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
        err?.response?.data ||
        "Failed to submit review"
      );
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    await deleteReviewAPI(id);
    loadReviews();
  };

  /* ================= UI ================= */
  return (
    <div style={styles.container}>
      <h3>⭐ Reviews & Ratings</h3>

      {/* ✅ IMPROVED AVG BOX */}
      <div style={styles.avgBox}>
        <h2>{avg || 0} ⭐</h2>
        <p>{reviews.length} reviews</p>
      </div>

      {/* STAR INPUT */}
      <div style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{
              fontSize: "24px",
              cursor: "pointer",
              transition: "0.2s",
              color:
                star <= (hover || rating) ? "#ffc107" : "#e4e5e9",
            }}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            ★
          </span>
        ))}
      </div>

      {/* COMMENT */}
      <textarea
        style={styles.textarea}
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button style={styles.btn} onClick={submitReview}>
        Submit Review
      </button>

      {/* REVIEW LIST */}
      <div style={{ marginTop: "20px" }}>
        {reviews.length === 0 && <p>No reviews yet</p>}

        {reviews.map((r) => (
          <div key={r.id} style={styles.card}>
            <div style={styles.cardTop}>
              <strong>⭐ {r.rating}</strong>
              <small>{r.user?.name || "User"}</small>
            </div>

            <p>{r.comment}</p>

            {r.user?.id === userId && (
              <button
                style={styles.deleteBtn}
                onClick={() => handleDelete(r.id)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  container: {
    padding: "20px",
    background: "#f9f9f9",
    borderRadius: "10px",
  },
  avgBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "15px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  stars: {
    margin: "10px 0",
  },
  textarea: {
    width: "100%",
    height: "80px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },
  btn: {
    marginTop: "10px",
    padding: "10px",
    width: "100%",
    background: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  card: {
    background: "#fff",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
  },
  deleteBtn: {
    marginTop: "8px",
    background: "red",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
