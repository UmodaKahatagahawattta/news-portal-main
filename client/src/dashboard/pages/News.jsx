import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './News.css';  // Import the CSS for styling

function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch news data from the backend
    axios.get('http://localhost:5000/news') // Adjust the URL if needed
      .then(response => {
        setNews(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching news data');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="news-container">
      <h1 className="news-title">Latest News</h1>
      <div className="news-list">
        {news.map((item) => (
          <div className="news-card" key={item._id}>
            <h2 className="news-card-title">{item.title}</h2>
            <p className="news-card-content">{item.content}</p>
            <p className="news-card-date">{new Date(item.date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default News;

