import React, { useEffect, useState, useRef } from 'react';

// Image Loading via Settling promise and infinite scroll

const ImageLoading = () => {
  const [imageData, setImageData] = useState([]);
  const [page, setPage] = useState(1);
  // add loader refrence
  const loader = useRef(null);

  const handleObserver = (entities) => {
    const target = entities[0];
    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  };

  const fetchImage = async () => {
    const imageArray = [...imageData];
    const result = await Promise.allSettled(
      [...Array(50).keys()].map(async () => {
        const res = await fetch('https://picsum.photos/200/300');
        const { url } = res;
        imageArray.push(url);
      }),
    );
    await result;
    setImageData(imageArray);
  };
  useEffect(() => {
    fetchImage();

    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    };
    // initialize IntersectionObserver
    // and attaching to Load More div
    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current);
    }
  }, []);

  useEffect(() => {
    fetchImage();
  }, [page]);

  return (
    <div>
      {
        imageData.length !== 0 && imageData.map((url, i) => (
          <div style={{
            width: '200px', height: '300px', border: '1px solid black', display: 'inline-block',
          }}
          >
            <img src={url} alt="img" />
          </div>
        ))
      }
      <div div className="loading" ref={loader}>
        <h2>Load More</h2>
      </div>
    </div>
  );
};

export default ImageLoading;
// https://picsum.photos/200/300
