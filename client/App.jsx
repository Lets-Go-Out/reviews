/* eslint-env commonjs, browser */

import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Review from './reviewDisplay.jsx';
import Stars from './Stars.jsx';
import BarChart from './BarChart.jsx';


class Reviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
      info: {},
      sortBy: 'date',
      sortDir: -1,
      starsCount: {},
    };
  }

  componentWillMount() {
    this.getBasicInfo();
    this.getReviews();
  }

  getBasicInfo() {
    const { id } = this.props;
    fetch(`/restaurants/${id}/reviewsummary`)
      .then((response) => {
        if (response.status === 500) { throw new Error('500 internal server error'); }
        return response.json();
      })
      .then(info => this.setState({ info }))
      .catch(err => console.log(err));
  }

  getReviews() {
    const { id } = this.props;
    fetch(`/restaurants/${id}/reviews`)
      .then((response) => {
        if (response.status === 500) { throw new Error('500 internal server error'); }
        return response.json();
      })
      .then((reviews) => {
        reviews.forEach(review => Object.assign(review, { date: new Date(review.date) }));
        const today = new Date();
        let recent = reviews.filter(review => today - review.date <= 7889400000);
        recent = recent.map(review => review.overall);
        const { info } = this.state;
        const sum = (a, b) => a + b;
        const newInfo = Object.assign({}, info, { recent: recent.reduce(sum) / recent.length });
        this.setState({ info: newInfo });
        this.setState({ reviews });
        this.countReviews();
      })
      .catch(err => console.log(err));
  }

  // gets distribution of stars for a restaurant, for display in bar chart
  countReviews() {
    const starsCount = {};
    const { reviews } = this.state;
    reviews.forEach((review) => {
      const rating = review.overall;
      starsCount[rating] = starsCount[rating] + 1 || 1;
    });
    const keys = Object.keys(starsCount);
    keys.forEach((key) => { starsCount[key] /= reviews.length; });
    console.log(starsCount);
    this.setState({ starsCount });
  }

  sortFunction(a, b) {
    const { sortDir, sortBy } = this.state;
    return sortDir * (a[sortBy] - b[sortBy]);
  }

  changeSort(sortParam) {
    if (sortParam === 'date') {
      this.setState({
        sortBy: 'date',
        sortDir: -1,
      });
    } else if (sortParam === 'best') {
      this.setState({
        sortBy: 'overall',
        sortDir: -1,
      });
    } else if (sortParam === 'worst') {
      this.setState({
        sortBy: 'overall',
        sortDir: 1,
      });
    }
  }


  render() {
    const { info, starsCount } = this.state;
    let { reviews } = this.state;
    console.log(reviews);
    reviews.sort((a, b) => this.sortFunction(a, b));
    reviews = reviews.map(review => <Review data={review} key={review.id} />);
    if (!reviews.length) { return <div />; }
    return (
      <div className="reviews">
        <div>
          Overall Ratings and Reviews
        </div>
        <div>
          <Stars num={Math.round(info.recent)} />
          {` ${info.recent.toFixed(2)} based on recent ratings`}
        </div>
        <div>
          {`${info.foodAvg.toFixed(2)} Food`}
        </div>
        <div>
          {`${info.serviceAvg.toFixed(2)} Service`}
        </div>
        <div>
          {`${info.ambienceAvg.toFixed(2)} Ambience`}
        </div>
        <div>
          {`${info.valueAvg.toFixed(2)} Value`}
        </div>
        <BarChart proportions={starsCount} />
        <div>
          Sort by
          <br />
          <select onChange={e => this.changeSort(e.target.value)}>
            <option value="date">
              Newest
            </option>
            <option value="best">
              Highest rating
            </option>
            <option value="worst">
              Lowest rating
            </option>
          </select>
        </div>
        {reviews}
      </div>
    );
  }
}

Reviews.defaultProps = {
  id: '1',
};

Reviews.propTypes = {
  id: PropTypes.string,
};

ReactDOM.render(<Reviews id="25" />, document.getElementById('reviews'));
