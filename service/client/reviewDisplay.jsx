/* eslint-env browser */

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Stars from './Stars';
import API from './APICalls';
import styles from './style.css';


class Review extends React.Component {
  constructor(props) {
    super(props);
    this.long = undefined;
    this.state = {
      expanded: false,
      long: true,
    };
    this.review = React.createRef();
    this.text = React.createRef();
    const { data } = this.props;
    const names = data.name.split(' ');
    this.initials = names[0][0] + names[1][0];
    const colors = ['pink', 'blue', 'orange', 'violet'];
    this.color = colors[Math.floor(Math.random() * 4)];
    this.checkButtonDisplay = () => this.checkReviewLength();
  }


  componentDidMount() {
    this.checkReviewLength();
    window.addEventListener('resize', this.checkButtonDisplay);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkButtonDisplay);
  }

  readMoreHandler() {
    const { expanded } = this.state;
    this.setState({ expanded: !expanded });
  }

  checkReviewLength() {
    const { expanded } = this.state;
    if (expanded) {
      return;
    }
    const long = this.review.current.clientHeight < this.text.current.clientHeight;
    this.setState({ long });
  }

  markHelpful() {
    const { data } = this.props;
    API.markHelpful(data.reviewId, () => console.log('this review marked helpful'));
  }

  report() {
    const { data } = this.props;
    API.report(data.reviewId, () => console.log('this review reported'));
  }


  render() {
    const { data } = this.props;
    const { expanded, long } = this.state;
    const { initials, color } = this;

    return (
      <div className={styles.reviewContainer}>
        <div className={styles.reviewAndUser}>
          <div className={styles.userInfo}>
            <div className={`${styles.userIcon} ${styles[color]}`}>
              <div>
                {initials}
              </div>
            </div>
            <div>
              {data.name}
            </div>
            <div>
              {data.userLocation}
            </div>
            <div>
              <span className={styles.speechBubble} />
              {`${data.userNumReviews} reviews`}
            </div>
          </div>
          <div className={styles.review}>
            <div>
              <Stars num={data.overallRating} />
            </div>
            <div>
              {`Dined on ${moment(data.date).format('MMMM Do YYYY')}`}
            </div>
            <div>
              {`Overall ${data.overallRating} \u00B7 Food ${data.foodRating} \u00B7 Service ${data.serviceRating} \u00B7 Ambience ${data.ambienceRating}`}
            </div>
            <div ref={this.review} className={expanded ? styles.review : `${styles.truncated} ${styles.review}`}>
              <div ref={this.text}>
                {data.text.split('\n\n').map(paragraph => (
                  <p>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <div className={styles.buttonRow}>
              {long
                ? (
                  <button type="button" className={styles.readMore} onClick={() => this.readMoreHandler()}>
                    {expanded ? '- Read less' : '+ Read more'}
                  </button>
                )
                : null}
              <button type="button" className={styles.report} onClick={() => this.report()}>
                <span className={styles.reportIcon} />
                report
              </button>
              <button type="button" className={styles.markHelpful} onClick={() => this.markHelpful()}>
                <span className={styles.helpfulIcon} />
                helpful
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


Review.propTypes = {
  data: PropTypes.shape({
    overallRating: PropTypes.number.isRequired,
    foodRating: PropTypes.number.isRequired,
    serviceRating: PropTypes.number.isRequired,
    valueRating: PropTypes.number.isRequired,
    ambienceRating: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default Review;
