import React from 'react';
import ReactDOM from 'react-dom';
import Review from './reviewDisplay.jsx';
import Stars from './Stars.jsx';
import BarChart from './BarChart.jsx';



class Reviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurant: this.props.id,
      reviews: [],
      info: {},
      sortBy: 'date',
      sortDir: -1,
      starsCount: {}
    };
  }

  sortFunction(a, b) {
    return this.state.sortDir * (a[this.state.sortBy] - b[this.state.sortBy]);
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

  //gets distribution of stars for a restaurant, for display in bar chart
  countReviews() {
    const starsCount = {};
    this.state.reviews.forEach(review => {
      const rating = review.overall;
      starsCount[rating] = starsCount[rating] + 1 || 1;
    });
    for (let key in starsCount) {
      starsCount[key] = starsCount[key] / this.state.reviews.length;
    }
    console.log(starsCount);
    this.setState({starsCount});
  }

  getReviews() {
    fetch(`/restaurants/${this.state.restaurant}/reviews`)
      .then((response) => {
        if (response.status === 500) { throw new Error('500 internal server error'); }
        return response.json();
      })
      .then(reviews => {
        reviews.forEach(review => Object.assign(review, {date: new Date(review.date)}));
        const today = new Date();
        const recent = reviews.filter(review => today - review.date <= 7889400000).map(review => review.overall);
        this.setState({info: Object.assign({}, this.state.info, {recent: recent.reduce((acc, val) => acc + val) / recent.length})});
        this.setState({reviews});
        this.countReviews();
      })
      .catch(err => console.log(err));
  }

  changeSort(sortParam) {
    if (sortParam === 'date') {
      this.setState({
        sortBy: 'date',
        sortDir: -1
      });
    } else if (sortParam === 'best') {
      this.setState({
        sortBy: 'overall',
        sortDir: -1
      });
    } else if (sortParam === 'worst') {
      this.setState({
        sortBy: 'overall',
        sortDir: 1
      });
    }
  }

  componentWillMount() {
    this.getBasicInfo();
    this.getReviews();
  }

  render() {
    const reviews = this.state.reviews.sort((a, b) => this.sortFunction(a, b))
      .map((review, idx) => <Review data={review} key={idx}/>);
    if (!this.state.reviews.length) { return <div></div>; }
    return (
      <div className="reviews">
        <div>Overall Ratings and Reviews</div>
        <div><Stars num={Math.round(this.state.info.recent)}/> {this.state.info.recent.toFixed(2)} based on recent ratings</div>
        <div>{this.state.info.foodAvg.toFixed(2)} Food</div>
        <div>{this.state.info.serviceAvg.toFixed(2)} Service</div>
        <div>{this.state.info.ambienceAvg.toFixed(2)} Ambience</div>
        <div>{this.state.info.valueAvg.toFixed(2)} Value</div>
        <BarChart proportions={this.state.starsCount} />
        <div>
          Sort by<br/>
          <select onChange={(e) => this.changeSort(e.target.value)}>
            <option value="date">Newest</option>
            <option value="best">Highest rating</option>
            <option value="worst">Lowest rating</option>
          </select>
        </div>
        {reviews}
      </div>
    );
  }
}

ReactDOM.render(<Reviews id="25" />, document.getElementById('reviews'));

// export default Reviews;