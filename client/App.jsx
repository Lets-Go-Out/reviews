import React from 'react';
import ReactDOM from 'react-dom';
import Review from './reviewDisplay.jsx';



class Reviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurant: this.props.id,
      reviews: [],
      info: {}
    };
  }

  getBasicInfo() {
    fetch(`/restaurants/${this.state.restaurant}/reviewsummary`)
      .then((response) => {
        if (response.status === 500) { throw new Error('500 internal server error'); }
        return response.json();
      })
      .then(info => this.setState({info}))
      .catch(err => console.log(err));
  }

  getReviews() {
    fetch(`/restaurants/${this.state.restaurant}/reviews`)
      .then((response) => {
        if (response.status === 500) { throw new Error('500 internal server error'); }
        return response.json();
      })
      .then(reviews => {
        const today = new Date();
        const recent = reviews.filter(review => today - new Date(review.date) <= 7889400000).map(review => review.overall);
        this.setState({info: Object.assign({}, this.state.info, {recent: recent.reduce((acc, val) => acc + val) / recent.length})});
        this.setState({reviews});
      })
      .catch(err => console.log(err));
  }

  componentWillMount() {
    this.getBasicInfo();
    this.getReviews();
  }

  render() {
    const reviews = this.state.reviews.map((review, idx) => <Review data={review} key={idx}/>);
    if (!this.state.reviews.length) { return <div></div>; }
    return (
      <div className="reviews">
        <div>Overall Ratings and Reviews</div>
        <div>{this.state.info.recent.toFixed(2)} based on recent ratings</div>
        <div>{this.state.info.foodAvg.toFixed(2)} Food</div>
        <div>{this.state.info.serviceAvg.toFixed(2)} Service</div>
        <div>{this.state.info.ambienceAvg.toFixed(2)} Ambience</div>
        <div>{this.state.info.valueAvg.toFixed(2)} Value</div>
        {reviews}
      </div>
    );
  }
}

ReactDOM.render(<Reviews id="5" />, document.getElementById('reviews'));

// export default Reviews;