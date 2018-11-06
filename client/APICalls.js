/* eslint-env browser */

const API = {
  getReviews: (id, cb) => {
    fetch(`http://localhost:3005/restaurants/${id}/reviews`)
      .then((response) => {
        if (response.status === 500) { throw new Error('500 internal server error'); }
        return response.json();
      })
      .then(data => cb(data))
      .catch(err => console.log(err));
  },

  getBasicInfo: (id, cb) => {
    fetch(`http://localhost:3005/restaurants/${id}/reviewsummary`)
      .then((response) => {
        if (response.status === 500) { throw new Error('500 internal server error'); }
        return response.json();
      })
      .then(data => cb(data))
      .catch(err => console.log(err));
  },

  markHelpful: (id, cb) => {
    fetch(`http://localhost:3005/reviews/${id}/markhelpful`, {
      method: 'PATCH',
    })
      .then((response) => {
        if (response.status === 500) { throw new Error('500 internal server error'); }
      })
      .then(() => cb())
      .catch(err => console.log(err));
  },

  report: (id, cb) => {
    fetch(`http://localhost:3005/reviews/${id}/report`, {
      method: 'PATCH',
    })
      .then((response) => {
        if (response.status === 500) { throw new Error('500 internal server error'); }
      })
      .then(() => cb())
      .catch(err => console.log(err));
  },

};

export default API;
