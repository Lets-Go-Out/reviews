/* eslint-env browser */

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Stars from './Stars';

import API from './APICalls';


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
  }


  componentDidMount() {
    this.checkReviewLength();
    window.addEventListener('resize', () => this.checkReviewLength());
  }

  readMoreHandler() {
    const { expanded } = this.state;
    this.setState({ expanded: !expanded });
  }

  checkReviewLength() {
    const long = this.review.current.clientHeight < this.text.current.clientHeight;
    this.setState({ long });
  }

  markHelpful() {
    const { data } = this.props;
    API.markHelpful(data.id, () => console.log('this review marked helpful'));
  }

  report() {
    const { data } = this.props;
    API.report(data.id, () => console.log('this review reported'));
  }


  render() {
    const { data } = this.props;
    const { expanded, long } = this.state;
    const { initials, color } = this;

    return (
      <div className="reviewContainer">
        <div className="reviewAndUser">
          <div className="userInfo">
            <div className={`userIcon ${color}`}>
              {initials}
            </div>
            <div>
              {data.name}
            </div>
            <div>
              {data.userLocation}
            </div>
            <div>
              <span className="speechBubble" />
              {`${data.userNumReviews} reviews`}
            </div>
          </div>
          <div className="review">
            <div>
              <Stars num={data.overall} />
            </div>
            <div>
              {`Dined on ${moment(data.date).format('MMMM Do YYYY')}`}
            </div>
            <div>
              {`Overall ${data.overall} \u00B7 Food ${data.food} \u00B7 Service ${data.service} \u00B7 Ambience ${data.ambience}`}
            </div>
            <div ref={this.review} className={expanded ? 'review' : 'truncated review'}>
              <div ref={this.text}>
                {data.text.split('\n\n').map(paragraph => (
                  <p>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <div className="buttonRow">
              {long
                ? (
                  <button type="button" className="readMore" onClick={() => this.readMoreHandler()}>
                    {expanded ? '- Read less' : '+ Read more'}
                  </button>
                )
                : null}
              <button type="button" className="report" onClick={() => this.report()}>
                <span className="reportIcon" />
                report
              </button>
              <button type="button" className="markHelpful" onClick={() => this.markHelpful()}>
                <span className="helpfulIcon" />
                helpful
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Review.defaultProps = {
  data: {},
};

Review.propTypes = {
  data: PropTypes.object,
};

export default Review;
