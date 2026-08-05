// Product reviews page - list and submit reviews
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchProductReviews, createReview } from '../../features/review/reviewSlice';
import Button from '../../components/common/Button';
import TextAreaField from '../../components/forms/TextAreaField';
import Loader from '../../components/common/Loader';

function Reviews() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { reviews, status } = useAppSelector((state) => state.review);
  const { accessToken } = useAppSelector((state) => state.auth);

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    dispatch(fetchProductReviews({ productId: id, params: { limit: 20 } }));
  }, [dispatch, id]);

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await dispatch(createReview({ productId: id, payload: { rating, title, comment } }));
    if (createReview.fulfilled.match(result)) {
      setTitle('');
      setComment('');
      setRating(5);
    }
  }

  return (
    <div className="reviews-page">
      <h2>Product Reviews</h2>

      {accessToken && (
        <form className="review-form" onSubmit={handleSubmit}>
          <h3>Write a Review</h3>
          <select value={rating} onChange={(e) => setRating(parseInt(e.target.value, 10))}>
            {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
          </select>
          <input
            type="text"
            placeholder="Review title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextAreaField label="Comment" name="comment" value={comment} onChange={(e) => setComment(e.target.value)} />
          <Button type="submit">Submit Review</Button>
        </form>
      )}

      {status === 'loading' ? (
        <Loader text="Loading reviews..." />
      ) : (
        <div className="review-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-item">
              <strong>{review.user_name || 'Anonymous'}</strong>
              <span>{review.rating} Stars</span>
              {review.is_verified_purchase && <span className="verified-badge">Verified Purchase</span>}
              <h4>{review.title}</h4>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Reviews;