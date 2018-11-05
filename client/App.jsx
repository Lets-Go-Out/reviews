/* eslint-env commonjs, browser */

import React from 'react';
import PropTypes from 'prop-types';
import Review from './reviewDisplay';
import APICalls from './APICalls';
import Summary from './Summary';
import Checkbox from './Checkbox';
import styles from './style.css';


class Reviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
      info: {},
      sortBy: 'date',
      sortDir: -1,
      starsCount: {},
      filterParam: null,
      filtersChecked: {},
    };
    this.filters = ['recent', 'good for groups', 'omnis'];
    const { filtersChecked } = this.state;
    this.filters.forEach((param) => { filtersChecked[param] = false; });
  }

  componentDidMount() {
    this.getBasicInfo();
    this.getReviews();
  }

  getBasicInfo() {
    const { id } = this.props;
    APICalls.getBasicInfo(id, info => this.setState({ info }));
  }

  getReviews() {
    const { id } = this.props;
    APICalls.getReviews(id, reviews => this.shapeReviews(reviews));
  }

  shapeReviews(reviews) {
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
    this.setState({ starsCount });
  }

  sortFunction(a, b) {
    const { sortDir, sortBy } = this.state;
    return sortDir * (a[sortBy] - b[sortBy]);
  }

  selectFilter(param) {
    const newFilters = {};
    this.filters.forEach((filterTerm) => { newFilters[filterTerm] = false; });
    if (param !== null) {
      Object.assign(newFilters, { [param]: true });
    }
    this.setState({
      filtersChecked: newFilters,
      filterParam: param,
    });
  }

  checkBoxHandler(param) {
    const { filterParam } = this.state;
    if (param === filterParam) {
      this.selectFilter(null);
    } else {
      this.selectFilter(param);
    }
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

  filterReviews() {
    const { filterParam, reviews } = this.state;
    if (filterParam === 'recent') {
      return reviews.filter(review => Date.now() - review.date > 2592000000);
    }
    if (filterParam === 'good for groups') {
      return reviews.filter(review => review.partySize > 4);
    }
    if (typeof filterParam === 'string') {
      return reviews.filter(review => review.text.includes(` ${filterParam} `));
    }
    return reviews;
  }

  render() {
    const { info, starsCount, filtersChecked } = this.state;
    const { reviews } = this.state;
    let reviewsToDisplay = this.filterReviews();
    reviewsToDisplay.sort((a, b) => this.sortFunction(a, b));
    reviewsToDisplay = reviewsToDisplay.map(review => <Review data={review} key={review.id} />);
    if (!reviews.length || !info.foodAvg) { return <div />; }
    return (
      <div>
        <Summary
          info={info}
          starsCount={starsCount}
          changeSort={e => this.changeSort(e.target.value)}
        />
        <div className={styles.mediumBold}>
            Filters
        </div>
        <div className={styles.filtersContainer}>
          {this.filters.map(param => (
            <Checkbox
              key={param}
              label={param}
              status={filtersChecked[param]}
              onChange={() => this.checkBoxHandler(param)}
            />
          ))}
        </div>
        <div className={styles.reviews}>
          {reviewsToDisplay}
        </div>
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

export default Reviews;
