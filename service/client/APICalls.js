/* eslint-env browser */

const API = {
  getReviews: (id, cb) => {
    fetch(`http://ec2-3-16-56-113.us-east-2.compute.amazonaws.com/restaurants/${id}/reviews`)
      .then((response) => {
        if (response.status === 500) { throw new Error('500 internal server error'); }
        return response.json();
      })
      .then(data => cb(data))
      .catch(err => console.log(err));
  },

  getBasicInfo: (id, cb) => {
    fetch(`http://ec2-3-16-56-113.us-east-2.compute.amazonaws.com/restaurants/${id}/reviewsummary`)
      .then((response) => {
        if (response.status === 500) { throw new Error('500 internal server error'); }
        return response.json();
      })
      .then(data => cb(data))
      .catch(err => console.log(err));
  },

  markHelpful: (id, cb) => {
    fetch(`http://ec2-3-16-56-113.us-east-2.compute.amazonaws.com/reviews/${id}/markhelpful`, {
      method: 'PATCH',
    })
      .then((response) => {
        if (response.status === 500) { throw new Error('500 internal server error'); }
      })
      .then(() => cb())
      .catch(err => console.log(err));
  },

  report: (id, cb) => {
    fetch(`http://ec2-3-16-56-113.us-east-2.compute.amazonaws.com/reviews/${id}/report`, {
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
